"""Error envelope - standardized API error responses."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel


class ErrorCode(str, Enum):
    """Standard error codes for API responses."""
    NOT_FOUND = "not_found"
    RATE_LIMITED = "rate_limited"
    VALIDATION_ERROR = "validation_error"
    INTERNAL_ERROR = "internal_error"
    BAD_REQUEST = "bad_request"

    def __str__(self) -> str:
        return self.value


class ErrorEnvelope(BaseModel):
    error: str
    code: ErrorCode
    detail: str | None = None
    request_id: str | None = None

    model_config = {"from_attributes": True}


class ProblemDetail(BaseModel):
    """RFC 7807 Problem Details inspired envelope."""

    type: str
    title: str
    status: int
    detail: str | None = None
    request_id: str | None = None
    extensions: dict[str, Any] | None = None

    model_config = {"from_attributes": True}


def envelope(
    error: str,
    code: ErrorCode,
    detail: str | None = None,
    request_id: str | None = None,
) -> dict[str, Any]:
    """Build a standardized error envelope."""
    result: dict[str, Any] = {"error": error, "code": code.value}
    if detail:
        result["detail"] = detail
    if request_id:
        result["request_id"] = request_id
    return result


def problem(
    status: int,
    title: str,
    detail: str | None = None,
    request_id: str | None = None,
    ext: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Build a problem-details envelope."""
    result: dict[str, Any] = {
        "type": f"https://api.joints.ai/errors/{status}",
        "title": title,
        "status": status,
    }
    if detail:
        result["detail"] = detail
    if request_id:
        result["request_id"] = request_id
    if ext:
        result["extensions"] = ext
    return result
