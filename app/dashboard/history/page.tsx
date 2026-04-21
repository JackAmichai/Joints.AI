"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { Plus, Calendar, ArrowRight, Clock, Activity } from "lucide-react";

interface PlanSummary {
  id: string;
  created_at: string;
  status: string;
  body_region?: string;
  exercises_completed: number;
  total_exercises: number;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "plan_ready":
        return "bg-green-100 text-green-700";
      case "pending_clinical_review":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getStatusLabel = (status: string) => {
    if (status === "plan_ready") return "Ready";
    if (status === "pending_clinical_review") return "In review";
    return status.replace(/_/g, " ");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Plans</h1>
          <p className="text-slate-500 mt-1">View and manage your exercise programs</p>
        </div>
        <Link href="/assess/method">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4" aria-busy="true" aria-label="Loading plans">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                  <div className="h-4 w-1/4 rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8 text-center text-red-600">{error}</CardContent>
        </Card>
      ) : plans.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No plans yet</h2>
            <p className="text-slate-500 mb-6">
              Start your first assessment to get a personalized exercise program.
            </p>
            <Link href="/assess/method">
              <Button>Start Assessment</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => {
            const progressPct =
              plan.total_exercises > 0
                ? Math.round((plan.exercises_completed / plan.total_exercises) * 100)
                : 0;
            return (
              <Card key={plan.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="text-lg font-semibold">Assessment #{plan.id.slice(0, 8)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(plan.status)}`}>
                          {getStatusLabel(plan.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" aria-hidden />
                          {formatDate(plan.created_at)}
                        </span>
                        {plan.body_region && (
                          <span className="flex items-center gap-1">
                            <Activity className="h-4 w-4" aria-hidden />
                            {plan.body_region}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden />
                          {plan.exercises_completed}/{plan.total_exercises} exercises
                        </span>
                      </div>
                      {plan.total_exercises > 0 && (
                        <div
                          className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden"
                          role="progressbar"
                          aria-valuenow={progressPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Plan progress: ${progressPct}%`}
                        >
                          <div
                            className="h-full bg-slate-900 transition-all"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <Link href={`/results/${plan.id}`} aria-label={`View plan ${plan.id.slice(0, 8)}`}>
                      <Button variant="outline">
                        View Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
