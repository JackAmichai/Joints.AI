"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import type { Therapist, TherapistKind } from "@/lib/types/therapists";
import { Search, Globe2, MapPin, ShieldCheck, Info } from "lucide-react";
import { clsx } from "clsx";

const SPECIALTY_CHIPS = [
  "Back pain",
  "Knee",
  "Shoulder",
  "Sports injury",
  "Post-surgical",
  "Running",
  "Chronic pain",
  "Balance",
];

export default function TherapistsPage() {
  const [kind, setKind] = useState<TherapistKind>("online");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"supabase" | "fallback">("fallback");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ kind });
    if (city.trim()) params.set("city", city.trim());
    if (specialty.trim()) params.set("specialty", specialty.trim());

    setLoading(true);
    fetch(`/api/therapists?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setTherapists(data.therapists || []);
        setSource(data.source || "fallback");
      })
      .catch(() => setTherapists([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [kind, city, specialty]);

  const featured = useMemo(() => therapists.filter((t) => t.featured), [therapists]);
  const rest = useMemo(() => therapists.filter((t) => !t.featured), [therapists]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Recommended Physiotherapists</h1>
        <p className="text-slate-500 mt-1">
          Curated in-person clinics and online platforms you can pair with your Joints.AI plan.
        </p>
      </div>

      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5 text-blue-600 shrink-0" aria-hidden />
            <div className="text-sm text-blue-900">
              <strong>This is a directory, not a referral.</strong> Joints.AI doesn&apos;t diagnose.
              These listings are informational — verify credentials, fit, and insurance with the
              clinic or platform before starting care. If any symptoms in your plan change or
              worsen, please see a clinician in person.
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          aria-label="Therapist type"
          className="inline-flex rounded-lg border border-slate-200 bg-white p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={kind === "online"}
            onClick={() => setKind("online")}
            className={clsx(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              kind === "online" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <Globe2 className="h-4 w-4" aria-hidden /> Online platforms
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={kind === "local"}
            onClick={() => setKind("local")}
            className={clsx(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              kind === "local" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <MapPin className="h-4 w-4" aria-hidden /> In-person clinics
          </button>
        </div>

        {kind === "local" && (
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
            <Input
              placeholder="City (e.g. London, NYC)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="pl-9"
              aria-label="Filter by city"
            />
          </div>
        )}

        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
          <Input
            placeholder="Specialty (e.g. knee, running)"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="pl-9"
            aria-label="Filter by specialty"
          />
        </div>

        {(city || specialty) && (
          <Button variant="ghost" size="sm" onClick={() => { setCity(""); setSpecialty(""); }}>
            Clear filters
          </Button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {SPECIALTY_CHIPS.map((s) => {
          const active = specialty.toLowerCase() === s.toLowerCase();
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSpecialty(active ? "" : s)}
              className={clsx(
                "rounded-full border px-3 py-1 text-xs transition-colors",
                active
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}
              aria-pressed={active}
            >
              {s}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading therapists">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-5 w-14 rounded-full bg-slate-100" />
                    <div className="h-5 w-16 rounded-full bg-slate-100" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : therapists.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-10 w-10 mx-auto text-slate-300 mb-3" aria-hidden />
            <p className="text-slate-500">No matches. Try clearing filters or switching tabs.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-slate-900">Featured</h2>
                <Badge variant="secondary">Editor&apos;s picks</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {featured.map((t) => (
                  <TherapistCard key={t.id} therapist={t} />
                ))}
              </div>
            </section>
          )}

          {rest.length > 0 && (
            <section>
              {featured.length > 0 && (
                <h2 className="mb-3 text-lg font-semibold text-slate-900">
                  {kind === "online" ? "More platforms" : "More clinics"}
                </h2>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((t) => (
                  <TherapistCard key={t.id} therapist={t} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <div className="mt-10 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 mt-0.5 text-slate-600 shrink-0" aria-hidden />
          <div className="text-sm text-slate-600">
            <p>
              Want to suggest a physiotherapist or platform we should list? Use the Feedback
              button on the bottom-left — we review every submission.
            </p>
            {source === "fallback" && (
              <p className="mt-1 text-xs text-slate-400">
                Showing our curated fallback list. The team is expanding coverage by region.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
