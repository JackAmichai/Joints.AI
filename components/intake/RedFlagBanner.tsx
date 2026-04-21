"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { RedFlagHit } from "@/lib/types/redFlags";

/**
 * Soft UX warning when the free-text field contains a red-flag phrase.
 * This is a hint only — the authoritative halt decision is made by the
 * Triage agent on the server after submission.
 */
export function RedFlagBanner({ hits }: { hits: RedFlagHit[] }) {
  if (hits.length === 0) return null;
  const top = hits[0]!;
  const isCritical = top.severity === "critical";
  return (
    <div
      role="alert"
      className={
        "mt-4 rounded-bento border p-4 text-sm " +
        (isCritical
          ? "border-halt/30 bg-halt-soft text-halt"
          : "border-caution/30 bg-caution-soft text-caution")
      }
    >
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold">
            {isCritical
              ? "Please stop and seek care first"
              : "This may need a clinician before exercises"}
          </p>
          <p className="mt-1 opacity-90">{top.userMessage}</p>
          <p className="mt-2">
            <Link
              href="/"
              className="underline underline-offset-2 font-medium"
            >
              Return to the home page
            </Link>
            {" "}— this tool is not the right next step right now.
          </p>
        </div>
      </div>
    </div>
  );
}
