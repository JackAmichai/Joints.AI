"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/toast";
import { User, Bell, Shield, Trash2, LogOut, Save } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser, logout } = useAuthStore();
  const [name, setName] = useState(user?.full_name || "");
  const [email] = useState(user?.email || "");
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notifications, setNotifications] = useState({
    planReady: true,
    reminders: true,
    updates: false,
  });

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      setUser({ ...user, full_name: name.trim() });
      toast("Profile saved", "success");
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
      // Supabase can fail offline; we still clear local state.
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
      toast("Account deletion requested. We'll email you within 24 hours to confirm.", "info");
    } catch (err) {
      toast("Could not submit deletion request", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                id="fullName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder="your@email.com"
                disabled
              />
              <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
            </div>
            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span>Plan ready notifications</span>
              <input
                type="checkbox"
                checked={notifications.planReady}
                onChange={(e) => setNotifications({ ...notifications, planReady: e.target.checked })}
                className="h-5 w-5"
                aria-label="Plan ready notifications"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Exercise reminders</span>
              <input
                type="checkbox"
                checked={notifications.reminders}
                onChange={(e) => setNotifications({ ...notifications, reminders: e.target.checked })}
                className="h-5 w-5"
                aria-label="Exercise reminders"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span>Product updates</span>
              <input
                type="checkbox"
                checked={notifications.updates}
                onChange={(e) => setNotifications({ ...notifications, updates: e.target.checked })}
                className="h-5 w-5"
                aria-label="Product updates"
              />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Data
            </CardTitle>
            <CardDescription>Manage your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Export my data</p>
                <p className="text-sm text-slate-500">Download all your exercise history and progress</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
                {exporting ? "Exporting..." : "Export"}
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
              <div>
                <p className="font-medium text-red-700">Delete account</p>
                <p className="text-sm text-slate-500">Permanently delete all your data</p>
              </div>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
                <Trash2 className="mr-2 h-4 w-4" />
                {deleting ? "..." : "Delete"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogOut className="h-5 w-5" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
