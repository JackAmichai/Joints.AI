"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BodyRegion } from "@/lib/types/body";
import {
  EMPTY_SUBJECTIVE_INPUT,
  type SubjectivePainInput,
  type UploadedFileMeta,
  type Aggravator,
  type Reliever,
  type PainQuality,
  type PainOnset
} from "@/lib/types/intake";

/**
 * Intake draft store. Holds the user's in-progress submission as they move
 * across the three intake screens. Persisted to sessionStorage (NOT local)
 * so a refresh doesn't lose state, but closing the tab clears it —
 * important for PHI hygiene on shared devices.
 *
 * File *contents* are never stored here; only UploadedFileMeta records.
 */

export type IntakeStep = "location" | "description" | "upload" | "review";

export const INTAKE_STEP_ORDER: IntakeStep[] = ["location", "description", "upload", "review"];

interface IntakeState {
  subjective: SubjectivePainInput;
  files: UploadedFileMeta[];
  furthestStep: IntakeStep;
  consentAcknowledged: boolean;

  setPrimaryLocation: (region: BodyRegion | null) => void;
  toggleSecondaryLocation: (region: BodyRegion) => void;

  setIntensity: (value: number | null) => void;
  toggleQuality: (q: PainQuality) => void;
  setOnset: (onset: PainOnset | null) => void;
  setDurationDays: (days: number | null) => void;
  toggleAggravator: (a: Aggravator) => void;
  toggleReliever: (r: Reliever) => void;
  setFreeText: (text: string) => void;

  addFile: (file: UploadedFileMeta) => void;
  updateFile: (id: string, patch: Partial<UploadedFileMeta>) => void;
  removeFile: (id: string) => void;

  setConsent: (v: boolean) => void;
  markStepReached: (step: IntakeStep) => void;
  reset: () => void;
}

const toggle = <T,>(arr: T[], value: T): T[] =>
  arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];

const stepIndex = (s: IntakeStep) => INTAKE_STEP_ORDER.indexOf(s);

export const useIntakeStore = create<IntakeState>()(
  persist(
    (set) => ({
      subjective: EMPTY_SUBJECTIVE_INPUT,
      files: [],
      furthestStep: "location",
      consentAcknowledged: false,

      setPrimaryLocation: (region) =>
        set((s) => ({
          subjective: {
            ...s.subjective,
            primaryLocation: region,
            secondaryLocations: s.subjective.secondaryLocations.filter((r) => r !== region)
          }
        })),

      toggleSecondaryLocation: (region) =>
        set((s) => {
          if (s.subjective.primaryLocation === region) return s;
          return {
            subjective: {
              ...s.subjective,
              secondaryLocations: toggle(s.subjective.secondaryLocations, region)
            }
          };
        }),

      setIntensity: (value) =>
        set((s) => ({ subjective: { ...s.subjective, intensity: value } })),
      toggleQuality: (q) =>
        set((s) => ({ subjective: { ...s.subjective, qualities: toggle(s.subjective.qualities, q) } })),
      setOnset: (onset) =>
        set((s) => ({ subjective: { ...s.subjective, onset } })),
      setDurationDays: (days) =>
        set((s) => ({ subjective: { ...s.subjective, durationDays: days } })),
      toggleAggravator: (a) =>
        set((s) => ({ subjective: { ...s.subjective, aggravators: toggle(s.subjective.aggravators, a) } })),
      toggleReliever: (r) =>
        set((s) => ({ subjective: { ...s.subjective, relievers: toggle(s.subjective.relievers, r) } })),
      setFreeText: (text) =>
        set((s) => ({ subjective: { ...s.subjective, freeText: text } })),

      addFile: (file) => set((s) => ({ files: [...s.files, file] })),
      updateFile: (id, patch) =>
        set((s) => ({
          files: s.files.map((f) => (f.id === id ? { ...f, ...patch } : f))
        })),
      removeFile: (id) => set((s) => ({ files: s.files.filter((f) => f.id !== id) })),

      setConsent: (v) => set({ consentAcknowledged: v }),
      markStepReached: (step) =>
        set((s) => ({
          furthestStep: stepIndex(step) > stepIndex(s.furthestStep) ? step : s.furthestStep
        })),

      reset: () =>
        set({
          subjective: EMPTY_SUBJECTIVE_INPUT,
          files: [],
          furthestStep: "location",
          consentAcknowledged: false
        })
    }),
    {
      name: "joints-ai-intake-draft",
      // sessionStorage so PHI does not outlive the tab
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? window.sessionStorage : (undefined as unknown as Storage)
      ),
      partialize: (state) => ({
        subjective: state.subjective,
        files: state.files,
        furthestStep: state.furthestStep,
        consentAcknowledged: state.consentAcknowledged
      })
    }
  )
);

/**
 * Derived validity per step. Used by the step shell to decide whether
 * "Continue" is enabled and whether the nav can skip ahead.
 */
export function stepIsValid(step: IntakeStep, state: IntakeState): boolean {
  if (step === "location") return state.subjective.primaryLocation !== null;
  if (step === "description") {
    const s = state.subjective;
    return (
      s.intensity !== null &&
      s.onset !== null &&
      (s.qualities.length > 0 || s.freeText.trim().length >= 10)
    );
  }
  if (step === "upload") return true; // optional step
  if (step === "review") return state.consentAcknowledged;
  return false;
}
