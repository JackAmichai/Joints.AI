from datetime import datetime
from enum import StrEnum
from typing import TYPE_CHECKING

from pydantic import BaseModel, Field

from app.schemas.body import BodyRegion

if TYPE_CHECKING:
    from app.schemas.agents import (
        ExtractedClinicalPayload,
        RehabPlan,
        TriageResult,
    )


class PainQuality(StrEnum):
    sharp = "sharp"
    dull = "dull"
    aching = "aching"
    throbbing = "throbbing"
    burning = "burning"
    stabbing = "stabbing"
    tingling = "tingling"
    pins_and_needles = "pins_and_needles"
    stiffness = "stiffness"


class PainOnset(StrEnum):
    sudden_traumatic = "sudden_traumatic"
    sudden_atraumatic = "sudden_atraumatic"
    gradual = "gradual"
    chronic_recurring = "chronic_recurring"
    unknown = "unknown"


class Aggravator(StrEnum):
    flexion = "flexion"
    extension = "extension"
    rotation = "rotation"
    lateral_flexion = "lateral_flexion"
    weight_bearing = "weight_bearing"
    sitting_prolonged = "sitting_prolonged"
    standing_prolonged = "standing_prolonged"
    walking = "walking"
    running = "running"
    lifting = "lifting"
    overhead_reach = "overhead_reach"
    gripping = "gripping"
    cold_weather = "cold_weather"
    morning_stiffness = "morning_stiffness"
    end_of_day = "end_of_day"
    after_exercise = "after_exercise"
    at_rest = "at_rest"
    at_night = "at_night"


class Reliever(StrEnum):
    rest = "rest"
    heat = "heat"
    ice = "ice"
    movement = "movement"
    stretching = "stretching"
    nsaids = "nsaids"
    position_change = "position_change"
    nothing_helps = "nothing_helps"


class UploadedFileCategory(StrEnum):
    imaging_report = "imaging_report"
    imaging_dicom = "imaging_dicom"
    imaging_photo = "imaging_photo"
    clinical_note = "clinical_note"
    lab_report = "lab_report"
    other = "other"


class UploadStatus(StrEnum):
    queued = "queued"
    uploading = "uploading"
    uploaded = "uploaded"
    processing = "processing"
    failed = "failed"


class SubjectivePainInput(BaseModel):
    primary_location: BodyRegion | None = Field(default=None, alias="primaryLocation")
    secondary_locations: list[BodyRegion] = Field(default_factory=list, alias="secondaryLocations")
    intensity: int | None = None
    qualities: list[PainQuality] = Field(default_factory=list)
    onset: PainOnset | None = None
    duration_days: int | None = Field(default=None, alias="durationDays")
    aggravators: list[Aggravator] = Field(default_factory=list)
    relievers: list[Reliever] = Field(default_factory=list)
    free_text: str = Field(default="", alias="freeText")

    model_config = {"populate_by_name": True}


class UploadedFileMeta(BaseModel):
    id: str
    filename: str
    mime_type: str = Field(alias="mimeType")
    size_bytes: int = Field(alias="sizeBytes")
    category: UploadedFileCategory
    uploaded_at: datetime = Field(alias="uploadedAt")
    status: UploadStatus
    storage_key: str | None = Field(default=None, alias="storageKey")
    note: str | None = None
    error: str | None = None

    model_config = {"populate_by_name": True}


class IntakeStatus(StrEnum):
    draft = "draft"
    submitted = "submitted"
    triaging = "triaging"
    halted_red_flag = "halted_red_flag"
    extracting = "extracting"
    retrieving = "retrieving"
    pending_clinical_review = "pending_clinical_review"
    plan_ready = "plan_ready"
    failed = "failed"


class IntakeSubmission(BaseModel):
    """Top-level submission record. Stored server-side; `plan` stays None
    until retrieval AND clinician-review complete."""

    id: str
    created_at: datetime = Field(alias="createdAt")
    status: IntakeStatus
    subjective: SubjectivePainInput
    files: list[UploadedFileMeta] = Field(default_factory=list)

    # Populated by the agent pipeline
    extracted: "ExtractedClinicalPayload | None" = None
    triage: "TriageResult | None" = None
    plan: "RehabPlan | None" = None

    model_config = {"populate_by_name": True}


class SubmitIntakeRequest(BaseModel):
    subjective: SubjectivePainInput
    files: list[UploadedFileMeta] = Field(default_factory=list)
    consent_version: str = Field(alias="consentVersion")

    model_config = {"populate_by_name": True}


class SubmitIntakeResponse(BaseModel):
    submission_id: str = Field(alias="submissionId")
    triage: "TriageResult"
    halted: bool
    poll_after_seconds: int | None = Field(alias="pollAfterSeconds")

    model_config = {"populate_by_name": True}


# Rebuild to resolve forward refs once the agents module has loaded.
def _rebuild() -> None:
    from app.schemas.agents import (  # noqa: F401
        ExtractedClinicalPayload,
        RehabPlan,
        TriageResult,
    )

    IntakeSubmission.model_rebuild()
    SubmitIntakeResponse.model_rebuild()


_rebuild()

