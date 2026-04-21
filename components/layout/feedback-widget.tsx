"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { MessageCircle, X, Send, Bug, Lightbulb, Heart, HelpCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toast";
import { authedFetch } from "@/lib/api/authedFetch";

type Category = "bug" | "suggestion" | "praise" | "other";

const CATEGORIES: Array<{ value: Category; label: string; icon: typeof Bug; color: string }> = [
  { value: "bug", label: "Report a bug", icon: Bug, color: "text-red-600" },
  { value: "suggestion", label: "Suggest a feature", icon: Lightbulb, color: "text-amber-600" },
  { value: "praise", label: "Share praise", icon: Heart, color: "text-pink-600" },
  { value: "other", label: "Something else", icon: HelpCircle, color: "text-slate-600" },
];

export function FeedbackWidget() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<Category>("suggestion");
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handleSubmit = async () => {
    if (!message.trim() || message.trim().length < 3) {
      toast("Please add a short message (at least 3 characters)", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await authedFetch("/api/user/feedback", {
        method: "POST",
        body: JSON.stringify({
          category,
          rating: rating || null,
          message: message.trim(),
          page: pathname,
        }),
      });
      if (res.ok) {
        toast("Thanks — your feedback is on its way to the team", "success");
        setMessage("");
        setRating(0);
        setCategory("suggestion");
        setOpen(false);
      } else {
        const data = await res.json().catch(() => ({}));
        toast(data?.error || "Could not submit feedback", "error");
      }
    } catch {
      toast("Could not submit feedback", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 print:hidden"
        aria-label="Give feedback"
      >
        <MessageCircle className="h-4 w-4" />
        Feedback
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 id="feedback-title" className="text-lg font-semibold text-slate-900">
                  Share your feedback
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  We read every message. What&apos;s on your mind?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close feedback form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const selected = category === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={clsx(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-left transition-colors",
                      selected
                        ? "border-slate-900 bg-slate-50 text-slate-900"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    )}
                    aria-pressed={selected}
                  >
                    <Icon className={clsx("h-4 w-4", c.color)} aria-hidden />
                    <span className="truncate">{c.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mb-3">
              <p className="mb-1.5 text-sm font-medium text-slate-700">How would you rate the experience?</p>
              <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={rating === n}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    onClick={() => setRating(rating === n ? 0 : n)}
                    className="p-1"
                  >
                    <Star
                      className={clsx(
                        "h-6 w-6 transition-colors",
                        n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    className="ml-2 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="feedback-message" className="mb-1.5 block text-sm font-medium text-slate-700">
                Your message
              </label>
              <Textarea
                id="feedback-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  category === "bug"
                    ? "What happened? What did you expect?"
                    : category === "suggestion"
                    ? "What would you like to see?"
                    : "Tell us what's on your mind..."
                }
                rows={4}
                maxLength={2000}
                autoFocus
              />
              <p className="mt-1 text-xs text-slate-400">{message.length}/2000</p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={submitting || !message.trim()}>
                <Send className="mr-2 h-4 w-4" />
                {submitting ? "Sending..." : "Send feedback"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
