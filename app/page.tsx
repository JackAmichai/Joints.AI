"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnatomicalBackground } from "@/components/layout/anatomical-background";
import { 
  ArrowRight, 
  Activity, 
  FileText, 
  MessageSquare, 
  Sparkles, 
  Shield, 
  Zap, 
  HeartPulse,
  Stethoscope,
  Globe2,
  ChevronRight
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-100/30 blur-[120px] rounded-full" />
        <div className="absolute top-[10%] right-[-5%] w-[35%] h-[35%] bg-brand-50/40 blur-[100px] rounded-full" />
      </div>

      {/* Hero */}
      <section className="relative pt-32 pb-24 md:pt-48 md:pb-32">
        <AnatomicalBackground variant="skeleton" className="opacity-[0.03] scale-150" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-sm font-semibold mb-8 border border-brand-100 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Next-Gen AI Physiotherapy
            </div>
          </FadeIn>
          
          <FadeIn delay={0.1}>
            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight text-ink leading-[1.1]">
              Your recovery, <br />
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                reimagined.
              </span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <p className="text-xl md:text-2xl text-ink-muted mb-12 max-w-3xl mx-auto leading-relaxed">
              Experience personalized, AI-driven physiotherapy that adapts to your journey. 
              Safe, professional, and accessible from anywhere.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-10 h-16 rounded-2xl shadow-xl shadow-brand-200/50" variant="default">
                Start Your Recovery <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-lg px-10 h-16 rounded-2xl">
                View Demo
              </Button>
            </Link>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale transition-all hover:grayscale-0">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Shield className="h-5 w-5" /> HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 font-bold text-ink">
                <HeartPulse className="h-5 w-5" /> Clinically Validated
              </div>
              <div className="flex items-center gap-2 font-bold text-ink">
                <Zap className="h-5 w-5" /> Real-time Feedback
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works with Bento Grid */}
      <section className="py-24 bg-slate-50/50 relative">
        <div className="container mx-auto px-6">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-ink mb-4 tracking-tight">A Smarter Path to Health</h2>
              <p className="text-ink-muted text-lg max-w-2xl mx-auto">
                Three simple steps to a personalized recovery plan tailored to your body and goals.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-12 gap-6 max-w-6xl mx-auto">
            <div className="md:col-span-8">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full overflow-hidden group border-none bg-white shadow-premium">
                  <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform group-hover:scale-110 pointer-events-none">
                    <FileText size={180} />
                  </div>
                  <CardHeader className="relative z-10">
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600 shadow-inner">
                      <FileText className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-3xl">1. Smart Assessment</CardTitle>
                    <CardDescription className="text-lg mt-4 max-w-md leading-relaxed">
                      Share your symptoms through our intuitive body map or interactive chat. 
                      Our AI understands the nuance of your pain to build a comprehensive clinical profile.
                    </CardDescription>
                    <div className="mt-8 flex gap-3">
                       <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">Body Map</span>
                       <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">AI Chat</span>
                       <span className="px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">Free Text</span>
                    </div>
                  </CardHeader>
                </Card>
              </AnimatedCard>
            </div>
            
            <div className="md:col-span-4">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full bg-brand-600 text-white border-none shadow-xl shadow-brand-200/50">
                  <CardHeader>
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-white backdrop-blur-sm">
                      <Zap className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-3xl text-white">2. AI Synthesis</CardTitle>
                    <CardDescription className="text-lg mt-4 text-brand-50/80 leading-relaxed">
                      Our proprietary engine analyzes clinical protocols to generate 
                      your optimal exercise routine instantly.
                    </CardDescription>
                    <div className="mt-12 flex items-center gap-2 text-brand-200 font-bold">
                       Analysis complete <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden"><motion.div className="h-full bg-white" initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ duration: 2, repeat: Infinity }} /></div>
                    </div>
                  </CardHeader>
                </Card>
              </AnimatedCard>
            </div>

            <div className="md:col-span-4">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full border-none bg-white shadow-premium">
                  <CardHeader>
                    <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600">
                      <Activity className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-2xl text-ink">3. Guided Recovery</CardTitle>
                    <CardDescription className="mt-4 leading-relaxed">
                      Follow HD video guides and track your progress daily with intelligent adjustments based on your feedback.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </AnimatedCard>
            </div>

            <div className="md:col-span-8">
              <AnimatedCard className="h-full">
                <Card variant="glass" className="h-full overflow-hidden border-brand-100 bg-brand-50/30">
                  <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-3xl font-bold text-ink mb-4">Start your journey today</h3>
                      <p className="text-ink-muted text-lg mb-8">
                        Join users who have accelerated their recovery with Joints.AI.
                      </p>
                      <Link href="/signup">
                        <Button variant="premium" size="lg" className="rounded-2xl h-14 px-8 group">
                          Create Free Account <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-2 gap-4">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-white rounded-3xl shadow-premium flex items-center justify-center"
                      >
                        <Activity className="text-brand-600 h-10 w-10" />
                      </motion.div>
                      <motion.div 
                        animate={{ y: [0, 10, 0] }} 
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="w-24 h-24 bg-brand-600 rounded-3xl shadow-premium flex items-center justify-center translate-y-4"
                      >
                        <Shield className="text-white h-10 w-10" />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Therapist Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="flex-1">
                 <FadeIn direction="left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
                       <Stethoscope className="h-3.5 w-3.5" /> Professional Support
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-ink mb-6 tracking-tight">Human expertise, <br />AI speed.</h2>
                    <p className="text-lg text-ink-muted mb-8 leading-relaxed">
                      While our AI handles the daily guidance, we connect you with certified physiotherapists for complex cases. 
                      Browse our directory of trusted clinics and telehealth providers.
                    </p>
                    <Link href="/signup">
                       <Button variant="outline" className="rounded-xl border-2">
                          Explore Therapist Directory
                       </Button>
                    </Link>
                 </FadeIn>
              </div>
              <div className="flex-1 w-full max-w-md">
                 <FadeIn direction="right">
                    <div className="space-y-4">
                       {[
                         { icon: Globe2, title: "Online Platforms", desc: "Hinge Health, Sword Health, and more." },
                         { icon: Stethoscope, title: "Local Clinics", desc: "Top-rated sports medicine nearby." },
                         { icon: HeartPulse, title: "Specialists", desc: "Direct access to rehab experts." }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-premium group">
                            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm group-hover:bg-brand-600 group-hover:text-white transition-colors">
                               <item.icon className="h-6 w-6" />
                            </div>
                            <div>
                               <h4 className="font-bold text-ink">{item.title}</h4>
                               <p className="text-sm text-ink-muted">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </FadeIn>
              </div>
           </div>
        </div>
      </section>

      {/* Trust Footer */}
      <footer className="py-16 bg-ink text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 border-b border-white/10 pb-12">
            <div>
               <div className="text-3xl font-black mb-4">Joints.AI</div>
               <p className="text-white/60 max-w-xs">Revolutionizing recovery through intelligent exercise prescription.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
               <div className="space-y-4">
                  <h5 className="font-bold uppercase text-xs tracking-widest text-white/40">Product</h5>
                  <ul className="space-y-2">
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">Assessment</Link></li>
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">AI Engine</Link></li>
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">Security</Link></li>
                  </ul>
               </div>
               <div className="space-y-4">
                  <h5 className="font-bold uppercase text-xs tracking-widest text-white/40">Company</h5>
                  <ul className="space-y-2">
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">About</Link></li>
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">Contact</Link></li>
                     <li><Link href="#" className="hover:text-brand-400 transition-colors">Careers</Link></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} JointsAI. All rights reserved.</p>
            <div className="flex gap-6">
               <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
               <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}