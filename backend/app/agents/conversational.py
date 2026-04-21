"""Agent 4 — Conversational Intake.

Takes user messages in free text and responds with follow-up questions
to build a structured intake. Maintains conversation history to extract
body region, pain type, severity, and duration.

This is NOT the same as the free-text parser (which parses a single
message) — this is an interactive chat session.
"""

from __future__ import annotations

from datetime import UTC, datetime
from enum import Enum

from pydantic import BaseModel, Field

from app.schemas.body import BodyRegion
from app.schemas.intake import (
    Aggravator,
    PainOnset,
    PainQuality,
    Reliever,
    SubjectivePainInput,
)


class QuestionState(str, Enum):
    """States in the conversational flow."""

    GREETING = "greeting"
    BODY_REGION = "body_region"
    PAIN_QUALITY = "pain_quality"
    SEVERITY = "severity"
    DURATION = "duration"
    AGGRAVATORS = "aggravators"
    RELIEVERS = "relievers"
    CONFIRMING = "confirming"
    DONE = "done"


GREETING_QUESTION = (
    "Hi there! I'm here to help you get a personalized exercise plan. "
    "Let's start with a simple conversation about what you're experiencing.\n\n"
    "Can you tell me in your own words what's bothering you?"
)

QUESTION_PROMPTS: dict[QuestionState, str] = {
    QuestionState.GREETING: GREETING_QUESTION,
    QuestionState.BODY_REGION: (
        "Where do you feel the discomfort? Is it your lower back, knee, shoulder, neck, "
        "hip, or somewhere else? You can describe or just name it."
    ),
    QuestionState.PAIN_QUALITY: (
        "What does that pain feel like? Is it sharp and sudden, dull and aching, "
        "a burning sensation, stiffness, or something else?"
    ),
    QuestionState.SEVERITY: (
        "On a scale of 1 to 10, where 1 is barely noticeable and 10 is the worst "
        "pain you've ever felt — where would you put it right now?"
    ),
    QuestionState.DURATION: (
        "How long have you been dealing with this? Is it something that started "
        "recently (a few days or weeks), or has it been going on for months?"
    ),
    QuestionState.AGGRAVATORS: (
        "What makes it feel worse? For example, does standing, sitting, walking, "
        "lifting, or bending make it more uncomfortable?"
    ),
    QuestionState.RELIEVERS: (
        "What helps ease the pain? Rest, heat, ice, movement, stretching, "
        "or medication?"
    ),
    QuestionState.CONFIRMING: (
        "Let me make sure I understand your situation correctly. "
        "Based on what you've shared, I want to confirm a few things."
    ),
    QuestionState.DONE: (
        "Thank you for sharing all that with me! Your personalized exercise plan "
        "is being prepared. You'll be able to review it shortly."
    ),
}

FOLLOW_UP_QUESTIONS: list[QuestionState] = [
    QuestionState.BODY_REGION,
    QuestionState.PAIN_QUALITY,
    QuestionState.SEVERITY,
    QuestionState.DURATION,
    QuestionState.AGGRAVATORS,
    QuestionState.RELIEVERS,
]


class ConversationTurn(BaseModel):
    """A single exchange in the conversation."""

    state: QuestionState
    question: str
    answer: str | None = None
    extracted_value: str | int | list[str] | None = None


class ConversationSession(BaseModel):
    """Full conversation state."""

    id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    state: QuestionState = QuestionState.GREETING
    history: list[ConversationTurn] = Field(default_factory=list)
    primary_location: BodyRegion | None = None
    pain_qualities: list[PainQuality] = Field(default_factory=list)
    severity: int | None = None
    onset: PainOnset | None = None
    duration_days: int | None = None
    aggravators: list[Aggravator] = Field(default_factory=list)
    relievers: list[Reliever] = Field(default_factory=list)

    @property
    def current_question(self) -> str:
        return QUESTION_PROMPTS.get(self.state, "")

    def to_subjective(self) -> SubjectivePainInput:
        """Convert conversation to structured intake."""

        return SubjectivePainInput(
            primary_location=self.primary_location,
            secondary_locations=[],
            intensity=self.severity,
            qualities=self.pain_qualities,
            onset=self.onset,
            duration_days=self.duration_days,
            aggravators=self.aggravators,
            relievers=self.relievers,
            free_text=self._build_free_text(),
        )

    def _build_free_text(self) -> str:
        parts = []
        if self.primary_location:
            parts.append(f"Pain in {self.primary_location.value}")
        if self.pain_qualities:
            parts.append(f"Pain quality: {', '.join(q.value for q in self.pain_qualities)}")
        if self.severity:
            parts.append(f"Severity: {self.severity}/10")
        return ". ".join(parts)


class ConversationalAgent:
    """Interactive chat agent for intake conversation."""

    def __init__(self) -> None:
        self._sessions: dict[str, ConversationSession] = {}

    def start_session(self, session_id: str) -> ConversationSession:
        """Start a new conversation session."""

        session = ConversationSession(id=session_id)
        self._sessions[session_id] = session
        return session

    def get_session(self, session_id: str) -> ConversationSession | None:
        """Get existing session."""

        return self._sessions.get(session_id)

    def process_message(
        self, session_id: str, user_message: str
    ) -> ConversationSession:
        """Process user message and advance conversation state."""

        if session_id not in self._sessions:
            self.start_session(session_id)

        session = self._sessions[session_id]
        current_state = session.state

        # Record the turn
        turn = ConversationTurn(
            state=current_state,
            question=session.current_question,
            answer=user_message,
        )

        # Extract information from user response
        self._extract_for_state(session, current_state, user_message)
        turn.extracted_value = self._get_extracted_value(session, current_state)

        session.history.append(turn)

        # Advance to next state
        if current_state in FOLLOW_UP_QUESTIONS:
            next_index = FOLLOW_UP_QUESTIONS.index(current_state) + 1
            if next_index < len(FOLLOW_UP_QUESTIONS):
                session.state = FOLLOW_UP_QUESTIONS[next_index]
            else:
                session.state = QuestionState.CONFIRMING
        elif current_state == QuestionState.CONFIRMING:
            session.state = QuestionState.DONE
        elif current_state == QuestionState.DONE:
            pass  # Stay done

        return session

    def _extract_for_state(
        self, session: ConversationSession, state: QuestionState, message: str
    ) -> None:
        """Extract structured data based on current state."""

        msg_lower = message.lower()

        if state == QuestionState.BODY_REGION:
            region = self._parse_body_region(msg_lower)
            if region:
                session.primary_location = region

        elif state == QuestionState.PAIN_QUALITY:
            qualities = self._parse_pain_qualities(msg_lower)
            session.pain_qualities.extend(qualities)

        elif state == QuestionState.SEVERITY:
            severity = self._parse_severity(msg_lower)
            if severity:
                session.severity = severity

        elif state == QuestionState.DURATION:
            onset, days = self._parse_duration(msg_lower)
            session.onset = onset
            session.duration_days = days

        elif state == QuestionState.AGGRAVATORS:
            aggs = self._parse_aggravators(msg_lower)
            session.aggravators.extend(aggs)

        elif state == QuestionState.RELIEVERS:
            rels = self._parse_relievers(msg_lower)
            session.relievers.extend(rels)

    def _get_extracted_value(
        self, session: ConversationSession, state: QuestionState
    ) -> str | int | list[str] | None:
        """Get the extracted value for display."""

        if state == QuestionState.BODY_REGION:
            return session.primary_location.value if session.primary_location else None
        if state == QuestionState.PAIN_QUALITY:
            return [q.value for q in session.pain_qualities]
        if state == QuestionState.SEVERITY:
            return session.severity
        if state == QuestionState.AGGRAVATORS:
            return [a.value for a in session.aggravators]
        if state == QuestionState.RELIEVERS:
            return [r.value for r in session.relievers]
        return None

    @staticmethod
    def _parse_body_region(text: str) -> BodyRegion | None:
        """Parse body region from text."""

        region_mapping = {
            "lower back": "lumbar_spine",
            "lumbar": "lumbar_spine",
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
            "jaw": "jaw",
            "chest": "chest",
            "abdomen": "abdomen",
            "si joint": "sacroiliac",
            "sacroiliac": "sacroiliac",
        }

        for phrase, region_id in region_mapping.items():
            if phrase in text:
                try:
                    return BodyRegion(region_id)
                except ValueError:
                    pass
        return None

    @staticmethod
    def _parse_pain_qualities(text: str) -> list[PainQuality]:
        """Parse pain qualities from text."""

        qualities = []
        mapping = {
            "sharp": PainQuality.sharp,
            "sudden": PainQuality.sharp,
            "dull": PainQuality.dull,
            "aching": PainQuality.aching,
            "throb": PainQuality.throbbing,
            "burn": PainQuality.burning,
            "stab": PainQuality.stabbing,
            "tingl": PainQuality.tingling,
            "numb": PainQuality.tingling,
            "pins and needles": PainQuality.pins_and_needles,
            "stiff": PainQuality.stiffness,
            "tight": PainQuality.stiffness,
        }

        for phrase, quality in mapping.items():
            if phrase in text:
                if quality not in qualities:
                    qualities.append(quality)
        return qualities

    @staticmethod
    def _parse_severity(text: str) -> int | None:
        """Parse severity level from text."""

        import re

        numbers = re.findall(r"\d+", text)
        for num_str in numbers:
            num = int(num_str)
            if 0 < num <= 10:
                return num

        if "worst" in text or "severe" in text:
            return 9
        if "moderate" in text or "medium" in text:
            return 5
        if "mild" in text or "slight" in text:
            return 3
        if "barely" in text or "minimal" in text:
            return 2

        return None

    @staticmethod
    def _parse_duration(
        text: str,
    ) -> tuple[PainOnset | None, int | None]:
        """Parse duration and onset type from text."""

        if "today" in text or "just now" in text or "just now" in text:
            return PainOnset.sudden_traumatic, 0
        if "week" in text:
            if "couple" in text or "2" in text or "two" in text:
                return PainOnset.gradual, 14
            return PainOnset.gradual, 7
        if "month" in text:
            if "couple" in text or "2" in text or "two" in text:
                return PainOnset.chronic_recurring, 60
            if "few" in text or "3" in text or "three" in text:
                return PainOnset.chronic_recurring, 30
            return PainOnset.chronic_recurring, 30
        if "year" in text or "years" in text:
            return PainOnset.chronic_recurring, 365
        if "long time" in text or "always" in text or "chronic" in text:
            return PainOnset.chronic_recurring, 90

        return PainOnset.unknown, None

    @staticmethod
    def _parse_aggravators(text: str) -> list[Aggravator]:
        """Parse aggravating factors from text."""

        aggravators = []
        mapping = {
            "stand": Aggravator.standing_prolonged,
            "sit": Aggravator.sitting_prolonged,
            "walk": Aggravator.walking,
            "run": Aggravator.running,
            "lift": Aggravator.lifting,
            "bend": Aggravator.flexion,
            "straight": Aggravator.extension,
            "twist": Aggravator.rotation,
            "morning": Aggravator.morning_stiffness,
            "end of day": Aggravator.end_of_day,
            "cold": Aggravator.cold_weather,
            "exercise": Aggravator.after_exercise,
            "rest": Aggravator.at_rest,
            "night": Aggravator.at_night,
        }

        for phrase, agg in mapping.items():
            if phrase in text and agg not in aggravators:
                aggravators.append(agg)
        return aggravators

    @staticmethod
    def _parse_relievers(text: str) -> list[Reliever]:
        """Parse relieving factors from text."""

        relievers = []
        mapping = {
            "rest": Reliever.rest,
            "heat": Reliever.heat,
            "hot": Reliever.heat,
            "ice": Reliever.ice,
            "cold": Reliever.ice,
            "movement": Reliever.movement,
            "walk": Reliever.movement,
            "stretch": Reliever.stretching,
            "nsaid": Reliever.nsaids,
            "ibuprofen": Reliever.nsaids,
            "advil": Reliever.nsaids,
            "tylenol": Reliever.nsaids,
            "position": Reliever.position_change,
            "lie down": Reliever.position_change,
            "sit": Reliever.position_change,
        }

        for phrase, rel in mapping.items():
            if phrase in text and rel not in relievers:
                relievers.append(rel)
        return relievers


_conversational_agent: ConversationalAgent | None = None


def get_conversational_agent() -> ConversationalAgent:
    global _conversational_agent
    if _conversational_agent is None:
        _conversational_agent = ConversationalAgent()
    return _conversational_agent
