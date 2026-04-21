"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { AlertCircle, Check, Clock, Pause, Play, RotateCcw } from "lucide-react";
import type { ExercisePhase } from "@/lib/types/agents";

/**
 * Single exercise tile inside a rendered RehabPlan. Visual intent:
 *  - calm, bento-card styling consistent with the intake flow
 *  - stop-conditions block is visually distinct (halt palette) so the user
 *    can't miss the safety cues even when skimming
 *  - instructions are an <ol> — the order matters clinically
 *  - Start ↔ Mark Complete are now distinct actions. Start opens an inline
 *    stopwatch so the user can time their set; Mark Complete is the explicit
 *    progress marker.
 */
interface ExerciseCardProps {
  id: string;
  name: string;
  phase: ExercisePhase | string;
  instructions: string[];
  dose: string;
  stopConditions: string[];
  videoUrl?: string;
  onComplete?: () => void;
  completed?: boolean;
  /** @deprecated use onComplete instead. Kept to avoid breaking older callers. */
  onStart?: () => void;
}

const PHASE_LABELS: Record<string, string> = {
  isometric_stabilization: "Stabilization",
  controlled_range_of_motion: "Range of Motion",
  loaded_mobility: "Loaded Mobility",
  integrated_movement: "Integrated Movement",
};

function formatSeconds(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExerciseCard({
  name,
  phase,
  instructions,
  dose,
  stopConditions,
  onComplete,
  onStart,
  completed,
}: ExerciseCardProps) {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStart = () => {
    setRunning(true);
    // Backwards-compat: callers that pass onStart still get their callback
    // when the user actually kicks off the timer.
    onStart?.();
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setSeconds(0);
  };

  const handleComplete = () => {
    setRunning(false);
    onComplete?.();
  };

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
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {PHASE_LABELS[phase] || phase}
            </span>
            {completed ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                <Check className="h-3 w-3" aria-hidden /> Completed
              </span>
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
          <Clock className="h-4 w-4 text-ink-muted" aria-hidden />
          <span className="font-medium">{dose}</span>
        </div>
      </div>

      {stopConditions.length > 0 ? (
        <div className="mt-4 rounded-md bg-halt-soft/40 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-halt" aria-hidden />
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

      {!completed ? (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {running || seconds > 0 ? (
            <>
              <div
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                aria-live="polite"
                aria-label={`Elapsed time ${formatSeconds(seconds)}`}
              >
                <span className="tabular-nums">{formatSeconds(seconds)}</span>
                {running ? (
                  <button
                    type="button"
                    onClick={handlePause}
                    aria-label="Pause timer"
                    className="rounded-full p-0.5 hover:bg-white/10"
                  >
                    <Pause className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStart}
                    aria-label="Resume timer"
                    className="rounded-full p-0.5 hover:bg-white/10"
                  >
                    <Play className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reset timer"
                  className="rounded-full p-0.5 hover:bg-white/10"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <Check className="h-4 w-4" />
                Mark complete
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleStart}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-ink-soft"
              >
                <Play className="h-4 w-4" />
                Start exercise
              </button>
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Check className="h-4 w-4" />
                Mark complete
              </button>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
