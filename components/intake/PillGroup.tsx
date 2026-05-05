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
      <legend className="text-sm font-black text-ink">{label}</legend>
      {hint ? <p className="mt-1 text-xs font-bold text-slate-400 uppercase tracking-widest">{hint}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o.value);
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o.value)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-200",
                active
                  ? "border-brand-300 bg-brand-50 text-brand-600 shadow-sm shadow-brand-100"
                  : "border-slate-200 bg-white text-slate-500 hover:border-brand-200 hover:text-ink"
              )}
              title={o.hint}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {mode === "single" ? (
        <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Pick one.</p>
      ) : null}
    </fieldset>
  );
}
