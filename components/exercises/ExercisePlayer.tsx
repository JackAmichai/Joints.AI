"use client";

import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Clock, X } from "lucide-react";

interface ExercisePlayerProps {
  open: boolean;
  onClose: () => void;
  exerciseName: string;
  instructions: string[];
  dose: string;
  videoUrl?: string;
  youtubeId?: string;
}

export function ExercisePlayer({
  open,
  onClose,
  exerciseName,
  instructions,
  dose,
  videoUrl,
  youtubeId,
}: ExercisePlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const parseDose = (doseStr: string): number => {
    const match = doseStr.match(/(\d+)\s*sec/i);
    return match && match[1] ? parseInt(match[1], 10) : 10;
  };

  const targetSeconds = parseDose(dose);
  const progress = targetSeconds > 0 ? Math.min(100, (timerSeconds / targetSeconds) * 100) : 0;

  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerRunning(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => !newOpen && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{exerciseName}</DialogTitle>
          <DialogDescription>Follow the instructions below</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {youtubeId && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                className="h-full w-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {videoUrl && !youtubeId && (
            <video src={videoUrl} controls className="w-full rounded-lg" autoPlay />
          )}

          {!youtubeId && !videoUrl && (
            <div className="aspect-video flex items-center justify-center rounded-lg bg-slate-100">
              <p className="text-slate-500">No video available for this exercise</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-3xl font-mono font-bold text-slate-900">
                <Clock className="h-8 w-8" />
                {formatTime(timerSeconds)}
              </div>
              {targetSeconds > 0 && (
                <p className="mt-1 text-sm text-slate-500">
                  Target: {targetSeconds} seconds
                </p>
              )}
            </div>

            <div className="h-3 w-full rounded-full bg-slate-200">
              <div
                className="h-3 rounded-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => setTimerRunning(!timerRunning)}
                className="h-14 w-14"
              >
                {timerRunning ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          <div className="rounded-md bg-slate-50 p-3">
            <p className="text-sm font-medium text-slate-700">Instructions:</p>
            <ol className="mt-2 list-decimal list-inside space-y-1 text-sm">
              {instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <p className="text-center text-sm text-slate-600">
            <strong>Dose:</strong> {dose}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}