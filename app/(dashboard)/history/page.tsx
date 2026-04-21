"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const [plans, setPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/user/plans");
      if (res.ok) {
        const data = await res.json();
        setPlans(data.plans || []);
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading your plans...</div>
      </div>
    );
  }

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

      {plans.length === 0 ? (
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
          {plans.map((plan) => (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">Assessment #{plan.id.slice(0, 8)}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(plan.status)}`}>
                        {plan.status === "plan_ready" ? "Ready" : plan.status.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(plan.created_at)}
                      </span>
                      {plan.body_region && (
                        <span className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          {plan.body_region}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {plan.exercises_completed}/{plan.total_exercises} exercises
                      </span>
                    </div>
                  </div>
                  <Link href={`/results/${plan.id}`}>
                    <Button variant="outline">
                      View Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}