"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/toast";
import { 
  CheckCircle, XCircle, Clock, Eye, 
  AlertTriangle, FileText, ChevronRight, Search 
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

export default function ClinicianDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"pending" | "reviewed">("pending");
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

  const pendingSubmissions = submissions.filter(s => s.status === "pending_clinical_review");
  const reviewedSubmissions = submissions.filter(s => s.status === "plan_ready");
  const displaySubmissions = filter === "pending" ? pendingSubmissions : reviewedSubmissions;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const getTriageColor = (disposition: string) => {
    switch (disposition) {
      case "proceed": return "bg-green-100 text-green-700";
      case "proceed_with_caution": return "bg-yellow-100 text-yellow-700";
      default: return "bg-red-100 text-red-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Clinician Dashboard</h1>
          <p className="text-slate-500 mt-1">Review and approve exercise plans</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Clock className="h-4 w-4 mr-1" />
            {pendingSubmissions.length} pending
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by ID or patient..." className="pl-10" />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === "pending" ? "default" : "outline"} 
            onClick={() => setFilter("pending")}
          >
            Pending Review ({pendingSubmissions.length})
          </Button>
          <Button 
            variant={filter === "reviewed" ? "default" : "outline"} 
            onClick={() => setFilter("reviewed")}
          >
            Reviewed ({reviewedSubmissions.length})
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {displaySubmissions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                No submissions to review
              </CardContent>
            </Card>
          ) : (
            displaySubmissions.map((sub) => (
              <Card 
                key={sub.id} 
                className={`cursor-pointer hover:shadow-md transition-all ${
                  selectedSubmission?.id === sub.id ? "ring-2 ring-slate-900" : ""
                }`}
                onClick={() => setSelectedSubmission(sub)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">#{sub.id.slice(0, 8)}</span>
                    <span className="text-xs text-slate-500">{formatDate(sub.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTriageColor(sub.triage?.disposition)}>
                      {sub.triage?.disposition || "unknown"}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {sub.subjective?.primary_location || "Unknown location"} - 
                    Intensity: {sub.subjective?.intensity || "N/A"}/10
                  </p>
                  {sub.plan && (
                    <div className="mt-2 text-xs text-slate-500">
                      {sub.plan.phases.reduce((acc, p) => acc + p.exercises.length, 0)} exercises
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedSubmission ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Submission #{selectedSubmission.id.slice(0, 12)}</span>
                  <Badge className={getTriageColor(selectedSubmission.triage?.disposition)}>
                    {selectedSubmission.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Patient Input</h3>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <p><strong>Location:</strong> {selectedSubmission.subjective?.primary_location || "Not specified"}</p>
                    <p><strong>Intensity:</strong> {selectedSubmission.subjective?.intensity || "N/A"}/10</p>
                    <p className="mt-2"><strong>Description:</strong></p>
                    <p className="text-slate-600">{selectedSubmission.subjective?.free_text || "No description"}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Triage Result</h3>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm">
                    <p><strong>Disposition:</strong> {selectedSubmission.triage?.disposition}</p>
                    <p><strong>Rationale:</strong> {selectedSubmission.triage?.rationale}</p>
                  </div>
                </div>

                {selectedSubmission.plan && (
                  <div>
                    <h3 className="font-semibold mb-2">Proposed Exercise Plan</h3>
                    <div className="space-y-3">
                      {selectedSubmission.plan.phases.map((phase, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">{phase.phase}</h4>
                          <ul className="space-y-1">
                            {phase.exercises.map((ex, j) => (
                              <li key={j} className="text-sm flex justify-between">
                                <span>{ex.name}</span>
                                <span className="text-slate-500">{ex.dose}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedSubmission.status === "pending_clinical_review" && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-2">Clinician Note (optional)</h3>
                    <Textarea
                      value={reviewNote}
                      onChange={(e) => setReviewNote(e.target.value)}
                      placeholder="Add a note for the patient..."
                      className="mb-4"
                    />
                    <div className="flex gap-3">
                      <Button 
                        variant="destructive" 
                        onClick={() => handleReject(selectedSubmission.id)}
                        disabled={actionLoading !== null}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        {actionLoading === selectedSubmission.id ? "Rejecting..." : "Reject"}
                      </Button>
                      <Button 
                        onClick={() => handleApprove(selectedSubmission.id)}
                        disabled={actionLoading !== null}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {actionLoading === selectedSubmission.id ? "Approving..." : "Approve & Release"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>Select a submission to review</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}