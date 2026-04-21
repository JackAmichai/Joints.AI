"""Agent 1 — Extractor.

Normalizes everything into a single ExtractedClinicalPayload. Three stages:

  1. **Structured pass-through** — the user's form inputs are already
     structured, so primary location + aggravators + relievers flow
     straight through. Always runs; no model required.

  2. **VLM pass** — for image uploads (photos of scans, rendered PDF pages),
     we prompt a vision model for verbatim visible text and any numeric
     findings. The VLM is NOT asked to diagnose — only to read.

  3. **LLM normalization** — free text + VLM outputs are handed to the
     LLM with a tight JSON-mode prompt that extracts structured
     measurements and reported-diagnosis terms, each with a verbatim
     quote for audit. The LLM is NOT asked to reach conclusions.

When the LLM/VLM are not configured (dev mode without a model endpoint),
the extractor returns the structured pass-through only. This is an honest
degraded mode — the provenance record lists exactly what ran.
"""

from __future__ import annotations

import json
from pathlib import Path

from app.llm import (
    LLMClient,
    LLMMessage,
    NullLLMClient,
    NullVLMClient,
    VLMClient,
    get_llm_client,
    get_vlm_client,
)
from app.logging import log
from app.schemas.agents import (
    ExtractedClinicalPayload,
    ExtractionProvenance,
    ReportedDiagnosisEvidence,
)
from app.schemas.intake import (
    SubjectivePainInput,
    UploadedFileCategory,
    UploadedFileMeta,
)

_NORMALIZER_SYSTEM_PROMPT = """You are a clinical document normalizer.

You will receive:
  - a patient's free-text symptom description, and
  - verbatim visible text extracted from their uploaded medical documents.

Your job is ONLY to extract structured evidence. You MUST NOT:
  - make any diagnosis,
  - infer conditions the documents don't name,
  - recommend treatment.

Return JSON with this shape:
  {
    "measurements": { "<snake_case_key>": <number|string>, ... },
    "reported_diagnoses": [
      { "term": "<verbatim diagnostic term>", "verbatim_quote": "<sentence it came from>" }
    ],
    "unclassified_notes": ["<anything you saw but could not classify>"]
  }

Measurement keys MUST be lowercase snake_case. Use the exact units seen in the text.
If nothing matches a slot, return an empty object/array — never guess."""


class Extractor:
    def __init__(
        self,
        llm: LLMClient | None = None,
        vlm: VLMClient | None = None,
    ) -> None:
        self.llm = llm or get_llm_client()
        self.vlm = vlm or get_vlm_client()

    async def extract(
        self,
        subjective: SubjectivePainInput,
        files: list[UploadedFileMeta],
        file_paths: dict[str, Path] | None = None,
    ) -> ExtractedClinicalPayload:
        if subjective.primary_location is None:
            raise ValueError("Extractor requires a primary_location — triage missed an empty form.")

        file_paths = file_paths or {}
        provenance: list[ExtractionProvenance] = []
        vlm_excerpts: list[tuple[str, str]] = []  # (file_id, text)

        # ---- 2. VLM pass on images ------------------------------------------------
        if not isinstance(self.vlm, NullVLMClient):
            for meta in files:
                if meta.category not in (
                    UploadedFileCategory.imaging_photo,
                    UploadedFileCategory.imaging_dicom,
                ):
                    continue
                path = file_paths.get(meta.id)
                if path is None or not path.exists():
                    continue
                try:
                    resp = await self.vlm.describe(
                        path,
                        prompt=(
                            "Transcribe any text visible in this image verbatim. "
                            "List numeric findings with their units. Do not diagnose."
                        ),
                    )
                    vlm_excerpts.append((meta.id, resp.content))
                    provenance.append(
                        ExtractionProvenance(
                            file_id=meta.id,
                            extraction_model=resp.model,
                            confidence=0.7,
                        )
                    )
                except Exception as err:  # noqa: BLE001
                    log.warning("vlm_extraction_failed", file_id=meta.id, err=str(err))

        # ---- 3. LLM normalization ------------------------------------------------
        measurements: dict[str, float | str] = {}
        reported_diagnoses: list[ReportedDiagnosisEvidence] = []
        unclassified_notes: list[str] = []

        if not isinstance(self.llm, NullLLMClient):
            user_payload = _build_user_prompt(subjective, vlm_excerpts)
            try:
                resp = await self.llm.chat(
                    [
                        LLMMessage(role="system", content=_NORMALIZER_SYSTEM_PROMPT),
                        LLMMessage(role="user", content=user_payload),
                    ],
                    temperature=0.0,
                    json_mode=True,
                )
                parsed = _safe_json(resp.content)
                measurements = _coerce_measurements(parsed.get("measurements", {}))
                for rd in parsed.get("reported_diagnoses", []) or []:
                    term = rd.get("term")
                    quote = rd.get("verbatim_quote")
                    if not term or not quote:
                        continue
                    # Link back to whichever file supplied the matching quote, if any.
                    source_file_id = _match_source_file(quote, vlm_excerpts)
                    reported_diagnoses.append(
                        ReportedDiagnosisEvidence(
                            term=str(term),
                            source_file_id=source_file_id,
                            verbatim_quote=str(quote),
                        )
                    )
                unclassified_notes = [str(n) for n in parsed.get("unclassified_notes", []) or []]
                provenance.append(
                    ExtractionProvenance(
                        file_id="__free_text__",
                        extraction_model=resp.model,
                        confidence=0.8,
                    )
                )
            except Exception as err:  # noqa: BLE001
                log.warning("llm_normalization_failed", err=str(err))

        return ExtractedClinicalPayload(
            primary_location=subjective.primary_location,
            secondary_locations=subjective.secondary_locations,
            aggravators=subjective.aggravators,
            relievers=subjective.relievers,
            measurements=measurements,
            reported_diagnoses=reported_diagnoses,
            provenance=provenance,
            unclassified_notes=unclassified_notes,
        )


def _build_user_prompt(
    subjective: SubjectivePainInput,
    vlm_excerpts: list[tuple[str, str]],
) -> str:
    parts: list[str] = []
    parts.append("=== PATIENT FREE TEXT ===")
    parts.append(subjective.free_text or "(none)")
    if vlm_excerpts:
        parts.append("\n=== DOCUMENT EXCERPTS ===")
        for file_id, text in vlm_excerpts:
            parts.append(f"\n--- file {file_id} ---\n{text}")
    parts.append("\nRespond with the JSON described in the system prompt.")
    return "\n".join(parts)


def _safe_json(s: str) -> dict:
    s = s.strip()
    # Some models fence JSON in ```json … ``` — strip it.
    if s.startswith("```"):
        s = s.split("```", 2)[1].lstrip("json").strip()
        if s.endswith("```"):
            s = s[:-3].strip()
    try:
        parsed = json.loads(s)
    except json.JSONDecodeError:
        return {}
    return parsed if isinstance(parsed, dict) else {}


def _coerce_measurements(raw: object) -> dict[str, float | str]:
    if not isinstance(raw, dict):
        return {}
    out: dict[str, float | str] = {}
    for k, v in raw.items():
        key = str(k).strip().lower().replace(" ", "_")
        if isinstance(v, (int, float)):
            out[key] = float(v)
        elif isinstance(v, str):
            out[key] = v
        # drop anything else silently — never pollute the measurement bag
    return out


def _match_source_file(quote: str, excerpts: list[tuple[str, str]]) -> str:
    quote_lc = quote.lower()
    for file_id, text in excerpts:
        if quote_lc in text.lower():
            return file_id
    return "__free_text__"
