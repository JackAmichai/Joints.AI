"use client";

import { clsx } from "clsx";
import { AlertCircle, Clock, Play } from "lucide-react";
import type { ExercisePhase } from "@/lib/types/agents";

/**
 * Single exercise tile inside a rendered RehabPlan. Visual intent:
 *  - calm, bento-card styling consistent with the intake flow
 *  - stop-conditions block is visually distinct (halt palette) so the user
 *    can't miss the safety cues even when skimming
 *  - instructions are an <ol> — the order matters clinically
 */
interface ExerciseCardProps {
  id: string;
  name: string;
  phase: ExercisePhase | string;
  instructions: string[];
  dose: string;
  stopConditions: string[];
  videoUrl?: string;
  onStart?: () => void;
  completed?: boolean;
}

const PHASE_LABELS: Record<string, string> = {
  isometric_stabilization: "Stabilization",
  controlled_range_of_motion: "Range of Motion",
  loaded_mobility: "Loaded Mobility",
  integrated_movement: "Integrated Movement"
};

export function ExerciseCard({
  name,
  phase,
  instructions,
  dose,
  stopConditions,
  onStart,
  completed
}: ExerciseCardProps) {
  return (
    <div
      className={clsx(
        "rounded-bento border p-5 transition-shadow",
        completed
          ? "border-accent/30 bg-accent-soft/40"
          : "border-black/5 bg-paper-raised hover:shadow-bento"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {PHASE_LABELS[phase] || phase}
            </span>
            {completed ? (
              <span className="text-xs font-medium text-accent">Completed</span>
            ) : null}
          </div>
          <h3 className="text-base font-semibold text-ink">{name}</h3>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        <div className="text-sm text-ink">
          <p className="mb-1 font-medium">Instructions</p>
          <ol className="list-inside list-decimal space-y-1 text-ink-muted">
            {instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-ink">
          <Clock className="h-4 w-4 text-ink-muted" />
          <span className="font-medium">{dose}</span>
        </div>
      </div>

      {stopConditions.length > 0 ? (
        <div className="mt-4 rounded-md bg-halt-soft/40 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-halt" />
            <div className="text-sm">
              <p className="font-medium text-halt">Stop if</p>
              <ul className="mt-1 space-y-0.5 text-ink">
                {stopConditions.map((condition, i) => (
                  <li key={i}>{condition}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}

      {!completed && onStart ? (
        <button
          type="button"
          onClick={onStart}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft"
        >
          <Play className="h-4 w-4" />
          Start exercise
        </button>
      ) : null}
    </div>
  );
}
