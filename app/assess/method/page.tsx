"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PenLine, ArrowLeft, Activity, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/ui/fade-in";

const METHODS = [
  {
    href: "/assess/location",
    title: "Structured Form",
    description: "Step-by-step wizard with body map and dropdowns",
    icon: FileText,
    color: "bg-brand-600",
    shadow: "shadow-brand-100"
  },
  {
    href: "/assess/chat",
    title: "Conversational",
    description: "Chat with our AI that asks follow-up questions",
    icon: MessageSquare,
    color: "bg-slate-900",
    shadow: "shadow-slate-200"
  },
  {
    href: "/assess/description",
    title: "Free Text",
    description: "Describe your issue in your own words",
    icon: PenLine,
    color: "bg-slate-700",
    shadow: "shadow-slate-100"
  },
];

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="container mx-auto px-6 py-12">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-12 -ml-2 text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-premium mb-8 text-brand-600"
              >
                <Activity className="h-10 w-10" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-ink mb-4 tracking-tight">
                How should we <br /> <span className="text-brand-600">assess you?</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
                Choose the way that feels most natural to you. Our AI will handle the rest.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6">
            {METHODS.map((method, i) => (
              <FadeIn key={method.href} delay={0.1 + i * 0.1} direction="up">
                <Link href={method.href} className="block group">
                  <Card variant="default" className="overflow-hidden border-none shadow-premium hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer">
                    <CardContent className="p-8 flex items-center gap-6">
                      <div className={`w-16 h-16 ${method.color} text-white rounded-2xl flex items-center justify-center shadow-lg ${method.shadow} group-hover:rotate-3 transition-transform`}>
                        <method.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl text-ink mb-1">{method.title}</h3>
                        <p className="text-slate-500 text-base leading-relaxed">
                          {method.description}
                        </p>
                      </div>
                      <ChevronRight className="h-6 w-6 text-slate-300 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <p className="text-center text-slate-400 font-medium text-sm mt-12 px-6">
              All assessment methods use the same clinically-backed synthesis engine to build your personalized plan.
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}