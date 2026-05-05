"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { FadeIn } from "@/components/ui/fade-in";
import { Plus, Calendar, ArrowRight, Clock, Activity, AlertTriangle, Archive } from "lucide-react";

interface PlanSummary {
  id: string;
  created_at: string;
  status: string;
  body_region?: string;
  exercises_completed: number;
  total_exercises: number;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  plan_ready: {
    label: "Ready",
    className: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  pending_clinical_review: {
    label: "In Review",
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  processing: {
    label: "Processing",
    className: "bg-brand-50 text-brand-700 border-brand-100",
  },
  plan_completed: {
    label: "Completed",
    className: "bg-violet-50 text-violet-700 border-violet-100",
  },
};

function statusStyle(status: string) {
  return (
    STATUS_STYLES[status] || {
      label: status.replace(/_/g, " "),
      className: "bg-slate-50 text-slate-700 border-slate-100",
    }
  );
}

export default function HistoryPage() {
  const { user } = useAuthStore();
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    async function load() {
      try {
        const res = await fetch(`/api/user/plans?user_id=${encodeURIComponent(user!.id)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setPlans(data.plans || []);
        } else {
          setPlans([]);
        }
      } catch (err) {
        if ((err as { name?: string }).name !== "AbortError") {
          setError("Couldn't load your plans. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [user]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Protocol Archive</span>
            </div>
            <h1 className="text-5xl font-black text-ink tracking-tight">Your Plans</h1>
            <p className="text-slate-500 font-medium text-lg italic mt-1">View and manage every recovery protocol you&apos;ve started.</p>
          </div>
          <Link href="/assess/method">
            <Button className="h-14 px-8 rounded-2xl shadow-2xl shadow-brand-200/50 group bg-brand-600 hover:bg-brand-700 text-white border-none">
              <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
              New Assessment
            </Button>
          </Link>
        </div>
      </FadeIn>

      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading plans">
          {[0, 1, 2].map((i) => (
            <Card key={i} variant="default" className="border-none shadow-premium bg-white">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-1/3 rounded-lg bg-slate-100" />
                  <div className="h-4 w-2/3 rounded bg-slate-50" />
                  <div className="h-1.5 w-full rounded bg-slate-50" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <FadeIn>
          <Card variant="default" className="border-none shadow-premium bg-white">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600 shadow-inner">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-black text-ink tracking-tight mb-2">Something went wrong</h2>
              <p className="text-slate-500 font-medium">{error}</p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : plans.length === 0 ? (
        <FadeIn>
          <Card variant="default" className="border-none shadow-premium bg-white overflow-hidden">
            <CardContent className="py-16 text-center px-8">
              <div className="w-20 h-20 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-600 shadow-inner">
                <Archive className="h-10 w-10" />
              </div>
              <h2 className="text-2xl font-black text-ink tracking-tight mb-3">No plans yet</h2>
              <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                Start your first assessment to get a personalized exercise program tailored to your biomechanical profile.
              </p>
              <Link href="/assess/method">
                <Button className="rounded-2xl h-14 px-8 bg-brand-600 hover:bg-brand-700 text-white border-none font-black shadow-xl shadow-brand-200/50">
                  Begin Assessment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <div className="space-y-4">
          {plans.map((plan, idx) => {
            const progressPct =
              plan.total_exercises > 0
                ? Math.round((plan.exercises_completed / plan.total_exercises) * 100)
                : 0;
            const status = statusStyle(plan.status);
            return (
              <FadeIn key={plan.id} delay={Math.min(idx * 0.05, 0.4)}>
                <Card variant="default" className="border-none shadow-premium bg-white hover:shadow-2xl transition-all group">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex items-start justify-between gap-6 flex-wrap">
                      <div className="flex items-start gap-5 flex-1 min-w-0">
                        <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 font-black text-xs shadow-inner shrink-0 group-hover:scale-110 transition-transform">
                          #{plan.id.slice(0, 4)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3 flex-wrap">
                            <h3 className="text-lg font-black text-ink tracking-tight">
                              Protocol {plan.id.slice(0, 8)}
                            </h3>
                            <span
                              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${status.className}`}
                            >
                              {status.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest flex-wrap mb-4">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" aria-hidden />
                              {formatDate(plan.created_at)}
                            </span>
                            {plan.body_region && (
                              <span className="flex items-center gap-1.5">
                                <Activity className="h-3.5 w-3.5" aria-hidden />
                                {plan.body_region}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" aria-hidden />
                              {plan.exercises_completed}/{plan.total_exercises} exercises
                            </span>
                          </div>
                          {plan.total_exercises > 0 && (
                            <div className="space-y-1.5">
                              <div
                                className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"
                                role="progressbar"
                                aria-valuenow={progressPct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Plan progress: ${progressPct}%`}
                              >
                                <div
                                  className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Progress</span>
                                <span className="text-brand-600">{progressPct}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/results/${plan.id}`}
                        aria-label={`View plan ${plan.id.slice(0, 8)}`}
                        className="shrink-0"
                      >
                        <Button
                          variant="outline"
                          className="rounded-xl h-12 px-5 border-2 font-black group-hover:bg-brand-50 group-hover:border-brand-200 group-hover:text-brand-700 transition-colors"
                        >
                          View Plan
                          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            );
          })}
        </div>
      )}
    </div>
  );
}
