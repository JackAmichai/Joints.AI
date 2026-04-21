import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, FileText, MessageSquare } from "lucide-react";

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Personalized Exercise Plans for Your Recovery
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Tell us about your pain or injury, and we&apos;ll create a custom physiotherapy
            program with videos and instructions to help you recover.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your Recovery <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Describe Your Issue</h3>
              <p className="text-slate-600">
                Choose to fill a form, chat with our AI, or type freely about your pain or injury.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Get Your Plan</h3>
              <p className="text-slate-600">
                Our system analyzes your input and generates personalized exercises just for you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Track Progress</h3>
              <p className="text-slate-600">
                Follow video exercises, mark completion, and adjust based on feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Input methods */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Three Ways to Report Your Issue</h2>
          <p className="text-center text-slate-600 mb-12">Pick whichever feels most comfortable for you</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Structured Form</h3>
              <p className="text-sm text-slate-600">Step-by-step wizard with body map and dropdowns</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Conversational</h3>
              <p className="text-sm text-slate-600">Chat with our AI that asks follow-up questions</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Free Text</h3>
              <p className="text-sm text-slate-600">Type your description in your own words</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Joints.AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
