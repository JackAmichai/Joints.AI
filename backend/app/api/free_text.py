from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.agents.free_text import FreeTextParser, get_free_text_parser

router = APIRouter(prefix="/free-text", tags=["free-text"])


class ParseRequest(BaseModel):
    text: str


class ParseResponse(BaseModel):
    primary_location: str | None
    pain_qualities: list[str]
    severity: int | None
    onset: str | None
    duration_days: int | None
    aggravators: list[str]
    relievers: list[str]
    confidence: float
    free_text: str


@router.post("/parse", response_model=ParseResponse)
async def parse_free_text(
    req: ParseRequest,
    parser: FreeTextParser = Depends(get_free_text_parser),
) -> ParseResponse:
    result = parser.parse(req.text)
    subjective = parser.to_subjective(req.text)

    return ParseResponse(
        primary_location=result.primary_location.value
        if result.primary_location
        else None,
        pain_qualities=[q.value for q in result.pain_qualities],
        severity=result.severity,
        onset=result.onset.value if result.onset else None,
        duration_days=result.duration_days,
        aggravators=[a.value for a in result.aggravators],
        relievers=[r.value for r in result.relievers],
        confidence=result.confidence,
        free_text=subjective.free_text,
    )