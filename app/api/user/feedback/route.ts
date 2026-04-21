import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { authenticateRequest, sanitizeString } from "@/lib/api/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const ALLOWED_CATEGORIES = ["bug", "suggestion", "praise", "other"] as const;
type Category = (typeof ALLOWED_CATEGORIES)[number];

/**
 * POST /api/user/feedback
 *
 * Accepts structured product feedback from authenticated users. Persists to
 * Supabase `user_feedback` if available, and best-effort forwards to the
 * Python backend so it can fan out (Slack, email, analytics). Either sink
 * being unavailable should NOT fail the request from the user's perspective
 * — feedback submission is low-stakes and should always feel successful.
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const categoryRaw: string = body?.category ?? "other";
    const category: Category = (ALLOWED_CATEGORIES as readonly string[]).includes(categoryRaw)
      ? (categoryRaw as Category)
      : "other";

    const message = sanitizeString(body?.message, 2000);
    if (!message || message.length < 3) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const rating = typeof body?.rating === "number" && body.rating >= 1 && body.rating <= 5
      ? Math.round(body.rating)
      : null;
    const page = sanitizeString(body?.page, 256) || null;
    const userAgent = sanitizeString(request.headers.get("user-agent") ?? "", 256) || null;

    const payload = {
      user_id: auth.userId,
      category,
      message,
      rating,
      page,
      user_agent: userAgent,
      created_at: new Date().toISOString(),
    };

    // Try Supabase first.
    let persisted = false;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { error } = await supabase.from("user_feedback").insert(payload);
        if (!error) persisted = true;
        else console.warn("Feedback insert warning:", error.message);
      } catch (err) {
        console.warn("Supabase feedback insert failed:", err);
      }
    }

    // Best-effort backend notify (non-blocking-style, but we still await so
    // a fast backend gets first-party delivery — we swallow errors).
    try {
      await fetch(`${BACKEND_URL}/api/user/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* backend down; Supabase row is enough */
    }

    return NextResponse.json({ ok: true, persisted });
  } catch (error) {
    console.error("Feedback submission error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export const dynamic = "force-dynamic";
