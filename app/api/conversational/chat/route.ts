import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
const BACKEND_TIMEOUT_MS = 15000;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);

  try {
    const response = await fetch(`${BACKEND_URL}/api/conversational/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
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
    const isAbort = (error as { name?: string })?.name === "AbortError";
    if (isAbort) {
      console.error("Chat backend timed out after", BACKEND_TIMEOUT_MS, "ms");
      return NextResponse.json(
        { error: "The assistant is taking longer than expected. Please try again." },
        { status: 504 }
      );
    }
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  } finally {
    clearTimeout(timeoutId);
  }
}
