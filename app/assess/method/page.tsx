"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PenLine, ArrowLeft, Activity } from "lucide-react";

const METHODS = [
  {
    href: "/assess/location",
    title: "Structured Form",
    description: "Step-by-step wizard with body map and dropdowns",
    icon: FileText,
    color: "bg-slate-900",
  },
  {
    href: "/assess/chat",
    title: "Conversational",
    description: "Chat with our AI that asks follow-up questions",
    icon: MessageSquare,
    color: "bg-blue-600",
  },
  {
    href: "/assess/description",
    title: "Free Text",
    description: "Describe your issue in your own words",
    icon: PenLine,
    color: "bg-green-600",
  },
];

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-8 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-slate-900 rounded-2xl mb-4">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Describe Your Issue
            </h1>
            <p className="text-slate-500 text-lg">
              Choose the way that feels most comfortable for you
            </p>
          </div>

          <div className="grid gap-4">
            {METHODS.map((method) => (
              <Link key={method.href} href={method.href} className="block">
                <Card className="hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-slate-900 group">
                  <CardContent className="p-6 flex items-center gap-5">
                    <div className={`w-14 h-14 ${method.color} text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <method.icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-slate-900">{method.title}</h3>
                      <p className="text-slate-500">
                        {method.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <p className="text-center text-slate-400 text-sm mt-8">
            All methods produce the same quality of personalized exercise plans
          </p>
        </div>
      </div>
    </div>
  );
}
