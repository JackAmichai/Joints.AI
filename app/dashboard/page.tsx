"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ChevronRight,
  Calendar,
  Activity
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
  icon: any;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  loading: boolean;
}) {
  return (
    <Card variant="default" className="border-none shadow-premium hover:shadow-xl transition-all group">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            {loading ? (
              <div className="h-8 w-16 rounded-lg bg-slate-100 animate-pulse" />
            ) : (
              <p className="text-2xl font-black text-ink tracking-tight">{value}</p>
            )}
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</p>
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

  const { thisWeekCount, lastWeekCount, weeklyBars } = useMemo(() => {
    const now = new Date();
    const weekdayOf = (d: Date) => (d.getDay() + 6) % 7; 
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
    <div className="max-w-7xl mx-auto space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
              <h1 className="text-4xl font-black text-ink tracking-tight mb-2">
                 Hello, {firstName || "there"}
              </h1>
              <p className="text-slate-500 font-medium">Here&apos;s your recovery overview for today.</p>
           </div>
           <Link href="/assess/method">
              <Button className="h-12 px-6 rounded-2xl shadow-lg shadow-brand-100 group">
                 <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform" />
                 New Assessment
              </Button>
           </Link>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FadeIn delay={0.1} direction="up">
          <StatCard icon={Target} iconBg="bg-brand-50" iconColor="text-brand-600" value={stats.completedExercises} label="Exercises Done" loading={loading} />
        </FadeIn>
        <FadeIn delay={0.2} direction="up">
          <StatCard icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" value={`${progressPercent}%`} label="Completion" loading={loading} />
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <StatCard icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-600" value={stats.currentStreak} label="Day Streak" loading={loading} />
        </FadeIn>
        <FadeIn delay={0.4} direction="up">
          <StatCard icon={TrendingUp} iconBg="bg-violet-50" iconColor="text-violet-600" value={stats.plansCompleted} label="Plans Finished" loading={loading} />
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-8">
          <FadeIn delay={0.5}>
            <Card variant="default" className="border-none shadow-premium h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-8">
                <div>
                   <CardTitle className="text-2xl">Weekly Activity</CardTitle>
                   <CardDescription>Exercises completed this week</CardDescription>
                </div>
                <div className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                   Live
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-48 gap-3 md:gap-6">
                  {DAY_LABELS.map((day, i) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-3 group">
                      <div className="w-full relative h-full flex items-end">
                         <motion.div
                           initial={{ height: 0 }}
                           animate={{ height: `${weeklyBars[i]}%` }}
                           transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: "easeOut" }}
                           className="w-full bg-slate-100 group-hover:bg-brand-100 rounded-t-xl relative overflow-hidden transition-colors"
                         >
                            <div className="absolute inset-0 bg-brand-600/10 group-hover:bg-brand-600/20" />
                         </motion.div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between text-sm">
                  <div className="flex gap-6">
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-brand-600/20" />
                        <span className="font-bold text-slate-600">This Week: {thisWeekCount}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-slate-100" />
                        <span className="font-bold text-slate-400 italic">Last Week: {lastWeekCount}</span>
                     </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        {/* Quick Actions / Recent */}
        <div className="lg:col-span-4 space-y-8">
           <FadeIn delay={0.6}>
              <Card variant="default" className="border-none shadow-premium overflow-hidden">
                 <div className="bg-brand-600 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">Recovery Pulse</h3>
                    <p className="text-brand-100 text-sm font-medium">Stay consistent for faster results.</p>
                 </div>
                 <CardContent className="p-6">
                    <div className="space-y-4">
                       {[
                         { icon: History, label: "Review Past Plans", href: "/dashboard/history" },
                         { icon: Stethoscope, label: "Contact Clinician", href: "/dashboard/therapists" },
                         { icon: SettingsIcon, label: "Profile Settings", href: "/dashboard/settings" }
                       ].map((item, i) => (
                         <Link key={i} href={item.href} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-brand-600 transition-colors">
                                  <item.icon className="h-4 w-4" />
                               </div>
                               <span className="text-sm font-bold text-slate-600 group-hover:text-ink">{item.label}</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-brand-600 transition-colors" />
                         </Link>
                       ))}
                    </div>
                 </CardContent>
              </Card>
           </FadeIn>

           <FadeIn delay={0.7}>
              <div className="flex items-center justify-between mb-4 px-2">
                 <h2 className="text-lg font-black text-ink uppercase tracking-tight">Recent Plans</h2>
                 <Link href="/dashboard/history" className="text-xs font-bold text-brand-600 hover:underline">View All</Link>
              </div>
              
              {loading ? (
                <div className="space-y-3">
                   {[0, 1].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
                </div>
              ) : recentPlans.length === 0 ? (
                <Card variant="default" className="border-none shadow-sm bg-slate-50/50">
                  <CardContent className="p-6 text-center">
                    <p className="text-slate-400 text-sm font-medium mb-4">No active plans.</p>
                    <Link href="/assess/method">
                       <Button variant="outline" size="sm" className="rounded-xl border-2">Start First Assessment</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentPlans.map((plan) => (
                    <Link key={plan.id} href={`/results/${plan.id}`}>
                      <Card variant="default" className="border-none shadow-premium hover:shadow-xl transition-all group">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-xs">
                                #{plan.id.slice(0, 4)}
                             </div>
                             <div>
                                <p className="text-sm font-bold text-ink">Plan {plan.id.slice(0, 8)}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   {plan.exercises_completed}/{plan.total_exercises} Exercises
                                </p>
                             </div>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-all">
                             <ArrowRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
           </FadeIn>
        </div>
      </div>
    </div>
  );
}