"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Mail, Database, Eye, Lock, Trash2 } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

const sections = [
  {
    icon: Eye,
    title: "Information We Collect",
    content: [
      "When you use Joints.AI, we collect information you provide directly, including:",
      "• Account details (name, email address, date of birth)",
      "• Health and assessment data (pain locations, intensity levels, described symptoms)",
      "• Uploaded medical documents and imaging files",
      "• Exercise feedback and progress reports",
      "• Communication records with licensed clinicians",
    ],
  },
  {
    icon: Database,
    title: "How We Use Your Information",
    content: [
      "We use the collected information to:",
      "• Generate personalized exercise recovery plans tailored to your condition",
      "• Connect you with licensed clinicians in your area",
      "• Improve our AI models through anonymized, aggregated data analysis",
      "• Communicate with you about your recovery progress and plan updates",
      "• Comply with applicable healthcare regulations and legal obligations",
    ],
  },
  {
    icon: Lock,
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your data:",
      "• All data is encrypted in transit (TLS 1.3) and at rest (AES-256)",
      "• Access to health data is restricted to authorized personnel only",
      "• Regular security audits and penetration testing",
      "• Secure authentication via Supabase with session management",
      "• HIPAA-compliant infrastructure and data handling practices",
    ],
  },
  {
    icon: Mail,
    title: "Data Sharing",
    content: [
      "We do not sell your personal information. Data may be shared only in the following circumstances:",
      "• With licensed clinicians you choose to connect with, to facilitate your care",
      "• With service providers who assist in operating our platform (under strict confidentiality agreements)",
      "• When required by law, regulation, or legal process",
      "• In the event of a merger or acquisition, with notice to affected users",
    ],
  },
  {
    icon: Trash2,
    title: "Your Rights",
    content: [
      "You have the right to:",
      "• Access and export all of your personal data at any time via the Settings page",
      "• Correct inaccurate information in your profile",
      "• Request deletion of your account and all associated data",
      "• Opt out of marketing communications at any time",
      "• Withdraw consent for data processing related to non-essential features",
      "Contact support@joints.ai to exercise any of these rights.",
    ],
  },
];

export default function PrivacyPolicyPage() {
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
              <div className="w-14 h-14 rounded-3xl bg-brand-50 flex items-center justify-center shadow-premium">
                <Shield className="h-7 w-7 text-brand-600" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-ink tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
              Last updated: May 5, 2026. This policy describes how Joints.AI Technology Corp. collects, uses, and protects your personal information.
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
          <div className="mt-12 bg-brand-50/50 rounded-3xl border border-brand-100 p-8">
            <h3 className="text-xl font-black text-brand-700 mb-3">Contact Us</h3>
            <p className="text-brand-600 font-medium leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at{" "}
              <a href="mailto:support@joints.ai" className="font-black underline hover:text-brand-700">
                support@joints.ai
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
