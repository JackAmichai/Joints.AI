"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";
import type { IntakeStep } from "@/lib/store/intakeStore";

const STEPS: Array<{ key: IntakeStep; label: string }> = [
  { key: "location", label: "Location" },
  { key: "description", label: "Description" },
  { key: "upload", label: "Files" },
  { key: "review", label: "Review" }
];

export function StepProgress({
  current,
  furthest
}: {
  current: IntakeStep;
  furthest: IntakeStep;
}) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  const furthestIdx = STEPS.findIndex((s) => s.key === furthest);
  return (
    <ol className="flex items-center gap-2 text-xs">
      {STEPS.map((s, i) => {
        const done = i < currentIdx || i < furthestIdx;
        const active = i === currentIdx;
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className={cn(
                "inline-flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                active && "border-accent bg-accent text-white",
                !active && done && "border-accent/40 bg-accent-soft text-accent",
                !active && !done && "border-black/15 bg-paper-raised text-ink-muted"
              )}
              aria-current={active ? "step" : undefined}
            >
              {done && !active ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden sm:inline",
                active ? "font-medium text-ink" : "text-ink-muted"
              )}
            >
              {s.label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px w-6 bg-black/10" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}
