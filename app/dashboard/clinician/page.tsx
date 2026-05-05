"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/ui/fade-in";
import {
  CheckCircle, XCircle, Clock, FileText, Search, Stethoscope, Loader2
} from "lucide-react";

interface Submission {
  id: string;
  user_id: string;
  status: string;
  created_at: string;
  subjective: {
    primary_location: string;
    intensity: number;
    free_text: string;
  };
  triage: {
    disposition: string;
    rationale: string;
  };
  plan?: {
    id: string;
    phases: Array<{
      phase: string;
      exercises: Array<{ id: string; name: string; dose: string }>;
    }>;
  };
}

const TRIAGE_STYLES: Record<string, string> = {
  proceed: "bg-emerald-50 text-emerald-700 border-emerald-100",
  proceed_with_caution: "bg-amber-50 text-amber-700 border-amber-100",
};

function triageBadge(disposition?: string) {
  if (!disposition) return "bg-slate-50 text-slate-700 border-slate-100";
  return TRIAGE_STYLES[disposition] || "bg-red-50 text-red-700 border-red-100";
}

export default function ClinicianDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "reviewed">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchSubmissions();
  }, [user, router]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/clinician/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
      }
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: string) => {
    setActionLoading(submissionId);
    try {
      const res = await fetch(`/api/clinician/submissions/${submissionId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: reviewNote }),
      });
      if (res.ok) {
        toast("Plan approved and released", "success");
        fetchSubmissions();
        setSelectedSubmission(null);
        setReviewNote("");
      } else {
        toast("Failed to approve", "error");
      }
    } catch (error) {
      console.error("Failed to approve:", error);
      toast("Failed to approve", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (submissionId: string) => {
    setActionLoading(submissionId);
    try {
      const res = await fetch(`/api/clinician/submissions/${submissionId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: reviewNote }),
      });
      if (res.ok) {
        toast("Submission rejected", "info");
        fetchSubmissions();
        setSelectedSubmission(null);
        setReviewNote("");
      } else {
        toast("Failed to reject", "error");
      }
    } catch (error) {
      console.error("Failed to reject:", error);
      toast("Failed to reject", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingSubmissions = useMemo(
    () => submissions.filter((s) => s.status === "pending_clinical_review"),
    [submissions]
  );
  const reviewedSubmissions = useMemo(
    () => submissions.filter((s) => s.status === "plan_ready"),
    [submissions]
  );

  const displaySubmissions = useMemo(() => {
    const pool = filter === "pending" ? pendingSubmissions : reviewedSubmissions;
    const q = searchQuery.trim().toLowerCase();
    if (!q) return pool;
    return pool.filter((s) => {
      const id = s.id.toLowerCase();
      const userId = (s.user_id || "").toLowerCase();
      const location = (s.subjective?.primary_location || "").toLowerCase();
      const text = (s.subjective?.free_text || "").toLowerCase();
      return id.includes(q) || userId.includes(q) || location.includes(q) || text.includes(q);
    });
  }, [filter, pendingSubmissions, reviewedSubmissions, searchQuery]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-slate-500 font-medium">
          <Loader2 className="h-5 w-5 animate-spin text-brand-600" />
          Loading submissions...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <FadeIn>
        <div className="flex items-center justify-between mb-10 gap-6 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                Clinical Review Queue
              </span>
            </div>
            <h1 className="text-5xl font-black text-ink tracking-tight">Clinician Console</h1>
            <p className="text-slate-500 font-medium text-lg italic mt-1">
              Review and release AI-generated rehabilitation protocols.
            </p>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-100">
            <Clock className="h-5 w-5 text-amber-600" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-700/80">Pending</p>
              <p className="text-2xl font-black text-amber-700 tracking-tight leading-none">{pendingSubmissions.length}</p>
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, location, or notes..."
              className="pl-11 h-12 rounded-xl"
              aria-label="Search submissions"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className="rounded-xl h-12 font-black"
            >
              Pending ({pendingSubmissions.length})
            </Button>
            <Button
              variant={filter === "reviewed" ? "default" : "outline"}
              onClick={() => setFilter("reviewed")}
              className="rounded-xl h-12 font-black"
            >
              Reviewed ({reviewedSubmissions.length})
            </Button>
          </div>
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {displaySubmissions.length === 0 ? (
            <Card variant="default" className="border-none shadow-premium bg-white">
              <CardContent className="py-16 text-center px-6">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 shadow-inner">
                  <Stethoscope className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold text-slate-500">
                  {searchQuery ? "No submissions match your search" : "No submissions to review"}
                </p>
              </CardContent>
            </Card>
          ) : (
            displaySubmissions.map((sub) => (
              <Card
                key={sub.id}
                variant="default"
                className={`cursor-pointer border transition-all ${
                  selectedSubmission?.id === sub.id
                    ? "border-brand-500 shadow-premium ring-2 ring-brand-500/20"
                    : "border-slate-100 shadow-sm hover:shadow-premium hover:border-brand-100"
                }`}
                onClick={() => setSelectedSubmission(sub)}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black text-ink">#{sub.id.slice(0, 8)}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {formatDate(sub.created_at)}
                    </span>
                  </div>
                  <div className="mb-3">
                    <span
                      className={`inline-block text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${triageBadge(
                        sub.triage?.disposition
                      )}`}
                    >
                      {sub.triage?.disposition?.replace(/_/g, " ") || "unknown"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 font-medium line-clamp-2">
                    {sub.subjective?.primary_location || "Unknown location"} · Intensity{" "}
                    {sub.subjective?.intensity ?? "—"}/10
                  </p>
                  {sub.plan && (
                    <div className="mt-3 pt-3 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {sub.plan.phases.reduce((acc, p) => acc + p.exercises.length, 0)} exercises proposed
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <FadeIn key={selectedSubmission.id}>
              <Card variant="default" className="border-none shadow-premium bg-white overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Submission</p>
                    <h2 className="text-xl font-black text-ink tracking-tight font-mono">
                      #{selectedSubmission.id.slice(0, 12)}
                    </h2>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${triageBadge(
                      selectedSubmission.triage?.disposition
                    )}`}
                  >
                    {selectedSubmission.status.replace(/_/g, " ")}
                  </span>
                </div>
                <CardContent className="p-8 space-y-8">
                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                      Patient Input
                    </h3>
                    <div className="bg-slate-50/60 rounded-2xl p-5 text-sm space-y-2 border border-slate-100">
                      <p className="font-medium">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mr-2">
                          Location
                        </span>
                        <span className="text-ink font-bold">
                          {selectedSubmission.subjective?.primary_location || "Not specified"}
                        </span>
                      </p>
                      <p className="font-medium">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mr-2">
                          Intensity
                        </span>
                        <span className="text-ink font-bold">
                          {selectedSubmission.subjective?.intensity ?? "—"}/10
                        </span>
                      </p>
                      <div className="pt-2">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">
                          Description
                        </p>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {selectedSubmission.subjective?.free_text || "No description"}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                      Triage Result
                    </h3>
                    <div className="bg-slate-50/60 rounded-2xl p-5 text-sm space-y-2 border border-slate-100">
                      <p className="font-medium">
                        <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] mr-2">
                          Disposition
                        </span>
                        <span className="text-ink font-bold">
                          {selectedSubmission.triage?.disposition?.replace(/_/g, " ")}
                        </span>
                      </p>
                      <div className="pt-1">
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-1.5">
                          Rationale
                        </p>
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {selectedSubmission.triage?.rationale}
                        </p>
                      </div>
                    </div>
                  </section>

                  {selectedSubmission.plan && (
                    <section>
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                        Proposed Exercise Plan
                      </h3>
                      <div className="space-y-3">
                        {selectedSubmission.plan.phases.map((phase, i) => (
                          <div key={i} className="border border-slate-100 rounded-2xl p-5 bg-white">
                            <h4 className="font-black text-sm text-ink tracking-tight mb-3">{phase.phase}</h4>
                            <ul className="space-y-2">
                              {phase.exercises.map((ex, j) => (
                                <li
                                  key={j}
                                  className="text-sm flex justify-between gap-4 py-1.5 border-b border-slate-50 last:border-none"
                                >
                                  <span className="font-bold text-ink">{ex.name}</span>
                                  <span className="text-slate-500 font-medium shrink-0">{ex.dose}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {selectedSubmission.status === "pending_clinical_review" && (
                    <section className="border-t border-slate-100 pt-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                        Clinician Note (optional)
                      </h3>
                      <Textarea
                        value={reviewNote}
                        onChange={(e) => setReviewNote(e.target.value)}
                        placeholder="Add a note for the patient..."
                        className="mb-5 rounded-xl"
                      />
                      <div className="flex gap-3">
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(selectedSubmission.id)}
                          disabled={actionLoading !== null}
                          className="rounded-xl h-12 px-5 font-black"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          {actionLoading === selectedSubmission.id ? "Rejecting..." : "Reject"}
                        </Button>
                        <Button
                          onClick={() => handleApprove(selectedSubmission.id)}
                          disabled={actionLoading !== null}
                          className="rounded-xl h-12 px-5 bg-brand-600 hover:bg-brand-700 text-white border-none font-black"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {actionLoading === selectedSubmission.id ? "Approving..." : "Approve & Release"}
                        </Button>
                      </div>
                    </section>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          ) : (
            <Card variant="default" className="border-none shadow-premium bg-white">
              <CardContent className="py-24 text-center px-6">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                  <FileText className="h-8 w-8" />
                </div>
                <p className="font-black text-ink mb-1 tracking-tight">Select a submission</p>
                <p className="text-sm text-slate-500 font-medium">
                  Choose a record from the queue to begin review.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
