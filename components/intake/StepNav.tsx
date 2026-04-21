"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StepNavProps {
  backHref?: string;
  nextHref?: string;
  nextLabel?: string;
  nextDisabled?: boolean;
  onNext?: () => void;
  onBack?: () => void;
}

export function StepNav({
  backHref,
  nextHref,
  nextLabel = "Continue",
  nextDisabled = false,
  onNext,
  onBack
}: StepNavProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {backHref ? (
        <Link
          href={backHref}
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-paper-raised px-4 py-2 text-sm text-ink hover:border-black/20"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
      ) : (
        <span />
      )}
      {nextHref ? (
        <Link
          href={nextDisabled ? "#" : nextHref}
          aria-disabled={nextDisabled}
          tabIndex={nextDisabled ? -1 : 0}
          onClick={(e) => {
            if (nextDisabled) {
              e.preventDefault();
              return;
            }
            onNext?.();
          }}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-medium transition-colors",
            nextDisabled
              ? "bg-paper-sunk text-ink-muted cursor-not-allowed"
              : "bg-ink text-white hover:bg-ink-soft"
          )}
        >
          {nextLabel}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
