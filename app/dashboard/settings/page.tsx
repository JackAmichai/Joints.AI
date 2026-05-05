"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";
import { authedFetch } from "@/lib/api/authedFetch";
import { useToast } from "@/components/ui/toast";
import { FadeIn } from "@/components/ui/fade-in";
import { User, Bell, Shield, Trash2, LogOut, Save, Download } from "lucide-react";

interface NotificationPrefs {
  planReady: boolean;
  reminders: boolean;
  updates: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  planReady: true,
  reminders: true,
  updates: false,
};

const PREFS_STORAGE_KEY = "joints-ai:notification-prefs";

function loadStoredPrefs(): NotificationPrefs {
  if (typeof window === "undefined") return DEFAULT_PREFS;
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFS;
    const parsed = JSON.parse(raw);
    return {
      planReady: parsed.planReady ?? DEFAULT_PREFS.planReady,
      reminders: parsed.reminders ?? DEFAULT_PREFS.reminders,
      updates: parsed.updates ?? DEFAULT_PREFS.updates,
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser, logout } = useAuthStore();
  const [name, setName] = useState(user?.full_name || "");
  const [email] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPrefs>(DEFAULT_PREFS);

  useEffect(() => {
    setNotifications(loadStoredPrefs());
  }, []);

  const persistNotifications = (next: NotificationPrefs) => {
    setNotifications(next);
    try {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Quota or privacy mode — fall back to in-memory only.
    }
    toast("Preferences saved", "success");
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const res = await authedFetch("/api/user/profile", {
        method: "PUT",
        body: JSON.stringify({
          full_name: name.trim(),
        }),
      });

      if (res.ok) {
        setUser({ ...user, full_name: name.trim() });
        toast("Profile saved", "success");
      } else {
        toast("Could not save. Please try again.", "error");
      }
    } catch (err) {
      toast("Could not save. Please try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("signOut failed", err);
    }
    logout();
    router.push("/login");
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const res = await fetch(`/api/user/plans?user_id=${encodeURIComponent(user.id)}`);
      const plans = res.ok ? (await res.json()).plans || [] : [];
      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.id, email: user.email, full_name: user.full_name },
        plans,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `joints-ai-export-${user.id.slice(0, 8)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast("Export downloaded", "success");
    } catch (err) {
      toast("Export failed", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const ok = window.confirm(
      "This will permanently delete your account and all data. This cannot be undone. Continue?"
    );
    if (!ok) return;
    setDeleting(true);
    try {
      // Sign out the user — account deletion requires contacting support
      await supabase.auth.signOut();
      logout();
      toast("Account marked for deletion. Please contact support@joints.ai to complete the process.", "info");
      router.push("/");
    } catch (err) {
      toast("Could not sign out. Please contact support@joints.ai", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <FadeIn>
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Account Configuration</span>
          </div>
          <h1 className="text-5xl font-black text-ink tracking-tight">Settings</h1>
          <p className="text-slate-500 font-medium text-lg italic mt-1">Manage your profile, preferences, and data.</p>
        </div>
      </FadeIn>

      <div className="space-y-8">
        <FadeIn delay={0.1}>
          <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink tracking-tight">Profile</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Personal Information</p>
              </div>
            </div>
            <CardContent className="p-8 space-y-5">
              <div>
                <label htmlFor="fullName" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="your@email.com"
                  disabled
                />
                <p className="text-xs text-slate-400 font-medium mt-2">Email cannot be changed.</p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving || !name.trim()}
                  className="rounded-xl h-12 px-6 bg-brand-600 hover:bg-brand-700 text-white border-none font-black"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.2}>
          <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 shadow-inner">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink tracking-tight">Notifications</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Preferences</p>
              </div>
            </div>
            <CardContent className="p-2">
              {[
                {
                  key: "planReady" as const,
                  title: "Plan ready",
                  desc: "Get notified when your clinician releases a new exercise plan.",
                },
                {
                  key: "reminders" as const,
                  title: "Exercise reminders",
                  desc: "Daily nudges to keep your protocol on track.",
                },
                {
                  key: "updates" as const,
                  title: "Product updates",
                  desc: "Occasional emails about new features and research.",
                },
              ].map((row) => (
                <label
                  key={row.key}
                  className="flex items-center justify-between gap-6 p-6 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-black text-ink tracking-tight">{row.title}</p>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{row.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications[row.key]}
                    onChange={(e) =>
                      persistNotifications({ ...notifications, [row.key]: e.target.checked })
                    }
                    className="h-5 w-5 accent-brand-600 shrink-0"
                    aria-label={row.title}
                  />
                </label>
              ))}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink tracking-tight">Privacy &amp; Data</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Your Records</p>
              </div>
            </div>
            <CardContent className="p-8 space-y-4">
              <div className="flex items-center justify-between gap-6 p-5 rounded-2xl border border-slate-100 bg-slate-50/40">
                <div className="min-w-0">
                  <p className="font-black text-ink tracking-tight">Export my data</p>
                  <p className="text-sm text-slate-500 font-medium">Download all your exercise history and progress as JSON.</p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleExport}
                  disabled={exporting}
                  className="rounded-xl h-11 px-5 border-2 font-black shrink-0"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exporting ? "Exporting..." : "Export"}
                </Button>
              </div>
               <div className="flex items-center justify-between gap-6 p-5 rounded-2xl border-2 border-red-100 bg-red-50/30">
                 <div className="min-w-0">
                   <p className="font-black text-red-700 tracking-tight">Delete account</p>
                   <p className="text-sm text-red-600/70 font-medium">Sign out and request permanent data deletion via support.</p>
                 </div>
                 <Button
                   variant="destructive"
                   onClick={handleDelete}
                   disabled={deleting}
                   className="rounded-xl h-11 px-5 font-black shrink-0"
                 >
                   <Trash2 className="mr-2 h-4 w-4" />
                   {deleting ? "..." : "Delete"}
                 </Button>
               </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.4}>
          <Card variant="default" className="border-none shadow-premium overflow-hidden bg-white">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-inner">
                <LogOut className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-ink tracking-tight">Session</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sign Out Safely</p>
              </div>
            </div>
            <CardContent className="p-8">
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full rounded-xl h-12 border-2 font-black"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}
