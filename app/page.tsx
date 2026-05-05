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
  ChevronRight,
  BrainCircuit,
  Microscope,
  Dna
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="relative overflow-hidden bg-white">
      {/* Dynamic Immersive Hero Section */}
      <section className="relative pt-32 pb-24 md:pt-56 md:pb-40 min-h-screen flex items-center">
        {/* Animated Background Layers */}
        <div className="absolute inset-0 z-0">
           <AnatomicalBackground variant="skeleton" className="opacity-[0.07] scale-150 translate-x-1/4" />
           <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-200/20 blur-[150px] rounded-full" />
           <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-brand-100/30 blur-[120px] rounded-full" />
           <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl">
             <FadeIn delay={0}>
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-brand-100 shadow-sm">
                 <div className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
                 Next-Gen Biomechanical AI
               </div>
             </FadeIn>
             
             <FadeIn delay={0.1}>
               <h1 className="text-7xl md:text-9xl font-black mb-10 tracking-tighter text-ink leading-[0.85]">
                 Recover <br />
                 <span className="bg-gradient-to-r from-brand-600 via-brand-400 to-brand-700 bg-clip-text text-transparent">
                   Smarter.
                 </span>
               </h1>
             </FadeIn>
             
             <FadeIn delay={0.2}>
               <p className="text-xl md:text-3xl text-ink-muted mb-16 max-w-2xl leading-tight font-medium">
                 Experience the first AI-driven recovery platform that synthesizes clinical protocols with your unique biomechanical profile.
               </p>
             </FadeIn>
             
             <FadeIn delay={0.3} className="flex flex-col sm:flex-row items-center gap-6">
               <Link href="/signup">
                 <Button size="lg" className="text-lg px-12 h-20 rounded-3xl shadow-2xl shadow-brand-200/50 bg-brand-600 hover:bg-brand-700 border-none group">
                   Initialize Recovery <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                 </Button>
               </Link>
               <Link href="/login">
                 <Button size="lg" variant="outline" className="text-lg px-12 h-20 rounded-3xl border-2 hover:bg-slate-50 font-black">
                   System Demo
                 </Button>
               </Link>
             </FadeIn>
          </div>
          
          <FadeIn delay={0.5}>
            <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-5xl opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0">
               {[
                 { icon: Shield, label: "HIPAA Compliant" },
                 { icon: HeartPulse, label: "FDA Registered" },
                 { icon: Microscope, label: "Clinical Precision" },
                 { icon: Dna, label: "Genetic Mapping" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-ink">
                    <item.icon className="h-5 w-5 text-brand-600" /> {item.label}
                 </div>
               ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Futuristic Bento Grid Section */}
      <section className="py-32 bg-slate-50/50 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.02]" />
        <div className="container mx-auto px-6 relative z-10">
          <FadeIn>
            <div className="mb-20">
              <h2 className="text-5xl md:text-7xl font-black text-ink mb-6 tracking-tighter">The Architecture of Healing</h2>
              <p className="text-ink-muted text-xl max-w-2xl leading-relaxed font-medium">
                Our synthesis engine analyzes thousands of clinical data points to generate your optimal rehabilitation trajectory.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-12 gap-8">
            {/* Primary Feature Card */}
            <div className="md:col-span-8">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full overflow-hidden group border-none bg-white shadow-premium relative">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] transition-transform group-hover:scale-110 pointer-events-none -mr-10 -mt-10">
                    <BrainCircuit size={300} />
                  </div>
                  <CardContent className="p-10 md:p-16 relative z-10 h-full flex flex-col">
                    <div className="w-16 h-16 bg-brand-50 rounded-3xl flex items-center justify-center mb-10 text-brand-600 shadow-inner group-hover:rotate-6 transition-transform">
                      <BrainCircuit className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                       <h3 className="text-4xl font-black text-ink mb-6 tracking-tight">Neural Protocol Synthesis</h3>
                       <p className="text-xl text-ink-muted leading-relaxed max-w-lg mb-10">
                         Our proprietary AI model maps your symptoms to validated orthopedic patterns, 
                         instantly generating a multi-phase exercise hierarchy tailored to your velocity of recovery.
                       </p>
                    </div>
                    <div className="flex gap-4">
                       {["Joint Stability", "Kinetic Chain", "Force Output"].map(tag => (
                         <span key={tag} className="px-4 py-2 rounded-xl bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            {tag}
                         </span>
                       ))}
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </div>
            
            {/* Highlighted Metric Card */}
            <div className="md:col-span-4">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full bg-brand-600 text-white border-none shadow-2xl shadow-brand-100/50 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 -z-10" />
                  <div className="absolute bottom-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform">
                     <Zap size={150} />
                  </div>
                  <CardContent className="p-10 md:p-12 h-full flex flex-col">
                    <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center mb-10 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                      <Zap className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-black mb-6 tracking-tight">Real-time Recalibration</h3>
                    <p className="text-lg text-brand-100 leading-relaxed mb-12">
                      The system adapts daily. Your feedback loops into the engine, 
                      automatically adjusting volume and intensity to prevent plateaus.
                    </p>
                    <div className="mt-auto pt-10 border-t border-white/10">
                       <div className="flex items-center gap-4">
                          <div className="text-4xl font-black italic">0.2s</div>
                          <div className="text-[10px] font-black text-brand-200 uppercase tracking-widest leading-tight">Processing <br />Latency</div>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </div>

            {/* Support Grid Items */}
            <div className="md:col-span-4">
              <AnimatedCard className="h-full">
                <Card variant="default" className="h-full border-none bg-white shadow-premium group">
                  <CardContent className="p-10">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                      <Activity className="h-7 w-7" />
                    </div>
                    <h4 className="text-2xl font-black text-ink mb-4 tracking-tight">Biometric HUD</h4>
                    <p className="text-ink-muted leading-relaxed">
                      Visualize your recovery with clinical precision. Track joint stability and range of motion over time.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedCard>
            </div>

            <div className="md:col-span-8">
              <AnimatedCard className="h-full">
                <Card variant="glass" className="h-full overflow-hidden border-brand-100 bg-brand-50/40 backdrop-blur-xl group">
                  <div className="p-10 md:p-16 flex flex-col md:flex-row items-center gap-12">
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-4xl font-black text-ink mb-6 tracking-tight">Initialize your protocol.</h3>
                      <p className="text-ink-muted text-xl mb-12 font-medium">
                        Join elite athletes and recovery patients who have unlocked their physical potential with Joints.AI.
                      </p>
                      <Link href="/signup">
                        <Button size="lg" className="rounded-3xl h-16 px-10 group bg-ink text-white hover:bg-slate-800 border-none">
                          Create Free Account <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2" />
                        </Button>
                      </Link>
                    </div>
                    <div className="flex-shrink-0 grid grid-cols-2 gap-6 relative">
                      <motion.div 
                        animate={{ y: [0, -20, 0] }} 
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="w-32 h-32 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center text-brand-600"
                      >
                        <Activity className="h-12 w-12" />
                      </motion.div>
                      <motion.div 
                        animate={{ y: [0, 20, 0] }} 
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="w-32 h-32 bg-brand-600 rounded-[2rem] shadow-2xl flex items-center justify-center text-white translate-y-8"
                      >
                        <Shield className="h-12 w-12" />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </AnimatedCard>
            </div>
          </div>
        </div>
      </section>

      {/* Human Clinician Section - Elite Version */}
      <section className="py-40 relative overflow-hidden bg-ink">
        <div className="absolute inset-0 z-0 opacity-10">
           <AnatomicalBackground variant="joints" className="scale-150" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col lg:flex-row items-center gap-24">
              <div className="flex-1">
                 <FadeIn direction="left">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 text-brand-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 backdrop-blur-sm border border-white/5">
                       <Stethoscope className="h-4 w-4" /> Clinical Human-in-the-Loop
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9]">Human <br /> Expertise.</h2>
                    <p className="text-xl text-white/60 mb-12 leading-relaxed max-w-xl font-medium">
                      While AI drives your daily trajectory, our certified network of physiotherapists is available for 1:1 clinical review, 
                      providing a human fail-safe for your most complex rehabilitation goals.
                    </p>
                    <Link href="/signup">
                       <Button variant="outline" className="rounded-2xl h-16 px-8 border-2 border-white/20 text-white hover:bg-white/5 font-black uppercase tracking-widest text-xs">
                          Access Provider Network
                       </Button>
                    </Link>
                 </FadeIn>
              </div>
              <div className="flex-1 w-full max-w-xl">
                 <FadeIn direction="right">
                    <div className="space-y-6">
                       {[
                         { icon: Globe2, title: "Online Hubs", desc: "Access top-tier telehealth rehab platforms." },
                         { icon: Stethoscope, title: "Local Precision", desc: "Integrated with 500+ physical clinics." },
                         { icon: HeartPulse, title: "Specialist Sync", desc: "Sync your data directly with your physician." }
                       ].map((item, i) => (
                         <div key={i} className="flex items-center gap-6 p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-500/50 transition-all group">
                            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform shrink-0">
                               <item.icon className="h-8 w-8" />
                            </div>
                            <div>
                               <h4 className="text-2xl font-black text-white mb-2">{item.title}</h4>
                               <p className="text-white/40 font-medium">{item.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </FadeIn>
              </div>
           </div>
        </div>
      </section>

      {/* Ultra-Modern Footer */}
      <footer className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-20 mb-20">
            <div className="max-w-xs">
               <div className="text-4xl font-black text-ink tracking-tighter mb-8">Joints<span className="text-brand-600">.AI</span></div>
               <p className="text-slate-400 font-medium leading-relaxed">
                  The architecture of recovery. Reimagining human potential through biomechanical synthesis.
               </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 md:gap-32">
               <div className="space-y-8">
                  <h5 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-300">Technology</h5>
                  <ul className="space-y-4 font-bold text-slate-500">
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">Synthesis Engine</Link></li>
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">Biometric HUD</Link></li>
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">Neural Mapping</Link></li>
                  </ul>
               </div>
               <div className="space-y-8">
                  <h5 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-300">Company</h5>
                  <ul className="space-y-4 font-bold text-slate-500">
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">About System</Link></li>
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">Clinical Hub</Link></li>
                     <li><Link href="#" className="hover:text-brand-600 transition-colors">Contact Terminal</Link></li>
                  </ul>
               </div>
            </div>
          </div>
          <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               &copy; {new Date().getFullYear()} JOINTS AI TECHNOLOGY CORP. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <Link href="#" className="hover:text-brand-600 transition-colors">Privacy Terminal</Link>
               <Link href="#" className="hover:text-brand-600 transition-colors">Legal Protocol</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}