import type { IntakeSubmission, IntakeStatus } from "@/lib/types/intake";

/**
 * Fetches the current state of a submission from the orchestrator.
 *
 * The orchestrator state machine runs asynchronously after triage:
 *   triaging → extracting → retrieving → pending_clinical_review → plan_ready
 *
 * The UI polls this endpoint after a non-halted submit until the status
 * reaches a terminal state (`plan_ready`, `halted_red_flag`, `failed`) or
 * the user navigates away.
 */
export async function fetchSubmission(
  id: string,
  signal?: AbortSignal
): Promise<IntakeSubmission> {
  const res = await fetch(`/api/intake/${encodeURIComponent(id)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
    // Disable Next.js route-handler caching — we specifically want fresh
    // polling reads, not a stale cached shell.
    cache: "no-store"
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Fetch submission failed (${res.status}): ${body}`);
  }
  return (await res.json()) as IntakeSubmission;
}

/** Status values at which polling should stop — no further transitions occur. */
export const TERMINAL_STATUSES: ReadonlySet<IntakeStatus> = new Set([
  "plan_ready",
  "halted_red_flag",
  "failed"
]);

export function isTerminal(status: IntakeStatus): boolean {
  return TERMINAL_STATUSES.has(status);
}
