"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PlanViewer } from "@/components/exercises/PlanViewer";
import { AlertTriangle, Clock, ShieldCheck, RefreshCw } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  phase: string;
  target_region: string;
  instructions: string[];
  dose: string;
  stop_conditions: string[];
  media_placeholders?: {
    video?: { caption: string };
    image?: { caption: string };
  };
  citations?: Array<{
    source_title: string;
    chunk_id: string;
    score: number;
  }>;
}

interface PlanPhase {
  phase: string;
  summary: string;
  exercises: Exercise[];
}

interface RehabPlan {
  id: string;
  generated_at: string;
  phases: PlanPhase[];
  probabilistic_framing?: {
    pattern: string;
    commonly_associated_with: string[];
    confidence: string;
  };
  clinician_reviewed: boolean;
  clinician_note?: string;
}

interface IntakeSubmission {
  id: string;
  status: string;
  plan?: RehabPlan;
  triage?: {
    disposition: string;
    halted: boolean;
  };
}

interface ResultsClientProps {
  submissionId: string;
  halted: boolean;
}

export function ResultsClient({ submissionId, halted }: ResultsClientProps) {
  const router = useRouter();
  const [submission, setSubmission] = useState<IntakeSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  const fetchSubmission = async () => {
    try {
      const res = await fetch(`/api/intake/${submissionId}`);
      if (!res.ok) throw new Error("Failed to fetch submission");
      const data = await res.json();
      setSubmission(data);
      setLastFetch(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (halted) {
      setLoading(false);
      return;
    }
    fetchSubmission();
    const interval = setInterval(fetchSubmission, 8000);
    return () => clearInterval(interval);
  }, [submissionId, halted]);

  const handlePrint = () => window.print();

  const handleDownloadPdf = async () => {
    const response = await fetch(`/api/exercises/pdf/${submissionId}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `exercise-plan-${submissionId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (halted) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="mt-4 rounded-lg border border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 mt-0.5 text-red-600 shrink-0" />
            <div>
              <h1 className="text-xl font-semibold text-red-700">
                Please seek in-person care first.
              </h1>
              <p className="mt-2 text-slate-700">
                The triage step flagged something in what you described that
                should be evaluated by a clinician before any mobility program
                is appropriate. We have not generated any exercises.
              </p>
              <p className="mt-2 text-slate-500">
                If this is urgent — numbness in the saddle area, loss of bowel
                or bladder control, severe chest pain, or a cold pulseless
                limb — please go to an emergency department now.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 mt-0.5 text-blue-600 shrink-0" />
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">
                This system does not diagnose.
              </span>{" "}
              Any protocol you eventually receive will use language like
              &quot;symptoms commonly associated with…&quot; — not &quot;you have…&quot;. If something
              about your condition changes, stop the program and consult a clinician.
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <div className="inline-flex items-center gap-2 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading your plan...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-red-600">Error: {error}</p>
        <button onClick={fetchSubmission} className="mt-4 text-blue-600 underline">
          Try again
        </button>
      </div>
    );
  }

  if (!submission?.plan) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="mt-4 rounded-lg border border-slate-200 p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-blue-600 shrink-0" />
            <div>
              <h1 className="text-xl font-semibold">Your plan is being prepared.</h1>
              <p className="mt-2 text-slate-500">
                Triage cleared. Your inputs are being processed, and a mobility
                protocol is being drafted. This usually takes a moment.
              </p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <StatusPill label="Triage" state="done" />
                <StatusPill label="Extraction & RAG" state="done" />
                <StatusPill label="Clinician review" state="queued" />
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Last checked: {lastFetch.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const plan = submission.plan;

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PlanViewer
        plan={{
          id: plan.id,
          generatedAt: plan.generated_at,
          phases: plan.phases.map((p) => ({
            phase: p.phase,
            summary: p.summary,
            exercises: p.exercises.map((e) => ({
              id: e.id,
              name: e.name,
              phase: e.phase,
              targetRegion: e.target_region,
              instructions: e.instructions,
              dose: e.dose,
              stopConditions: e.stop_conditions,
              mediaPlaceholders: e.media_placeholders,
              citations: e.citations?.map((c) => ({
                sourceTitle: c.source_title,
                chunkId: c.chunk_id,
                score: c.score,
              })),
            })),
          })),
          probabilisticFraming: plan.probabilistic_framing
            ? {
                pattern: plan.probabilistic_framing.pattern,
                commonlyAssociatedWith:
                  plan.probabilistic_framing.commonly_associated_with,
                confidence: plan.probabilistic_framing.confidence,
              }
            : undefined,
          clinicianReviewed: plan.clinician_reviewed,
          clinicianNote: plan.clinician_note,
        }}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onExerciseComplete={(id) => console.log("Completed:", id)}
      />
    </div>
  );
}

function StatusPill({
  label,
  state,
}: {
  label: string;
  state: "done" | "running" | "queued";
}) {
  const style =
    state === "done"
      ? "bg-green-100 text-green-700"
      : state === "running"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-slate-100 text-slate-500";
  const text =
    state === "done" ? "Done" : state === "running" ? "Running" : "Waiting";
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <span className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${style}`}>
        {text}
      </span>
    </div>
  );
}