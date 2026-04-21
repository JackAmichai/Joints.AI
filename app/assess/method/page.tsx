"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, PenLine, ArrowRight } from "lucide-react";

export default function MethodPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">How would you like to describe your issue?</h1>
          <p className="text-slate-500">Choose whichever way feels most comfortable for you</p>
        </div>

        <div className="grid gap-4">
          <Link href="/assess/location" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-slate-900">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Structured Form</h3>
                  <p className="text-sm text-slate-500">
                    Step-by-step wizard with body map and dropdowns
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/assess/chat" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-slate-900">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Conversational</h3>
                  <p className="text-sm text-slate-500">
                    Chat with our AI assistant
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/assess/description" className="block">
            <Card className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-slate-900">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center">
                  <PenLine className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">Free Text</h3>
                  <p className="text-sm text-slate-500">
                    Describe in your own words
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-slate-400" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}