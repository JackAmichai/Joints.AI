"""Middleware for request-level observability."""

from __future__ import annotations

import uuid
from contextlib import contextmanager

import structlog
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.logging import log


@contextmanager
def request_context(request_id: str):
    """Bind a request_id to contextvars for the lifetime of a request."""
    structlog.contextvars.clear_contextvars()
    structlog.contextvars.bind_contextvars(request_id=request_id)
    try:
        yield
    finally:
        structlog.contextvars.clear_contextvars()


class CorrelationMiddleware(BaseHTTPMiddleware):
    """Stamps every request with a unique correlation ID."""

    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
        with request_context(request_id):
            log.info("request_started", method=request.method, path=request.url.path)
            response = await call_next(request)
            log.info("request_completed", status_code=response.status_code)
            response.headers["x-request-id"] = request_id
            return response
