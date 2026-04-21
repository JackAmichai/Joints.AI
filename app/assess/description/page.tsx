"use client";

import { useEffect, useMemo } from "react";
import { useIntakeStore, stepIsValid } from "@/lib/store/intakeStore";
import { StepFrame } from "@/components/intake/StepFrame";
import { StepNav } from "@/components/intake/StepNav";
import { PainDescriptionForm } from "@/components/intake/PainDescriptionForm";
import { scanForRedFlags } from "@/lib/types/redFlags";

export default function DescriptionStep() {
  const { subjective, markStepReached } = useIntakeStore();
  const valid = useIntakeStore((s) => stepIsValid("description", s));

  useEffect(() => {
    markStepReached("description");
  }, [markStepReached]);

  /**
   * If the user has typed a CRITICAL red-flag phrase, disable advancement.
   * This is a soft UX gate — the server still does the authoritative call.
   */
  const hasCriticalFlag = useMemo(
    () =>
      scanForRedFlags(subjective.freeText).some(
        (h) => h.severity === "critical"
      ),
    [subjective.freeText]
  );

  return (
    <StepFrame
      eyebrow="Step 2 of 4"
      title="How does it feel?"
      subtitle="This is for your profile only. The clearer you are here, the better our matching to safe mobility protocols."
    >
      <PainDescriptionForm />
      <StepNav
        backHref="/assess/location"
        nextHref="/assess/upload"
        nextDisabled={!valid || hasCriticalFlag}
      />
    </StepFrame>
  );
}
