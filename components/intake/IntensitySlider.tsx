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
      <legend className="text-sm font-black text-ink">Pain intensity right now</legend>
      <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
        0 = none, 10 = the worst you&apos;ve ever felt
      </p>
      <div className="mt-4">
        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={value ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-brand-500"
          aria-valuemin={0}
          aria-valuemax={10}
          aria-valuenow={value ?? 0}
        />
        <div className="mt-2 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-sm",
            value === null
              ? "bg-slate-100 text-slate-400"
              : value >= 7
                ? "bg-red-50 text-red-600 border border-red-100"
                : value >= 4
                  ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
          )}
        >
          {value === null
            ? "Drag to set"
            : `${value}/10 — ${LABELS[value] ?? ""}`}
        </div>
      </div>
    </fieldset>
  );
}
