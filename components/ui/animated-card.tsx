"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  hoverEnabled?: boolean;
}

export function AnimatedCard({
  children,
  className = "",
  hoverEnabled = true
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      whileHover={hoverEnabled ? { y: -4, scale: 1.01 } : undefined}
      whileTap={hoverEnabled ? { scale: 0.99 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}