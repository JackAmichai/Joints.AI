from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.api.intake import router as intake_router
from app.errors import ErrorCode, envelope
from app.config import settings
from app.db.store import get_submission_store
from app.knowledge_base.vector_store import get_vector_store
from app.logging import configure_logging, log
from app.middleware import CorrelationMiddleware


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    configure_logging()
    log.info("joints_ai_starting", llm=settings.llm_configured, vlm=settings.vlm_configured)
    # Warm up the vector store + seed corpus on cold start so the first
    # user request doesn't block on embedding model download.
    store = get_vector_store()
    seeded = store.seed_if_empty()
    log.info("vector_store_ready", newly_seeded=seeded)
    yield
    log.info("joints_ai_shutting_down")


app = FastAPI(
    title="Joints.AI Orchestrator",
    version="0.1.0",
    description=(
        "Multi-agent pipeline: Triage (deterministic red-flag gate) → Extractor "
        "(LLM/VLM normalization) → RAG Retriever (ChromaDB). All generated plans "
        "wait in a clinician review queue before release."
    ),
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.add_middleware(CorrelationMiddleware)

limiter = Limiter(key_func=get_remote_address)


def _get_limiter() -> Limiter:
    return limiter


app.include_router(intake_router, prefix="/api")


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    return JSONResponse(
        status_code=429,
        content=envelope(
            error="rate_limit_exceeded",
            code=ErrorCode.RATE_LIMITED,
            detail=str(exc.detail),
        ),
    )


@app.get("/healthz", tags=["ops"])
async def healthz() -> dict[str, str]:
    vector_store = get_vector_store()
    vector_ok = vector_store._collection.count() > 0

    try:
        store = get_submission_store()
        store.get("__health_check_do_not_delete__")
        db_ok = True
    except Exception:
        db_ok = False

    if vector_ok and db_ok:
        return {"status": "ok", "vector_store": "ready", "db": "ready"}

    return {
        "status": "degraded",
        "vector_store": "ready" if vector_ok else "empty",
        "db": "ok" if db_ok else "error",
    }


@app.get("/readyz", tags=["ops"])
async def readyz() -> dict[str, str]:
    """Readiness probe - returns 200 only if fully warmed."""
    vector_store = get_vector_store()
    if vector_store._collection.count() == 0:
        raise HTTPException(status_code=503, detail="vector store not seeded")
    return {"ready": True}
