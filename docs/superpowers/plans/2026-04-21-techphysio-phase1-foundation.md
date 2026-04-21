# TechPhysio Phase 1: Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the core infrastructure: authentication, database, CMS integration, and basic app structure.

**Architecture:** Next.js 14 with App Router, Supabase for auth/database/storage, Zustand for state management, Tailwind for styling.

**Tech Stack:** Next.js 14, Supabase (Auth, Database, Storage), Zustand, Tailwind CSS, Framer Motion, Lucide React

---

## File Structure Overview

```
/Volumes/AI_Drive/Code/TechPhysio/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth routes (login, signup)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard home
│   │   └── intake/               # Intake flow
│   │       ├── page.tsx          # Intake wizard
│   │       ├── location/page.tsx
│   │       ├── description/page.tsx
│   │       ├── upload/page.tsx
│   │       └── review/page.tsx
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── exercises/route.ts
│   │   ├── plans/route.ts
│   │   └── intake/route.ts
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── auth/                     # Auth components
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── intake/                   # Intake flow components
│   │   ├── body-map.tsx
│   │   ├── pain-slider.tsx
│   │   ├── file-uploader.tsx
│   │   └── ...
│   ├── exercises/                # Exercise components
│   │   ├── exercise-card.tsx
│   │   ├── exercise-player.tsx
│   │   └── plan-viewer.tsx
│   └── layout/
│       ├── header.tsx
│       ├── footer.tsx
│       └── sidebar.tsx
├── lib/
│   ├── supabase/                 # Supabase client
│   │   └── client.ts
│   ├── auth/                     # Auth utilities
│   │   └── config.ts
│   ├── exercises/                # Exercise library (CMS client)
│   │   └── client.ts
│   └── ai/                       # AI utilities
│       └── client.ts
├── store/
│   ├── authStore.ts
│   └── exerciseStore.ts
├── types/                        # Already exists
├── public/
│   └── images/
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

---

## Task 1: Supabase Setup & Database Schema

**Files:**
- Create: `supabase/migrations/001_initial_schema.sql`
- Create: `lib/supabase/client.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Create database migration**

```sql
-- supabase/migrations/001_initial_schema.sql

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  age INTEGER,
  fitness_level TEXT CHECK (fitness_level IN ('sedentary', 'moderate', 'active', 'athlete')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Injury Reports
CREATE TABLE public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  input_method TEXT CHECK (input_method IN ('structured', 'conversational', 'free_text')),
  input_data JSONB DEFAULT '{}',
  ai_parsed_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise Plans
CREATE TABLE public.plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id UUID REFERENCES public.reports(id) NOT NULL,
  exercises JSONB DEFAULT '[]',
  generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress Logs
CREATE TABLE public.progress_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  plan_id UUID REFERENCES public.plans(id),
  exercise_id TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  notes TEXT,
  feedback TEXT CHECK (feedback IN ('too_easy', 'just_right', 'too_hard'))
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own reports" ON public.reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own plans" ON public.plans FOR SELECT USING (EXISTS (SELECT 1 FROM public.reports WHERE id = plan_id AND user_id = auth.uid()));

CREATE POLICY "Users can view own progress" ON public.progress_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert progress" ON public.progress_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);
CREATE POLICY "Users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.uid() = (storage.foldername(name))[1]);
CREATE POLICY "Users can view uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
```

- [ ] **Step 2: Create Supabase client**

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getSupabaseAuth = () => supabase.auth;
```

- [ ] **Step 3: Create .env.local.example**

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth (optional - can use Supabase Auth directly)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
# CLERK_SECRET_KEY=your-clerk-secret

# AI
OPENAI_API_KEY=sk-your-openai-key
```

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/001_initial_schema.sql lib/supabase/client.ts .env.local.example
git commit -m "feat: add Supabase database schema and client"
```

---

## Task 2: Authentication System

**Files:**
- Modify: `package.json` (add @supabase/auth-helpers-nextjs)
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/(auth)/login/page.tsx`
- Create: `app/(auth)/signup/page.tsx`
- Create: `components/auth/login-form.tsx`
- Create: `components/auth/signup-form.tsx`
- Create: `store/authStore.ts`

- [ ] **Step 1: Install Supabase auth helpers**

```bash
cd /Volumes/AI_Drive/Code/TechPhysio && npm install @supabase/auth-helpers-nextjs @supabase/ssr
```

- [ ] **Step 2: Create auth store**

```typescript
// store/authStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  fitness_level?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: "techphysio-auth",
    }
  )
);
```

- [ ] **Step 3: Create login page**

```tsx
// app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create login form component**

```tsx
// components/auth/login-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", data.user.id)
        .single();

      setUser({
        id: data.user.id,
        email: data.user.email!,
        ...profile,
      });
    }

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 5: Create signup page**

```tsx
// app/(auth)/signup/page.tsx
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <SignupForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Create signup form component**

```tsx
// components/auth/signup-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email,
        full_name: fullName,
      });

      setUser({
        id: data.user.id,
        email,
        full_name: fullName,
      });
    }

    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 7: Create auth middleware**

```typescript
// middleware.ts (in app root)
import { createMiddlewareClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
```

- [ ] **Step 8: Commit**

```bash
git add package.json store/authStore.ts app/\(auth\)/ components/auth/ middleware.ts
git commit -m "feat: add authentication system with Supabase Auth"
```

---

## Task 3: UI Components Library

**Files:**
- Create: `components/ui/button.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/label.tsx`
- Create: `components/ui/slider.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/ui/checkbox.tsx`
- Create: `components/ui/textarea.tsx`
- Create: `components/ui/dialog.tsx`
- Create: `components/ui/progress.tsx`

- [ ] **Step 1: Create button component**

```tsx
// components/ui/button.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-slate-900 text-white hover:bg-slate-800": variant === "default",
            "border border-slate-300 bg-transparent hover:bg-slate-100": variant === "outline",
            "hover:bg-slate-100": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600": variant === "destructive",
            "h-10 px-4 py-2": size === "default",
            "h-9 rounded-md px-3": size === "sm",
            "h-11 rounded-md px-8": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
```

- [ ] **Step 2: Create input component**

```tsx
// components/ui/input.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
```

- [ ] **Step 3: Create card component**

```tsx
// components/ui/card.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={clsx("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={clsx("p-6 pt-0", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return <div className={clsx("flex items-center p-6 pt-0", className)} {...props} />;
}
```

- [ ] **Step 4: Create remaining UI components (label, slider, badge, select, checkbox, textarea, dialog, progress)**

```tsx
// components/ui/label.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
      {...props}
    />
  )
);
Label.displayName = "Label";
```

```tsx
// components/ui/slider.tsx
"use client";

import * as React from "react";
import { clsx } from "clsx";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export function Slider({ value, onChange, min = 0, max = 10, step = 1, label }: SliderProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}: {value}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
```

```tsx
// components/ui/badge.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        {
          "border-transparent bg-slate-900 text-slate-50": variant === "default",
          "border-transparent bg-slate-100 text-slate-900": variant === "secondary",
          "text-slate-950": variant === "outline",
          "border-transparent bg-red-500 text-slate-50": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
```

```tsx
// components/ui/select.tsx
"use client";

import * as React from "react";
import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder = "Select...", label }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-950"
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
}
```

```tsx
// components/ui/checkbox.tsx
"use client";

import * as React from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <div
        className={clsx(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
          checked ? "bg-slate-900 border-slate-900" : "border-slate-300 bg-white"
        )}
        onClick={() => onChange(!checked)}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
      {label && <span className="text-sm">{label}</span>}
    </label>
  );
}
```

```tsx
// components/ui/textarea.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={clsx(
        "flex min-h-[80px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
```

```tsx
// components/ui/dialog.tsx
"use client";

import * as React from "react";
import { clsx } from "clsx";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
```

```tsx
// components/ui/progress.tsx
import * as React from "react";
import { clsx } from "clsx";

export interface ProgressProps {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100 }: ProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full bg-slate-900 transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add components/ui/
git commit -m "feat: add UI component library (button, input, card, slider, etc.)"
```

---

## Task 4: Landing Page & Dashboard Layout

**Files:**
- Modify: `app/page.tsx`
- Create: `app/layout.tsx`
- Create: `components/layout/header.tsx`
- Create: `app/(dashboard)/layout.tsx`
- Create: `app/(dashboard)/page.tsx`

- [ ] **Step 1: Create header component**

```tsx
// components/layout/header.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { User, LogOut, Menu } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          TechPhysio
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update root layout**

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";

export const metadata: Metadata = {
  title: "TechPhysio - Personalized Physiotherapy Exercises",
  description: "Get personalized exercise programs based on your injury or pain. Professional physiotherapy guidance at home.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <Header />
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Create landing page**

```tsx
// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, FileText, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Personalized Exercise Plans for Your Recovery
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Tell us about your pain or injury, and we'll create a custom physiotherapy
            program with videos and instructions to help you recover.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your Recovery <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Describe Your Issue</h3>
              <p className="text-slate-600">
                Choose to fill a form, chat with our AI, or type freely about your pain or injury.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Your Plan</h3>
              <p className="text-slate-600">
                Our system analyzes your input and generates personalized exercises just for you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
              <p className="text-slate-600">
                Follow video exercises, mark completion, and adjust based on feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Input methods */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Three Ways to Report Your Issue</h2>
          <p className="text-center text-slate-600 mb-12">Pick whichever feels most comfortable for you</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Structured Form</h3>
              <p className="text-sm text-slate-600">Step-by-step wizard with body map and dropdowns</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Conversational</h3>
              <p className="text-sm text-slate-600">Chat with our AI that asks follow-up questions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Free Text</h3>
              <p className="text-sm text-slate-600">Type your description in your own words</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 TechPhysio. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
```

- [ ] **Step 4: Create dashboard layout**

```tsx
// app/(dashboard)/layout.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      setUser({
        id: session.user.id,
        email: session.user.email!,
      });
      setLoading(false);
    };
    initAuth();
  }, [router, setUser, setLoading]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

- [ ] **Step 5: Create sidebar component**

```tsx
// components/layout/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Home, Plus, History, Settings, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/intake", icon: Plus, label: "New Assessment" },
  { href: "/dashboard/history", icon: History, label: "History" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r bg-slate-50 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">TechPhysio</h1>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-slate-200 text-slate-900"
                : "text-slate-600 hover:bg-slate-100"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:bg-slate-100 w-full"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Create dashboard home page**

```tsx
// app/(dashboard)/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, History, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Welcome Back</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/intake">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <Plus className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">New Assessment</h3>
                  <p className="text-sm text-slate-500">Report a new pain or injury</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Your Plans</h3>
                <p className="text-sm text-slate-500">View past assessments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Progress</h3>
                <p className="text-sm text-slate-500">Track your recovery</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4">Recent Plans</h2>
      <Card>
        <CardContent className="p-6">
          <p className="text-slate-500">No plans yet. Start a new assessment to get your personalized exercise program.</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

- [ ] **Step 7: Add globals.css**

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply antialiased;
}
```

- [ ] **Step 8: Commit**

```bash
git add app/ components/layout/ app/globals.css
git commit -m "feat: add landing page and dashboard layout"
```

---

## Task 5: Basic TypeScript Check

- [ ] **Step 1: Run typecheck**

```bash
cd /Volumes/AI_Drive/Code/TechPhysio && npm run typecheck
```

- [ ] **Step 2: Fix any type errors**

- [ ] **Step 3: Commit**

```bash
git commit -m "fix: resolve type errors"
```

---

## Phase 1 Completion Checklist

- [ ] Database schema created with migrations
- [ ] Supabase client configured
- [ ] Authentication system (login/signup)
- [ ] Auth middleware for protected routes
- [ ] UI component library (12 components)
- [ ] Landing page
- [ ] Dashboard layout with sidebar
- [ ] Dashboard home page
- [ ] TypeScript checks pass
