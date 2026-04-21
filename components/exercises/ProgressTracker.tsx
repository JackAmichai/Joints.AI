"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Minus } from "lucide-react";

interface ProgressTrackerProps {
  planId: string;
  onFeedback?: (feedback: "too_easy" | "just_right" | "too_hard") => void;
}

export function ProgressTracker({ planId, onFeedback }: ProgressTrackerProps) {
  const [selectedFeedback, setSelectedFeedback] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleFeedback = async (feedback: "too_easy" | "just_right" | "too_hard") => {
    setSelectedFeedback(feedback);
    try {
      await fetch(`/api/plans/${planId}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
      });
      setSaved(true);
      onFeedback?.(feedback);
    } catch (error) {
      console.error("Failed to save feedback:", error);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="text-lg font-semibold mb-3">How are the exercises feeling?</h3>
      
      <div className="flex gap-3">
        <Button
          variant={selectedFeedback === "too_easy" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFeedback("too_easy")}
        >
          <ThumbsUp className="mr-2 h-4 w-4" />
          Too Easy
        </Button>
        
        <Button
          variant={selectedFeedback === "just_right" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFeedback("just_right")}
        >
          <Minus className="mr-2 h-4 w-4" />
          Just Right
        </Button>
        
        <Button
          variant={selectedFeedback === "too_hard" ? "default" : "outline"}
          size="sm"
          onClick={() => handleFeedback("too_hard")}
        >
          <ThumbsDown className="mr-2 h-4 w-4" />
          Too Hard
        </Button>
      </div>

      {saved && (
        <p className="mt-3 text-sm text-green-600">
          Feedback saved! This will help adjust future plans.
        </p>
      )}
    </div>
  );
}