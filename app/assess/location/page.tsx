"use client";

import { useEffect } from "react";
import { useIntakeStore, stepIsValid } from "@/lib/store/intakeStore";
import { StepFrame } from "@/components/intake/StepFrame";
import { StepNav } from "@/components/intake/StepNav";
import { BodyMap } from "@/components/intake/BodyMap";

export default function LocationStep() {
  const {
    subjective,
    setPrimaryLocation,
    toggleSecondaryLocation,
    markStepReached
  } = useIntakeStore();

  const valid = useIntakeStore((s) => stepIsValid("location", s));

  useEffect(() => {
    markStepReached("location");
  }, [markStepReached]);

  return (
    <StepFrame
      eyebrow="Step 1 of 4"
      title="Where does it hurt?"
      subtitle="Tap the part of the body that bothers you most. If other areas are also affected, shift-tap to add them."
    >
      <BodyMap
        primary={subjective.primaryLocation}
        secondary={subjective.secondaryLocations}
        onPickPrimary={setPrimaryLocation}
        onToggleSecondary={toggleSecondaryLocation}
      />
      <StepNav
        backHref="/"
        nextHref="/assess/description"
        nextDisabled={!valid}
      />
    </StepFrame>
  );
}
