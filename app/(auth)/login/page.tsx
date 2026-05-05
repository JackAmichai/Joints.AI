"use client";

import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";
import { Activity, ChevronLeft, Quote } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-600" />
        
        <div className="max-w-md w-full mx-auto">
          <FadeIn direction="down" delay={0.1}>
            <Link href="/" className="inline-flex items-center gap-2 group mb-12">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-lg shadow-brand-200">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter text-ink">
                Joints<span className="text-brand-600">.AI</span>
              </span>
            </Link>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="text-4xl font-black text-ink mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 text-lg mb-10">Sign in to continue your personalized recovery journey.</p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <LoginForm />
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mt-10 text-center text-slate-500 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-brand-600 font-bold hover:underline underline-offset-4">
                Create one for free
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Right Side - Visual/Social Proof */}
      <div className="hidden lg:flex flex-1 bg-slate-50 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
           <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-100/40 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-50 blur-[100px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-lg">
           <FadeIn direction="up" delay={0.5}>
              <Card variant="glass" className="p-10 border-none bg-white/60 backdrop-blur-xl shadow-premium">
                 <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-brand-100">
                    <Quote className="h-6 w-6" />
                 </div>
                 <p className="text-2xl font-bold text-ink leading-relaxed mb-8">
                    "Joints.AI helped me recover from my ACL injury 3 weeks faster than expected. The AI adjustments were spot on."
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200" />
                    <div>
                       <div className="font-bold text-ink">Sarah Jenkins</div>
                       <div className="text-sm text-slate-500 font-medium">Recovered Athlete</div>
                    </div>
                 </div>
              </Card>
           </FadeIn>

           <div className="mt-12 grid grid-cols-2 gap-4">
              <FadeIn direction="up" delay={0.6}>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-3xl font-black text-brand-600 mb-1">2k+</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active Users</div>
                 </div>
              </FadeIn>
              <FadeIn direction="up" delay={0.7}>
                 <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-3xl font-black text-brand-600 mb-1">98%</div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Satisfaction</div>
                 </div>
              </FadeIn>
           </div>
        </div>
      </div>
    </div>
  );
}