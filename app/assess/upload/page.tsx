"use client";

import { useEffect } from "react";
import { useIntakeStore } from "@/lib/store/intakeStore";
import { StepFrame } from "@/components/intake/StepFrame";
import { StepNav } from "@/components/intake/StepNav";
import { FileUpload } from "@/components/intake/FileUpload";

export default function UploadStep() {
  const { files, markStepReached } = useIntakeStore();

  useEffect(() => {
    markStepReached("upload");
  }, [markStepReached]);

  const anyUploading = files.some((f) => f.status === "uploading");

  return (
    <StepFrame
      eyebrow="Step 3 of 4"
      title="Anything we should read?"
      subtitle="Optional — but if you have imaging reports, referral letters, or a photo of a printed scan, adding them lets the extractor pick up specifics like angles and measurements."
    >
      <FileUpload />
      <StepNav
        backHref="/assess/description"
        nextHref="/assess/review"
        nextLabel={files.length > 0 ? "Continue" : "Skip and continue"}
        nextDisabled={anyUploading}
      />
    </StepFrame>
  );
}
