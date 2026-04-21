import type { SubjectivePainInput, UploadedFileMeta } from "@/lib/types/intake";
import type { TriageResult } from "@/lib/types/agents";

/**
 * Submission payload posted to the orchestrator endpoint. The backend
 * routes this through:
 *   1. Triage agent    (Nemotron safety-tuned — red flag scan)
 *   2. Extractor agent (VLM for images, text parser for PDFs)
 *   3. RAG retriever   (ChromaDB / Pinecone biomechanics corpus)
 *
 * The response is intentionally thin — a submission ID and the triage
 * decision. The full plan (if one is generated) is NOT returned in-line;
 * it is polled separately because (a) it may take minutes and (b) it
 * routes through a human clinician review queue before release.
 */
export interface SubmitIntakeRequest {
  subjective: SubjectivePainInput;
  files: UploadedFileMeta[];
  consentVersion: string;
}

export interface SubmitIntakeResponse {
  submissionId: string;
  triage: TriageResult;
  /** Set when triage halts the pipeline — no plan will be produced. */
  halted: boolean;
  /** When to poll for plan readiness. Null if halted. */
  pollAfterSeconds: number | null;
}

/**
 * Current consent text version. Incremented any time the disclaimer or
 * data-handling language changes; stored with the submission for audit.
 */
export const CONSENT_VERSION = "2026-04-21.v1";

export async function submitIntake(
  req: SubmitIntakeRequest,
  signal?: AbortSignal
): Promise<SubmitIntakeResponse> {
  const res = await fetch("/api/intake/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Intake submission failed (${res.status}): ${body}`);
  }
  return (await res.json()) as SubmitIntakeResponse;
}
