# Joints.AI Visual Redesign — Design Spec

## Overview
Redesign Joints.AI from a plain white clinical site into a visually rich, light & airy website with anatomical SVG illustrations that look realistic and professional.

## Design Direction: Light & Airy, Anatomical (Option B)

### Design Principles
- **Light backgrounds** with flowing gradients (white → soft blue)
- **Detailed anatomical SVGs** that look realistic, not cartoonish
- **Medical-professional feel** with soft blue gradients
- **Subtle animations** — pulse dots on joints, gentle floating elements
- **Maintain clinical trust** — no over-designing, keep it professional

---

## 1. Color Palette Updates

### Extended palette (add to tailwind.config.ts)
- `sky-soft`: `#E8F1FF` — very light blue for section backgrounds
- `sky-50`: `#F5F9FF` — near-white blue
- `teal`: `#0D9488` — accent for exercise/health elements
- `teal-soft`: `#CCFBF1` — light teal background
- `violet`: `#7C3AED` — for progress/achievement elements
- `violet-soft`: `EDE9FE` — light violet background

### Gradient utilities
- `gradient-hero`: `from-sky-50 via-white to-sky-soft`
- `gradient-card-blue`: `from-sky-soft to-white`
- `gradient-card-teal`: `from-teal-soft/60 to-white`

---

## 2. SVG Components (new directory: `components/illustrations/`)

### `BodySilhouette.tsx`
- Full-body anatomical figure with realistic proportions
- Visible spine with natural S-curve (cervical, thoracic, lumbar)
- Subtle muscle group outlines (not filled)
- Clean bone structure hints (ribs, pelvis outline)
- Joints highlighted with circles: shoulder, elbow, wrist, hip, knee, ankle, spine points
- Props: `className`, `animated` (toggles pulse effects on joints)
- Size: responsive via viewBox, default 200x500

### `JointKnee.tsx`, `JointShoulder.tsx`, `JointHip.tsx`, `JointSpine.tsx`
- Detailed individual joint illustrations
- Show: bone ends, cartilage space, ligament hints, joint capsule
- Style: clean line art with subtle fills, medical textbook aesthetic
- Each uses proper anatomical proportions and shapes
- Props: `className`, `size`

### `WaveBackground.tsx`
- Reusable flowing wave SVG pattern
- 2-3 overlapping wave paths with different opacities
- Props: `color` (default accent), `className`

### `DotGridBackground.tsx`
- Subtle dot grid pattern for section backgrounds
- Props: `spacing`, `dotSize`, `color`, `className`

### `AnimatedJointDot.tsx`
- Pulsing highlight circle for joint positions
- Uses Framer Motion for scale + opacity animation
- Props: `x`, `y`, `color`, `delay`

---

## 3. Landing Page (app/page.tsx)

### Hero Section
- Background: `bg-gradient-to-b from-sky-50 via-white to-sky-soft/30`
- Left side: hero text (badge, title, subtitle, CTA)
- Right side: `BodySilhouette` at ~50% opacity, positioned bottom-right
- Animated joint pulse dots at shoulder, knee, hip positions
- Subtle `WaveBackground` at bottom edge
- Small floating geometric shapes (circles, plus signs) with float animation

### How It Works Section
- Background: white with subtle `DotGridBackground`
- Step cards get enhanced visual treatment:
  - Each card has a colored icon badge with gradient background
  - Card borders have subtle colored left edge
  - Numbers (1, 2, 3) in large light text behind icons
- Animated SVG connector line between cards (desktop only)

### Input Methods Section
- Background: soft blue gradient
- Each card gets a small illustrative SVG icon
- Hover state: subtle blue glow border

### Therapist Section
- Background: white with low-opacity spine SVG
- Cards get colored icon badges matching the accent system

### Footer
- Add subtle top wave SVG for visual transition
- Keep simple copyright text

---

## 4. Auth Pages (login & signup)

### Layout: Split Screen
- Left panel (50% on desktop, hidden on mobile): form centered
- Right panel (50% on desktop, full background on mobile): visual panel
  - Background: gradient `from-sky-50 to-sky-soft`
  - `BodySilhouette` centered, ~40% opacity
  - Animated pulse dots at key joints
  - Floating quote/testimonial area at bottom
  - Subtle wave pattern at top edge

### Form Card
- Updated logo: small anatomical SVG + "Joints.AI" text
- Input fields get subtle focus ring (blue)
- Social proof element below form ("Join X users recovering faster")

### Login & Signup share the same layout structure

---

## 5. Dashboard

### Background
- Add subtle `DotGridBackground` to dashboard background
- Top area: thin gradient banner with spine SVG at very low opacity

### Stat Cards
- Each stat card gets a gradient background matching its icon color:
  - Exercises: blue gradient (`from-sky-soft/80 to-white`)
  - Completion: teal gradient (`from-teal-soft/60 to-white`)
  - Streak: amber gradient (`from-yellow-50 to-white`)
  - Plans: violet gradient (`from-violet-soft/60 to-white`)
- Icon badges get gradient backgrounds instead of solid colors
- Subtle left border accent on each card

### Quick Action Cards
- Icons get gradient circular backgrounds
- Hover: subtle shadow lift

### Weekly Progress Chart
- Bars get gradient fill: `from-accent to-teal`
- Add small decorative element (joint icon) in empty state

### Sidebar
- Active nav item: blue gradient background instead of solid dark
- Sidebar logo: updated anatomical SVG
- Subtle hover glow on nav items

---

## 6. Global Styles (globals.css)

### New CSS utilities
```css
.gradient-text-anatomy {
  background: linear-gradient(135deg, #2F6FEB, #0D9488);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.joint-glow {
  box-shadow: 0 0 12px rgba(47, 111, 235, 0.3), 0 0 24px rgba(47, 111, 235, 0.1);
}

.wave-divider {
  height: 40px;
  background-image: url("data:image/svg+xml,...");
}
```

---

## 7. File Structure Changes

```
components/
  illustrations/          # NEW
    BodySilhouette.tsx
    JointKnee.tsx
    JointShoulder.tsx
    JointHip.tsx
    JointSpine.tsx
    WaveBackground.tsx
    DotGridBackground.tsx
    AnimatedJointDot.tsx
  layout/
    anatomical-background.tsx  # KEEP (used by existing assessment flow)
    header.tsx                 # UPDATE (logo, styling)
    sidebar.tsx                # UPDATE (styling)

app/
  page.tsx                    # UPDATE (full visual redesign)
  (auth)/login/page.tsx       # UPDATE (split layout)
  (auth)/signup/page.tsx      # UPDATE (split layout)
  dashboard/page.tsx          # UPDATE (card styling, gradients)

globals.css                   # UPDATE (new utilities, gradients)
tailwind.config.ts            # UPDATE (extended palette)
```

---

## 8. Implementation Plan
1. Add extended colors + gradients to `tailwind.config.ts`
2. Create all SVG illustration components
3. Redesign landing page with new backgrounds and illustrations
4. Redesign auth pages with split layout
5. Update dashboard with gradient cards and visual enhancements
6. Update global styles with new utilities
7. Update header logo and sidebar styling
8. Test responsiveness (mobile/tablet/desktop)
9. Build and verify no errors
10. Push to GitHub and deploy on Vercel
