import Link from "next/link";
import { AlertTriangle, Clock, ShieldCheck } from "lucide-react";

/**
 * Post-submission landing. Real plan data will be fetched here via the
 * status endpoint once the orchestrator is live. For now, this renders
 * two views: a halt banner (when triage stopped the pipeline) and a
 * "pending clinical review" placeholder for the happy path.
 */
export default function ResultsPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { halted?: string };
}) {
  const halted = searchParams.halted === "1";

  return (
    <main className="flex-1 bg-paper">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <p className="text-xs text-ink-muted">Submission {params.id}</p>

        {halted ? (
          <section className="mt-4 bento bento-pad border-halt/30 bg-halt-soft/60">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 text-halt shrink-0" />
              <div>
                <h1 className="text-xl font-semibold text-halt">
                  Please seek in-person care first.
                </h1>
                <p className="mt-2 text-ink">
                  The triage step flagged something in what you described that
                  should be evaluated by a clinician before any mobility program
                  is appropriate. We have not generated any exercises.
                </p>
                <p className="mt-2 text-ink-muted">
                  If this is urgent — numbness in the saddle area, loss of bowel
                  or bladder control, severe chest pain, or a cold pulseless
                  limb — please go to an emergency department now.
                </p>
                <Link
                  href="/"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft"
                >
                  Back to home
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-4 bento bento-pad">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-0.5 text-accent shrink-0" />
              <div>
                <h1 className="text-xl font-semibold">
                  Your intake is being reviewed.
                </h1>
                <p className="mt-2 text-ink-muted">
                  Triage cleared. Your inputs and files are being parsed, and a
                  mobility protocol is being drafted. It won&apos;t be released
                  until a clinician has cleared it — this usually takes a short
                  while.
                </p>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <StatusPill label="Triage" state="done" />
                  <StatusPill label="Extraction & RAG" state="running" />
                  <StatusPill label="Clinician review" state="queued" />
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="mt-6 bento bento-pad">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 mt-0.5 text-accent shrink-0" />
            <p className="text-sm text-ink-muted">
              <span className="font-medium text-ink">
                This system does not diagnose.
              </span>{" "}
              Any protocol you eventually receive will use language like
              &quot;symptoms commonly associated with…&quot; — not &quot;you
              have…&quot;. If something about your condition changes, stop the
              program and consult a clinician.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusPill({
  label,
  state
}: {
  label: string;
  state: "done" | "running" | "queued";
}) {
  const style =
    state === "done"
      ? "bg-accent-soft text-accent"
      : state === "running"
        ? "bg-caution-soft text-caution"
        : "bg-paper-sunk text-ink-muted";
  const text =
    state === "done" ? "Cleared" : state === "running" ? "Running" : "Waiting";
  return (
    <div className="rounded-bento border border-black/5 bg-paper-raised p-3">
      <p className="text-xs text-ink-muted">{label}</p>
      <span
        className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${style}`}
      >
        {text}
      </span>
    </div>
  );
}
