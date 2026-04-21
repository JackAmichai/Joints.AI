"""Pipeline orchestrator.

Runs the three agents in order and walks the submission through the
IntakeStatus state machine. Triage runs synchronously because the user
needs an immediate halt signal; extraction + retrieval run as a
background task so the POST /intake/submit handler can return quickly.

State transitions:
    submitted → triaging → halted_red_flag           (stop)
    submitted → triaging → extracting → retrieving
                                → pending_clinical_review → plan_ready
    any step → failed                                  (error)
"""

from __future__ import annotations

import asyncio
import uuid
from datetime import UTC, datetime

from app.agents.extractor import Extractor
from app.agents.retriever import Retriever
from app.agents.triage import TriageAgent
from app.config import settings
from app.db.store import SubmissionStore, get_submission_store
from app.logging import log
from app.schemas.agents import TriageDisposition, TriageResult
from app.schemas.intake import (
    IntakeStatus,
    IntakeSubmission,
    SubjectivePainInput,
    SubmitIntakeRequest,
    SubmitIntakeResponse,
    UploadedFileMeta,
)


class Orchestrator:
    def __init__(
        self,
        triage: TriageAgent | None = None,
        extractor: Extractor | None = None,
        retriever: Retriever | None = None,
        store: SubmissionStore | None = None,
    ) -> None:
        self.triage = triage or TriageAgent()
        self.extractor = extractor or Extractor()
        # Retriever initialization seeds Chroma; keep lazy for cold-start speed.
        self._retriever = retriever
        self.store = store or get_submission_store()

    @property
    def retriever(self) -> Retriever:
        if self._retriever is None:
            self._retriever = Retriever()
        return self._retriever

    async def submit(self, req: SubmitIntakeRequest) -> SubmitIntakeResponse:
        """Fast path: persist submission, run triage synchronously, decide
        whether to spawn the extract+retrieve task.
        """
        submission = self._new_submission(req.subjective, req.files)
        self.store.save(submission)

        # --- Triage ----------------------------------------------------------
        self.store.update_status(submission.id, IntakeStatus.triaging)
        triage_result = self.triage.evaluate(submission.subjective)
        submission = _with_triage(submission, triage_result)

        if triage_result.halted:
            submission = _with_status(submission, IntakeStatus.halted_red_flag)
            self.store.update(submission)
            log.info(
                "pipeline_halted",
                submission_id=submission.id,
                disposition=triage_result.disposition.value,
            )
            return SubmitIntakeResponse(
                submission_id=submission.id,
                triage=triage_result,
                halted=True,
                poll_after_seconds=None,
            )

        # Cleared triage — persist and spawn background work.
        submission = _with_status(submission, IntakeStatus.extracting)
        self.store.update(submission)
        asyncio.create_task(self._run_extract_and_retrieve(submission.id))

        return SubmitIntakeResponse(
            submission_id=submission.id,
            triage=triage_result,
            halted=False,
            poll_after_seconds=8,
        )

    async def _run_extract_and_retrieve(self, submission_id: str) -> None:
        """Background pipeline after triage clears. Any uncaught error
        flips the submission to `failed` with the message captured.
        """
        try:
            submission = self.store.get(submission_id)
            if submission is None:
                log.error("submission_missing_for_background", submission_id=submission_id)
                return

            extracted = await self.extractor.extract(
                submission.subjective,
                submission.files,
                file_paths={},  # File bytes wired up when upload endpoint lands.
            )
            submission = submission.model_copy(update={"extracted": extracted})
            submission = _with_status(submission, IntakeStatus.retrieving)
            self.store.update(submission)

            plan = self.retriever.retrieve_and_compose(extracted)
            submission = submission.model_copy(update={"plan": plan})
            submission = _with_status(submission, IntakeStatus.pending_clinical_review)
            self.store.update(submission)

            # HITL gate. The plan is NOT released to the user until a
            # clinician flips `clinician_reviewed = True`. If a webhook is
            # configured, notify the review queue.
            await self._notify_clinician_queue(submission)

            log.info("pipeline_awaiting_clinical_review", submission_id=submission_id)
        except Exception as err:  # noqa: BLE001
            log.exception("pipeline_failed", submission_id=submission_id, err=str(err))
            sub = self.store.get(submission_id)
            if sub is not None:
                self.store.update(_with_status(sub, IntakeStatus.failed))

    async def _notify_clinician_queue(self, submission: IntakeSubmission) -> None:
        if not settings.clinician_webhook_url:
            return
        import httpx

        try:
            async with httpx.AsyncClient(timeout=10.0) as http:
                await http.post(
                    settings.clinician_webhook_url,
                    json={
                        "submission_id": submission.id,
                        "triage_disposition": submission.triage.disposition.value
                        if submission.triage
                        else None,
                        "created_at": submission.created_at.isoformat(),
                    },
                )
        except Exception as err:  # noqa: BLE001
            log.warning("clinician_webhook_failed", submission_id=submission.id, err=str(err))

    def _new_submission(
        self,
        subjective: SubjectivePainInput,
        files: list[UploadedFileMeta],
    ) -> IntakeSubmission:
        return IntakeSubmission(
            id=f"sub_{uuid.uuid4().hex[:16]}",
            created_at=datetime.now(UTC),
            status=IntakeStatus.submitted,
            subjective=subjective,
            files=files,
        )


def _with_status(submission: IntakeSubmission, status: IntakeStatus) -> IntakeSubmission:
    return submission.model_copy(update={"status": status})


def _with_triage(submission: IntakeSubmission, triage: TriageResult) -> IntakeSubmission:
    return submission.model_copy(update={"triage": triage})


_orchestrator: Orchestrator | None = None


def get_orchestrator() -> Orchestrator:
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = Orchestrator()
    return _orchestrator
