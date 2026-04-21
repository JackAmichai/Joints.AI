import type { BodyRegion } from "./body";
import type { Aggravator, Reliever } from "./intake";
import type { RedFlagHit } from "./redFlags";

/**
 * Contracts between the orchestrator and each agent. The frontend never
 * produces these — it only consumes them once the backend populates them
 * on the IntakeSubmission record. Defined here so the UI can render
 * results type-safely and the same types can be shared with the Python
 * FastAPI backend via a codegen step later.
 */

// =====================================================================
// Agent 1 — The Extractor
// =====================================================================

/**
 * Normalized clinical payload produced by the Extractor. Merges the
 * user's subjective input with structured evidence from uploaded files
 * (VLM for images, text parsing for reports).
 *
 * Numeric findings go in `measurements` (e.g., LCEA angle, Cobb angle,
 * ROM degrees). Free-text diagnoses that appear in uploaded reports go
 * in `reportedDiagnoses` — these are evidence of what *someone wrote*,
 * NOT a diagnosis this system is making.
 */
export interface ExtractedClinicalPayload {
  primaryLocation: BodyRegion;
  secondaryLocations: BodyRegion[];
  aggravators: Aggravator[];
  relievers: Reliever[];
  /**
   * Structured numeric findings keyed by lowercase snake_case term.
   * Examples: lcea_left, cobb_angle, knee_flexion_degrees.
   */
  measurements: Record<string, number | string>;
  /**
   * Diagnostic terms extracted verbatim from clinical documents.
   * These are EVIDENCE, not conclusions this system draws.
   */
  reportedDiagnoses: Array<{
    term: string;
    sourceFileId: string;
    verbatimQuote: string;
  }>;
  /** Per-file confidence & provenance. */
  provenance: Array<{
    fileId: string;
    extractionModel: string;
    confidence: number; // 0..1
  }>;
  /**
   * Anything the Extractor saw but could not classify. Gets shown to the
   * clinician at HITL review so nothing silently gets dropped.
   */
  unclassifiedNotes: string[];
}

// =====================================================================
// Agent 2 — The Triage
// =====================================================================

export type TriageDisposition =
  | "proceed"
  | "halt_seek_emergency"
  | "halt_seek_physician"
  | "proceed_with_caution";

export interface TriageResult {
  disposition: TriageDisposition;
  hits: RedFlagHit[];
  /** Human-readable rationale — shown to the user if the pipeline halts. */
  rationale: string;
  /** ISO timestamp of the triage decision. */
  evaluatedAt: string;
  /** Model identifier used (e.g., "nemotron-3-8b-safety-2026-03"). */
  evaluatedBy: string;
}

// =====================================================================
// Agent 3 — The RAG Retriever & plan composer
// =====================================================================

export type ExercisePhase =
  | "isometric_stabilization"
  | "controlled_range_of_motion"
  | "loaded_mobility"
  | "integrated_movement";

export interface Exercise {
  id: string;            // stable ID from the knowledge base
  name: string;
  phase: ExercisePhase;
  targetRegion: BodyRegion;
  /** Educational instructions — plain text, phrased as cues not commands. */
  instructions: string[];
  /** Dose guidance, e.g. "2 sets of 10 holds, 10s each". */
  dose: string;
  /** Cues to stop: pain spikes, paresthesia, etc. */
  stopConditions: string[];
  /**
   * Contraindication tags matched against the user's profile at
   * retrieval time. If any of these are active for the user, the
   * exercise is NOT returned.
   */
  contraindicationTags: string[];
  mediaPlaceholders: {
    video?: { caption: string };
    image?: { caption: string };
  };
  /** RAG source document chunks used to justify this pick. */
  citations: Array<{
    sourceTitle: string;
    chunkId: string;
    score: number;
  }>;
}

export interface RehabPlan {
  id: string;
  generatedAt: string;
  /**
   * Ordered phases — the user is never shown a plan "menu"; they move
   * through phases under the logic the clinician cleared.
   */
  phases: Array<{
    phase: ExercisePhase;
    summary: string;
    exercises: Exercise[];
  }>;
  /**
   * Probabilistic framing for the UI. This is the ONLY place the system
   * describes what the user's symptoms might be consistent with — and
   * even then, never as "You have X."
   */
  probabilisticFraming: {
    pattern: string;                 // e.g., "anterior hip impingement pattern"
    commonlyAssociatedWith: string[]; // lay terms, never presented as a dx
    confidence: "low" | "moderate" | "high";
  };
  /** Set by HITL workflow — plan not released to the user until true. */
  clinicianReviewed: boolean;
  clinicianNote?: string;
}
