"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnatomicalBackground } from "@/components/layout/anatomical-background";
import { ArrowRight, Activity, FileText, MessageSquare, Sparkles, Stethoscope, Globe2 } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-24 bg-gradient-to-b from-paper via-paper to-accent-soft/20 relative overflow-hidden">
        <AnatomicalBackground variant="skeleton" className="animate-pulse-subtle" />
        <div className="container mx-auto px-4 text-center relative">
          <FadeIn delay={0}>
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

      {/* How it works */}
      <section className="py-20 relative overflow-hidden">
        <AnatomicalBackground variant="spine" className="opacity-[0.05]" />
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedCard>
              <FadeIn delay={0.1} direction="up">
                <div className="text-center p-6">
                  <motion.div 
                    className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <FileText className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">1. Describe Your Issue</h3>
                  <p className="text-slate-600">
                    Choose to fill a form, chat with our AI, or type freely about your pain or injury.
                  </p>
                </div>
              </FadeIn>
            </AnimatedCard>
            <AnimatedCard>
              <FadeIn delay={0.2} direction="up">
                <div className="text-center p-6">
                  <motion.div 
                    className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Activity className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">2. Get Your Plan</h3>
                  <p className="text-slate-600">
                    Our system analyzes your input and generates personalized exercises just for you.
                  </p>
                </div>
              </FadeIn>
            </AnimatedCard>
            <AnimatedCard>
              <FadeIn delay={0.3} direction="up">
                <div className="text-center p-6">
                  <motion.div 
                    className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <MessageSquare className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
                  <p className="text-slate-600">
                    Follow video exercises, mark completion, and adjust based on feedback.
                  </p>
                </div>
              </FadeIn>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Input methods */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <AnatomicalBackground variant="joints" className="opacity-[0.06]" />
        <div className="container mx-auto px-4 relative">
          <FadeIn>
            <h2 className="text-3xl font-bold text-center mb-4">Three Ways to Report Your Issue</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p className="text-center text-slate-600 mb-12">Pick whichever feels most comfortable for you</p>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <AnimatedCard hoverEnabled>
              <FadeIn delay={0.2} direction="up">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Structured Form</h3>
                  <p className="text-sm text-slate-600">Step-by-step wizard with body map and dropdowns</p>
                </div>
              </FadeIn>
            </AnimatedCard>
            <AnimatedCard hoverEnabled>
              <FadeIn delay={0.3} direction="up">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Conversational</h3>
                  <p className="text-sm text-slate-600">Chat with our AI that asks follow-up questions</p>
                </div>
              </FadeIn>
            </AnimatedCard>
            <AnimatedCard hoverEnabled>
              <FadeIn delay={0.4} direction="up">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Free Text</h3>
                  <p className="text-sm text-slate-600">Type your description in your own words</p>
                </div>
              </FadeIn>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* Therapist directory */}
      <section className="py-20 relative overflow-hidden">
        <AnatomicalBackground variant="skeleton" className="opacity-[0.04]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-soft text-accent text-xs font-medium mb-4">
                <Stethoscope className="h-3.5 w-3.5" /> Human clinicians, too
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl font-bold mb-3">Pair your plan with a physiotherapist</h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-slate-600">
                Inside your account, you&apos;ll find a curated directory of in-person clinics and
                trusted online physiotherapy platforms — from Hinge Health and Sword Health to
                local sports medicine practices.
              </p>
            </FadeIn>
          </div>
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <AnimatedCard>
              <FadeIn delay={0.3} direction="left">
                <div className="bg-white border rounded-lg p-6 flex items-start gap-4">
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
                </div>
              </FadeIn>
            </AnimatedCard>
            <AnimatedCard>
              <FadeIn delay={0.4} direction="right">
                <div className="bg-white border rounded-lg p-6 flex items-start gap-4">
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
                </div>
              </FadeIn>
            </AnimatedCard>
          </div>
          <div className="text-center mt-8">
            <FadeIn delay={0.5}>
              <Link href="/signup">
                <Button variant="outline">
                  Create an account to browse <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Joints.AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}