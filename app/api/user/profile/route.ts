import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, isValidUUID, sanitizeString } from "@/lib/api/auth";

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    if (auth.error) return auth.error;

    const body = await request.json();
    const { full_name, age, fitness_level, known_conditions } = body;

    if (!isValidUUID(auth.userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const supabase = require("@supabase/supabase-js").createClient(supabaseUrl, supabaseKey);

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (full_name !== undefined) {
      updates.full_name = sanitizeString(full_name, 100);
    }
    if (age !== undefined) {
      const ageNum = parseInt(age, 10);
      updates.age = !isNaN(ageNum) && ageNum > 0 && ageNum < 150 ? ageNum : null;
    }
    if (fitness_level !== undefined) {
      const validLevels = ["sedentary", "moderate", "active", "athlete"];
      updates.fitness_level = validLevels.includes(fitness_level) ? fitness_level : null;
    }
    if (known_conditions !== undefined) {
      updates.known_conditions = Array.isArray(known_conditions) 
        ? known_conditions.slice(0, 20).map((s: unknown) => sanitizeString(s, 50))
        : [];
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", auth.userId)
      .select()
      .single();

    if (error) {
      console.error("Profile update error:", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error) {
    console.error("Profile update catch error:", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const auth = await authenticateRequest(request);
  if (auth.error) return auth.error;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const supabase = require("@supabase/supabase-js").createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, age, fitness_level, known_conditions, created_at, updated_at")
    .eq("id", auth.userId)
    .single();

  if (error) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  return NextResponse.json({ profile: data });
}

export const dynamic = 'force-dynamic';