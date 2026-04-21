"use client";

import { useCallback, useEffect, useState } from "react";
import { PlanViewer } from "@/components/exercises/PlanViewer";
import { AlertTriangle, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/toast";

import {
  fetchSubmission as fetchSubmissionApi,
  isTerminal
} from "@/lib/api/fetchSubmission";
import type { IntakeSubmission } from "@/lib/types/intake";

// The backend serializes camelCase via Pydantic aliases + response_model_by_alias=True.
// We consume those types directly from @/lib/types rather than maintaining a
// snake_case shadow copy here (which was the source of a bug where every
// plan field rendered as undefined).

interface ResultsClientProps {
  submissionId: string;
  halted: boolean;
}

export function ResultsClient({ submissionId, halted }: ResultsClientProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<IntakeSubmission | null>(null);
  const [loading, setLoading] = useState(!halted);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date>(new Date());

  const handleExerciseComplete = useCallback(async (exerciseId: string) => {
    if (!user) return;
    try {
      await fetch("/api/progress/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          submission_id: submissionId,
          exercise_id: exerciseId,
        }),
      });
      toast("Exercise marked as complete", "success");
    } catch (err) {
      console.error("Failed to record exercise completion", err);
      toast("Could not save progress", "error");
    }
  }, [user, submissionId, toast]);

  const fetchSubmission = useCallback(async () => {
    try {
      const data = await fetchSubmissionApi(submissionId);
      setSubmission(data);
      setLastFetch(new Date());
      setError(null);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
      return null;
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    if (halted) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const POLL_MS = 8000;
    async function tick() {
      if (cancelled) return;
      const next = await fetchSubmission();
      if (cancelled) return;
      // Stop polling once we hit a terminal state. On error, keep polling
      // but back off — the backend may just be restarting.
      if (!next) {
        timer = setTimeout(tick, POLL_MS * 2);
        return;
      }
      if (!isTerminal(next.status)) {
        timer = setTimeout(tick, POLL_MS);
      }
    }
    tick();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [fetchSubmission, halted]);

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

  // HITL gate: the draft is not released until a clinician has cleared it.
  if (!submission.plan.clinicianReviewed) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12">
        <section className="mt-4 rounded-lg border border-slate-200 p-6">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 mt-0.5 text-blue-600 shrink-0" />
            <div>
              <h1 className="text-xl font-semibold">A clinician is reviewing your plan.</h1>
              <p className="mt-2 text-slate-500">
                The draft is ready and queued for human sign-off. It won&apos;t
                be released until a clinician has cleared it.
              </p>
              <p className="mt-4 text-xs text-slate-400">
                Last checked: {lastFetch.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <PlanViewer
        plan={submission.plan}
        onPrint={handlePrint}
        onDownloadPdf={handleDownloadPdf}
        onExerciseComplete={handleExerciseComplete}
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