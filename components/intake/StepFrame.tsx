"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FadeIn } from "@/components/ui/fade-in";

/**
 * Premium frame for assessment steps.
 */
export function StepFrame({
  eyebrow,
  title,
  subtitle,
  children
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-3xl mx-auto w-full px-6 py-8 md:py-12">
      <FadeIn>
        <div className="mb-10 text-center md:text-left">
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4">
              {eyebrow}
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-ink mb-3 tracking-tight leading-tight">
              {title}
           </h1>
           {subtitle && (
             <p className="text-slate-500 text-lg leading-relaxed">
               {subtitle}
             </p>
           )}
        </div>
      </FadeIn>

      <FadeIn delay={0.1} direction="up">
        <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
          <CardContent className="p-8 md:p-12">
            {children}
          </CardContent>
        </Card>
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-xs font-medium">
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              Secure Assessment
           </div>
           <div className="w-1 h-1 rounded-full bg-slate-200" />
           <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
              AI Synthesized
           </div>
        </div>
      </FadeIn>
    </div>
  );
}