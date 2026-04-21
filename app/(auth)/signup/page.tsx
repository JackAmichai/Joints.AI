import { SignupForm } from "@/components/auth/signup-form";
import Link from "next/link";
import { Activity } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Joints.AI</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create your account</h1>
          <p className="text-slate-500">Start your personalized recovery journey</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}