"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { LogOut, Activity } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    router.push("/login");
  };

  if (pathname.startsWith("/dashboard")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-brand-200">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-ink">
            Joints<span className="text-brand-600">.AI</span>
          </span>
        </Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="font-bold text-ink">Dashboard</Button>
              </Link>
              <Button variant="outline" size="icon" onClick={handleLogout} className="rounded-xl">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="font-bold text-ink">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button className="rounded-xl shadow-lg shadow-brand-100">Get Started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
