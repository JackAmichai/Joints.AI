"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, ArrowRight, CheckCircle } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  extracted?: Record<string, unknown>;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversational/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setSessionId(data.session_id);
      setMessages([{ id: "greeting", role: "assistant", content: data.greeting }]);
    } catch (error) {
      console.error("Failed to start conversation:", error);
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

    try {
      const res = await fetch("/api/conversational/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, message: input }),
      });

      const data = await res.json();

      if (data.extracted) {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-ext`, role: "assistant", content: "Got it!", extracted: data.extracted },
        ]);
      }

      if (data.is_complete && data.subjective) {
        setMessages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-done`,
            role: "assistant",
            content: "Perfect! Your exercise plan is being prepared...",
          },
        ]);
        localStorage.setItem("conversational_intake", JSON.stringify(data.subjective));
        router.push("/assess/review");
      } else {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-ai`, role: "assistant", content: data.question },
        ]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatExtracted = (extracted?: Record<string, unknown>) => {
    if (!extracted) return null;
    const parts: string[] = [];
    if (extracted.primary_location) parts.push(`Location: ${extracted.primary_location}`);
    if (extracted.severity) parts.push(`Severity: ${extracted.severity}/10`);
    return parts.length > 0 ? parts.join(" | ") : null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b p-4 bg-white">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Conversational Intake
        </h1>
        <p className="text-sm text-slate-500 mt-1">Chat with our AI to describe your injury</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"}`}>
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-1">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium text-slate-500">AI Assistant</span>
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
              {msg.extracted && (
                <div className="mt-2 pt-2 border-t border-slate-200/20">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <CheckCircle className="h-3 w-3" />
                    {formatExtracted(msg.extracted)}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <span className="text-xs text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4 bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your response..."
            disabled={loading}
            className="flex-1"
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-400">
          <span>Press Enter to send</span>
          <button onClick={() => router.push("/assess/location")} className="flex items-center gap-1 hover:text-slate-600">
            Switch to form <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}