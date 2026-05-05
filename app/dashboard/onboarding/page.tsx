"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { authedFetch } from "@/lib/api/authedFetch";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/ui/fade-in";
import { motion } from "framer-motion";
import { ArrowRight, Check, Activity, Sparkles, ArrowLeft } from "lucide-react";

interface OnboardingData {
  fullName: string;
  age: string;
  fitnessLevel: string;
  knownConditions: string[];
}

const FITNESS_OPTIONS = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "moderate", label: "Moderate", description: "Some exercise 1–3x/week" },
  { value: "active", label: "Active", description: "Regular exercise 3–5x/week" },
  { value: "athlete", label: "Athlete", description: "Intense exercise daily" },
];

const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: user?.full_name || "",
    age: user?.age?.toString() || "",
    fitnessLevel: user?.fitness_level || "",
    knownConditions: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await authedFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          full_name: data.fullName,
          age: data.age,
          fitness_level: data.fitnessLevel,
          known_conditions: data.knownConditions,
        }),
      });

      if (res.ok) {
        localStorage.setItem("onboarding_complete", "true");
        setUser({
          ...user,
          full_name: data.fullName,
          age: data.age ? parseInt(data.age, 10) : undefined,
          fitness_level: data.fitnessLevel || undefined,
        });
        toast("Profile saved successfully", "success");
        router.push("/dashboard");
      } else {
        const err = await res.json().catch(() => ({}));
        toast(err.error || "Failed to save profile", "error");
      }
    } catch (error) {
      console.error("Onboarding save error:", error);
      toast("Failed to save profile", "error");
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return data.fullName.trim().length > 0;
    if (step === 2) return data.fitnessLevel.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50/40 via-white to-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-100/40 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-brand-50/60 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-lg w-full relative z-10">
        <FadeIn>
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-600 rounded-3xl mb-6 shadow-2xl shadow-brand-200/60">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-brand-100">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-600 animate-pulse" />
              Initialize Profile
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight">
              Welcome to Joints<span className="text-brand-600">.AI</span>
            </h1>
            <p className="text-slate-500 font-medium text-lg mt-2 italic">
              Let&apos;s personalize your recovery system.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s, i) => (
              <div key={s} className="flex items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: s === step ? 1.05 : 1,
                  }}
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                    s < step
                      ? "bg-brand-600 text-white shadow-lg shadow-brand-200/60"
                      : s === step
                      ? "bg-ink text-white shadow-xl ring-4 ring-brand-100"
                      : "bg-white text-slate-400 border border-slate-100"
                  }`}
                >
                  {s < step ? <Check className="h-5 w-5" /> : s}
                </motion.div>
                {i < 2 && (
                  <div
                    className={`w-12 h-1 rounded-full transition-colors ${
                      s < step ? "bg-brand-600" : "bg-slate-100"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card variant="default" className="border-none shadow-2xl bg-white overflow-hidden">
            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Step {step} of {TOTAL_STEPS}
              </p>
              <h2 className="text-2xl font-black text-ink tracking-tight mt-1">
                {step === 1 && "Tell us about yourself"}
                {step === 2 && "Your fitness background"}
                {step === 3 && "You're all set"}
              </h2>
            </div>
            <CardContent className="p-8">
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={data.fullName}
                      onChange={(e) => setData({ ...data, fullName: e.target.value })}
                      placeholder="Enter your name"
                      className="h-12 rounded-xl"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Age <span className="text-slate-300 normal-case tracking-normal">(optional)</span>
                    </label>
                    <Input
                      type="number"
                      value={data.age}
                      onChange={(e) => setData({ ...data, age: e.target.value })}
                      placeholder="Your age"
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white border-none font-black text-base shadow-xl shadow-brand-200/60 group"
                    disabled={!canProceed()}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-2">
                    {FITNESS_OPTIONS.map((option) => {
                      const selected = data.fitnessLevel === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setData({ ...data, fitnessLevel: option.value })}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                            selected
                              ? "border-brand-500 bg-brand-50/60 shadow-md"
                              : "border-slate-100 hover:border-brand-200 hover:bg-slate-50"
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                              selected ? "border-brand-600 bg-brand-600" : "border-slate-200"
                            }`}
                          >
                            {selected && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                          </div>
                          <div>
                            <p className="font-black text-ink tracking-tight">{option.label}</p>
                            <p className="text-sm text-slate-500 font-medium">{option.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                      Medical Conditions{" "}
                      <span className="text-slate-300 normal-case tracking-normal">(optional)</span>
                    </label>
                    <Input
                      placeholder="e.g. diabetes, previous injuries"
                      className="h-12 rounded-xl"
                      onChange={(e) =>
                        setData({
                          ...data,
                          knownConditions: e.target.value
                            ? e.target.value.split(",").map((s) => s.trim())
                            : [],
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={() => setStep(3)}
                    className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white border-none font-black text-base shadow-xl shadow-brand-200/60 group"
                    disabled={!canProceed()}
                  >
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner"
                  >
                    <Sparkles className="h-10 w-10 text-emerald-600" />
                  </motion.div>
                  <h2 className="text-2xl font-black text-ink tracking-tight mb-3">
                    You&apos;re ready, {data.fullName.split(" ")[0] || "Member"}.
                  </h2>
                  <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto leading-relaxed">
                    Your profile is configured. Start your first assessment to generate a personalized
                    rehabilitation protocol.
                  </p>
                  <div className="space-y-3">
                    <Button
                      onClick={handleSave}
                      disabled={loading}
                      className="w-full h-14 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white border-none font-black text-base shadow-xl shadow-brand-200/60"
                    >
                      {loading ? "Saving..." : "Go to Dashboard"}
                    </Button>
                    <Link href="/assess/method" className="block">
                      <Button
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 font-black text-base"
                      >
                        Start Assessment Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {step > 1 && step < 3 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 mx-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}
      </div>
    </div>
  );
}
