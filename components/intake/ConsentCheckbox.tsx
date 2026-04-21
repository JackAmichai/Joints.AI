"use client";

import { cn } from "@/lib/utils/cn";

export function ConsentCheckbox({
  checked,
  onChange
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "mt-6 flex items-start gap-3 rounded-bento border p-4 text-sm cursor-pointer transition-colors",
        checked
          ? "border-accent bg-accent-soft/40"
          : "border-black/10 bg-paper-raised"
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-accent"
      />
      <span className="text-ink-muted">
        I understand this tool provides <span className="font-medium text-ink">educational
        guidance, not a medical diagnosis</span>, and that any generated plan is{" "}
        <span className="font-medium text-ink">held for clinician review</span>{" "}
        before being released to me. If my symptoms include numbness, loss of
        bowel or bladder control, severe trauma, or radiating nerve pain, I
        will stop and seek emergency care. I consent to the secure processing
        of my symptom description and uploaded files for the sole purpose of
        generating this guidance.
      </span>
    </label>
  );
}
