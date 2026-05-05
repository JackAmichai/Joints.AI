"use client";

import { useCallback, useEffect, useState } from "react";
import { PlanViewer } from "@/components/exercises/PlanViewer";
import { AlertTriangle, Clock, ShieldCheck, RefreshCw, Loader2, CheckCircle2, FileText, Share2, Download, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";

import {
  fetchSubmission as fetchSubmissionApi,
  isTerminal
} from "@/lib/api/fetchSubmission";
import type { IntakeSubmission } from "@/lib/types/intake";

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

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Recovery Plan — Joints.AI",
          text: "Check out my personalized physiotherapy plan",
          url: window.location.href,
        });
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied to clipboard", "success");
    }
  }, [toast]);

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
    let consecutiveFailures = 0;
    const POLL_MS = 8000;
    const MAX_FAILURES = 3;
    async function tick() {
      if (cancelled) return;
      const next = await fetchSubmission();
      if (cancelled) return;
      if (!next) {
        consecutiveFailures += 1;
        if (consecutiveFailures >= MAX_FAILURES) {
          // Give up — the error UI will be shown via the `error` state.
          return;
        }
        timer = setTimeout(tick, POLL_MS * 2);
        return;
      }
      consecutiveFailures = 0;
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

  const handleDownloadPdf = async () => {
    toast("Generating your PDF...", "info");
    const response = await fetch(`/api/exercises/pdf/${submissionId}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recovery-plan-${submissionId.slice(0, 8)}.pdf`;
      a.click();
      toast("PDF downloaded", "success");
    } else {
      toast("Failed to download PDF", "error");
    }
  };

  if (halted) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24">
        <FadeIn>
          <Card className="border-none shadow-premium overflow-hidden">
            <div className="bg-red-600 p-8 text-white">
              <AlertTriangle className="h-12 w-12 mb-6" />
              <h1 className="text-3xl font-black tracking-tight mb-2">Red Flag Warning</h1>
              <p className="text-red-100 text-lg">Your assessment indicates symptoms that require urgent medical evaluation.</p>
            </div>
            <CardContent className="p-8">
              <div className="space-y-6">
                <p className="text-slate-600 leading-relaxed font-medium">
                  We have halted the AI generation of your exercise plan because your safety is our priority. 
                  Certain symptoms require a physical examination by a healthcare professional before starting any rehab.
                </p>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                   <h3 className="font-bold text-ink mb-2">Next Steps:</h3>
                   <ul className="space-y-3">
                      <li className="flex gap-3 text-sm text-slate-500 font-medium">
                         <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">1</div>
                         Contact your primary care physician immediately.
                      </li>
                      <li className="flex gap-3 text-sm text-slate-500 font-medium">
                         <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">2</div>
                         If you experience severe worsening, visit Urgent Care or the ER.
                      </li>
                   </ul>
                </div>
                <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => window.location.href = "/dashboard"}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    );
  }

  if (loading || (submission && !isTerminal(submission.status))) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
         <div className="relative mb-12">
            <div className="w-24 h-24 border-4 border-brand-100 rounded-full" />
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 w-24 h-24 border-4 border-brand-600 border-t-transparent rounded-full"
            />
            <Activity className="absolute inset-0 m-auto h-8 w-8 text-brand-600" />
         </div>
         <FadeIn>
            <div className="text-center">
               <h1 className="text-3xl font-black text-ink mb-2 tracking-tight">Synthesizing Your Plan</h1>
               <p className="text-slate-500 font-medium max-w-xs mx-auto">Our AI is analyzing your assessment against clinical protocols...</p>
            </div>
         </FadeIn>
         <div className="mt-12 w-full max-w-xs bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <motion.div 
               initial={{ width: "0%" }}
               animate={{ width: "100%" }}
               transition={{ duration: 15, ease: "easeInOut" }}
               className="h-full bg-brand-600"
            />
         </div>
      </div>
    );
  }

  if (error || !submission || !submission.plan) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-slate-300">
           <AlertTriangle className="h-10 w-10" />
        </div>
        <h1 className="text-2xl font-black text-ink mb-4">Something went wrong</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">{error || "We couldn't generate your plan at this time. Our engineers have been notified."}</p>
        <Button variant="default" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
           <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-black uppercase tracking-widest mb-4">
                 <CheckCircle2 className="h-3.5 w-3.5" /> Plan Ready
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-2">
                 Your Recovery Plan
              </h1>
               <p className="text-slate-500 text-lg font-medium">Generated based on your assessment from {new Date(submission.createdAt).toLocaleDateString()}</p>
           </div>
           <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="rounded-xl h-12" onClick={handleDownloadPdf}>
                 <Download className="h-4 w-4 mr-2" /> PDF
              </Button>
               <Button variant="outline" className="rounded-xl h-12" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
               </Button>
           </div>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8">
            <PlanViewer
              plan={submission.plan}
              onExerciseComplete={handleExerciseComplete}
            />
         </div>
         <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
               <Card variant="default" className="border-none shadow-premium overflow-hidden">
                  <div className="bg-slate-900 p-6 text-white">
                     <h3 className="font-bold flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-brand-400" />
                        Clinical Guardrails
                     </h3>
                  </div>
                  <CardContent className="p-6 space-y-4">
                      <p className="text-sm text-slate-500 leading-relaxed italic">
                         &ldquo;Stop immediately if you feel sharp, stabbing pain or sudden swelling.&rdquo;
                      </p>
                     <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Compliance</h4>
                        <div className="flex items-center gap-2 text-emerald-600">
                           <ShieldCheck className="h-4 w-4" />
                           <span className="text-xs font-bold">HIPAA Secure Data</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               <Card variant="glass" className="border-none shadow-premium bg-brand-50/50">
                  <CardContent className="p-6">
                     <h3 className="font-bold text-ink mb-2">Need human review?</h3>
                     <p className="text-sm text-slate-500 mb-6">Connect with a certified physiotherapist to review this plan.</p>
                     <Link href="/dashboard/therapists">
                        <Button className="w-full rounded-xl h-12" variant="premium">Find a Clinician</Button>
                     </Link>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
    </div>
  );
}