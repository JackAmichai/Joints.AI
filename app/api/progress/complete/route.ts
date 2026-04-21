import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, isValidUUID, sanitizeString } from "@/lib/api/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const { submission_id, exercise_id } = body;

    if (submission_id && !isValidUUID(submission_id)) {
      return NextResponse.json({ error: "Invalid submission ID" }, { status: 400 });
    }
    if (exercise_id && !isValidUUID(exercise_id)) {
      return NextResponse.json({ error: "Invalid exercise ID" }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/api/progress/complete`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-User-Id": auth.userId,
      },
      body: JSON.stringify({
        ...body,
        user_id: auth.userId,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Progress complete error:", error);
    return NextResponse.json(
      { error: "Failed to record progress" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';