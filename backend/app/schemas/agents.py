from datetime import datetime
from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.body import BodyRegion
from app.schemas.intake import Aggravator, Reliever
from app.schemas.red_flags import RedFlagHit

# =====================================================================
# Agent 1 — Extractor
# =====================================================================


class ReportedDiagnosisEvidence(BaseModel):
    """Diagnostic term extracted VERBATIM from a document. Evidence of what
    someone wrote, NOT something this system diagnoses.
    """

    term: str
    source_file_id: str = Field(alias="sourceFileId")
    verbatim_quote: str = Field(alias="verbatimQuote")

    model_config = {"populate_by_name": True}


class ExtractionProvenance(BaseModel):
    file_id: str = Field(alias="fileId")
    extraction_model: str = Field(alias="extractionModel")
    confidence: float

    model_config = {"populate_by_name": True}


class ExtractedClinicalPayload(BaseModel):
    primary_location: BodyRegion = Field(alias="primaryLocation")
    secondary_locations: list[BodyRegion] = Field(default_factory=list, alias="secondaryLocations")
    aggravators: list[Aggravator] = Field(default_factory=list)
    relievers: list[Reliever] = Field(default_factory=list)
    measurements: dict[str, float | str] = Field(default_factory=dict)
    reported_diagnoses: list[ReportedDiagnosisEvidence] = Field(
        default_factory=list, alias="reportedDiagnoses"
    )
    provenance: list[ExtractionProvenance] = Field(default_factory=list)
    unclassified_notes: list[str] = Field(default_factory=list, alias="unclassifiedNotes")

    model_config = {"populate_by_name": True}


# =====================================================================
# Agent 2 — Triage
# =====================================================================


class TriageDisposition(StrEnum):
    proceed = "proceed"
    halt_seek_emergency = "halt_seek_emergency"
    halt_seek_physician = "halt_seek_physician"
    proceed_with_caution = "proceed_with_caution"


class TriageResult(BaseModel):
    disposition: TriageDisposition
    hits: list[RedFlagHit] = Field(default_factory=list)
    rationale: str
    evaluated_at: datetime = Field(alias="evaluatedAt")
    evaluated_by: str = Field(alias="evaluatedBy")

    model_config = {"populate_by_name": True}

    @property
    def halted(self) -> bool:
        return self.disposition in (
            TriageDisposition.halt_seek_emergency,
            TriageDisposition.halt_seek_physician,
        )


# =====================================================================
# Agent 3 — RAG Retriever + plan composer
# =====================================================================


ExercisePhase = Literal[
    "isometric_stabilization",
    "controlled_range_of_motion",
    "loaded_mobility",
    "integrated_movement",
]


class ExerciseMediaPlaceholder(BaseModel):
    caption: str


class ExerciseCitation(BaseModel):
    source_title: str = Field(alias="sourceTitle")
    chunk_id: str = Field(alias="chunkId")
    score: float

    model_config = {"populate_by_name": True}


class Exercise(BaseModel):
    id: str
    name: str
    phase: ExercisePhase
    target_region: BodyRegion = Field(alias="targetRegion")
    instructions: list[str]
    dose: str
    stop_conditions: list[str] = Field(alias="stopConditions")
    contraindication_tags: list[str] = Field(default_factory=list, alias="contraindicationTags")
    media_placeholders: dict[str, ExerciseMediaPlaceholder] = Field(
        default_factory=dict, alias="mediaPlaceholders"
    )
    citations: list[ExerciseCitation] = Field(default_factory=list)

    model_config = {"populate_by_name": True}


class PlanPhase(BaseModel):
    phase: ExercisePhase
    summary: str
    exercises: list[Exercise]

    model_config = {"populate_by_name": True}


class ProbabilisticFraming(BaseModel):
    """Hard-coded probabilistic framing. The ONLY place the system talks
    about what symptoms might be consistent with — and never as a diagnosis.
    """

    pattern: str
    commonly_associated_with: list[str] = Field(alias="commonlyAssociatedWith")
    confidence: Literal["low", "moderate", "high"]

    model_config = {"populate_by_name": True}


class RehabPlan(BaseModel):
    id: str
    generated_at: datetime = Field(alias="generatedAt")
    phases: list[PlanPhase]
    probabilistic_framing: ProbabilisticFraming = Field(alias="probabilisticFraming")
    clinician_reviewed: bool = Field(default=False, alias="clinicianReviewed")
    clinician_note: str | None = Field(default=None, alias="clinicianNote")

    model_config = {"populate_by_name": True}
