"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, ArrowRight, CheckCircle, AlertCircle, Sparkles } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  extracted?: Record<string, unknown>;
}

export default function ChatPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/conversational/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to start conversation");
      const data = await res.json();
      setSessionId(data.session_id);
      setMessages([{ id: "greeting", role: "assistant", content: data.greeting }]);
      setTimeout(() => inputRef.current?.focus(), 200);
    } catch (err) {
      console.error("Failed to start conversation:", err);
      setError("Could not start conversation. Please refresh the page.");
      toast("Failed to start conversation", "error");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !sessionId || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/conversational/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: input }),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || "Failed to send message");
      }

      const data = await res.json();

      if (data.extracted) {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-ext`, role: "assistant", content: "Got it.", extracted: data.extracted },
        ]);
      }

      if (data.is_complete && data.subjective) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-done`,
            role: "assistant",
            content: "Perfect — your exercise plan is being prepared.",
          },
        ]);
        sessionStorage.setItem("conversational_intake", JSON.stringify(data.subjective));
        router.push("/assess/review");
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-ai`, role: "assistant", content: data.question },
        ]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      const message = err instanceof Error ? err.message : "Failed to send message. Please try again.";
      setError(message);
      toast(message, "error");
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const formatExtracted = (extracted?: Record<string, unknown>) => {
    if (!extracted) return null;
    const parts: string[] = [];
    if (extracted.primary_location) parts.push(`Location: ${extracted.primary_location}`);
    if (extracted.severity) parts.push(`Severity: ${extracted.severity}/10`);
    return parts.length > 0 ? parts.join(" · ") : null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-b from-brand-50/20 via-white to-white">
      <FadeIn>
        <div className="border-b border-slate-100 px-6 md:px-10 py-5 bg-white/80 backdrop-blur-xl">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Conversational Intake
                </p>
                <h1 className="text-lg font-black text-ink tracking-tight">AI Assessment</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                Live
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="flex-1 overflow-y-auto px-6 md:px-10 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-ink text-white shadow-lg shadow-slate-900/10"
                      : "bg-white border border-slate-100 shadow-premium text-ink"
                  }`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        AI Clinician
                      </span>
                    </div>
                  )}
                  <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  {msg.extracted && (
                    <div className="mt-3 pt-3 border-t border-slate-100/80">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        <CheckCircle className="h-3 w-3" />
                        {formatExtracted(msg.extracted)}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-slate-100 shadow-premium rounded-3xl px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-brand-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-100 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-bold">{error}</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 md:px-10 py-5 bg-white/80 backdrop-blur-xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your response..."
              disabled={loading}
              className="flex-1 h-13 rounded-2xl"
              aria-label="Type your response"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="h-13 w-13 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white border-none shadow-xl shadow-brand-200/40 shrink-0"
              aria-label="Send message"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>Press Enter to send</span>
            <button
              onClick={() => router.push("/assess/location")}
              className="flex items-center gap-1.5 hover:text-brand-600 transition-colors"
            >
              Switch to form
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
