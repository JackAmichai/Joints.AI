/**
 * Anatomical region taxonomy used across the body map, the Extractor agent's
 * normalized output, and the RAG retriever's biomechanical lookup keys.
 * Keep this list stable — downstream vector-DB metadata filters key off it.
 */
export const BODY_REGIONS = [
  "cervical_spine",
  "thoracic_spine",
  "lumbar_spine",
  "sacroiliac",
  "shoulder_left",
  "shoulder_right",
  "elbow_left",
  "elbow_right",
  "wrist_left",
  "wrist_right",
  "hand_left",
  "hand_right",
  "hip_left",
  "hip_right",
  "knee_left",
  "knee_right",
  "ankle_left",
  "ankle_right",
  "foot_left",
  "foot_right",
  "jaw",
  "chest",
  "abdomen"
] as const;

export type BodyRegion = (typeof BODY_REGIONS)[number];

export type BodyView = "anterior" | "posterior";

export interface BodyRegionMeta {
  id: BodyRegion;
  label: string;
  view: BodyView | "both";
  /** Joint-level grouping used by the retriever's biomechanical profile index. */
  kinematicGroup:
    | "spine"
    | "shoulder_complex"
    | "upper_limb"
    | "hip_complex"
    | "lower_limb"
    | "axial";
}

export const BODY_REGION_META: Record<BodyRegion, BodyRegionMeta> = {
  cervical_spine:   { id: "cervical_spine",   label: "Neck",            view: "both",      kinematicGroup: "spine" },
  thoracic_spine:   { id: "thoracic_spine",   label: "Upper back",      view: "posterior", kinematicGroup: "spine" },
  lumbar_spine:     { id: "lumbar_spine",     label: "Lower back",      view: "posterior", kinematicGroup: "spine" },
  sacroiliac:       { id: "sacroiliac",       label: "SI joint",        view: "posterior", kinematicGroup: "spine" },
  shoulder_left:    { id: "shoulder_left",    label: "Left shoulder",   view: "both",      kinematicGroup: "shoulder_complex" },
  shoulder_right:   { id: "shoulder_right",   label: "Right shoulder",  view: "both",      kinematicGroup: "shoulder_complex" },
  elbow_left:       { id: "elbow_left",       label: "Left elbow",      view: "both",      kinematicGroup: "upper_limb" },
  elbow_right:      { id: "elbow_right",      label: "Right elbow",     view: "both",      kinematicGroup: "upper_limb" },
  wrist_left:       { id: "wrist_left",       label: "Left wrist",      view: "both",      kinematicGroup: "upper_limb" },
  wrist_right:      { id: "wrist_right",      label: "Right wrist",     view: "both",      kinematicGroup: "upper_limb" },
  hand_left:        { id: "hand_left",        label: "Left hand",       view: "both",      kinematicGroup: "upper_limb" },
  hand_right:       { id: "hand_right",       label: "Right hand",      view: "both",      kinematicGroup: "upper_limb" },
  hip_left:         { id: "hip_left",         label: "Left hip",        view: "both",      kinematicGroup: "hip_complex" },
  hip_right:        { id: "hip_right",        label: "Right hip",       view: "both",      kinematicGroup: "hip_complex" },
  knee_left:        { id: "knee_left",        label: "Left knee",       view: "both",      kinematicGroup: "lower_limb" },
  knee_right:       { id: "knee_right",       label: "Right knee",      view: "both",      kinematicGroup: "lower_limb" },
  ankle_left:       { id: "ankle_left",       label: "Left ankle",      view: "both",      kinematicGroup: "lower_limb" },
  ankle_right:      { id: "ankle_right",      label: "Right ankle",     view: "both",      kinematicGroup: "lower_limb" },
  foot_left:        { id: "foot_left",        label: "Left foot",       view: "both",      kinematicGroup: "lower_limb" },
  foot_right:       { id: "foot_right",       label: "Right foot",      view: "both",      kinematicGroup: "lower_limb" },
  jaw:              { id: "jaw",              label: "Jaw (TMJ)",       view: "anterior",  kinematicGroup: "axial" },
  chest:            { id: "chest",            label: "Chest",           view: "anterior",  kinematicGroup: "axial" },
  abdomen:          { id: "abdomen",          label: "Abdomen",         view: "anterior",  kinematicGroup: "axial" }
};
