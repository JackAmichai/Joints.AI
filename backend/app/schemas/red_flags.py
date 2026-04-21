from enum import Enum

from pydantic import BaseModel


class RedFlagCategory(str, Enum):
    cauda_equina = "cauda_equina"
    severe_trauma = "severe_trauma"
    radiating_nerve = "radiating_nerve"
    progressive_weakness = "progressive_weakness"
    systemic_illness = "systemic_illness"
    cardiac_referral = "cardiac_referral"
    vascular = "vascular"


class RedFlagSeverity(str, Enum):
    critical = "critical"
    high = "high"


class RedFlagDisposition(str, Enum):
    emergency_room = "emergency_room"
    urgent_physician = "urgent_physician"
    physician_review = "physician_review"


class RedFlagRule(BaseModel):
    category: RedFlagCategory
    severity: RedFlagSeverity
    patterns: list[str]
    user_message: str
    disposition: RedFlagDisposition


class RedFlagHit(BaseModel):
    category: RedFlagCategory
    severity: RedFlagSeverity
    matched_phrase: str
    offset: int
    user_message: str
    disposition: RedFlagDisposition


RED_FLAG_RULES: list[RedFlagRule] = [
    RedFlagRule(
        category=RedFlagCategory.cauda_equina,
        severity=RedFlagSeverity.critical,
        patterns=[
            "loss of bowel",
            "loss of bladder",
            "bowel control",
            "bladder control",
            "saddle numbness",
            "saddle anesthesia",
            "can't feel when i pee",
            "cant feel when i pee",
            "numb between my legs",
        ],
        user_message=(
            "What you've described may need urgent evaluation. "
            "Please stop this intake and seek emergency care."
        ),
        disposition=RedFlagDisposition.emergency_room,
    ),
    RedFlagRule(
        category=RedFlagCategory.severe_trauma,
        severity=RedFlagSeverity.critical,
        patterns=[
            "car accident",
            "fell from height",
            "severe trauma",
            "hit by",
            "motorcycle crash",
            "unconscious",
        ],
        user_message=(
            "Acute trauma needs in-person evaluation before any exercise program. "
            "Please see an emergency provider."
        ),
        disposition=RedFlagDisposition.emergency_room,
    ),
    RedFlagRule(
        category=RedFlagCategory.radiating_nerve,
        severity=RedFlagSeverity.high,
        patterns=[
            "radiating nerve pain",
            "shooting down my leg",
            "shooting down both legs",
            "shooting down my arm",
            "electric shock",
            "foot drop",
        ],
        user_message=(
            "Radiating or shock-like pain is a signal to have a clinician "
            "evaluate you before starting a mobility program."
        ),
        disposition=RedFlagDisposition.urgent_physician,
    ),
    RedFlagRule(
        category=RedFlagCategory.progressive_weakness,
        severity=RedFlagSeverity.critical,
        patterns=[
            "getting weaker",
            "progressive weakness",
            "can't lift my",
            "leg gave out",
            "losing strength",
        ],
        user_message=(
            "Worsening weakness warrants prompt medical assessment "
            "before any mobility work."
        ),
        disposition=RedFlagDisposition.urgent_physician,
    ),
    RedFlagRule(
        category=RedFlagCategory.systemic_illness,
        severity=RedFlagSeverity.high,
        patterns=[
            "fever and back pain",
            "night sweats",
            "unexplained weight loss",
            "history of cancer",
        ],
        user_message=(
            "Your description includes findings that should be reviewed by a "
            "physician before exercise guidance is appropriate."
        ),
        disposition=RedFlagDisposition.physician_review,
    ),
    RedFlagRule(
        category=RedFlagCategory.cardiac_referral,
        severity=RedFlagSeverity.critical,
        patterns=[
            "chest pain and",
            "crushing chest",
            "pain down my left arm",
            "jaw pain with chest",
        ],
        user_message=(
            "What you've described can be a cardiac warning. "
            "Please seek emergency care right now."
        ),
        disposition=RedFlagDisposition.emergency_room,
    ),
    RedFlagRule(
        category=RedFlagCategory.vascular,
        severity=RedFlagSeverity.critical,
        patterns=[
            "cold pale limb",
            "no pulse in my",
            "limb turned blue",
        ],
        user_message="A cold, pale, or pulseless limb is an emergency. Please go to an ER.",
        disposition=RedFlagDisposition.emergency_room,
    ),
]
