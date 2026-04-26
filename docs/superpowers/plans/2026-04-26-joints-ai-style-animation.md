# Joints.AI Style & Animation Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add visual polish to Joints.AI with anatomical-themed backgrounds and moderate animations

**Architecture:** Create reusable animation components using Framer Motion (already in project), add anatomical SVG backgrounds, implement scroll-triggered animations throughout the landing page

**Tech Stack:** Next.js 14, Framer Motion 11, Tailwind CSS, TypeScript

---

## File Structure

### New Files to Create
- `components/ui/fade-in.tsx` - Reusable scroll-triggered fade-in animation component
- `components/ui/animated-card.tsx` - Reusable card with hover animations
- `components/layout/anatomical-background.tsx` - Anatomical SVG background component
- `public/anatomy/skeleton.svg` - Skeleton silhouette SVG (public folder)

### Files to Modify
- `app/page.tsx` - Main landing page with animations
- `app/globals.css` - Additional CSS utilities and animation keyframes
- `tailwind.config.ts` - Add animation utilities

---

## Implementation Tasks

### Task 1: Create Reusable Fade-In Animation Component

**Files:**
- Create: `components/ui/fade-in.tsx`

- [ ] **Step 1: Create fade-in component**

```tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  duration?: number;
}

const directionVariants = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
  none: { x: 0, y: 0 }
};

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.5
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionVariants[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/fade-in.tsx
git commit -m "feat: add reusable FadeIn animation component"
```

---

### Task 2: Create Reusable Animated Card Component

**Files:**
- Create: `components/ui/animated-card.tsx`

- [ ] **Step 1: Create animated card component**

```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEnabled?: boolean;
}

export function AnimatedCard({
  children,
  className = "",
  hoverEnabled = true
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={hoverEnabled ? { y: -4, scale: 1.01 } : undefined}
      whileTap={hoverEnabled ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ui/animated-card.tsx
git commit -m "feat: add reusable AnimatedCard component with hover effects"
```

---

### Task 3: Add Custom Animation Keyframes to Tailwind/CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add custom animations to globals.css**

```css
/* Floating animation for background elements */
@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(2deg);
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    opacity: 0.15;
  }
  50% {
    opacity: 0.25;
  }
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 4s ease-in-out infinite;
}

.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat: add custom animation keyframes (float, pulse-subtle, breathe)"
```

---

### Task 4: Create Anatomical Background Component

**Files:**
- Create: `components/layout/anatomical-background.tsx`

- [ ] **Step 1: Create anatomical background component**

```tsx
"use client";

interface AnatomicalBackgroundProps {
  variant?: "skeleton" | "spine" | "joints";
  className?: string;
}

export function AnatomicalBackground({
  variant = "skeleton",
  className = ""
}: AnatomicalBackgroundProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute w-full h-full opacity-[0.08]"
        viewBox="0 0 400 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {variant === "skeleton" && (
          <g transform="translate(100, 50)">
            {/* Skull */}
            <ellipse cx="100" cy="40" rx="35" ry="42" fill="currentColor" className="text-accent" />
            {/* Spine */}
            <path
              d="M100 82 L100 280"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              className="text-accent"
            />
            {/* Ribs */}
            <path d="M100 110 L60 140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 110 L140 140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 145 L55 175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 145 L145 175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 180 L60 200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M100 180 L140 200" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            {/* Pelvis */}
            <path d="M70 220 Q100 240 130 220" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" className="text-accent" />
            {/* Arms */}
            <path d="M60 140 L30 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            <path d="M140 140 L170 220" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-accent" />
            {/* Legs */}
            <path d="M80 250 L70 350 L60 450" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-accent" />
            <path d="M120 250 L130 350 L140 450" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-accent" />
          </g>
        )}
        {variant === "spine" && (
          <g transform="translate(160, 80)">
            {/* Vertebrae stack */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240].map((y, i) => (
              <g key={i} transform={`translate(0, ${y})`}>
                <ellipse cx="40" cy="0" rx="25" ry="8" fill="currentColor" className="text-accent" />
                <rect x="35" y="-12" width="10" height="24" rx="2" fill="currentColor" className="text-accent" />
              </g>
            ))}
          </g>
        )}
        {variant === "joints" && (
          <g transform="translate(120, 150)">
            {/* Shoulder joints */}
            <circle cx="0" cy="0" r="15" fill="currentColor" className="text-accent" />
            <circle cx="160" cy="0" r="15" fill="currentColor" className="text-accent" />
            {/* Hip joints */}
            <circle cx="40" cy="200" r="18" fill="currentColor" className="text-accent" />
            <circle cx="120" cy="200" r="18" fill="currentColor" className="text-accent" />
            {/* Knee joints */}
            <circle cx="35" cy="300" r="12" fill="currentColor" className="text-accent" />
            <circle cx="125" cy="300" r="12" fill="currentColor" className="text-accent" />
          </g>
        )}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/layout/anatomical-background.tsx
git commit -m "feat: add anatomical background component with skeleton, spine, joints variants"
```

---

### Task 5: Enhance Landing Page with Animations and Backgrounds

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update imports in page.tsx**

Add these imports at the top of the file:

```tsx
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnatomicalBackground } from "@/components/layout/anatomical-background";
```

- [ ] **Step 2: Enhance Hero section**

Replace the existing hero with this enhanced version:

```tsx
{/* Hero */}
<section className="relative py-24 overflow-hidden bg-gradient-to-b from-paper via-paper to-accent-soft/20">
  <AnatomicalBackground variant="skeleton" className="animate-pulse-subtle" />
  <div className="container mx-auto px-4 relative z-10 text-center">
    <FadeIn>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-600 text-sm mb-8">
        <Sparkles className="h-4 w-4" />
        AI-Powered Physiotherapy
      </div>
    </FadeIn>
    <FadeIn delay={0.1}>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
        Joints.AI
      </h1>
    </FadeIn>
    <FadeIn delay={0.2}>
      <p className="text-xl md:text-2xl text-slate-600 mb-4 max-w-2xl mx-auto">
        Personalized Exercise Plans for Your Recovery
      </p>
    </FadeIn>
    <FadeIn delay={0.3}>
      <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
        Tell us about your pain or injury, and our AI will create a custom physiotherapy
        program with videos and instructions to help you recover faster.
      </p>
    </FadeIn>
    <FadeIn delay={0.4}>
      <Link href="/signup">
        <Button size="lg" className="text-lg px-8 bg-slate-900 hover:bg-slate-800">
          Start Your Recovery <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </FadeIn>
    <FadeIn delay={0.5}>
      <p className="text-sm text-slate-400 mt-4">Free to start &middot; No credit card required</p>
    </FadeIn>
  </div>
</section>
```

- [ ] **Step 3: Enhance How It Works section**

Replace the How It Works section:

```tsx
{/* How it works */}
<section className="py-20 relative overflow-hidden">
  <AnatomicalBackground variant="spine" className="opacity-[0.05]" />
  <div className="container mx-auto px-4 relative z-10">
    <FadeIn>
      <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
    </FadeIn>
    <div className="grid md:grid-cols-3 gap-8">
      <FadeIn delay={0.1} direction="up">
        <AnimatedCard className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-accent/30 transition-colors">
          <motion.div
            className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <FileText className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">1. Describe Your Issue</h3>
          <p className="text-slate-600">
            Choose to fill a form, chat with our AI, or type freely about your pain or injury.
          </p>
        </AnimatedCard>
      </FadeIn>
      <FadeIn delay={0.2} direction="up">
        <AnimatedCard className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-accent/30 transition-colors">
          <motion.div
            className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Activity className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">2. Get Your Plan</h3>
          <p className="text-slate-600">
            Our system analyzes your input and generates personalized exercises just for you.
          </p>
        </AnimatedCard>
      </FadeIn>
      <FadeIn delay={0.3} direction="up">
        <AnimatedCard className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-accent/30 transition-colors">
          <motion.div
            className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <MessageSquare className="h-8 w-8" />
          </motion.div>
          <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
          <p className="text-slate-600">
            Follow video exercises, mark completion, and adjust based on feedback.
          </p>
        </AnimatedCard>
      </FadeIn>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Enhance Input Methods section**

Replace the Input Methods section:

```tsx
{/* Input methods */}
<section className="py-20 bg-slate-50 relative overflow-hidden">
  <AnatomicalBackground variant="joints" className="opacity-[0.06]" />
  <div className="container mx-auto px-4 relative z-10">
    <FadeIn>
      <h2 className="text-3xl font-bold text-center mb-4">Three Ways to Report Your Issue</h2>
    </FadeIn>
    <FadeIn delay={0.1}>
      <p className="text-center text-slate-600 mb-12">Pick whichever feels most comfortable for you</p>
    </FadeIn>
    <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      <FadeIn delay={0.2} direction="up">
        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Structured Form</h3>
          <p className="text-sm text-slate-600">Step-by-step wizard with body map and dropdowns</p>
        </AnimatedCard>
      </FadeIn>
      <FadeIn delay={0.3} direction="up">
        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Conversational</h3>
          <p className="text-sm text-slate-600">Chat with our AI that asks follow-up questions</p>
        </AnimatedCard>
      </FadeIn>
      <FadeIn delay={0.4} direction="up">
        <AnimatedCard className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer">
          <h3 className="text-lg font-semibold mb-2">Free Text</h3>
          <p className="text-sm text-slate-600">Type your description in your own words</p>
        </AnimatedCard>
      </FadeIn>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Enhance Therapist section**

Replace the Therapist section:

```tsx
{/* Therapist directory */}
<section className="py-20 relative overflow-hidden">
  <AnatomicalBackground variant="skeleton" className="opacity-[0.04]" />
  <div className="container mx-auto px-4 relative z-10">
    <FadeIn>
      <div className="max-w-3xl mx-auto text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-medium mb-4">
          <Stethoscope className="h-3.5 w-3.5" /> Human clinicians, too
        </div>
        <h2 className="text-3xl font-bold mb-3">Pair your plan with a physiotherapist</h2>
        <p className="text-slate-600">
          Inside your account, you&apos;ll find a curated directory of in-person clinics and
          trusted online physiotherapy platforms — from Hinge Health and Sword Health to
          local sports medicine practices.
        </p>
      </div>
    </FadeIn>
    <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      <FadeIn delay={0.1} direction="left">
        <AnimatedCard className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md hover:border-accent/30 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-accent-soft rounded-lg flex items-center justify-center shrink-0">
            <Globe2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">Online physiotherapy platforms</h3>
            <p className="text-sm text-slate-600">
              Virtual 1:1 care, motion-tracking apps, and telehealth services —
              convenient, often insurance-covered.
            </p>
          </div>
        </AnimatedCard>
      </FadeIn>
      <FadeIn delay={0.2} direction="right">
        <AnimatedCard className="bg-white border rounded-lg p-6 flex items-start gap-4 hover:shadow-md hover:border-accent/30 transition-colors cursor-pointer">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
            <Stethoscope className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h3 className="font-semibold mb-1">In-person clinics</h3>
            <p className="text-sm text-slate-600">
              Filter by city and specialty. Great for hands-on manual therapy and
              post-surgical rehab.
            </p>
          </div>
        </AnimatedCard>
      </FadeIn>
    </div>
    <FadeIn delay={0.3}>
      <div className="text-center mt-8">
        <Link href="/signup">
          <Button variant="outline">
            Create an account to browse <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </FadeIn>
  </div>
</section>
```

- [ ] **Step 6: Commit**

```bash
git add app/page.tsx
git commit -m "feat: enhance landing page with animations and anatomical backgrounds"
```

---

### Task 6: Verify Build and Test

**Files:**
- Verify: `npm run build`

- [ ] **Step 1: Run build to verify no errors**

```bash
cd /Volumes/AI_Drive/Code/JointsAI && npm run build
```

Expected: Successful build with no errors

- [ ] **Step 2: Commit**

```bash
git add -A
git commit -m "chore: verify build passes"
```

---

### Task 7: Push to GitHub

**Files:**
- Push: Origin

- [ ] **Step 1: Push changes to GitHub**

```bash
git push origin main
```

Or if on a branch:

```bash
git push origin HEAD
```

- [ ] **Step 2: Summary**

All done! Changes include:
- New FadeIn component for scroll-triggered animations
- New AnimatedCard component with hover effects
- Custom CSS animations (float, pulse-subtle, breathe)
- AnatomicalBackground component with skeleton, spine, joints variants
- Enhanced landing page with all animations and backgrounds
- Build verified successfully

---

## Plan Complete

**Files created:**
- `components/ui/fade-in.tsx`
- `components/ui/animated-card.tsx`
- `components/layout/anatomical-background.tsx`

**Files modified:**
- `app/page.tsx`
- `app/globals.css`

**Tasks completed:** 7

Please review and let me know which execution approach you'd like:
1. **Subagent-Driven** (recommended) - I dispatch a subagent per task
2. **Inline Execution** - Execute tasks in this session

Which approach?