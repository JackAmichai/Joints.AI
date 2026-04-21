"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useIntakeStore, stepIsValid } from "@/lib/store/intakeStore";
import { StepFrame } from "@/components/intake/StepFrame";
import { ReviewSummary } from "@/components/intake/ReviewSummary";
import { ConsentCheckbox } from "@/components/intake/ConsentCheckbox";
import { submitIntake, CONSENT_VERSION } from "@/lib/api/submitIntake";

export default function ReviewStep() {
  const router = useRouter();
  const {
    subjective,
    files,
    consentAcknowledged,
    setConsent,
    markStepReached
  } = useIntakeStore();
  const valid = useIntakeStore((s) => stepIsValid("review", s));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    markStepReached("review");
  }, [markStepReached]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitIntake({
        subjective,
        files,
        consentVersion: CONSENT_VERSION
      });
      if (res.halted) {
        router.push(`/results/${res.submissionId}?halted=1`);
      } else {
        router.push(`/results/${res.submissionId}`);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't submit your intake. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <StepFrame
      eyebrow="Step 4 of 4"
      title="Review what you've shared"
      subtitle="Once you submit, a triage check runs first. If you've described anything we need a clinician to see, the flow will stop here and point you to care — it won't auto-generate exercises."
    >
      <ReviewSummary />
      <ConsentCheckbox
        checked={consentAcknowledged}
        onChange={setConsent}
      />
      {error ? (
        <p className="mt-3 text-sm text-halt" role="alert">
          {error}
        </p>
      ) : null}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/assess/upload")}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-paper-raised px-4 py-2 text-sm text-ink hover:border-black/20"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid || submitting}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-ink-soft disabled:bg-paper-sunk disabled:text-ink-muted disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting…" : "Submit for triage & review"}
        </button>
      </div>
    </StepFrame>
  );
}
