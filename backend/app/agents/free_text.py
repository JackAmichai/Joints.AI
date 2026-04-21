"""Free-text parser for single-message intake.

Takes a free-form description and uses AI/LLM to extract
structured intake data. This is simpler than conversational -
just one message in, structured data out.
"""

from __future__ import annotations

from datetime import UTC, datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.schemas.body import BodyRegion
from app.schemas.intake import (
    Aggravator,
    PainOnset,
    PainQuality,
    Reliever,
    SubjectivePainInput,
)


class ExtractedIntake(BaseModel):
    """Structured extraction from free text."""

    primary_location: Optional[BodyRegion] = None
    pain_qualities: list[PainQuality] = Field(default_factory=list)
    severity: Optional[int] = None
    onset: Optional[PainOnset] = None
    duration_days: Optional[int] = None
    aggravators: list[Aggravator] = Field(default_factory=list)
    relievers: list[Reliever] = Field(default_factory=list)
    confidence: float = 0.0


# Simple keyword-based parser (no LLM required)
# Maps common phrases to structured values

LOCATION_PHRASES = {
    "lower back": "lumbar_spine",
    "lumbar": "lumbar_spine",
    "low back": "lumbar_spine",
    "back": "lumbar_spine",
    "upper back": "thoracic_spine",
    "thoracic": "thoracic_spine",
    "neck": "cervical_spine",
    "cervical": "cervical_spine",
    "shoulder": "shoulder_left",
    "knee": "knee_left",
    "hip": "hip_left",
    "elbow": "elbow_left",
    "wrist": "wrist_left",
    "ankle": "ankle_left",
    "foot": "foot_left",
}

PAIN_QUALITY_PHRASES = {
    "sharp": PainQuality.sharp,
    "sudden": PainQuality.sharp,
    "dull": PainQuality.dull,
    "aching": PainQuality.aching,
    "throb": PainQuality.throbbing,
    "burning": PainQuality.burning,
    "stabbing": PainQuality.stabbing,
    "tingling": PainQuality.tingling,
    "numbness": PainQuality.tingling,
    "stiff": PainQuality.stiffness,
    "stiffness": PainQuality.stiffness,
}

ONSET_PHRASES = {
    "today": (PainOnset.sudden_traumatic, 0),
    "yesterday": (PainOnset.sudden_traumatic, 1),
    "just now": (PainOnset.sudden_traumatic, 0),
    "week": (PainOnset.gradual, 7),
    "weeks": (PainOnset.gradual, 14),
    "month": (PainOnset.chronic_recurring, 30),
    "months": (PainOnset.chronic_recurring, 90),
    "years": (PainOnset.chronic_recurring, 365),
    "long time": (PainOnset.chronic_recurring, 90),
    "chronic": (PainOnset.chronic_recurring, 90),
    "always": (PainOnset.chronic_recurring, 365),
}

AGGRAVATOR_PHRASES = {
    "standing": Aggravator.standing_prolonged,
    "sit": Aggravator.sitting_prolonged,
    "sitting": Aggravator.sitting_prolonged,
    "walk": Aggravator.walking,
    "walking": Aggravator.walking,
    "running": Aggravator.running,
    "lift": Aggravator.lifting,
    "bending": Aggravator.flexion,
    "bend": Aggravator.flexion,
    "straighten": Aggravator.extension,
    "twist": Aggravator.rotation,
    "morning": Aggravator.morning_stiffness,
    "cold": Aggravator.cold_weather,
    "exercise": Aggravator.after_exercise,
    "rest": Aggravator.at_rest,
    "night": Aggravator.at_night,
}

RELIEVER_PHRASES = {
    "rest": Reliever.rest,
    "heat": Reliever.heat,
    "hot": Reliever.heat,
    "ice": Reliever.ice,
    "cold": Reliever.ice,
    "movement": Reliever.movement,
    "walk": Reliever.movement,
    "stretch": Reliever.stretching,
    "stretching": Reliever.stretching,
    "nsaid": Reliever.nsaids,
    "ibuprofen": Reliever.nsaids,
    "advil": Reliever.nsaids,
    "tylenol": Reliever.nsaids,
    "position": Reliever.position_change,
}


class FreeTextParser:
    """Parse free-text descriptions into structured intake."""

    def __init__(self) -> None:
        pass

    def parse(self, text: str) -> ExtractedIntake:
        """Parse text into structured intake."""

        text_lower = text.lower()
        result = ExtractedIntake()

        # Find body location
        for phrase, region_id in LOCATION_PHRASES.items():
            if phrase in text_lower:
                try:
                    result.primary_location = BodyRegion(region_id)
                    result.confidence += 0.3
                    break
                except ValueError:
                    pass

        # Find pain qualities
        for phrase, quality in PAIN_QUALITY_PHRASES.items():
            if phrase in text_lower:
                if quality not in result.pain_qualities:
                    result.pain_qualities.append(quality)
                    result.confidence += 0.1
        if result.pain_qualities:
            result.confidence = min(result.confidence, 0.5)

        # Extract severity
        import re
        severity_match = re.search(r"(\d+)\s*(?:out of|/|\/10)", text_lower)
        if severity_match:
            sev = int(severity_match.group(1))
            if 0 < sev <= 10:
                result.severity = sev
                result.confidence += 0.2
        else:
            if "worst" in text_lower or "severe" in text_lower:
                result.severity = 8
                result.confidence += 0.1
            elif "moderate" in text_lower:
                result.severity = 5
                result.confidence += 0.1
            elif "mild" in text_lower or "little" in text_lower:
                result.severity = 3
                result.confidence += 0.1
            elif "none" in text_lower or "no pain" in text_lower:
                result.severity = 1

        # Find onset/duration
        onset_found = False
        for phrase, (onset, days) in ONSET_PHRASES.items():
            if phrase in text_lower:
                result.onset = onset
                result.duration_days = days
                result.confidence += 0.15
                onset_found = True
                break
        if not onset_found:
            result.onset = PainOnset.unknown

        # Find aggravators
        for phrase, agg in AGGRAVATOR_PHRASES.items():
            if phrase in text_lower:
                if agg not in result.aggravators:
                    result.aggravators.append(agg)
        if result.aggravators:
            result.confidence += 0.1

        # Find relievers
        for phrase, rel in RELIEVER_PHRASES.items():
            if phrase in text_lower:
                if rel not in result.relievers:
                    result.relievers.append(rel)
        if result.relievers:
            result.confidence += 0.1

        # Cap confidence at 1.0
        result.confidence = min(result.confidence, 1.0)

        return result

    def to_subjective(self, text: str) -> SubjectivePainInput:
        """Convert to SubjectivePainInput."""

        extracted = self.parse(text)

        free_text_parts = [text]
        if extracted.primary_location:
            free_text_parts.append(f"Location: {extracted.primary_location.value}")
        if extracted.pain_qualities:
            free_text_parts.append(f"Pain: {', '.join(q.value for q in extracted.pain_qualities)}")
        if extracted.severity:
            free_text_parts.append(f"Severity: {extracted.severity}/10")

        return SubjectivePainInput(
            primary_location=extracted.primary_location,
            secondary_locations=[],
            intensity=extracted.severity,
            qualities=extracted.pain_qualities,
            onset=extracted.onset,
            duration_days=extracted.duration_days,
            aggravators=extracted.aggravators,
            relievers=extracted.relievers,
            free_text=". ".join(free_text_parts),
        )


_free_text_parser: FreeTextParser | None = None


def get_free_text_parser() -> FreeTextParser:
    global _free_text_parser
    if _free_text_parser is None:
        _free_text_parser = FreeTextParser()
    return _free_text_parser