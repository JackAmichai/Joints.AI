"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { AlertCircle, Check, Clock, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
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
 *  - When we can parse a target hold/duration out of the dose string, the
 *    stopwatch emits a soft audio chime + pulse animation at that time so
 *    the user doesn't have to watch the screen during a set.
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

/**
 * Best-effort extraction of a hold/duration target in seconds from a dose
 * string. Dose strings are clinician-authored free text, so we're generous
 * about format ("30 sec hold", "hold 45s", "2 min", "1 minute"). Returns
 * null when no duration can be inferred — in that case the timer is still
 * useful as a plain stopwatch but won't fire an end-cue.
 */
function parseTargetSeconds(dose: string): number | null {
  if (!dose) return null;
  const lc = dose.toLowerCase();
  // Minutes: "2 min", "1 minute", "1.5 minutes"
  const minMatch = lc.match(/(\d+(?:\.\d+)?)\s*(?:min(?:ute)?s?)\b/);
  if (minMatch?.[1]) {
    const m = parseFloat(minMatch[1]);
    if (!isNaN(m) && m > 0 && m < 30) return Math.round(m * 60);
  }
  // Seconds: "30 sec", "30 seconds", "30s hold"
  const secMatch = lc.match(/(\d+)\s*(?:s(?:ec(?:ond)?s?)?\b|"\s|'\s)/);
  if (secMatch?.[1]) {
    const s = parseInt(secMatch[1], 10);
    if (!isNaN(s) && s >= 3 && s <= 600) return s;
  }
  return null;
}

/**
 * Fire a short pleasant chime via the Web Audio API. Pure frontend — no
 * asset to ship and no permission prompt. Silently no-ops when audio is
 * unavailable (e.g. SSR, old browser, user muted at OS level).
 */
function playChime() {
  if (typeof window === "undefined") return;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return;
  try {
    const ctx = new Ctor();
    const now = ctx.currentTime;
    const tones = [880, 1320]; // two-note chime, E5-ish
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + i * 0.18;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.4);
    });
    // Release the context after the sound is done.
    setTimeout(() => ctx.close().catch(() => {}), 900);
  } catch {
    // Best-effort — never let a blocked audio context break the timer.
  }
}

const SOUND_PREF_KEY = "joints-ai:exercise-sound";

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
  const [targetReached, setTargetReached] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const targetSeconds = useMemo(() => parseTargetSeconds(dose), [dose]);

  // Load the user's sound preference from localStorage once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const pref = window.localStorage.getItem(SOUND_PREF_KEY);
    if (pref === "off") setSoundOn(false);
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // Fire the end-cue exactly when we cross the target (not on every tick
  // after). The pulse animation lingers for two seconds via CSS.
  useEffect(() => {
    if (!targetSeconds || targetReached) return;
    if (seconds >= targetSeconds) {
      setTargetReached(true);
      if (soundOn) playChime();
      // Light haptic on mobile when available.
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate?.(120);
        } catch {
          /* no-op */
        }
      }
    }
  }, [seconds, targetSeconds, targetReached, soundOn]);

  const handleStart = () => {
    setRunning(true);
    onStart?.();
  };

  const handlePause = () => setRunning(false);

  const handleReset = () => {
    setRunning(false);
    setSeconds(0);
    setTargetReached(false);
  };

  const handleComplete = () => {
    setRunning(false);
    onComplete?.();
  };

  const toggleSound = () => {
    setSoundOn((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SOUND_PREF_KEY, next ? "on" : "off");
      }
      return next;
    });
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
          {targetSeconds ? (
            <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              target {formatSeconds(targetSeconds)}
            </span>
          ) : null}
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
        <div className="mt-4 flex flex-wrap items-center gap-2 print:hidden">
          {running || seconds > 0 ? (
            <>
              <div
                className={clsx(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white transition-all",
                  targetReached
                    ? "bg-accent animate-pulse"
                    : "bg-slate-900"
                )}
                aria-live="polite"
                aria-label={
                  targetReached
                    ? `Target reached at ${formatSeconds(seconds)}`
                    : `Elapsed time ${formatSeconds(seconds)}`
                }
              >
                <span className="tabular-nums">{formatSeconds(seconds)}</span>
                {targetSeconds ? (
                  <span className="text-xs opacity-80 tabular-nums">
                    / {formatSeconds(targetSeconds)}
                  </span>
                ) : null}
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
              {targetSeconds ? (
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={soundOn ? "Mute end-of-set chime" : "Enable end-of-set chime"}
                  aria-pressed={soundOn}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                  title={soundOn ? "Chime on" : "Chime off"}
                >
                  {soundOn ? (
                    <Volume2 className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" aria-hidden />
                  )}
                </button>
              ) : null}
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
