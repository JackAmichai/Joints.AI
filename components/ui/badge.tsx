import * as React from "react";
import { clsx } from "clsx";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={clsx(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2",
        {
          "border-transparent bg-slate-900 text-white": variant === "default",
          "border-transparent bg-slate-100 text-slate-900": variant === "secondary",
          "text-slate-950": variant === "outline",
          "border-transparent bg-red-500 text-white": variant === "destructive",
        },
        className
      )}
      {...props}
    />
  );
}
