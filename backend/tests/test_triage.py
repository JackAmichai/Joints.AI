"""Triage is the safety-critical gate. These tests pin the behavior of the
red-flag detector so a refactor can't silently let a halting phrase through.
"""

from __future__ import annotations

from app.agents.triage import TriageAgent
from app.schemas.agents import TriageDisposition
from app.schemas.intake import SubjectivePainInput
from app.schemas.red_flags import RedFlagCategory, RedFlagSeverity


def _input(free_text: str) -> SubjectivePainInput:
    return SubjectivePainInput(primary_location=None, free_text=free_text)


def test_clean_input_proceeds() -> None:
    agent = TriageAgent()
    result = agent.evaluate(_input("My left knee aches when I go up stairs."))
    assert result.disposition == TriageDisposition.proceed
    assert result.hits == []


def test_cauda_equina_halts_to_emergency() -> None:
    agent = TriageAgent()
    result = agent.evaluate(
        _input("Sudden low back pain and I've had some loss of bladder control today.")
    )
    assert result.disposition == TriageDisposition.halt_seek_emergency
    assert any(h.category == RedFlagCategory.cauda_equina for h in result.hits)
    assert result.halted


def test_radiating_nerve_is_high_not_critical() -> None:
    agent = TriageAgent()
    result = agent.evaluate(_input("I have pain shooting down my leg when I sit."))
    # High-severity only → proceed with caution, not halt.
    assert result.disposition == TriageDisposition.proceed_with_caution
    assert all(h.severity == RedFlagSeverity.high for h in result.hits)


def test_cardiac_phrases_halt_to_emergency() -> None:
    agent = TriageAgent()
    result = agent.evaluate(_input("Crushing chest pain started an hour ago."))
    assert result.disposition == TriageDisposition.halt_seek_emergency
    assert any(h.category == RedFlagCategory.cardiac_referral for h in result.hits)


def test_case_insensitive_and_offset_reported() -> None:
    agent = TriageAgent()
    prefix = "I'm worried — "
    text = prefix + "FEVER AND BACK PAIN for the last three days."
    result = agent.evaluate(_input(text))
    assert result.hits, "expected a hit on 'fever and back pain'"
    hit = result.hits[0]
    assert hit.matched_phrase == "fever and back pain"
    # Offset is measured on the lowercased scan — verify it points to the
    # correct position by recovering the phrase from the original text.
    assert text[hit.offset : hit.offset + len(hit.matched_phrase)].lower() == hit.matched_phrase
