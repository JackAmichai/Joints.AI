"""Agent 2 — Triage.

The safety-critical gate. Runs BEFORE any extraction or retrieval and decides
whether the pipeline is allowed to produce exercise content at all.

Deliberately deterministic: a regex/phrase match against a curated rule list.
No LLM judgment on this layer — clinician-authored rules are auditable and
don't drift. An LLM-backed secondary safety check can be layered on top later,
but it cannot *relax* a deterministic halt.
"""

from __future__ import annotations

from datetime import UTC, datetime

from app.config import settings
from app.schemas.agents import TriageDisposition, TriageResult
from app.schemas.intake import SubjectivePainInput
from app.schemas.red_flags import (
    RED_FLAG_RULES,
    RedFlagDisposition,
    RedFlagHit,
    RedFlagSeverity,
)


class TriageAgent:
    """Red-flag detector. Pure function wrapped in a class so the
    orchestrator can inject test doubles and so we can version the model
    identifier that appears on the audit record.
    """

    def __init__(self, agent_id: str | None = None) -> None:
        # Format: algorithm-name@semver-like. Bump when rules change.
        self.agent_id = agent_id or f"triage-deterministic@v1+{settings.llm_model}"

    def scan(self, text: str) -> list[RedFlagHit]:
        if not text:
            return []
        haystack = text.lower()
        hits: list[RedFlagHit] = []
        for rule in RED_FLAG_RULES:
            for phrase in rule.patterns:
                needle = phrase.lower()
                start = 0
                while start <= len(haystack):
                    idx = haystack.find(needle, start)
                    if idx == -1:
                        break
                    hits.append(
                        RedFlagHit(
                            category=rule.category,
                            severity=rule.severity,
                            matched_phrase=phrase,
                            offset=idx,
                            user_message=rule.user_message,
                            disposition=rule.disposition,
                        )
                    )
                    start = idx + len(needle)
        hits.sort(key=lambda h: (0 if h.severity == RedFlagSeverity.critical else 1, h.offset))
        return hits

    def evaluate(self, subjective: SubjectivePainInput) -> TriageResult:
        """Run triage across everything the user has told us in free text.

        Only the free-text field is scanned — the structured enums are
        authored options that don't contain red-flag language. That keeps
        the scan space tight and the rule set interpretable.
        """
        hits = self.scan(subjective.free_text)
        disposition, rationale = self._decide(hits)
        return TriageResult(
            disposition=disposition,
            hits=hits,
            rationale=rationale,
            evaluated_at=datetime.now(UTC),
            evaluated_by=self.agent_id,
        )

    @staticmethod
    def _decide(hits: list[RedFlagHit]) -> tuple[TriageDisposition, str]:
        if not hits:
            return (
                TriageDisposition.proceed,
                "No red-flag language detected. Proceeding with extraction and retrieval.",
            )

        critical = [h for h in hits if h.severity == RedFlagSeverity.critical]
        if critical:
            top = critical[0]
            if top.disposition == RedFlagDisposition.emergency_room:
                return (
                    TriageDisposition.halt_seek_emergency,
                    f"Pipeline halted. Matched {top.category.value}: '{top.matched_phrase}'. "
                    "Routing to emergency care.",
                )
            return (
                TriageDisposition.halt_seek_physician,
                f"Pipeline halted. Matched {top.category.value}: '{top.matched_phrase}'. "
                "Urgent physician evaluation required.",
            )

        # Only high-severity hits — proceed with caution. Plans produced
        # under this disposition are flagged for tighter clinical review.
        return (
            TriageDisposition.proceed_with_caution,
            f"Non-critical caution flags detected ({len(hits)}). Plan will be flagged "
            "for tighter clinical review.",
        )
