"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TherapistCard } from "@/components/therapists/TherapistCard";
import { FadeIn } from "@/components/ui/fade-in";
import type { Therapist, TherapistKind } from "@/lib/types/therapists";
import { Search, Globe2, MapPin, ShieldCheck, Info, Sparkles } from "lucide-react";
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
    <div className="max-w-7xl mx-auto pb-20">
      <FadeIn>
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Provider Network
            </span>
          </div>
          <h1 className="text-5xl font-black text-ink tracking-tight">Find a Clinician</h1>
          <p className="text-slate-500 font-medium text-lg italic mt-1">
            Curated in-person clinics and online platforms to pair with your Joints.AI plan.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Card variant="default" className="mb-8 border-none shadow-premium overflow-hidden bg-gradient-to-br from-brand-50/60 to-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-700 shadow-inner shrink-0">
                <Info className="h-5 w-5" aria-hidden />
              </div>
              <div className="text-sm text-slate-600 font-medium leading-relaxed">
                <p className="font-black text-ink mb-1 tracking-tight">
                  This is a directory, not a referral.
                </p>
                <p>
                  Joints.AI doesn&apos;t diagnose. These listings are informational — verify
                  credentials, fit, and insurance with the clinic or platform before starting care.
                  If symptoms in your plan change or worsen, please see a clinician in person.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div
            role="tablist"
            aria-label="Therapist type"
            className="inline-flex rounded-2xl border border-slate-100 bg-white p-1 shadow-sm"
          >
            <button
              type="button"
              role="tab"
              aria-selected={kind === "online"}
              onClick={() => setKind("online")}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl px-4 h-10 text-xs font-black uppercase tracking-widest transition-all",
                kind === "online"
                  ? "bg-ink text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Globe2 className="h-4 w-4" aria-hidden /> Online
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={kind === "local"}
              onClick={() => setKind("local")}
              className={clsx(
                "inline-flex items-center gap-2 rounded-xl px-4 h-10 text-xs font-black uppercase tracking-widest transition-all",
                kind === "local"
                  ? "bg-ink text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <MapPin className="h-4 w-4" aria-hidden /> In-Person
            </button>
          </div>

          {kind === "local" && (
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden
              />
              <Input
                placeholder="City (e.g. London, NYC)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="pl-11 h-12 rounded-xl"
                aria-label="Filter by city"
              />
            </div>
          )}

          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
              aria-hidden
            />
            <Input
              placeholder="Specialty (e.g. knee, running)"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="pl-11 h-12 rounded-xl"
              aria-label="Filter by specialty"
            />
          </div>

          {(city || specialty) && (
            <Button
              variant="ghost"
              onClick={() => {
                setCity("");
                setSpecialty("");
              }}
              className="rounded-xl h-12 font-black text-xs uppercase tracking-widest"
            >
              Clear filters
            </Button>
          )}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div className="mb-10 flex flex-wrap gap-2">
          {SPECIALTY_CHIPS.map((s) => {
            const active = specialty.toLowerCase() === s.toLowerCase();
            return (
              <button
                key={s}
                type="button"
                onClick={() => setSpecialty(active ? "" : s)}
                className={clsx(
                  "rounded-full border-2 px-4 h-9 text-[10px] font-black uppercase tracking-widest transition-all",
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-200/60"
                    : "border-slate-100 bg-white text-slate-500 hover:border-brand-200 hover:text-brand-700"
                )}
                aria-pressed={active}
              >
                {s}
              </button>
            );
          })}
        </div>
      </FadeIn>

      {loading ? (
        <div
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
          aria-busy="true"
          aria-label="Loading therapists"
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i} variant="default" className="border-none shadow-premium bg-white">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-5 w-2/3 rounded-lg bg-slate-100" />
                  <div className="h-3 w-1/3 rounded bg-slate-50" />
                  <div className="h-3 w-full rounded bg-slate-50" />
                  <div className="h-3 w-5/6 rounded bg-slate-50" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 rounded-full bg-slate-50" />
                    <div className="h-6 w-20 rounded-full bg-slate-50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : therapists.length === 0 ? (
        <FadeIn>
          <Card variant="default" className="border-none shadow-premium bg-white">
            <CardContent className="py-16 text-center px-6">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                <Search className="h-8 w-8" aria-hidden />
              </div>
              <h2 className="text-xl font-black text-ink tracking-tight mb-2">No matches</h2>
              <p className="text-slate-500 font-medium">
                Try clearing filters or switching tabs.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <>
          {featured.length > 0 && (
            <FadeIn delay={0.4}>
              <section className="mb-10">
                <div className="mb-5 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" aria-hidden />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Editor&apos;s Picks
                  </h2>
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {featured.map((t) => (
                    <TherapistCard key={t.id} therapist={t} />
                  ))}
                </div>
              </section>
            </FadeIn>
          )}

          {rest.length > 0 && (
            <FadeIn delay={featured.length > 0 ? 0.5 : 0.4}>
              <section>
                {featured.length > 0 && (
                  <h2 className="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {kind === "online" ? "More Platforms" : "More Clinics"}
                  </h2>
                )}
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((t) => (
                    <TherapistCard key={t.id} therapist={t} />
                  ))}
                </div>
              </section>
            </FadeIn>
          )}
        </>
      )}

      <FadeIn delay={0.6}>
        <div className="mt-12 rounded-3xl border border-slate-100 bg-white shadow-premium p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner shrink-0">
              <ShieldCheck className="h-5 w-5" aria-hidden />
            </div>
            <div className="text-sm text-slate-500 font-medium leading-relaxed">
              <p>
                Want to suggest a physiotherapist or platform we should list? Use the Feedback
                button on the bottom-left — we review every submission.
              </p>
              {source === "fallback" && (
                <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Showing curated fallback list — coverage is expanding by region.
                </p>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
