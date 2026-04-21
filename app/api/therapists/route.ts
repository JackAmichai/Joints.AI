import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { LOCAL_SAMPLES, ONLINE_PLATFORMS } from "@/lib/constants/therapists";
import type { Therapist, TherapistKind } from "@/lib/types/therapists";

/**
 * GET /api/therapists
 *
 * Returns the curated directory of recommended therapists.
 *   ?kind=online | local
 *   ?city=London              (filters local matches, substring match)
 *   ?specialty=running        (substring on each therapist's specialties[])
 *
 * Falls back to the static curated list in lib/constants/therapists.ts if the
 * Supabase table is unpopulated or unreachable. This keeps the user area
 * informative even before ops has seeded data.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const kindParam = searchParams.get("kind");
  const city = searchParams.get("city")?.toLowerCase() ?? "";
  const specialty = searchParams.get("specialty")?.toLowerCase() ?? "";
  const kind: TherapistKind | null =
    kindParam === "online" || kindParam === "local" ? kindParam : null;

  let therapists: Therapist[] = [];
  let source: "supabase" | "fallback" = "fallback";

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      let query = supabase
        .from("recommended_therapists")
        .select(
          "id, kind, name, summary, specialties, website_url, booking_url, phone, country, region, city, postal_code, platform_tier, insurance_accepted, price_range, rating, review_count, logo_url, featured"
        )
        .order("featured", { ascending: false })
        .order("rating", { ascending: false, nullsFirst: false });
      if (kind) query = query.eq("kind", kind);

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        therapists = data.map((row) => ({
          id: row.id,
          kind: row.kind as TherapistKind,
          name: row.name,
          summary: row.summary,
          specialties: row.specialties ?? [],
          websiteUrl: row.website_url,
          bookingUrl: row.booking_url,
          phone: row.phone,
          country: row.country,
          region: row.region,
          city: row.city,
          postalCode: row.postal_code,
          platformTier: row.platform_tier,
          insuranceAccepted: row.insurance_accepted ?? [],
          priceRange: row.price_range,
          rating: row.rating,
          reviewCount: row.review_count ?? 0,
          logoUrl: row.logo_url,
          featured: row.featured ?? false,
        }));
        source = "supabase";
      }
    } catch (err) {
      console.warn("Therapists fetch fell back to static list:", err);
    }
  }

  if (therapists.length === 0) {
    const all: Therapist[] = [...ONLINE_PLATFORMS, ...LOCAL_SAMPLES];
    therapists = kind ? all.filter((t) => t.kind === kind) : all;
  }

  if (city) {
    therapists = therapists.filter(
      (t) => t.kind !== "local" || (t.city?.toLowerCase().includes(city) ?? false)
    );
  }
  if (specialty) {
    therapists = therapists.filter((t) =>
      (t.specialties ?? []).some((s) => s.toLowerCase().includes(specialty))
    );
  }

  return NextResponse.json({ therapists, source });
}

export const dynamic = "force-dynamic";
