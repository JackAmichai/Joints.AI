"use client";

import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { ProgressTracker } from "./ProgressTracker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { 
  Printer, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Share2, 
  Check as CheckIcon,
  ShieldCheck,
  Activity,
  AlertCircle
} from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Exercise {
  id: string;
  name: string;
  phase: string;
  targetRegion: string;
  description: string;
  video_url?: string;
  sets?: number;
  reps?: string;
  duration_seconds?: number;
}

interface PlanPhase {
  phase: string;
  summary: string;
  exercises: Exercise[];
}

interface RehabPlan {
  id: string;
  generatedAt: string;
  phases: PlanPhase[];
  probabilisticFraming?: {
    pattern: string;
    commonlyAssociatedWith: string[];
    confidence: string;
  };
  clinicianReviewed: boolean;
  clinicianNote?: string;
}

interface PlanViewerProps {
  plan: RehabPlan;
  onExerciseComplete?: (exerciseId: string) => void;
  onPrint?: () => void;
  onDownloadPdf?: () => void;
}

const PHASE_TITLES: Record<string, string> = {
  isometric_stabilization: "Stabilization",
  controlled_range_of_motion: "Range of Motion",
  loaded_mobility: "Loaded Mobility",
  integrated_movement: "Integrated Movement",
};

export function PlanViewer({
  plan,
  onExerciseComplete,
  onPrint,
  onDownloadPdf,
}: PlanViewerProps) {
  const { toast } = useToast();
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({
    isometric_stabilization: true,
  });
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  const markComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
       newCompleted.delete(exerciseId);
    } else {
       newCompleted.add(exerciseId);
       toast("Progress saved", "success");
    }
    setCompletedExercises(newCompleted);
    onExerciseComplete?.(exerciseId);
  };

  const totalExercises = plan.phases.reduce((acc, p) => acc + p.exercises.length, 0);
  const progress = totalExercises > 0 ? (completedExercises.size / totalExercises) * 100 : 0;

  return (
    <div className="space-y-10">
      {/* Progress Overview Card */}
      <FadeIn>
         <Card variant="default" className="border-none shadow-premium bg-slate-900 text-white overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
               <Activity size={160} />
            </div>
            <CardContent className="p-8 md:p-10 relative z-10">
               <div className="flex flex-col md:flex-row justify-between gap-8">
                  <div className="space-y-4">
                     <h2 className="text-3xl font-black tracking-tight">Your Progress</h2>
                     <p className="text-slate-400 max-w-sm font-medium">
                        Consistency is the key to recovery. Complete all Phase 1 exercises before moving forward.
                     </p>
                     <div className="flex gap-4 pt-2">
                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                           <div className="text-2xl font-black">{completedExercises.size}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Done</div>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                           <div className="text-2xl font-black">{totalExercises}</div>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</div>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-center">
                     <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                           <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/10" />
                           <motion.circle 
                              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                              strokeDasharray={364.4}
                              strokeDashoffset={364.4 - (364.4 * progress) / 100}
                              className="text-brand-500"
                           />
                        </svg>
                        <span className="absolute text-2xl font-black tracking-tighter">{Math.round(progress)}%</span>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>
      </FadeIn>

      {/* Probabilistic Warning if present */}
      {plan.probabilisticFraming && (
        <FadeIn delay={0.1}>
           <div className="p-4 bg-brand-50 border border-brand-100 rounded-2xl flex gap-3">
              <ShieldCheck className="h-5 w-5 text-brand-600 shrink-0" />
              <p className="text-sm text-brand-900 font-medium">
                <strong>Clinician Note:</strong> These exercises are optimized for patterns commonly associated with <span className="underline decoration-brand-200">{plan.probabilisticFraming.pattern}</span>.
              </p>
           </div>
        </FadeIn>
      )}

      {/* Phases */}
      <div className="space-y-6">
        {plan.phases.map((planPhase, i) => {
          const isExpanded = expandedPhases[planPhase.phase] ?? false;
          const completedInPhase = planPhase.exercises.filter(e => completedExercises.has(e.id)).length;

          return (
            <FadeIn key={planPhase.phase} delay={0.2 + i * 0.1}>
              <div className={`rounded-3xl border-2 transition-all duration-500 overflow-hidden ${isExpanded ? "border-slate-100 bg-white shadow-premium" : "border-transparent bg-slate-50/50"}`}>
                <button
                  onClick={() => togglePhase(planPhase.phase)}
                  className="flex w-full items-center justify-between p-6 md:p-8 text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-xl transition-all ${isExpanded ? "bg-brand-600 text-white shadow-lg shadow-brand-100" : "bg-white text-slate-400 shadow-sm"}`}>
                      {i + 1}
                    </div>
                    <div>
                      <h3 className={`text-xl font-black tracking-tight transition-colors ${isExpanded ? "text-ink" : "text-slate-500"}`}>
                        {PHASE_TITLES[planPhase.phase] || planPhase.phase}
                      </h3>
                      <p className="text-sm font-medium text-slate-400 mt-1">
                        {completedInPhase} of {planPhase.exercises.length} completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     {completedInPhase === planPhase.exercises.length && (
                        <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                           <CheckIcon className="h-3 w-3" /> All Done
                        </div>
                     )}
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isExpanded ? "bg-slate-100 text-ink rotate-180" : "bg-transparent text-slate-300"}`}>
                        <ChevronDown className="h-6 w-6" />
                     </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-6 md:p-8 pt-0 space-y-6">
                        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
                           <p className="text-slate-500 font-medium italic leading-relaxed text-sm">
                              "{planPhase.summary}"
                           </p>
                        </div>
                        <div className="space-y-4">
                           {planPhase.exercises.map((exercise) => (
                             <ExerciseCard
                               key={exercise.id}
                               exercise={exercise}
                               isCompleted={completedExercises.has(exercise.id)}
                               onComplete={() => markComplete(exercise.id)}
                             />
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeIn>
          );
        })}
      </div>

      <ProgressTracker planId={plan.id} />
    </div>
  );
}