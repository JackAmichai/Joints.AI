from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from app.agents.conversational import (
    ConversationalAgent,
    QuestionState,
    get_conversational_agent,
)

router = APIRouter(prefix="/conversational", tags=["conversational"])


class ChatMessageRequest(BaseModel):
    session_id: str
    message: str


class ChatMessageResponse(BaseModel):
    session_id: str
    state: str
    question: str
    extracted: dict | None = None
    is_complete: bool = False
    subjective: dict | None = None


class StartSessionResponse(BaseModel):
    session_id: str
    greeting: str


@router.post("/start", response_model=StartSessionResponse)
async def start_conversation(
    agent: ConversationalAgent = Depends(get_conversational_agent),
) -> StartSessionResponse:
    import uuid

    session_id = f"chat_{uuid.uuid4().hex[:12]}"
    session = agent.start_session(session_id)

    return StartSessionResponse(
        session_id=session_id,
        greeting=session.current_question,
    )


@router.post("/chat", response_model=ChatMessageResponse)
async def chat_message(
    req: ChatMessageRequest,
    agent: ConversationalAgent = Depends(get_conversational_agent),
) -> ChatMessageResponse:
    session = agent.process_message(req.session_id, req.message)

    def serialize_value(val):
        if hasattr(val, "value"):
            return val.value
        if isinstance(val, (list, tuple)):
            return [serialize_value(v) for v in val]
        return val

    extracted = {
        "primary_location": session.primary_location.value
        if session.primary_location
        else None,
        "pain_qualities": [q.value for q in session.pain_qualities],
        "severity": session.severity,
        "onset": session.onset.value if session.onset else None,
        "duration_days": session.duration_days,
        "aggravators": [a.value for a in session.aggravators],
        "relievers": [r.value for r in session.relievers],
    }

    is_complete = session.state == QuestionState.DONE
    subjective = None
    if is_complete:
        subjective = session.to_subjective().model_dump()

    return ChatMessageResponse(
        session_id=session.id,
        state=session.state.value,
        question=session.current_question,
        extracted=extracted,
        is_complete=is_complete,
        subjective=subjective,
    )


@router.get("/session/{session_id}", response_model=ChatMessageResponse)
async def get_session(
    session_id: str,
    agent: ConversationalAgent = Depends(get_conversational_agent),
) -> ChatMessageResponse:
    session = agent.get_session(session_id)
    if session is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="session not found")

    def serialize_value(val):
        if hasattr(val, "value"):
            return val.value
        if isinstance(val, (list, tuple)):
            return [serialize_value(v) for v in val]
        return val

    extracted = {
        "primary_location": session.primary_location.value
        if session.primary_location
        else None,
        "pain_qualities": [q.value for q in session.pain_qualities],
        "severity": session.severity,
        "onset": session.onset.value if session.onset else None,
        "duration_days": session.duration_days,
        "aggravators": [a.value for a in session.aggravators],
        "relievers": [r.value for r in session.relievers],
    }

    is_complete = session.state == QuestionState.DONE
    subjective = None
    if is_complete:
        subjective = session.to_subjective().model_dump()

    return ChatMessageResponse(
        session_id=session.id,
        state=session.state.value,
        question=session.current_question,
        extracted=extracted,
        is_complete=is_complete,
        subjective=subjective,
    )
