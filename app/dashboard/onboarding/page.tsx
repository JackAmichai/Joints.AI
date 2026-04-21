"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { authedFetch } from "@/lib/api/authedFetch";
import { useToast } from "@/components/ui/toast";
import { ArrowRight, User, Check, Activity, Zap } from "lucide-react";

interface OnboardingData {
  fullName: string;
  age: string;
  fitnessLevel: string;
  knownConditions: string[];
}

const FITNESS_OPTIONS = [
  { value: "sedentary", label: "Sedentary", description: "Little to no exercise" },
  { value: "moderate", label: "Moderate", description: "Some exercise 1-3x/week" },
  { value: "active", label: "Active", description: "Regular exercise 3-5x/week" },
  { value: "athlete", label: "Athlete", description: "Intense exercise daily" },
];

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to Joints.AI</h1>
          <p className="text-slate-500 mt-2">Let&apos;s personalize your experience</p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  s < step
                    ? "bg-slate-900 text-white"
                    : s === step
                    ? "bg-slate-900 text-white ring-4 ring-slate-200"
                    : "bg-slate-200 text-slate-500"
                }`}
              >
                {s < step ? <Check className="h-5 w-5" /> : s}
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 ${s < step ? "bg-slate-900" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Your fitness background"}
              {step === 3 && "All done!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Full Name</label>
                  <Input
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    placeholder="Enter your name"
                    className="h-12"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Age <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <Input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    placeholder="Your age"
                    className="h-12"
                  />
                </div>
                <Button
                  onClick={() => setStep(2)}
                  className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                  disabled={!canProceed()}
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  {FITNESS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setData({ ...data, fitnessLevel: option.value })}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                        data.fitnessLevel === option.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          data.fitnessLevel === option.value ? "border-slate-900" : "border-slate-300"
                        }`}
                      >
                        {data.fitnessLevel === option.value && (
                          <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{option.label}</p>
                        <p className="text-sm text-slate-500">{option.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">
                    Known medical conditions <span className="text-slate-400 font-normal">(optional)</span>
                  </label>
                  <Input
                    placeholder="e.g., diabetes, heart conditions, previous injuries"
                    className="h-12"
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
                  className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                  disabled={!canProceed()}
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">You&apos;re all set!</h2>
                <p className="text-slate-500 mb-6">
                  {data.fullName}, your profile is ready. Start your first assessment to get personalized exercises.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800"
                  >
                    {loading ? "Saving..." : "Go to Dashboard"}
                  </Button>
                  <Link href="/assess/method" className="block">
                    <Button variant="outline" className="w-full h-12 text-base">
                      Start Assessment Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 block w-full text-center text-sm text-slate-500 hover:text-slate-700"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
