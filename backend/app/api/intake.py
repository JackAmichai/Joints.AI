from fastapi import APIRouter, Depends, HTTPException, status

from app.db.store import SubmissionStore, get_submission_store
from app.orchestrator import Orchestrator, get_orchestrator
from app.schemas.intake import (
    IntakeSubmission,
    SubmitIntakeRequest,
    SubmitIntakeResponse,
)

router = APIRouter(prefix="/intake", tags=["intake"])


@router.post("/submit", response_model=SubmitIntakeResponse, response_model_by_alias=True)
async def submit_intake(
    req: SubmitIntakeRequest,
    orchestrator: Orchestrator = Depends(get_orchestrator),
) -> SubmitIntakeResponse:
    return await orchestrator.submit(req)


@router.get("/{submission_id}", response_model=IntakeSubmission, response_model_by_alias=True)
async def get_submission(
    submission_id: str,
    store: SubmissionStore = Depends(get_submission_store),
) -> IntakeSubmission:
    submission = store.get(submission_id)
    if submission is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="submission not found")
    return submission
