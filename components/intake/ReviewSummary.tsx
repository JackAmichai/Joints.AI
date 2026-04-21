"use client";

import { useIntakeStore } from "@/lib/store/intakeStore";
import { BODY_REGION_META } from "@/lib/types/body";
import {
  AGGRAVATOR_OPTIONS,
  PAIN_ONSET_OPTIONS,
  PAIN_QUALITY_OPTIONS,
  RELIEVER_OPTIONS
} from "@/lib/constants/painOptions";
import { UPLOAD_CATEGORY_LABELS, humanSize } from "@/lib/constants/uploads";

const label = <T extends string>(
  options: Array<{ value: T; label: string }>,
  value: T
): string => options.find((o) => o.value === value)?.label ?? value;

export function ReviewSummary() {
  const { subjective, files } = useIntakeStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SummaryCard title="Location">
        {subjective.primaryLocation ? (
          <p className="text-sm">
            Primary:{" "}
            <span className="font-medium">
              {BODY_REGION_META[subjective.primaryLocation].label}
            </span>
          </p>
        ) : (
          <p className="text-sm text-ink-muted italic">Not set</p>
        )}
        {subjective.secondaryLocations.length > 0 ? (
          <p className="mt-2 text-sm">
            Also:{" "}
            <span className="text-ink-muted">
              {subjective.secondaryLocations
                .map((r) => BODY_REGION_META[r].label)
                .join(", ")}
            </span>
          </p>
        ) : null}
      </SummaryCard>

      <SummaryCard title="How it feels">
        <p className="text-sm">
          Intensity:{" "}
          <span className="font-medium">
            {subjective.intensity ?? "—"}/10
          </span>
        </p>
        <p className="mt-1 text-sm">
          Onset:{" "}
          <span className="text-ink-muted">
            {subjective.onset
              ? label(PAIN_ONSET_OPTIONS, subjective.onset)
              : "—"}
          </span>
        </p>
        {subjective.durationDays !== null ? (
          <p className="mt-1 text-sm">
            Duration:{" "}
            <span className="text-ink-muted">
              {subjective.durationDays} days
            </span>
          </p>
        ) : null}
        {subjective.qualities.length > 0 ? (
          <p className="mt-2 text-sm">
            Quality:{" "}
            <span className="text-ink-muted">
              {subjective.qualities
                .map((q) => label(PAIN_QUALITY_OPTIONS, q))
                .join(", ")}
            </span>
          </p>
        ) : null}
      </SummaryCard>

      <SummaryCard title="What makes it worse / better">
        <p className="text-sm">
          Worse with:{" "}
          <span className="text-ink-muted">
            {subjective.aggravators.length === 0
              ? "—"
              : subjective.aggravators
                  .map((a) => label(AGGRAVATOR_OPTIONS, a))
                  .join(", ")}
          </span>
        </p>
        <p className="mt-1 text-sm">
          Better with:{" "}
          <span className="text-ink-muted">
            {subjective.relievers.length === 0
              ? "—"
              : subjective.relievers
                  .map((r) => label(RELIEVER_OPTIONS, r))
                  .join(", ")}
          </span>
        </p>
      </SummaryCard>

      <SummaryCard title="Uploaded files">
        {files.length === 0 ? (
          <p className="text-sm text-ink-muted italic">None</p>
        ) : (
          <ul className="space-y-1.5">
            {files.map((f) => (
              <li key={f.id} className="text-sm">
                <span className="font-medium">{f.filename}</span>{" "}
                <span className="text-ink-muted">
                  — {UPLOAD_CATEGORY_LABELS[f.category]} ·{" "}
                  {humanSize(f.sizeBytes)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </SummaryCard>

      {subjective.freeText.trim().length > 0 ? (
        <div className="md:col-span-2">
          <SummaryCard title="In your own words">
            <p className="text-sm whitespace-pre-wrap text-ink-muted">
              {subjective.freeText}
            </p>
          </SummaryCard>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-bento border border-black/5 bg-paper-raised p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}
