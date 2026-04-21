"use client";

import { clsx } from "clsx";
import { ExternalLink, MapPin, Phone, Star, BadgeCheck, Globe2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
        "group relative rounded-xl border bg-white p-5 transition-shadow hover:shadow-md",
        therapist.featured ? "border-accent/40" : "border-slate-200"
      )}
    >
      {therapist.featured && (
        <span className="absolute -top-2 left-4 inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-white">
          <BadgeCheck className="h-3 w-3" aria-hidden />
          Featured
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">{therapist.name}</h3>
          <div className="mt-0.5 flex items-center gap-2 text-sm text-slate-500">
            {isOnline ? (
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-4 w-4" aria-hidden /> Online platform
              </span>
            ) : location ? (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" aria-hidden /> {location}
              </span>
            ) : null}
          </div>
        </div>
        {typeof therapist.rating === "number" && therapist.rating > 0 && (
          <div className="shrink-0 text-right">
            <div className="inline-flex items-center gap-1 text-sm font-medium text-slate-800">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
              {therapist.rating.toFixed(1)}
            </div>
            {therapist.reviewCount ? (
              <p className="text-xs text-slate-400">{therapist.reviewCount.toLocaleString()} reviews</p>
            ) : null}
          </div>
        )}
      </div>

      {therapist.summary && (
        <p className="mt-3 text-sm text-slate-600">{therapist.summary}</p>
      )}

      {therapist.specialties && therapist.specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {therapist.specialties.slice(0, 5).map((s) => (
            <Badge key={s} variant="secondary" className="bg-slate-100 text-slate-700">
              {s}
            </Badge>
          ))}
        </div>
      )}

      {(therapist.priceRange || (therapist.insuranceAccepted && therapist.insuranceAccepted.length > 0)) && (
        <div className="mt-3 text-xs text-slate-500 space-y-0.5">
          {therapist.priceRange && <p>Pricing: {therapist.priceRange}</p>}
          {therapist.insuranceAccepted && therapist.insuranceAccepted.length > 0 && (
            <p>Accepts: {therapist.insuranceAccepted.slice(0, 4).join(", ")}</p>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        {bookHref ? (
          <a href={bookHref} target="_blank" rel="noopener noreferrer">
            <Button size="sm">
              {therapist.bookingUrl ? "Book" : "Visit"}
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        ) : null}
        {therapist.phone && (
          <a
            href={`tel:${therapist.phone}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" aria-hidden /> Call
          </a>
        )}
      </div>
    </article>
  );
}
