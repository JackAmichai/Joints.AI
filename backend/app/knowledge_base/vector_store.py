"""ChromaDB-backed vector store for the exercise corpus.

Uses Chroma's default local embedder (ONNX all-MiniLM-L6-v2). On first run
the ~90 MB model file is downloaded to the OS cache directory — one-time
cost. For production, swap in a managed vector DB (Pinecone, Weaviate) and
an embedder of your choice; the interface here is intentionally narrow so
that swap is localized.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import chromadb
from chromadb.api.models.Collection import Collection

from app.config import settings
from app.knowledge_base.seed import SEED_EXERCISES, SeedExercise
from app.logging import log


@dataclass
class RetrievedExercise:
    seed: SeedExercise
    score: float
    chunk_id: str


class VectorStore:
    """Thin wrapper around Chroma. All calls are synchronous — Chroma's
    local client doesn't provide a real async API and our volumes are low
    enough that threading is unnecessary for now.
    """

    def __init__(self, persist_dir: Path, collection_name: str) -> None:
        persist_dir.mkdir(parents=True, exist_ok=True)
        self._client = chromadb.PersistentClient(path=str(persist_dir))
        self._collection_name = collection_name
        self._collection: Collection = self._client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def seed_if_empty(self, exercises: list[SeedExercise] | None = None) -> int:
        exercises = exercises or SEED_EXERCISES
        if self._collection.count() > 0:
            return 0

        ids = [ex.id for ex in exercises]
        documents = [_embedding_document(ex) for ex in exercises]
        metadatas = [_flatten_metadata(ex) for ex in exercises]
        self._collection.add(ids=ids, documents=documents, metadatas=metadatas)
        log.info("vector_store_seeded", count=len(exercises), collection=self._collection_name)
        return len(exercises)

    def reset(self) -> None:
        self._client.delete_collection(self._collection_name)
        self._collection = self._client.get_or_create_collection(
            name=self._collection_name,
            metadata={"hnsw:space": "cosine"},
        )

    def query(
        self,
        text: str,
        *,
        kinematic_group: str | None = None,
        exclude_contraindication_tags: list[str] | None = None,
        top_k: int = 12,
    ) -> list[RetrievedExercise]:
        where: dict[str, object] | None = None
        if kinematic_group:
            where = {"kinematic_group": kinematic_group}

        result = self._collection.query(
            query_texts=[text],
            n_results=top_k,
            where=where,
        )

        retrieved: list[RetrievedExercise] = []
        by_id = {ex.id: ex for ex in SEED_EXERCISES}

        ids_batch = result.get("ids") or [[]]
        dist_batch = result.get("distances") or [[]]
        for item_id, distance in zip(ids_batch[0], dist_batch[0], strict=False):
            seed = by_id.get(item_id)
            if seed is None:
                continue
            if exclude_contraindication_tags and set(seed.contraindication_tags) & set(
                exclude_contraindication_tags
            ):
                continue
            # Chroma returns cosine distance; convert to a 0..1 similarity.
            score = max(0.0, 1.0 - float(distance))
            retrieved.append(RetrievedExercise(seed=seed, score=score, chunk_id=item_id))
        return retrieved


def _embedding_document(ex: SeedExercise) -> str:
    """Compose a single text blob for embedding. Includes the summary, the
    instruction cues (which carry biomechanical vocabulary), and the phase
    so semantically similar exercises cluster by intent.
    """
    parts = [
        f"Exercise: {ex.name}",
        f"Phase: {ex.phase}",
        f"Target group: {ex.kinematic_group}",
        f"Summary: {ex.summary}",
        "Cues: " + " | ".join(ex.instructions),
    ]
    if ex.contraindication_tags:
        parts.append("Contraindications: " + ", ".join(ex.contraindication_tags))
    return "\n".join(parts)


def _flatten_metadata(ex: SeedExercise) -> dict[str, str]:
    """Chroma metadata only accepts scalar values — no nested lists.
    We JSON-encode the list fields and decode on the way out via the
    seed lookup (we never re-hydrate exercises from Chroma metadata alone).
    """
    return {
        "id": ex.id,
        "name": ex.name,
        "phase": ex.phase,
        "kinematic_group": ex.kinematic_group,
        "contraindication_tags": json.dumps(ex.contraindication_tags),
        "source_title": ex.source_title,
    }


_store: VectorStore | None = None


def get_vector_store() -> VectorStore:
    global _store
    if _store is None:
        _store = VectorStore(settings.chroma_dir, settings.chroma_collection)
    return _store
