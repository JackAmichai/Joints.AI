"use client";

import { cn } from "@/lib/utils/cn";

interface PillGroupProps<T extends string> {
  label: string;
  hint?: string;
  options: Array<{ value: T; label: string; hint?: string }>;
  selected: T[];
  onToggle: (value: T) => void;
  mode?: "multi" | "single";
}

export function PillGroup<T extends string>({
  label,
  hint,
  options,
  selected,
  onToggle,
  mode = "multi"
}: PillGroupProps<T>) {
  return (
    <fieldset className="mt-6">
      <legend className="text-sm font-medium text-ink">{label}</legend>
      {hint ? <p className="mt-1 text-sm text-ink-muted">{hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={cn("pill", active ? "pill-active" : "pill-default")}
              title={o.hint}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {mode === "single" ? (
        <p className="mt-2 text-xs text-ink-muted">Pick one.</p>
      ) : null}
    </fieldset>
  );
}
