from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.intake import router as intake_router
from app.config import settings
from app.knowledge_base.vector_store import get_vector_store
from app.logging import configure_logging, log


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    configure_logging()
    log.info("techphysio_starting", llm=settings.llm_configured, vlm=settings.vlm_configured)
    # Warm up the vector store + seed corpus on cold start so the first
    # user request doesn't block on embedding model download.
    store = get_vector_store()
    seeded = store.seed_if_empty()
    log.info("vector_store_ready", newly_seeded=seeded)
    yield
    log.info("techphysio_shutting_down")


app = FastAPI(
    title="TechPhysio Orchestrator",
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

app.include_router(intake_router, prefix="/api")


@app.get("/healthz", tags=["ops"])
async def healthz() -> dict[str, str]:
    return {"status": "ok"}
