"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useIntakeStore, type IntakeStep } from "@/lib/store/intakeStore";
import { StepProgress } from "@/components/intake/StepProgress";
import { useIsHydrated } from "@/lib/utils/useIsHydrated";

function pathToStep(pathname: string): IntakeStep {
  if (pathname.endsWith("/description")) return "description";
  if (pathname.endsWith("/upload")) return "upload";
  if (pathname.endsWith("/review")) return "review";
  return "location";
}

export default function AssessLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const current = pathToStep(pathname);
  const furthest = useIntakeStore((s) => s.furthestStep);
  const hydrated = useIsHydrated();

  return (
    <main className="flex-1 bg-paper">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-paper/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Joints.AI
          </Link>
          {/* Gate on hydration to avoid SSR mismatch against persisted store */}
          {hydrated ? (
            <StepProgress current={current} furthest={furthest} />
          ) : (
            <StepProgress current={current} furthest={current} />
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8 md:py-12">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mx-auto max-w-3xl px-6 pb-8 text-xs text-ink-muted">
        Educational guidance only. Not a diagnosis. If you experience numbness,
        loss of bowel or bladder control, severe trauma, or radiating nerve
        pain, stop and seek emergency care.
      </p>
    </main>
  );
}
