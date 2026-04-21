"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import {
  Plus,
  History,
  TrendingUp,
  Target,
  Flame,
  CheckCircle,
  ArrowRight,
  Stethoscope,
  Settings as SettingsIcon,
} from "lucide-react";

interface Stats {
  totalExercises: number;
  completedExercises: number;
  currentStreak: number;
  plansCompleted: number;
}

interface PlanSummary {
  id: string;
  created_at: string;
  status: string;
  exercises_completed: number;
  total_exercises: number;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  loading,
}: {
  icon: typeof Target;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
            <Icon className={`h-5 w-5 ${iconColor}`} aria-hidden />
          </div>
          <div className="min-w-0">
            {loading ? (
              <div className="h-7 w-12 rounded bg-slate-100 animate-pulse" />
            ) : (
              <p className="text-2xl font-bold">{value}</p>
            )}
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<Stats>({
    totalExercises: 0,
    completedExercises: 0,
    currentStreak: 0,
    plansCompleted: 0,
  });
  const [recentPlans, setRecentPlans] = useState<PlanSummary[]>([]);
  const [allPlans, setAllPlans] = useState<PlanSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const controller = new AbortController();
    const userId = user.id;

    async function loadData() {
      try {
        const res = await fetch(`/api/user/plans?user_id=${encodeURIComponent(userId)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          const plans: PlanSummary[] = data.plans || [];
          setAllPlans(plans);
          setRecentPlans(plans.slice(0, 3));

          const totalEx = plans.reduce((acc, p) => acc + (p.total_exercises || 0), 0);
          const completedEx = plans.reduce((acc, p) => acc + (p.exercises_completed || 0), 0);
          const completedPlans = plans.filter((p) => p.status === "plan_completed").length;

          setStats({
            totalExercises: totalEx,
            completedExercises: completedEx,
            currentStreak: Math.floor(completedEx / 7),
            plansCompleted: completedPlans,
          });
        }
      } catch (err) {
        if ((err as { name?: string }).name !== "AbortError") {
          console.error("Failed to load stats", err);
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
    return () => controller.abort();
  }, [user]);

  const progressPercent =
    stats.totalExercises > 0
      ? Math.round((stats.completedExercises / stats.totalExercises) * 100)
      : 0;

  // Derive a rough weekly activity histogram from recent plan activity.
  // Each plan created in the last 7 days contributes to that weekday's bucket.
  const { thisWeekCount, lastWeekCount, weeklyBars } = useMemo(() => {
    const now = new Date();
    const weekdayOf = (d: Date) => (d.getDay() + 6) % 7; // Mon=0 ... Sun=6
    const bars = new Array(7).fill(0) as number[];
    let thisWeek = 0;
    let lastWeek = 0;
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(now.getDate() - weekdayOf(now));
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfWeek.getDate() - 7);

    for (const p of allPlans) {
      if (!p.created_at) continue;
      const d = new Date(p.created_at);
      if (isNaN(d.getTime())) continue;
      const completed = p.exercises_completed || 0;
      if (d >= startOfWeek) {
        thisWeek += completed;
        const idx = weekdayOf(d);
        bars[idx] = (bars[idx] ?? 0) + completed;
      } else if (d >= startOfLastWeek) {
        lastWeek += completed;
      }
    }
    const max = Math.max(1, ...bars);
    return {
      thisWeekCount: thisWeek,
      lastWeekCount: lastWeek,
      weeklyBars: bars.map((b) => Math.max(8, (b / max) * 100)),
    };
  }, [allPlans]);

  const firstName = user?.full_name?.split(" ")[0];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Welcome back{firstName ? `, ${firstName}` : ""}
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Target} iconBg="bg-blue-100" iconColor="text-blue-600" value={stats.completedExercises} label="Exercises Done" loading={loading} />
        <StatCard icon={CheckCircle} iconBg="bg-green-100" iconColor="text-green-600" value={`${progressPercent}%`} label="Completion Rate" loading={loading} />
        <StatCard icon={Flame} iconBg="bg-orange-100" iconColor="text-orange-600" value={stats.currentStreak} label="Day Streak" loading={loading} />
        <StatCard icon={TrendingUp} iconBg="bg-purple-100" iconColor="text-purple-600" value={stats.plansCompleted} label="Plans Completed" loading={loading} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/assess/method" aria-label="Start a new assessment">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <Plus className="h-5 w-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">New Assessment</h3>
                  <p className="text-sm text-slate-500">Report pain or injury</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/history" aria-label="View your plans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center">
                  <History className="h-5 w-5 text-blue-600" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">Your Plans</h3>
                  <p className="text-sm text-slate-500">View past assessments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/therapists" aria-label="Find a recommended physiotherapist">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full border-accent/40">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-accent-soft rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-5 w-5 text-accent" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">Find a Therapist</h3>
                  <p className="text-sm text-slate-500">In-person & online</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/settings" aria-label="Open settings">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-100 rounded-lg flex items-center justify-center">
                  <SettingsIcon className="h-5 w-5 text-slate-700" aria-hidden />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold">Settings</h3>
                  <p className="text-sm text-slate-500">Manage your profile</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Weekly Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-end justify-between h-32 gap-2"
            role="img"
            aria-label={`Weekly activity: ${thisWeekCount} exercises this week`}
          >
            {DAY_LABELS.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-slate-900 rounded-t transition-all"
                  style={{ height: `${weeklyBars[i]}%` }}
                />
                <span className="text-xs text-slate-500">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>This week: {thisWeekCount} exercises</span>
            <span>Last week: {lastWeekCount} exercises</span>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Recent Plans</h2>
      {loading ? (
        <div className="space-y-3" aria-busy="true" aria-label="Loading plans">
          {[0, 1].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-5 w-1/3 rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-100" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : recentPlans.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-slate-500 mb-4">
              No plans yet. Start a new assessment to get your personalized exercise program.
            </p>
            <Link href="/assess/method" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              Start your first assessment <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {recentPlans.map((plan) => (
            <Link key={plan.id} href={`/results/${plan.id}`} aria-label={`Open plan ${plan.id.slice(0, 8)}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Assessment #{plan.id.slice(0, 8)}</p>
                    <p className="text-sm text-slate-500">
                      {plan.exercises_completed}/{plan.total_exercises} exercises completed
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" aria-hidden />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
