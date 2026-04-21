import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, isValidUUID } from "@/lib/api/auth";

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("user_id");

  if (requestedUserId && requestedUserId !== auth.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const userId = requestedUserId || auth.userId;

  if (!isValidUUID(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/user/plans?user_id=${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
    console.error("User plans fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch plans", plans: [] },
      { status: 500 }
    );
  }
}