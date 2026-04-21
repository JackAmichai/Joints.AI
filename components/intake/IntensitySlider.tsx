"use client";

import { cn } from "@/lib/utils/cn";

const LABELS: Record<number, string> = {
  0: "No pain",
  1: "Barely noticeable",
  2: "Mild",
  3: "Mild",
  4: "Uncomfortable",
  5: "Moderate",
  6: "Moderate",
  7: "Severe",
  8: "Very severe",
  9: "Intense",
  10: "Worst imaginable"
};

export function IntensitySlider({
  value,
  onChange
}: {
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-ink">
        Pain intensity right now
      </legend>
      <p className="mt-1 text-sm text-ink-muted">
        0 = none, 10 = the worst you&apos;ve ever felt.
      </p>
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-accent"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={value ?? 0}
        />
        <div className="mt-2 flex items-center justify-between text-xs text-ink-muted">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm",
            value === null
              ? "bg-paper-sunk text-ink-muted"
              : value >= 7
                ? "bg-halt-soft text-halt"
                : value >= 4
                  ? "bg-caution-soft text-caution"
                  : "bg-accent-soft text-accent"
          )}
        >
          {value === null
            ? "Drag to set"
            : `${value}/10 · ${LABELS[value] ?? ""}`}
        </div>
      </div>
    </fieldset>
  );
}
