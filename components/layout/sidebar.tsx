"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Home, Plus, History, Settings, LogOut, Activity, Menu, X, Stethoscope, User } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/assess/method", icon: Plus, label: "New Assessment" },
  { href: "/dashboard/history", icon: History, label: "Recovery History" },
  { href: "/dashboard/therapists", icon: Stethoscope, label: "Find a Clinician" },
  { href: "/dashboard/settings", icon: Settings, label: "Account Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    setIsOpen(false);
    await supabase.auth.signOut();
    logout();
    router.push("/login");
  };

  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 bg-white border border-slate-200 rounded-2xl shadow-premium text-ink"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200/60 p-6 flex flex-col transform transition-transform duration-300 lg:transform-none lg:static",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="mb-10 px-2">
          <Link href="/dashboard" onClick={handleLinkClick} className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-100 transition-transform group-hover:scale-110">
              <Activity className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-ink">
              Joints<span className="text-brand-600">.AI</span>
            </span>
          </Link>
        </div>

        <nav className="space-y-1.5 flex-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-4">Main Menu</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className={clsx(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group",
                pathname === item.href
                  ? "bg-brand-50 text-brand-600 shadow-sm shadow-brand-50"
                  : "text-slate-500 hover:bg-slate-50 hover:text-ink"
              )}
            >
              <item.icon className={clsx(
                "h-5 w-5 transition-colors",
                pathname === item.href ? "text-brand-600" : "text-slate-400 group-hover:text-ink"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          {user && (
            <div className="flex items-center gap-3 px-2 mb-4">
               <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 font-bold">
                  {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
               </div>
               <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-bold text-ink truncate">{user.full_name || "User"}</p>
                  <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
               </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all w-full"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}