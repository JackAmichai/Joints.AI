"use client";

import Link from "next/link";
import { ArrowLeft, Target, Users, Zap, Heart, Globe, Shield } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const values = [
  { icon: Target, title: "Precision Recovery", desc: "Every protocol is calibrated to your unique biomechanical profile, not generic templates." },
  { icon: Users, title: "Clinician-First", desc: "We amplify therapist expertise, never replace it. Human oversight at every critical decision point." },
  { icon: Zap, title: "Real-time Adaptation", desc: "Your feedback loops directly into the engine, adjusting intensity before plateaus form." },
  { icon: Heart, title: "Evidence-Based", desc: "Every exercise recommendation is grounded in peer-reviewed orthopedic rehabilitation research." },
  { icon: Globe, title: "Accessible Care", desc: "Breaking geographic barriers — expert-guided recovery available anywhere, anytime." },
  { icon: Shield, title: "Privacy-First", desc: "Your health data belongs to you. Full export and deletion capabilities at your fingertips." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/50 via-white to-sky-soft/30">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <FadeIn>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 mb-8">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em]">Our Mission</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-ink tracking-tight mb-6 leading-[1.1]">
              Reimagining human<br />
              <span className="text-brand-600">potential</span> through<br />
              biomechanical synthesis.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Joints.AI was built on a simple premise: recovery should be precise, personalized, and accessible to everyone. We combine orthopedic science with adaptive AI to accelerate healing.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="mb-20">
            <h2 className="text-3xl font-black text-ink tracking-tight mb-10">Core Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((v, idx) => (
                <FadeIn key={idx} delay={0.1 * idx}>
                  <div className="bg-white rounded-3xl shadow-premium border border-slate-100/60 p-8 group hover:shadow-xl transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <v.icon className="h-6 w-6 text-brand-600" />
                    </div>
                    <h3 className="text-lg font-black text-ink tracking-tight mb-2">{v.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.5}>
          <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <h2 className="text-3xl font-black mb-4 relative z-10">Ready to begin?</h2>
            <p className="text-brand-100 font-medium text-lg mb-8 relative z-10">
              Start your first assessment and get a personalized recovery plan in minutes.
            </p>
            <Link href="/assess/method" className="relative z-10">
              <span className="inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-50 transition-colors shadow-lg">
                Start Assessment
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
