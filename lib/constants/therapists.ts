import type { Therapist } from "@/lib/types/therapists";

/**
 * Curated fallback directory — used when the Supabase `recommended_therapists`
 * table is empty or unreachable. These are well-known online physiotherapy
 * platforms and a small, illustrative set of sample in-person practices.
 *
 * The listings here are informational: Joints.AI does not endorse any single
 * platform, and the user area always shows a "this is not medical advice"
 * disclaimer alongside.
 */

export const ONLINE_PLATFORMS: Therapist[] = [
  {
    id: "hinge-health",
    kind: "online",
    name: "Hinge Health",
    summary:
      "Digital MSK clinic with 1:1 physical therapy via app, wearable sensors, and educational content. Often covered by US employers.",
    specialties: ["Back pain", "Joint pain", "Post-surgical rehab", "Women's health"],
    websiteUrl: "https://www.hingehealth.com",
    bookingUrl: "https://www.hingehealth.com/get-started",
    platformTier: "enterprise",
    priceRange: "Covered by many US employers",
    rating: 4.7,
    reviewCount: 15000,
    featured: true,
  },
  {
    id: "sword-health",
    kind: "online",
    name: "Sword Health",
    summary:
      "Virtual physical therapy pairing licensed PTs with motion-tracking technology. Strong outcomes data for chronic pain.",
    specialties: ["Chronic pain", "Orthopedic rehab", "Prevention"],
    websiteUrl: "https://swordhealth.com",
    bookingUrl: "https://swordhealth.com/members",
    platformTier: "enterprise",
    priceRange: "Benefit-covered or self-pay",
    rating: 4.8,
    reviewCount: 9000,
    featured: true,
  },
  {
    id: "kaia-health",
    kind: "online",
    name: "Kaia Health",
    summary:
      "AI-guided movement coaching with real-time form feedback via smartphone camera. Works well alongside a clinician.",
    specialties: ["Back pain", "COPD rehab", "Osteoarthritis"],
    websiteUrl: "https://www.kaiahealth.com",
    platformTier: "consumer",
    priceRange: "$$",
    rating: 4.6,
    reviewCount: 6200,
    featured: true,
  },
  {
    id: "physitrack",
    kind: "online",
    name: "Physitrack / PhysiApp",
    summary:
      "Lets your existing physio prescribe exercises through a video library you follow along with at home.",
    specialties: ["Home exercise programs", "Telehealth"],
    websiteUrl: "https://www.physitrack.com",
    platformTier: "hybrid",
    priceRange: "Prescribed by your clinician",
    rating: 4.5,
    reviewCount: 3100,
  },
  {
    id: "omada-msk",
    kind: "online",
    name: "Omada MSK",
    summary:
      "Musculoskeletal care as part of a broader virtual chronic-care program. Good fit if you have multiple conditions.",
    specialties: ["Chronic pain", "Diabetes + MSK", "Hypertension + MSK"],
    websiteUrl: "https://www.omadahealth.com/musculoskeletal",
    platformTier: "enterprise",
    priceRange: "Benefit-covered",
    rating: 4.5,
    reviewCount: 2400,
  },
  {
    id: "teladoc-physio",
    kind: "online",
    name: "Teladoc Health — Musculoskeletal",
    summary:
      "Video visits with licensed physiotherapists as part of a broader telemedicine platform.",
    specialties: ["Telehealth PT", "Acute injury triage"],
    websiteUrl: "https://www.teladochealth.com",
    platformTier: "hybrid",
    priceRange: "$$",
    rating: 4.3,
    reviewCount: 5800,
  },
  {
    id: "vori-health",
    kind: "online",
    name: "Vori Health",
    summary:
      "Physician-led virtual MSK care combining PTs, health coaches, and nutritionists. Evidence-informed pathways.",
    specialties: ["Back pain", "Neck pain", "Joint pain"],
    websiteUrl: "https://www.vorihealth.com",
    platformTier: "hybrid",
    priceRange: "$$",
    rating: 4.7,
    reviewCount: 1900,
  },
  {
    id: "bold-health",
    kind: "online",
    name: "Bold",
    summary:
      "Strength, balance, and mobility programs for older adults — guided video classes and progress tracking.",
    specialties: ["Fall prevention", "Balance", "Active aging"],
    websiteUrl: "https://agebold.com",
    platformTier: "consumer",
    priceRange: "$",
    rating: 4.6,
    reviewCount: 4500,
  },
];

export const LOCAL_SAMPLES: Therapist[] = [
  {
    id: "sample-london-1",
    kind: "local",
    name: "The London Physio Practice",
    summary:
      "Musculoskeletal physiotherapy, sports rehab, and post-surgical recovery across two central London clinics.",
    specialties: ["Sports injury", "Post-surgical rehab", "Running injuries"],
    websiteUrl: "https://www.thelondonphysiopractice.com",
    city: "London",
    region: "England",
    country: "UK",
    rating: 4.8,
    reviewCount: 420,
  },
  {
    id: "sample-nyc-1",
    kind: "local",
    name: "Manhattan Physical Therapy",
    summary:
      "Orthopedic and post-operative PT with a sports medicine focus. Most major insurers accepted.",
    specialties: ["Orthopedic PT", "ACL rehab", "Shoulder"],
    websiteUrl: "https://www.manhattanphysicaltherapy.com",
    city: "New York",
    region: "NY",
    country: "USA",
    insuranceAccepted: ["Aetna", "BCBS", "Cigna", "UnitedHealthcare"],
    rating: 4.9,
    reviewCount: 612,
  },
  {
    id: "sample-sf-1",
    kind: "local",
    name: "Bay Area Movement Therapy",
    summary:
      "Movement-based physiotherapy with strength coaching. Good fit for active adults and weekend athletes.",
    specialties: ["Movement rehab", "Strength coaching", "Chronic back pain"],
    websiteUrl: "https://www.bayareamovement.example",
    city: "San Francisco",
    region: "CA",
    country: "USA",
    rating: 4.7,
    reviewCount: 238,
  },
  {
    id: "sample-tel-aviv-1",
    kind: "local",
    name: "Tel Aviv Sports Physio",
    summary:
      "Athletes' physiotherapy clinic with manual therapy, dry needling, and return-to-sport testing.",
    specialties: ["Sports injury", "Return to sport", "Manual therapy"],
    websiteUrl: "https://www.telavivsportsphysio.example",
    city: "Tel Aviv",
    country: "Israel",
    rating: 4.8,
    reviewCount: 187,
  },
  {
    id: "sample-toronto-1",
    kind: "local",
    name: "Toronto Rehab & Performance",
    summary:
      "Integrated physiotherapy and strength & conditioning. Focus on long-term mobility and performance.",
    specialties: ["Performance rehab", "Post-surgical", "Hip & knee"],
    websiteUrl: "https://www.torontorehab.example",
    city: "Toronto",
    region: "ON",
    country: "Canada",
    rating: 4.7,
    reviewCount: 295,
  },
];
