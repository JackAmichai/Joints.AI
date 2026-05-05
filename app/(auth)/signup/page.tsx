"use client";

import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { Activity, ShieldCheck, HeartPulse, Zap } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { Card } from "@/components/ui/card";
import { BodySilhouette } from "@/components/illustrations/BodySilhouette";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Anatomical Visual/Features */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-ink via-slate-900 to-brand-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0 opacity-20">
           <div className="absolute top-[20%] left-[-10%] w-[70%] h-[70%] bg-brand-600 blur-[150px] rounded-full" />
           <div className="absolute bottom-[10%] right-[-5%] w-[50%] h-[50%] bg-teal-600/30 blur-[120px] rounded-full" />
        </div>

        {/* Anatomical body silhouette */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none">
          <div className="h-[85%] text-brand-400">
            <BodySilhouette animated />
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
           <FadeIn direction="right" delay={0.1}>
              <h2 className="text-5xl font-black text-white mb-12 tracking-tight leading-tight">
                Join the future of <span className="text-brand-400">rehabilitation.</span>
              </h2>
           </FadeIn>

           <div className="space-y-8">
              {[
                { icon: ShieldCheck, title: "Clinical Privacy", desc: "Your health data is encrypted and HIPAA-ready." },
                { icon: HeartPulse, title: "Personalized Care", desc: "Exercises that adapt to your pain levels daily." },
                { icon: Zap, title: "Instant Results", desc: "Get your first plan in less than 2 minutes." }
              ].map((feature, i) => (
                <FadeIn key={i} direction="right" delay={0.2 + i * 0.1}>
                   <div className="flex gap-5">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-brand-400 shrink-0 backdrop-blur-sm">
                         <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                         <h4 className="text-xl font-bold text-white mb-1">{feature.title}</h4>
                         <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                      </div>
                   </div>
                </FadeIn>
              ))}
           </div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 md:px-12 lg:px-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-brand-600" />
        
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
            <h1 className="text-4xl font-black text-ink mb-3 tracking-tight">Create account</h1>
            <p className="text-slate-500 text-lg mb-10">Start your free trial and get your recovery plan today.</p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <SignupForm />
          </FadeIn>

          <FadeIn delay={0.4}>
            <p className="mt-10 text-center text-slate-500 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-600 font-bold hover:underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <p className="mt-12 text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              By creating an account, you agree to our <br />
              <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>.
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
