"use client";

import { useState } from "react";
import { ExerciseCard } from "./ExerciseCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download, ChevronDown, ChevronUp, Play } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  phase: string;
  targetRegion: string;
  instructions: string[];
  dose: string;
  stopConditions: string[];
  mediaPlaceholders?: {
    video?: { caption: string };
    image?: { caption: string };
  };
  citations?: Array<{
    sourceTitle: string;
    chunkId: string;
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

const PHASE_ORDER = [
  "isometric_stabilization",
  "controlled_range_of_motion",
  "loaded_mobility",
  "integrated_movement",
];

const PHASE_TITLES: Record<string, string> = {
  isometric_stabilization: "Phase 1: Stabilization",
  controlled_range_of_motion: "Phase 2: Range of Motion",
  loaded_mobility: "Phase 3: Loaded Mobility",
  integrated_movement: "Phase 4: Integrated Movement",
};

export function PlanViewer({
  plan,
  onExerciseComplete,
  onPrint,
  onDownloadPdf,
}: PlanViewerProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
    () => ({
      isometric_stabilization: true,
      controlled_range_of_motion: true,
      loaded_mobility: true,
    })
  );
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(
    new Set()
  );

  const togglePhase = (phase: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phase]: !prev[phase] }));
  };

  const markComplete = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    newCompleted.add(exerciseId);
    setCompletedExercises(newCompleted);
    onExerciseComplete?.(exerciseId);
  };

  const progress =
    plan.phases.reduce((acc, p) => acc + p.exercises.length, 0) > 0
      ? (completedExercises.size /
          plan.phases.reduce((acc, p) => acc + p.exercises.length, 0)) *
        100
      : 0;

  return (
    <div className="space-y-6">
      {!plan.clinicianReviewed && (
        <div className="rounded-md border border-caution/30 bg-caution-soft/30 p-4">
          <p className="text-sm text-caution">
            <strong>Pending Review:</strong> This plan has not yet been reviewed
            by a clinician. It will be released once reviewed.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Exercise Plan</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onPrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={onDownloadPdf}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {plan.phases.map((planPhase) => {
          const isExpanded = expandedPhases[planPhase.phase] ?? false;
          const phaseExercises = planPhase.exercises.filter(
            (e) => !completedExercises.has(e.id)
          );
          const completedCount =
            planPhase.exercises.length - phaseExercises.length;

          return (
            <div
              key={planPhase.phase}
              className="rounded-lg border border-slate-200 bg-white"
            >
              <button
                onClick={() => togglePhase(planPhase.phase)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold">
                    {PHASE_ORDER.indexOf(planPhase.phase) + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {PHASE_TITLES[planPhase.phase] || planPhase.phase}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {planPhase.summary}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {completedCount > 0 && (
                    <Badge variant="secondary">{completedCount} done</Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-100 p-4 space-y-4">
                  {planPhase.exercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      {...exercise}
                      completed={completedExercises.has(exercise.id)}
                      onStart={() => markComplete(exercise.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Progress</span>
          <span className="text-sm text-slate-500">
            {completedExercises.size} /{" "}
            {plan.phases.reduce((acc, p) => acc + p.exercises.length, 0)} exercises
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {plan.probabilisticFraming && (
        <div className="rounded-lg border border-slate-200 bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The exercises in this plan are commonly associated
            with{" "}
            {plan.probabilisticFraming.pattern}. This is not a diagnosis — please
            consult a clinician if your condition changes.
          </p>
        </div>
      )}
    </div>
  );
}