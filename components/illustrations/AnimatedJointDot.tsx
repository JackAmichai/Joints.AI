"use client";

import { motion } from "framer-motion";

interface AnimatedJointDotProps {
  cx: number;
  cy: number;
  color?: string;
  delay?: number;
  radius?: number;
}

export function AnimatedJointDot({
  cx,
  cy,
  color = "#2F6FEB",
  delay = 0,
  radius = 6,
}: AnimatedJointDotProps) {
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={color}
      opacity={0.15}
      initial={{ scale: 1, opacity: 0.15 }}
      animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.3, 0.15] }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        repeatType: "reverse",
        delay,
        ease: "easeInOut",
      }}
    />
  );
}
