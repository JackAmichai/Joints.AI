"use client";

import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function PainDescriptionForm() {
  const [aiLoading, setAiLoading] = useState(false);
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
    <div className="space-y-6">
      <FadeIn>
        <IntensitySlider value={subjective.intensity} onChange={setIntensity} />
      </FadeIn>

      <FadeIn delay={0.05}>
        <PillGroup
          label="Quality of the pain"
          hint="Pick every word that fits."
          options={PAIN_QUALITY_OPTIONS}
          selected={subjective.qualities}
          onToggle={toggleQuality}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <PillGroup
          label="How did it start?"
          options={PAIN_ONSET_OPTIONS}
          selected={onsetSelected}
          onToggle={(v) => setOnset(v === subjective.onset ? null : v)}
          mode="single"
        />
      </FadeIn>

      <FadeIn delay={0.15}>
        <fieldset className="mt-6">
          <legend className="text-sm font-black text-ink mb-3">How long has this been going on?</legend>
          <div className="flex items-center gap-3">
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
              className="w-32 rounded-2xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all"
              aria-label="Duration in days"
            />
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">days</span>
          </div>
        </fieldset>
      </FadeIn>

      <FadeIn delay={0.2}>
        <PillGroup
          label="What makes it worse?"
          options={AGGRAVATOR_OPTIONS}
          selected={subjective.aggravators}
          onToggle={toggleAggravator}
        />
      </FadeIn>

      <FadeIn delay={0.25}>
        <PillGroup
          label="What makes it better?"
          options={RELIEVER_OPTIONS}
          selected={subjective.relievers}
          onToggle={toggleReliever}
        />
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="mt-8 p-6 rounded-3xl bg-slate-50/80 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label
                htmlFor="freeText"
                className="block text-sm font-black text-ink"
              >
                In your own words
              </label>
              <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
                Describe your pain, or use AI to extract automatically
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-2xl border-brand-200 text-brand-600 hover:bg-brand-50"
              onClick={async () => {
                if (!subjective.freeText.trim()) return;
                setAiLoading(true);
                try {
                  const res = await fetch("/api/free-text/parse", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: subjective.freeText }),
                  });
                  const data = await res.json();
                  
                  if (data.primary_location) {
                    // Would need to import and use body region mapping
                  }
                  if (data.severity) setIntensity(data.severity);
                  if (data.pain_qualities) {
                    data.pain_qualities.forEach((q: string) => {
                      try { toggleQuality(q as never); } catch {}
                    });
                  }
                  if (data.onset) setOnset(data.onset as never);
                  if (data.duration_days) setDurationDays(data.duration_days);
                  if (data.aggravators) {
                    data.aggravators.forEach((a: string) => {
                      try { toggleAggravator(a as never); } catch {}
                    });
                  }
                  if (data.relievers) {
                    data.relievers.forEach((r: string) => {
                      try { toggleReliever(r as never); } catch {}
                    });
                  }
                } catch (err) {
                  console.error("AI parse failed:", err);
                } finally {
                  setAiLoading(false);
                }
              }}
              disabled={aiLoading || !subjective.freeText.trim()}
            >
              {aiLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              <span className="ml-2">AI Parse</span>
            </Button>
          </div>
          <textarea
            id="freeText"
            value={subjective.freeText}
            onChange={(e) => setFreeText(e.target.value)}
            rows={5}
            maxLength={2000}
            placeholder="I woke up last Tuesday with a deep ache in my left hip that gets sharper when I…"
            className="block w-full rounded-2xl border-2 border-slate-200 bg-white px-4 py-4 text-sm font-medium text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all resize-none"
          />
          <div className="mt-2 flex justify-end text-xs font-bold text-slate-400">
            {subjective.freeText.length} / 2000
          </div>
          <RedFlagBanner hits={redFlagHits} />
        </div>
      </FadeIn>
    </div>
  );
}
