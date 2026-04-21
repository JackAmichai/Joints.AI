import type {
  PainQuality,
  PainOnset,
  Aggravator,
  Reliever
} from "@/lib/types/intake";

export const PAIN_QUALITY_OPTIONS: Array<{ value: PainQuality; label: string }> = [
  { value: "sharp", label: "Sharp" },
  { value: "dull", label: "Dull" },
  { value: "aching", label: "Aching" },
  { value: "throbbing", label: "Throbbing" },
  { value: "burning", label: "Burning" },
  { value: "stabbing", label: "Stabbing" },
  { value: "tingling", label: "Tingling" },
  { value: "pins_and_needles", label: "Pins & needles" },
  { value: "stiffness", label: "Stiffness" }
];

export const PAIN_ONSET_OPTIONS: Array<{ value: PainOnset; label: string; hint: string }> = [
  { value: "sudden_traumatic", label: "Sudden — after an injury", hint: "e.g., fall, tackle, lift gone wrong" },
  { value: "sudden_atraumatic", label: "Sudden — no clear cause", hint: "woke up with it / appeared without a trigger" },
  { value: "gradual", label: "Gradual onset", hint: "built up over days or weeks" },
  { value: "chronic_recurring", label: "Chronic / recurring", hint: "comes and goes over months or years" },
  { value: "unknown", label: "Not sure", hint: "" }
];

export const AGGRAVATOR_OPTIONS: Array<{ value: Aggravator; label: string }> = [
  { value: "flexion", label: "Bending forward" },
  { value: "extension", label: "Bending backward" },
  { value: "rotation", label: "Twisting" },
  { value: "lateral_flexion", label: "Side-bending" },
  { value: "weight_bearing", label: "Putting weight on it" },
  { value: "sitting_prolonged", label: "Sitting for long" },
  { value: "standing_prolonged", label: "Standing for long" },
  { value: "walking", label: "Walking" },
  { value: "running", label: "Running" },
  { value: "lifting", label: "Lifting" },
  { value: "overhead_reach", label: "Reaching overhead" },
  { value: "gripping", label: "Gripping" },
  { value: "cold_weather", label: "Cold weather" },
  { value: "morning_stiffness", label: "First thing in the morning" },
  { value: "end_of_day", label: "End of the day" },
  { value: "after_exercise", label: "After exercise" },
  { value: "at_rest", label: "At rest" },
  { value: "at_night", label: "At night" }
];

export const RELIEVER_OPTIONS: Array<{ value: Reliever; label: string }> = [
  { value: "rest", label: "Rest" },
  { value: "heat", label: "Heat" },
  { value: "ice", label: "Ice" },
  { value: "movement", label: "Gentle movement" },
  { value: "stretching", label: "Stretching" },
  { value: "nsaids", label: "Over-the-counter pain meds" },
  { value: "position_change", label: "Changing position" },
  { value: "nothing_helps", label: "Nothing helps" }
];
