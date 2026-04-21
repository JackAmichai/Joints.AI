from app.schemas.agents import (
    Exercise,
    ExercisePhase,
    ExtractedClinicalPayload,
    RehabPlan,
    TriageDisposition,
    TriageResult,
)
from app.schemas.body import BODY_REGION_META, BodyRegion, BodyRegionMeta, KinematicGroup
from app.schemas.intake import (
    Aggravator,
    IntakeStatus,
    IntakeSubmission,
    PainOnset,
    PainQuality,
    Reliever,
    SubjectivePainInput,
    SubmitIntakeRequest,
    SubmitIntakeResponse,
    UploadedFileCategory,
    UploadedFileMeta,
    UploadStatus,
)
from app.schemas.red_flags import (
    RED_FLAG_RULES,
    RedFlagCategory,
    RedFlagDisposition,
    RedFlagHit,
    RedFlagRule,
    RedFlagSeverity,
)

__all__ = [
    "BODY_REGION_META",
    "BodyRegion",
    "BodyRegionMeta",
    "KinematicGroup",
    "SubjectivePainInput",
    "UploadedFileMeta",
    "UploadedFileCategory",
    "UploadStatus",
    "IntakeStatus",
    "IntakeSubmission",
    "SubmitIntakeRequest",
    "SubmitIntakeResponse",
    "PainQuality",
    "PainOnset",
    "Aggravator",
    "Reliever",
    "RedFlagCategory",
    "RedFlagSeverity",
    "RedFlagDisposition",
    "RedFlagRule",
    "RedFlagHit",
    "RED_FLAG_RULES",
    "ExtractedClinicalPayload",
    "ExercisePhase",
    "Exercise",
    "TriageDisposition",
    "TriageResult",
    "RehabPlan",
]


# Intake's forward-ref resolution needs agents.py fully loaded. When this
# package is imported top-level, agents loads first (line 1 above) and
# intake.py's own bottom-of-file _rebuild() no-ops to avoid a partial-
# initialization ImportError. Re-run it now that both modules exist.
from app.schemas.intake import _rebuild as _rebuild_intake_refs  # noqa: E402

_rebuild_intake_refs()
del _rebuild_intake_refs
