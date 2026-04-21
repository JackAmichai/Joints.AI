# TechPhysio Design Specification

## Project Overview

**Product:** TechPhysio — Consumer-facing physiotherapy platform where users report injuries/pain and receive personalized exercise plans with videos.

**Core Value:** Accessible, personalized physiotherapy guidance that empowers injured individuals to understand their condition and follow targeted exercise programs.

---

## 1. Architecture

### Tech Stack
- **Frontend:** Next.js (React) — modern, SEO-friendly
- **Authentication:** Clerk or Supabase Auth — user accounts
- **Database:** PostgreSQL via Supabase — users, history, preferences
- **Content:** Headless CMS (Strapi or Contentful) — exercise library
- **AI:** OpenAI/Anthropic API — intelligent exercise matching
- **Storage:** Supabase Storage — uploaded files, custom videos

### System Diagram
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Next.js   │────▶│  Supabase   │◀────│    CMS     │
│  Frontend   │────▶│   Auth     │     │ (Exercises)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  AI API     │     │  Storage   │     │  YouTube   │
│ (Matching) │     │  (Files)   │     │  (Videos)  │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 2. User Flow

1. **Sign Up/Login** — Create account to save plans
2. **Onboarding** — Optional: age, fitness level, known conditions
3. **Report Issue** — Three input methods:
   - Structured form (select body part → pain type → severity → duration)
   - Conversational (chat with AI asking follow-ups)
   - Free text (describe freely, AI parses)
4. **Review & Confirm** — User sees AI's understanding, can edit
5. **Get Plan** — Generated exercise plan with videos
6. **Track Progress** — Mark exercises complete, log pain levels

---

## 3. Data Model

### Users
| Field | Type |
|-------|------|
| id | UUID |
| email | string |
| name | string |
| age | number? |
| fitness_level | enum (sedentary, moderate, active, athlete) |
| created_at | timestamp |

### Injury Reports
| Field | Type |
|-------|------|
| id | UUID |
| user_id | FK |
| input_method | enum (structured, conversational, free_text) |
| input_data | JSON |
| ai_parsed_data | JSON |
| status | enum |
| created_at | timestamp |

### Exercise Plans
| Field | Type |
|-------|------|
| id | UUID |
| report_id | FK |
| exercises | array |
| generated_at | timestamp |

### Exercises (CMS)
| Field | Type |
|-------|------|
| id | UUID |
| title | string |
| description | string |
| body_parts | array |
| difficulty | enum |
| video_url | string |
| video_type | enum (youtube, custom) |
| duration | string |
| reps | string |
| sets | string |

### Progress Logs
| Field | Type |
|-------|------|
| id | UUID |
| user_id | FK |
| exercise_id | FK |
| completed_at | timestamp |
| pain_level | number (0-10) |
| notes | string? |

---

## 4. Input Methods

### Structured Form
- Step 1: Select body part (head, neck, shoulder, elbow, wrist, back, hip, knee, ankle)
- Step 2: Pain type (sharp, dull, aching, burning, stiffness, weakness)
- Step 3: Severity (1-10 scale with visual slider)
- Step 4: Duration (less than a week, 1-4 weeks, 1-3 months, more than 3 months)
- Step 5: Optional: What makes it worse/better

### Conversational
- AI asks 3-5 follow-up questions based on initial response
- Remembers context within the session
- Example: "I see you mentioned knee pain. Is it the front, back, or side?"

### Free Text
- User types freely: "I hurt my lower back lifting heavy boxes yesterday, it's hard to bend"
- AI extracts structured data using function calling
- Shows user: "Here's what I understood" with edit capability

---

## 5. Exercise Matching Logic

1. **AI analyzes input** (from any of the 3 methods) and maps to:
   - Affected body part(s)
   - Condition type (strain, sprain, chronic, post-surgery, etc.)
   - Severity level
   - Contraindications (what to avoid)

2. **Matching algorithm:**
   - Filter exercise library by body part + condition type
   - Exclude exercises flagged as contraindicated
   - Rank by: appropriateness → difficulty matching user's fitness level → variety
   - Output: 6-10 exercises with progressive difficulty

---

## 6. Output/Plan Details

### Generated Plan Page
- Exercise thumbnail + title
- Video (embedded YouTube or custom player)
- Text instructions
- Duration, reps, sets
- Difficulty tag
- "Start Exercise" button → modal with video + timer

### Export Options
- **Print** — Clean formatted PDF layout
- **Watch on site** — All videos in playlist style
- **Both** — Embedded videos + downloadable PDF

### Progression
- Plans adjust based on completion feedback
- "Too easy" / "Too hard" feedback adjusts next plan

---

## 7. Existing Codebase Assets

The codebase already has:
- `lib/types/body.ts` — Body region taxonomy (28 regions with kinematics)
- `lib/types/intake.ts` — Intake types, pain qualities, onset types
- `lib/types/agents.ts` — Agent contracts (Extractor, Triage, RAG)
- `lib/types/redFlags.ts` — Red flag detection system
- `lib/store/intakeStore.ts` — Zustand store for intake form state
- Tailwind config, PostCSS, ESLint configured
- Next.js 14.2.15 setup

---

## 8. Deliverables

### Phase 1: Foundation
- [ ] Auth system (Clerk or Supabase Auth)
- [ ] Database schema and migrations
- [ ] CMS integration for exercise library
- [ ] Basic user onboarding

### Phase 2: Intake System
- [ ] Structured form UI
- [ ] Conversational interface
- [ ] Free text input with AI parsing
- [ ] Review/confirmation screen

### Phase 3: Exercise Generation
- [ ] AI matching logic
- [ ] Plan generation from exercises
- [ ] PDF export

### Phase 4: Video & Progress
- [ ] Video player integration
- [ ] Progress tracking
- [ ] Feedback system

---

## 9. Acceptance Criteria

- [ ] Users can sign up and log in
- [ ] Users can report their issue using any of the 3 methods
- [ ] AI correctly parses user input into structured data
- [ ] Users receive personalized exercise plans (6-10 exercises)
- [ ] Plans include video instructions (YouTube + custom)
- [ ] Users can print/download PDF plans
- [ ] Users can track progress over time
- [ ] "Too easy" / "Too hard" feedback adjusts future plans