import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api/auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  const auth = await authenticateRequest(request);
  
  try {
    const body = await request.json();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const payload = { ...body };
    if (auth.userId) {
      payload.user_id = auth.userId;
    }

    const response = await fetch(`${BACKEND_URL}/api/intake/submit`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
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
    console.error("Intake submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit intake" },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';