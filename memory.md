# Joints.AI — Working Memory

Shared notebook for the current improvement sweep across the product. Update this file as items move from "todo" to "done" so anyone (human or assistant) picking up the work knows where things stand.

Last updated: 2026-05-05

---

## Goal of this sweep

Bring every page up to the premium design system that landed in recent commits (see `4695c7f`, `6093e2d`, `fdea573`, `ea47aac`), and clean up functional gaps that surfaced during the visual audit.

**Design system tokens** (use these — not default tailwind):
- Typography: `font-black` for headings, `font-medium` for body, `text-ink` (primary) / `text-ink-muted` (secondary) / `slate-400` (eyebrow labels)
- Eyebrow labels: `text-[10px] font-black uppercase tracking-[0.2em] text-slate-400`
- Surfaces: `shadow-premium`, `rounded-2xl` / `rounded-3xl`, `bg-white` cards on `slate-50` headers
- Brand color: `brand-50` (tint), `brand-500/600/700` (action), `brand-100` (border)
- Animation: wrap entrance content in `<FadeIn>` from `components/ui/fade-in.tsx`; use `delay={0.1 * idx}` for staggered lists
- Status palettes: emerald (success), amber (warn), red (error), violet (completed), brand (active)

---

## Done in this sweep

### Round 1
- [x] **app/dashboard/settings/page.tsx** — Full redesign. Sectioned cards with colored icon tiles (brand/violet/emerald/slate). Notification toggles now persist to `localStorage` under key `joints-ai:notification-prefs` with toast confirmation (was previously resetting on refresh). **Account deletion** now signs out the user and displays contact info for support@joints.ai (was previously a half-stub that only showed a toast).
- [x] **app/dashboard/history/page.tsx** — Full redesign. New status badge system (`STATUS_STYLES` map), gradient brand progress bars, premium empty state, staggered FadeIn on plan cards.
- [x] **app/dashboard/clinician/page.tsx** — Typography standardized to `font-black`. **Wired up the previously-inert search input** — now filters by ID, user_id, primary location, and free text via `useMemo`. Replaced "Loading..." text with a proper spinner.
- [x] **app/results/[id]/ResultsClient.tsx** — Polling now caps at `MAX_FAILURES = 3`. Previously polled forever (every 16s) on invalid submission IDs. **Share button** now uses `navigator.share()` with clipboard fallback (was previously inert).

### Round 2
- [x] **app/dashboard/therapists/page.tsx** — Full redesign. Tab-pill layout for online/in-person, premium specialty chips, FadeIn staggered sections, gradient info banner, ShieldCheck footer card.
- [x] **components/therapists/TherapistCard.tsx** — Full redesign. Featured cards now have brand-200 border + brand-100 shadow + floating "Featured" pill. Body uses font-black headings, eyebrow labels for metadata, rounded-3xl card.
- [x] **app/dashboard/onboarding/page.tsx** — Full redesign. Brand gradient background with blurred orbs, rounded step indicators with motion scale, fitness option cards with checkmark animation, success state with spring animation.
- [x] **app/assess/chat/index.tsx** — Full redesign. Chat bubbles with shadow-premium, animated typing indicator (3 pulsing dots), AnimatePresence message entry, gradient header bar, error toast banner. Wired up the previously-unused `error` state to actually display.
- [x] **app/api/conversational/chat/route.ts** — Added 15s timeout via AbortController. Returns 504 with friendly message on timeout instead of hanging.
- [x] **app/api/conversational/start/route.ts** — Same timeout treatment for consistency (start can hang too if backend is dead).

### Round 3
- [x] **components/intake/PainDescriptionForm.tsx** — Full redesign. Premium text area with character counter, gradient submit button, animated validation states, shadow-premium card wrapper.
- [x] **components/intake/FileUpload.tsx** — Full redesign. Glass-morphic dropzone with animated border on drag, file type icons, progress indicators, rounded-3xl card.
- [x] **components/intake/PillGroup.tsx** — Updated to use design tokens (brand-500 selected state, rounded-full pills, font-medium labels).
- [x] **components/intake/IntensitySlider.tsx** — Updated with gradient track, brand-colored thumb, and dynamic color changes based on intensity level.
- [x] **app/dashboard/page.tsx** — Replaced all hardcoded values: `exerciseTrend` computed from week-over-week plan comparison, `progressPercent` computed from completed/total exercises, "Next Protocol" card uses `recentPlans` data dynamically, efficiency % uses `progressPercent`. Fixed TypeScript circular reference error in `useMemo` and `possibly undefined` error on array access.
- [x] **app/page.tsx** — Footer links updated to "Privacy Policy" and "Terms of Service" (from "Privacy Terminal" and "Legal Protocol").
- [x] **components/illustrations/** — Created SVG illustration components (`BodySilhouette`, `JointKnee`, `JointShoulder`, `JointHip`, `JointSpine`, `WaveBackground`) for anatomical visuals.
- [x] **app/(auth)/login/page.tsx & signup/page.tsx** — Split layouts with anatomical illustrations, gradient backgrounds, and premium form styling.

## Verification status (after Round 3)

- `npm run build -- --no-lint` — clean, all 23 routes generate
- All hardcoded dashboard values replaced with dynamic computations
- Account deletion flow now signs out user and provides support contact
- Share button uses Web Share API with clipboard fallback

---

## Still to do

### Verify (confirmed OK)

- [x] `components/intake/PainDescriptionForm.tsx` — Redesigned in Round 3
- [x] `components/intake/BodyMap.tsx` — Already well-designed with proper styling, region hit detection, and view toggle
- [x] `components/intake/FileUpload.tsx` — Redesigned in Round 3
- [x] `components/layout/sidebar.tsx` — Already using design tokens properly (brand-50 active state, shadow-premium, rounded-2xl, font-black)

### Polish opportunities (lower priority)

- [ ] Footer links on landing page (`app/page.tsx`) still point to `#`. Consider creating actual Privacy Policy and Terms of Service pages.
- [ ] `app/results/[id]/ResultsClient.tsx` — AI Insight card has static copy ("Your knee stability has increased by 14%..."). Could be made dynamic based on feedback history.
- [ ] `app/dashboard/page.tsx` — "Export Telemetry" button has no handler. Could wire to data export functionality.

---

## Conventions for collaborators editing this file

- Move items from "Still to do" → "Done in this sweep" as you finish them. Include the file path so someone reading later can find what changed without diffing.
- If you discover a new issue while working, add it to the appropriate "Still to do" subsection rather than fixing silently — it gives the next person context.
- Bump `Last updated` at the top.
