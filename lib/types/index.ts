import type { BodyRegion } from "./body";

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
  primaryLocation: BodyRegion | null;
  secondaryLocations: BodyRegion[];
  intensity: number | null;
  qualities: PainQuality[];
  onset: PainOnset | null;
  durationDays: number | null;
  aggravators: Aggravator[];
  relievers: Reliever[];
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

export type UploadedFileCategory =
  | "imaging_report"
  | "imaging_dicom"
  | "imaging_photo"
  | "clinical_note"
  | "lab_report"
  | "other";

export type UploadStatus =
  | "queued"
  | "uploading"
  | "uploaded"
  | "processing"
  | "failed";

export interface UploadedFileMeta {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  category: UploadedFileCategory;
  uploadedAt: string;
  status: UploadStatus;
  storageKey?: string;
  note?: string;
  error?: string;
}

export type IntakeStatus =
  | "draft"
  | "submitted"
  | "triaging"
  | "halted_red_flag"
  | "extracting"
  | "retrieving"
  | "pending_clinical_review"
  | "plan_ready"
  | "failed";

export interface IntakeSubmission {
  id: string;
  createdAt: string;
  status: IntakeStatus;
  subjective: SubjectivePainInput;
  files: UploadedFileMeta[];
  extracted?: ExtractedClinicalPayload;
  triage?: TriageResult;
  plan?: RehabPlan;
}

export interface TriageResult {
  disposition: TriageDisposition;
  hits: RedFlagHit[];
  rationale: string;
  evaluatedAt: string;
  evaluatedBy: string;
}

export type TriageDisposition =
  | "proceed"
  | "halt_seek_emergency"
  | "halt_seek_physician"
  | "proceed_with_caution";

export interface RedFlagHit {
  category: string;
  severity: string;
  matchedPhrase: string;
  offset: number;
  userMessage: string;
  disposition: string;
}

export interface ExtractedClinicalPayload {
  primary_location: BodyRegion;
  secondary_locations: BodyRegion[];
  aggravators: Aggravator[];
  relievers: Reliever[];
  measurements: Record<string, number | string>;
  reportedDiagnoses: Array<{
    term: string;
    sourceFileId: string;
    verbatimQuote: string;
  }>;
  provenance: Array<{
    fileId: string;
    extractionModel: string;
    confidence: number;
  }>;
  unclassifiedNotes: string[];
}

export interface RehabPlan {
  id: string;
  generated_at: string;
  phases: PlanPhase[];
  probabilistic_framing?: {
    pattern: string;
    commonly_associated_with: string[];
    confidence: string;
  };
  clinician_reviewed: boolean;
  clinician_note?: string;
}

export interface PlanPhase {
  phase: string;
  summary: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  phase: string;
  target_region: BodyRegion;
  instructions: string[];
  dose: string;
  stop_conditions: string[];
  contraindication_tags: string[];
  media_placeholders?: {
    video?: { caption: string };
    image?: { caption: string };
  };
  citations?: Array<{
    source_title: string;
    chunk_id: string;
    score: number;
  }>;
}