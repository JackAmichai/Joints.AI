from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import UTC, datetime
import uuid

router = APIRouter(prefix="/progress", tags=["progress"])


class ExerciseCompleteRequest(BaseModel):
    user_id: str
    plan_id: str
    exercise_id: str
    pain_level: int | None = None
    notes: str | None = None


class FeedbackRequest(BaseModel):
    plan_id: str
    feedback: str


@router.post("/complete")
async def complete_exercise(req: ExerciseCompleteRequest):
    """Record exercise completion."""

    return {
        "id": f"prog_{uuid.uuid4().hex[:12]}",
        "user_id": req.user_id,
        "plan_id": req.plan_id,
        "exercise_id": req.exercise_id,
        "completed_at": datetime.now(UTC).isoformat(),
        "pain_level": req.pain_level,
        "notes": req.notes,
    }


@router.post("/feedback")
async def submit_feedback(req: FeedbackRequest):
    """Record plan feedback."""

    return {
        "id": f"feed_{uuid.uuid4().hex[:12]}",
        "plan_id": req.plan_id,
        "feedback": req.feedback,
        "created_at": datetime.now(UTC).isoformat(),
    }


@router.get("/history/{user_id}")
async def get_progress_history(user_id: str):
    """Get user's exercise history."""

    return {
        "completed_exercises": [],
        "current_streak": 0,
        "total_completed": 0,
    }