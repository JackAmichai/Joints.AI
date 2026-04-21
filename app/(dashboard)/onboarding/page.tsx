"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, User } from "lucide-react";

interface OnboardingData {
  fullName: string;
  age: string;
  fitnessLevel: string;
  knownConditions: string[];
}

const FITNESS_OPTIONS = [
  { value: "sedentary", label: "Sedentary (little to no exercise)" },
  { value: "moderate", label: "Moderate (some exercise 1-3x/week)" },
  { value: "active", label: "Active (regular exercise 3-5x/week)" },
  { value: "athlete", label: "Athlete (intense exercise daily)" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fullName: "",
    age: "",
    fitnessLevel: "",
    knownConditions: [],
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      localStorage.setItem("onboarding_complete", "true");
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to Joints.AI</h1>
          <p className="text-slate-500 mt-2">Let's get to know you better</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full ${
                s <= step ? "bg-slate-900" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {step === 1 && "Your Information"}
              {step === 2 && "Fitness Level"}
              {step === 3 && "Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={data.fullName}
                    onChange={(e) => setData({ ...data, fullName: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age (optional)</label>
                  <Input
                    type="number"
                    value={data.age}
                    onChange={(e) => setData({ ...data, age: e.target.value })}
                    placeholder="Your age"
                  />
                </div>
                <Button onClick={() => setStep(2)} className="w-full" disabled={!data.fullName}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    How would you describe your fitness level?
                  </label>
                  <select
                    value={data.fitnessLevel}
                    onChange={(e) => setData({ ...data, fitnessLevel: e.target.value })}
                    className="w-full h-10 rounded-md border border-slate-300 bg-white px-3"
                  >
                    <option value="">Select fitness level...</option>
                    <option value="sedentary">Sedentary (little to no exercise)</option>
                    <option value="moderate">Moderate (some exercise 1-3x/week)</option>
                    <option value="active">Active (regular exercise 3-5x/week)</option>
                    <option value="athlete">Athlete (intense exercise daily)</option>
                  </select>
                </div>
                <div className="mt-6">
                  <label className="block text-sm font-medium mb-1">
                    Any known conditions? (optional)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    E.g., diabetes, heart conditions, previous injuries
                  </p>
                  <Input
                    placeholder="List any conditions or leave blank"
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
                <Button onClick={() => setStep(3)} className="w-full" disabled={!data.fitnessLevel}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}

            {step === 3 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold mb-2">You're all set!</h2>
                <p className="text-slate-500 mb-6">
                  Your profile has been saved. Ready to get your first exercise plan?
                </p>
                <div className="space-y-3">
                  <Button onClick={handleSave} disabled={loading} className="w-full">
                    {loading ? "Saving..." : "Go to Dashboard"}
                  </Button>
                  <Link href="/assess/method" className="block">
                    <Button variant="outline" className="w-full">
                      Start Assessment Now
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="mt-4 text-sm text-slate-500 underline">
            Back
          </button>
        )}
      </div>
    </div>
  );
}