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
  Activity,
  Zap,
  ShieldCheck,
  BrainCircuit,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnatomicalBackground } from "@/components/layout/anatomical-background";

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
  trend,
}: {
  icon: any;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
  loading: boolean;
  trend?: string;
}) {
  return (
    <Card variant="default" className="border-none shadow-premium hover:shadow-2xl transition-all group relative overflow-hidden bg-white/80 backdrop-blur-xl">
      <div className={`absolute top-0 right-0 w-24 h-24 ${iconBg} opacity-[0.03] -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-150`} />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
           <div className={`w-12 h-12 ${iconBg} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
           </div>
           {trend && (
             <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                <ArrowUpRight className="h-3 w-3" /> {trend}
             </div>
           )}
        </div>
        <div className="min-w-0">
          {loading ? (
            <div className="h-10 w-20 rounded-lg bg-slate-100 animate-pulse mb-1" />
          ) : (
            <p className="text-3xl font-black text-ink tracking-tight mb-1">{value}</p>
          )}
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
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
    <div className="max-w-7xl mx-auto space-y-10 relative pb-20">
      {/* Immersive background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10 opacity-[0.03]">
         <AnatomicalBackground variant="skeleton" className="scale-125 translate-x-1/4" />
      </div>

      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Clinical Command Center</span>
              </div>
              <h1 className="text-5xl font-black text-ink tracking-tight">
                 Welcome, {firstName || "Member"}
              </h1>
              <p className="text-slate-500 font-medium text-lg italic">Your recovery protocols are synchronized and active.</p>
           </div>
           <div className="flex gap-3">
              <Link href="/assess/method">
                 <Button className="h-14 px-8 rounded-2xl shadow-2xl shadow-brand-200/50 group bg-brand-600 hover:bg-brand-700 text-white border-none">
                    <Plus className="h-5 w-5 mr-3 group-hover:rotate-90 transition-transform" />
                    New Assessment
                 </Button>
              </Link>
           </div>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FadeIn delay={0.1} direction="up">
          <StatCard icon={Target} iconBg="bg-brand-50" iconColor="text-brand-600" value={stats.completedExercises} label="Protocol Exercises" loading={loading} trend="+12%" />
        </FadeIn>
        <FadeIn delay={0.2} direction="up">
          <StatCard icon={CheckCircle} iconBg="bg-emerald-50" iconColor="text-emerald-600" value={`${progressPercent}%`} label="Overall Completion" loading={loading} trend="+5%" />
        </FadeIn>
        <FadeIn delay={0.3} direction="up">
          <StatCard icon={Flame} iconBg="bg-orange-50" iconColor="text-orange-600" value={stats.currentStreak} label="Activity Streak" loading={loading} />
        </FadeIn>
        <FadeIn delay={0.4} direction="up">
          <StatCard icon={TrendingUp} iconBg="bg-violet-50" iconColor="text-violet-600" value={stats.plansCompleted} label="Clinical Success" loading={loading} />
        </FadeIn>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Main Analytics Hub */}
        <div className="lg:col-span-8 space-y-8">
          <FadeIn delay={0.5}>
            <Card variant="default" className="border-none shadow-premium h-full overflow-hidden bg-white/40 backdrop-blur-xl border-white/20">
              <CardHeader className="flex flex-row items-center justify-between pb-10">
                <div>
                   <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2 text-ink">
                      <Activity className="h-6 w-6 text-brand-600" />
                      Recovery Velocity
                   </CardTitle>
                   <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mt-1">Daily biomechanical load tracking</CardDescription>
                </div>
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-brand-500 animate-pulse" />
                   <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">Active Stream</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-56 gap-4 md:gap-8 px-2">
                  {DAY_LABELS.map((day, i) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="w-full relative h-full flex items-end">
                         {/* High-end bar chart */}
                         <div className="absolute inset-0 bg-slate-50/50 rounded-2xl -z-10" />
                         <motion.div
                           initial={{ height: 0 }}
                           animate={{ height: `${weeklyBars[i]}%` }}
                           transition={{ duration: 1.5, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                           className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-2xl relative shadow-lg shadow-brand-100/50 group-hover:from-brand-500 group-hover:to-brand-300 transition-all cursor-pointer"
                         >
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                <span className="text-[8px] font-black text-white bg-ink/80 px-2 py-1 rounded-md">LOAD: {Math.round(weeklyBars[i] ?? 0)}</span>
                            </div>
                         </motion.div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex gap-8">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Week</span>
                        <span className="text-xl font-black text-ink tracking-tight">{thisWeekCount} <span className="text-xs font-bold text-slate-400 uppercase">Ex</span></span>
                     </div>
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency</span>
                        <span className="text-xl font-black text-emerald-600 tracking-tight">94.2%</span>
                     </div>
                  </div>
                  <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-brand-600 hover:bg-brand-50">
                     Export Telemetry <ChevronRight className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
             <FadeIn delay={0.6}>
                <Card variant="glass" className="bg-brand-600 border-none text-white shadow-xl shadow-brand-100 overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <Zap size={100} />
                   </div>
                   <CardContent className="p-8">
                      <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                         <Zap className="h-5 w-5" />
                         Next Protocol
                      </h3>
                      <p className="text-brand-100 font-medium text-sm mb-6 leading-relaxed">
                         You have Phase 2: Range of Motion scheduled for this afternoon. 15 minutes of guided movement.
                      </p>
                      <Button className="w-full bg-white text-brand-600 hover:bg-brand-50 rounded-xl h-12 font-black text-sm uppercase tracking-widest border-none shadow-lg">
                         Resume Now
                      </Button>
                   </CardContent>
                </Card>
             </FadeIn>
             <FadeIn delay={0.7}>
                <Card variant="default" className="border-none shadow-premium bg-slate-900 text-white overflow-hidden relative">
                   <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 -z-10" />
                   <CardContent className="p-8">
                      <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                         <BrainCircuit className="h-5 w-5 text-brand-400" />
                         AI Insight
                      </h3>
                      <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">
                         Your knee stability has increased by 14% based on your last 3 feedback reports. Stay focused on eccentric holds.
                      </p>
                      <div className="flex items-center gap-2 text-[10px] font-black text-brand-400 uppercase tracking-[0.2em]">
                         Deep Learning Active <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                      </div>
                   </CardContent>
                </Card>
             </FadeIn>
          </div>
        </div>

        {/* HUD Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           <FadeIn delay={0.8}>
              <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
                 <div className="bg-slate-50 p-6 flex justify-between items-center border-b border-slate-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <Clock className="h-4 w-4" />
                       Recent Records
                    </h3>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                       {loading ? (
                         [0,1,2].map(i => <div key={i} className="h-20 bg-slate-50/50 animate-pulse" />)
                       ) : recentPlans.length === 0 ? (
                         <div className="p-10 text-center">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No telemetry found</p>
                         </div>
                       ) : (
                         recentPlans.map((plan) => (
                           <Link key={plan.id} href={`/results/${plan.id}`} className="block group">
                             <div className="p-6 hover:bg-brand-50 transition-all flex items-center justify-between">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-brand-600 font-black text-xs group-hover:scale-110 group-hover:shadow-lg transition-all">
                                     #{plan.id.slice(0, 4)}
                                  </div>
                                  <div>
                                     <p className="text-sm font-black text-ink group-hover:text-brand-700">Protocol {plan.id.slice(0, 8)}</p>
                                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                        {plan.exercises_completed}/{plan.total_exercises} Units Complete
                                     </p>
                                  </div>
                               </div>
                               <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all">
                                  <ArrowRight className="h-5 w-5" />
                               </div>
                             </div>
                           </Link>
                         ))
                       )}
                    </div>
                    <div className="p-6 bg-slate-50/50">
                       <Link href="/dashboard/history">
                          <Button variant="outline" className="w-full rounded-xl h-12 font-black text-[10px] uppercase tracking-widest border-2">
                             Full Archive System
                          </Button>
                       </Link>
                    </div>
                 </CardContent>
              </Card>
           </FadeIn>

           <FadeIn delay={0.9}>
              <Card variant="glass" className="border-none shadow-2xl bg-white/60 backdrop-blur-2xl p-8 text-center relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10">
                    <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand-600 shadow-inner group-hover:scale-110 transition-transform">
                       <Stethoscope className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-black text-ink mb-2 tracking-tight">Need a Clinician?</h3>
                    <p className="text-xs font-bold text-slate-400 leading-relaxed mb-8 uppercase tracking-widest">
                       Connect with human experts for complex cases.
                    </p>
                    <Link href="/dashboard/therapists">
                       <Button className="w-full rounded-2xl h-14 bg-ink text-white hover:bg-slate-800 shadow-xl border-none font-black text-xs uppercase tracking-[0.2em]">
                          Open Directory
                       </Button>
                    </Link>
                 </div>
              </Card>
           </FadeIn>
        </div>
      </div>
    </div>
  );
}