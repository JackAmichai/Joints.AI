"use client";

import Link from "next/link";
import { ArrowLeft, Scale, UserCheck, ShieldAlert, AlertTriangle, FileText } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const sections = [
  {
    icon: Scale,
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Joints.AI (the \"Service\"), you agree to be bound by these Terms of Service (\"Terms\").",
      "If you do not agree to these Terms, you may not access or use the Service. Joints.AI Technology Corp. reserves the right to modify these Terms at any time, and continued use constitutes acceptance of any changes.",
    ],
  },
  {
    icon: UserCheck,
    title: "Eligibility",
    content: [
      "You must be at least 18 years old to use this Service. By using the Service, you represent and warrant that you meet this requirement.",
      "The Service is intended for individuals seeking orthopedic rehabilitation guidance and is not a substitute for professional medical advice, diagnosis, or treatment.",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Medical Disclaimer",
    content: [
      "Joints.AI provides AI-generated exercise recommendations based on self-reported symptoms. These recommendations are informational only and do not constitute medical advice.",
      "Always consult with a qualified healthcare professional before beginning any exercise program. Discontinue any exercise that causes pain or discomfort and seek medical attention if symptoms worsen.",
      "Joints.AI is not liable for any injury, harm, or adverse outcome resulting from the use of exercise recommendations provided through the Service.",
    ],
  },
  {
    icon: FileText,
    title: "User Responsibilities",
    content: [
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "You agree to provide accurate and complete information during assessment and registration.",
      "You must not upload any content that violates applicable laws or infringes on the rights of third parties.",
      "You agree not to attempt to reverse-engineer, copy, or exploit the Service for commercial purposes without authorization.",
    ],
  },
  {
    icon: AlertTriangle,
    title: "Limitation of Liability",
    content: [
      "To the maximum extent permitted by law, Joints.AI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
      "The Service is provided \"as is\" and \"as available\" without warranties of any kind, either express or implied.",
      "Our total liability shall not exceed the amount you have paid for the Service in the twelve (12) months preceding the claim.",
    ],
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50/50 via-white to-sky-soft/30">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <FadeIn>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-brand-600 transition-colors mb-12"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-3xl bg-slate-100 flex items-center justify-center shadow-premium">
                <Scale className="h-7 w-7 text-slate-700" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-ink tracking-tight mb-4">Terms of Service</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              Last updated: May 5, 2026. These Terms govern your access to and use of the Joints.AI platform and services.
            </p>
          </div>
        </FadeIn>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <FadeIn key={idx} delay={0.1 * idx}>
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100/60 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center">
                    <section.icon className="h-5 w-5 text-slate-600" />
                  </div>
                  <h2 className="text-2xl font-black text-ink tracking-tight">{section.title}</h2>
                </div>
                <div className="space-y-2 text-slate-600 font-medium leading-relaxed">
                  {section.content.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.6}>
          <div className="mt-12 bg-slate-50 rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-black text-slate-700 mb-3">Questions?</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              For questions about these Terms, contact us at{" "}
              <a href="mailto:support@joints.ai" className="font-black text-brand-600 underline hover:text-brand-700">
                support@joints.ai
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
