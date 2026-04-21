export type TherapistKind = "local" | "online";

export interface Therapist {
  id: string;
  kind: TherapistKind;
  name: string;
  summary?: string | null;
  specialties?: string[];
  websiteUrl?: string | null;
  bookingUrl?: string | null;
  phone?: string | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  postalCode?: string | null;
  platformTier?: string | null;
  insuranceAccepted?: string[];
  priceRange?: string | null;
  rating?: number | null;
  reviewCount?: number;
  logoUrl?: string | null;
  featured?: boolean;
}
