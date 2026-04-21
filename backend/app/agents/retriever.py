"""Agent 3 — RAG Retriever + plan composer.

Takes the Extractor's ExtractedClinicalPayload, queries the vector store
for appropriate exercises filtered by kinematic group, and composes a
phased RehabPlan. The Retriever is NOT an LLM — the composition logic is
deterministic. The vectors serve ranking; the phases/dosing/framing
come from clinician-authored data.

Critical: every exercise returned here will still wait in the clinical
review queue before release (see orchestrator).
"""

from __future__ import annotations

import uuid
from datetime import UTC, datetime
from typing import cast

from app.knowledge_base.vector_store import RetrievedExercise, VectorStore, get_vector_store
from app.schemas.agents import (
    Exercise,
    ExerciseCitation,
    ExerciseMediaPlaceholder,
    ExercisePhase,
    ExtractedClinicalPayload,
    PlanPhase,
    ProbabilisticFraming,
    RehabPlan,
)
from app.schemas.body import BODY_REGION_META, BodyRegion

PHASE_ORDER: list[ExercisePhase] = cast(
    "list[ExercisePhase]",
    [
        "isometric_stabilization",
        "controlled_range_of_motion",
        "loaded_mobility",
    ],
)

PHASE_SUMMARIES: dict[ExercisePhase, str] = {
    "isometric_stabilization": (
        "Safe activation patterns. Hold-based. No repetitive joint motion."
    ),
    "controlled_range_of_motion": (
        "Gentle exploration of range within comfortable limits. No loading."
    ),
    "loaded_mobility": (
        "Light external load against the movements you've rebuilt. Tempo-controlled."
    ),
    "integrated_movement": (
        "Task-like patterns combining multiple joints. Advanced — gate carefully."
    ),
}


class Retriever:
    def __init__(self, store: VectorStore | None = None) -> None:
        self._store = store or get_vector_store()
        self._store.seed_if_empty()

    def retrieve_and_compose(
        self,
        extracted: ExtractedClinicalPayload,
    ) -> RehabPlan:
        group = BODY_REGION_META[extracted.primary_location].kinematic_group
        query_text = self._build_query(extracted)

        # Retrieve a pool large enough to fill each phase; Chroma ranks by
        # cosine similarity to the query + kinematic_group metadata filter.
        pool = self._store.query(
            query_text,
            kinematic_group=group,
            top_k=24,
        )

        phases: list[PlanPhase] = []
        for phase in PHASE_ORDER:
            phase_exercises = [r for r in pool if r.seed.phase == phase]
            if not phase_exercises:
                continue
            exercises = [_to_exercise(r, extracted.primary_location) for r in phase_exercises[:3]]
            phases.append(
                PlanPhase(
                    phase=phase,
                    summary=PHASE_SUMMARIES[phase],
                    exercises=exercises,
                )
            )

        framing = ProbabilisticFraming(
            pattern=_framing_pattern(extracted),
            commonly_associated_with=_framing_associations(extracted),
            confidence="low",
        )

        return RehabPlan(
            id=f"plan_{uuid.uuid4().hex[:12]}",
            generated_at=datetime.now(UTC),
            phases=phases,
            probabilistic_framing=framing,
            clinician_reviewed=False,
            clinician_note=None,
        )

    @staticmethod
    def _build_query(extracted: ExtractedClinicalPayload) -> str:
        parts = [
            f"pain region: {extracted.primary_location.value}",
        ]
        if extracted.aggravators:
            parts.append("aggravated by: " + ", ".join(a.value for a in extracted.aggravators))
        if extracted.relievers:
            parts.append("relieved by: " + ", ".join(r.value for r in extracted.relievers))
        if extracted.measurements:
            measure_str = ", ".join(f"{k}={v}" for k, v in extracted.measurements.items())
            parts.append(f"findings: {measure_str}")
        return " | ".join(parts)


def _to_exercise(r: RetrievedExercise, region: BodyRegion) -> Exercise:
    seed = r.seed
    return Exercise(
        id=seed.id,
        name=seed.name,
        phase=cast("ExercisePhase", seed.phase),
        target_region=region,
        instructions=list(seed.instructions),
        dose=seed.dose,
        stop_conditions=list(seed.stop_conditions),
        contraindication_tags=list(seed.contraindication_tags),
        media_placeholders={
            "video": ExerciseMediaPlaceholder(caption=f"Demonstration: {seed.name}"),
            "image": ExerciseMediaPlaceholder(caption=f"Starting position: {seed.name}"),
        },
        citations=[
            ExerciseCitation(
                source_title=seed.source_title,
                chunk_id=r.chunk_id,
                score=r.score,
            )
        ],
    )


def _framing_pattern(extracted: ExtractedClinicalPayload) -> str:
    region = BODY_REGION_META[extracted.primary_location]
    return f"{region.label.lower()} mobility limitation pattern"


def _framing_associations(extracted: ExtractedClinicalPayload) -> list[str]:
    """Lay-language phrases describing conditions commonly associated with
    the region. NEVER presented as a diagnosis — the consent flow and UI
    copy already make that clear, but the data contract reinforces it.
    """
    region = extracted.primary_location
    generic_by_group = {
        "hip_complex": [
            "hip-area soft-tissue irritability",
            "gluteal deconditioning",
            "anterior hip impingement patterns",
        ],
        "lower_limb": [
            "patellofemoral irritability",
            "quadriceps deconditioning",
        ],
        "spine": [
            "mechanical low back irritability",
            "deep-core endurance deficits",
        ],
        "shoulder_complex": [
            "rotator cuff tendinopathy patterns",
            "scapular control deficits",
        ],
    }
    group = BODY_REGION_META[region].kinematic_group
    return generic_by_group.get(group, [])
