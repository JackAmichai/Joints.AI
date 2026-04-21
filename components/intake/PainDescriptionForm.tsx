"use client";

import { useMemo } from "react";
import { useIntakeStore } from "@/lib/store/intakeStore";
import { PillGroup } from "./PillGroup";
import { IntensitySlider } from "./IntensitySlider";
import { RedFlagBanner } from "./RedFlagBanner";
import {
  PAIN_QUALITY_OPTIONS,
  PAIN_ONSET_OPTIONS,
  AGGRAVATOR_OPTIONS,
  RELIEVER_OPTIONS
} from "@/lib/constants/painOptions";
import { scanForRedFlags } from "@/lib/types/redFlags";

export function PainDescriptionForm() {
  const {
    subjective,
    setIntensity,
    toggleQuality,
    setOnset,
    setDurationDays,
    toggleAggravator,
    toggleReliever,
    setFreeText
  } = useIntakeStore();

  const redFlagHits = useMemo(
    () => scanForRedFlags(subjective.freeText),
    [subjective.freeText]
  );

  const onsetSelected = subjective.onset ? [subjective.onset] : [];

  return (
    <div>
      <IntensitySlider value={subjective.intensity} onChange={setIntensity} />

      <PillGroup
        label="Quality of the pain"
        hint="Pick every word that fits."
        options={PAIN_QUALITY_OPTIONS}
        selected={subjective.qualities}
        onToggle={toggleQuality}
      />

      <PillGroup
        label="How did it start?"
        options={PAIN_ONSET_OPTIONS}
        selected={onsetSelected}
        onToggle={(v) => setOnset(v === subjective.onset ? null : v)}
        mode="single"
      />

      <fieldset className="mt-6">
        <legend className="text-sm font-medium text-ink">
          How long has this been going on?
        </legend>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="Days"
            value={subjective.durationDays ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              setDurationDays(v === "" ? null : Math.max(0, Number(v)));
            }}
            className="w-32 rounded-xl border border-black/10 bg-paper-raised px-3 py-2 text-sm focus:border-accent focus:outline-none"
            aria-label="Duration in days"
          />
          <span className="text-sm text-ink-muted">days</span>
        </div>
      </fieldset>

      <PillGroup
        label="What makes it worse?"
        options={AGGRAVATOR_OPTIONS}
        selected={subjective.aggravators}
        onToggle={toggleAggravator}
      />

      <PillGroup
        label="What makes it better?"
        options={RELIEVER_OPTIONS}
        selected={subjective.relievers}
        onToggle={toggleReliever}
      />

      <div className="mt-8">
        <label
          htmlFor="freeText"
          className="block text-sm font-medium text-ink"
        >
          In your own words
        </label>
        <p className="mt-1 text-sm text-ink-muted">
          Anything the options above missed. Be specific — when it started,
          what you were doing, how it behaves.
        </p>
        <textarea
          id="freeText"
          value={subjective.freeText}
          onChange={(e) => setFreeText(e.target.value)}
          rows={5}
          maxLength={2000}
          placeholder="I woke up last Tuesday with a deep ache in my left hip that gets sharper when I…"
          className="mt-3 block w-full rounded-xl border border-black/10 bg-paper-raised px-4 py-3 text-sm focus:border-accent focus:outline-none"
        />
        <div className="mt-1 flex justify-end text-xs text-ink-muted">
          {subjective.freeText.length} / 2000
        </div>
        <RedFlagBanner hits={redFlagHits} />
      </div>
    </div>
  );
}
