import type { BodyRegion } from "./body";

/**
 * Subjective, user-reported pain data. This is the raw input side of the
 * intake — it represents what the user told us, NOT a clinical assessment.
 * The Extractor agent merges this with evidence from uploaded files to
 * produce the normalized ExtractedClinicalPayload.
 */

export type PainQuality =
  | "sharp"
  | "dull"
  | "aching"
  | "throbbing"
  | "burning"
  | "stabbing"
  | "tingling"
  | "pins_and_needles"
  | "stiffness";

export type PainOnset =
  | "sudden_traumatic"
  | "sudden_atraumatic"
  | "gradual"
  | "chronic_recurring"
  | "unknown";

export type Aggravator =
  | "flexion"
  | "extension"
  | "rotation"
  | "lateral_flexion"
  | "weight_bearing"
  | "sitting_prolonged"
  | "standing_prolonged"
  | "walking"
  | "running"
  | "lifting"
  | "overhead_reach"
  | "gripping"
  | "cold_weather"
  | "morning_stiffness"
  | "end_of_day"
  | "after_exercise"
  | "at_rest"
  | "at_night";

export type Reliever =
  | "rest"
  | "heat"
  | "ice"
  | "movement"
  | "stretching"
  | "nsaids"
  | "position_change"
  | "nothing_helps";

export interface SubjectivePainInput {
  /** Primary site the user identifies as the worst pain. */
  primaryLocation: BodyRegion | null;
  /** Optional additional sites, in user-reported order. */
  secondaryLocations: BodyRegion[];
  /** 0–10 visual analog scale. Null until user interacts. */
  intensity: number | null;
  qualities: PainQuality[];
  onset: PainOnset | null;
  /** Null if unknown; 0 allowed for "started today". */
  durationDays: number | null;
  aggravators: Aggravator[];
  relievers: Reliever[];
  /**
   * Free-text subjective description. Gets streamed into the Triage agent
   * verbatim for red-flag keyword scanning BEFORE the Extractor runs.
   */
  freeText: string;
}

export const EMPTY_SUBJECTIVE_INPUT: SubjectivePainInput = {
  primaryLocation: null,
  secondaryLocations: [],
  intensity: null,
  qualities: [],
  onset: null,
  durationDays: null,
  aggravators: [],
  relievers: [],
  freeText: ""
};

/**
 * Metadata for a file the user uploaded. The file bytes themselves live in
 * object storage (backend-side) — we keep only the pointer and provenance
 * here so the client state is never holding PHI blobs past upload.
 */
export type UploadedFileCategory =
  | "imaging_report"   // radiology narrative, PDF
  | "imaging_dicom"    // raw imaging (MRI/CT/X-ray)
  | "imaging_photo"    // user-captured photo of a printed scan
  | "clinical_note"    // referral letter, consult note
  | "lab_report"
  | "other";

export type UploadStatus =
  | "queued"
  | "uploading"
  | "uploaded"
  | "processing"   // handed off to Extractor/VLM
  | "failed";

export interface UploadedFileMeta {
  /** Client-side UUID — stable across the upload lifecycle. */
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  category: UploadedFileCategory;
  uploadedAt: string; // ISO 8601
  status: UploadStatus;
  /** Server-issued opaque key, populated once the upload completes. */
  storageKey?: string;
  /** User-supplied note (e.g., "MRI from April 2025"). */
  note?: string;
  /** Set when status === "failed". */
  error?: string;
}

/**
 * Top-level intake record. Carries the full user-reported picture plus the
 * outputs of each agent as they run. The `status` field is the HITL
 * state machine — no exercise plan is surfaced until status reaches
 * `plan_ready` AND a clinician has cleared it (handled server-side).
 */
export type IntakeStatus =
  | "draft"                     // user still filling the form
  | "submitted"                 // sent to orchestrator
  | "triaging"                  // Agent 2 running
  | "halted_red_flag"           // Agent 2 hit a critical keyword — no plan
  | "extracting"                // Agent 1 running on files
  | "retrieving"                // Agent 3 querying RAG
  | "pending_clinical_review"   // plan drafted, awaiting human sign-off
  | "plan_ready"                // released to user
  | "failed";

export interface IntakeSubmission {
  id: string;
  createdAt: string;            // ISO 8601
  status: IntakeStatus;
  subjective: SubjectivePainInput;
  files: UploadedFileMeta[];
  /** Filled by the agent pipeline; all optional here. */
  extracted?: import("./agents").ExtractedClinicalPayload;
  triage?: import("./agents").TriageResult;
  plan?: import("./agents").RehabPlan;
}
