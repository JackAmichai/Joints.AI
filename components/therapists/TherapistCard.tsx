"use client";

import { clsx } from "clsx";
import { ExternalLink, MapPin, Phone, Star, BadgeCheck, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Therapist } from "@/lib/types/therapists";

export function TherapistCard({ therapist }: { therapist: Therapist }) {
  const location = [therapist.city, therapist.region, therapist.country]
    .filter(Boolean)
    .join(", ");
  const isOnline = therapist.kind === "online";
  const bookHref = therapist.bookingUrl || therapist.websiteUrl || undefined;

  return (
    <article
      className={clsx(
        "group relative rounded-3xl bg-white p-6 transition-all hover:-translate-y-1",
        therapist.featured
          ? "border-2 border-brand-200 shadow-2xl shadow-brand-100/50 hover:shadow-brand-200/60"
          : "border border-slate-100 shadow-premium hover:shadow-2xl"
      )}
    >
      {therapist.featured && (
        <span className="absolute -top-3 left-5 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest shadow-lg shadow-brand-200/50">
          <BadgeCheck className="h-3 w-3" aria-hidden />
          Featured
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-black text-ink tracking-tight leading-tight">{therapist.name}</h3>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            {isOnline ? (
              <>
                <Globe2 className="h-3.5 w-3.5" aria-hidden /> Online Platform
              </>
            ) : location ? (
              <>
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {location}
              </>
            ) : null}
          </div>
        </div>
        {typeof therapist.rating === "number" && therapist.rating > 0 && (
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 text-sm font-black text-ink">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {therapist.rating.toFixed(1)}
            </div>
            {therapist.reviewCount ? (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                {therapist.reviewCount.toLocaleString()} reviews
              </p>
            ) : null}
          </div>
        )}
      </div>

      {therapist.summary && (
        <p className="mt-4 text-sm text-slate-500 font-medium leading-relaxed">{therapist.summary}</p>
      )}

      {therapist.specialties && therapist.specialties.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {therapist.specialties.slice(0, 5).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      {(therapist.priceRange ||
        (therapist.insuranceAccepted && therapist.insuranceAccepted.length > 0)) && (
        <div className="mt-4 pt-4 border-t border-slate-50 text-[11px] font-medium text-slate-500 space-y-1">
          {therapist.priceRange && (
            <p>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1.5">
                Pricing
              </span>
              {therapist.priceRange}
            </p>
          )}
          {therapist.insuranceAccepted && therapist.insuranceAccepted.length > 0 && (
            <p>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mr-1.5">
                Accepts
              </span>
              {therapist.insuranceAccepted.slice(0, 4).join(", ")}
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        {bookHref ? (
          <a href={bookHref} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              className="rounded-xl h-10 px-4 bg-brand-600 hover:bg-brand-700 text-white border-none font-black"
            >
              {therapist.bookingUrl ? "Book" : "Visit"}
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </a>
        ) : null}
        {therapist.phone && (
          <a
            href={`tel:${therapist.phone}`}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-slate-100 px-4 h-10 text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-colors"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden /> Call
          </a>
        )}
      </div>
    </article>
  );
}
