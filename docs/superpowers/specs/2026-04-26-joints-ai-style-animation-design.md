# Joints.AI Style & Animation Enhancement Design

**Date**: 2026-04-26
**Status**: Draft - awaiting approval

---

## Overview

Add visual polish to Joints.AI with anatomical-themed backgrounds and moderate animations to create a premium, engaging experience that reinforces the physiotherapy/rehabilitation domain.

## Visual Style

**Clinical/Anatomical** - A clean, professional medical feel with:
- Anatomical illustrations showing skeleton, joints, and body regions
- Subtle gradient overlays on background sections
- Color palette: white/light backgrounds with clinical accent colors (#2F6FEB blue accent)
- Professional typography with clear hierarchy

## Animation Strategy

**Moderate/Noticeable** animations that:
- Draw attention to key sections
- Make the site feel dynamic and premium
- Include staggered reveals for lists and grids
- Subtle hover effects on interactive elements
- Scroll-triggered animations using Framer Motion

---

## Implementation Plan

### 1. Hero Section Enhancement

**Current**: Basic gradient with text
**New**: 
- Anatomical skeleton/joint SVG illustration as subtle background (15% opacity)
- Gradient overlay: `bg-gradient-to-br from-white via-transparent to-blue-50/30`
- Staggered text entrance animation using Framer Motion
- Floating silhouette element with subtle animation

### 2. How It Works Section

**Current**: Static cards with icons
**New**:
- Icon animation on hover (subtle pulse/bounce)
- Card lift effect on hover with shadow expansion
- Staggered fade-in on scroll
- Animated background pattern (subtle dots or lines)

### 3. Input Methods Section

**Current**: Simple cards
**New**:
- Card hover lift with border glow effect
- Animated gradient border on hover
- Staggered reveal animation
- Subtle geometric background pattern

### 4. Therapist Section

**Current**: Basic two-column layout
**New**:
- Reveal animation on scroll
- Card hover states with slight scale
- Animated connection lines or icons
- Human clinician badge with subtle pulse

### 5. Global Enhancements

- Add Framer Motion for scroll-triggered animations
- Create reusable animation components
- Add smooth page transitions
- Implement consistent motion tokens in CSS

---

## Technical Notes

- Use Framer Motion (already in project) for animations
- Create anatomical SVG illustrations or use public domain images
- Ensure animations respect `prefers-reduced-motion`
- Mobile-friendly animation (adjust or disable on small screens)

---

## Success Criteria

1. Hero has anatomical background with gradient overlay
2. All sections have scroll-triggered animations
3. Hover effects work on all interactive elements
4. Site feels dynamic but professional
5. Respects accessibility (reduced motion)