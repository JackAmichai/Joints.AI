/**
 * Red-flag taxonomy and keyword patterns consumed by the Triage agent
 * (Agent 2). This file is deliberately colocated with the frontend types
 * so the same source-of-truth drives both the client-side soft warning
 * (shown the moment a user types a flagged term in the free-text field)
 * AND the authoritative server-side gate that halts the pipeline.
 *
 * CRITICAL: client-side detection is a UX hint only. The server MUST
 * re-run its own detection — never trust the browser for safety logic.
 */

export type RedFlagCategory =
  | "cauda_equina"          // loss of bowel/bladder, saddle anesthesia
  | "severe_trauma"         // acute high-energy mechanism
  | "radiating_nerve"       // nerve root / sciatica patterns
  | "progressive_weakness"  // worsening motor loss
  | "systemic_illness"      // fever + back pain, unexplained weight loss
  | "cardiac_referral"      // chest pain patterns
  | "vascular";             // cold/pulseless limb

export type RedFlagSeverity = "critical" | "high";

export interface RedFlagRule {
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  /**
   * Case-insensitive phrase matches. Whole-word boundary applied at scan
   * time. Keep these phrases specific — false positives train users to
   * ignore warnings.
   */
  patterns: string[];
  /** Shown in the UI if tripped on the client. */
  userMessage: string;
  /** Where we route the user when this trips server-side. */
  disposition: "emergency_room" | "urgent_physician" | "physician_review";
}

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    category: "cauda_equina",
    severity: "critical",
    patterns: [
      "loss of bowel",
      "loss of bladder",
      "bowel control",
      "bladder control",
      "saddle numbness",
      "saddle anesthesia",
      "can't feel when i pee",
      "cant feel when i pee",
      "numb between my legs"
    ],
    userMessage:
      "What you've described may need urgent evaluation. Please stop this intake and seek emergency care.",
    disposition: "emergency_room"
  },
  {
    category: "severe_trauma",
    severity: "critical",
    patterns: [
      "car accident",
      "fell from height",
      "severe trauma",
      "hit by",
      "motorcycle crash",
      "unconscious"
    ],
    userMessage:
      "Acute trauma needs in-person evaluation before any exercise program. Please see an emergency provider.",
    disposition: "emergency_room"
  },
  {
    category: "radiating_nerve",
    severity: "high",
    patterns: [
      "radiating nerve pain",
      "shooting down my leg",
      "shooting down both legs",
      "shooting down my arm",
      "electric shock",
      "foot drop"
    ],
    userMessage:
      "Radiating or shock-like pain is a signal to have a clinician evaluate you before starting a mobility program.",
    disposition: "urgent_physician"
  },
  {
    category: "progressive_weakness",
    severity: "critical",
    patterns: [
      "getting weaker",
      "progressive weakness",
      "can't lift my",
      "leg gave out",
      "losing strength"
    ],
    userMessage:
      "Worsening weakness warrants prompt medical assessment before any mobility work.",
    disposition: "urgent_physician"
  },
  {
    category: "systemic_illness",
    severity: "high",
    patterns: [
      "fever and back pain",
      "night sweats",
      "unexplained weight loss",
      "history of cancer"
    ],
    userMessage:
      "Your description includes findings that should be reviewed by a physician before exercise guidance is appropriate.",
    disposition: "physician_review"
  },
  {
    category: "cardiac_referral",
    severity: "critical",
    patterns: [
      "chest pain and",
      "crushing chest",
      "pain down my left arm",
      "jaw pain with chest"
    ],
    userMessage:
      "What you've described can be a cardiac warning. Please seek emergency care right now.",
    disposition: "emergency_room"
  },
  {
    category: "vascular",
    severity: "critical",
    patterns: [
      "cold pale limb",
      "no pulse in my",
      "limb turned blue"
    ],
    userMessage:
      "A cold, pale, or pulseless limb is an emergency. Please go to an ER.",
    disposition: "emergency_room"
  }
];

export interface RedFlagHit {
  category: RedFlagCategory;
  severity: RedFlagSeverity;
  matchedPhrase: string;
  /** Character offset in the scanned text, for UI highlighting. */
  offset: number;
  userMessage: string;
  disposition: RedFlagRule["disposition"];
}

/**
 * Fast client-side scan. O(n*m) with small m — fine for form input.
 * Returns hits sorted by severity (critical first) then by offset.
 *
 * Remember: this is a UX nudge. The server re-scans authoritatively.
 */
export function scanForRedFlags(text: string): RedFlagHit[] {
  if (!text) return [];
  const haystack = text.toLowerCase();
  const hits: RedFlagHit[] = [];
  for (const rule of RED_FLAG_RULES) {
    for (const phrase of rule.patterns) {
      const needle = phrase.toLowerCase();
      let from = 0;
      while (from <= haystack.length) {
        const idx = haystack.indexOf(needle, from);
        if (idx === -1) break;
        hits.push({
          category: rule.category,
          severity: rule.severity,
          matchedPhrase: phrase,
          offset: idx,
          userMessage: rule.userMessage,
          disposition: rule.disposition
        });
        from = idx + needle.length;
      }
    }
  }
  const severityRank: Record<RedFlagSeverity, number> = { critical: 0, high: 1 };
  hits.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || a.offset - b.offset);
  return hits;
}
