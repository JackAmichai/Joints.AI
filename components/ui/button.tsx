import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "premium";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={clsx(
          "inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-200": variant === "default",
            "bg-slate-900 text-white hover:bg-slate-800 shadow-sm": variant === "premium",
            "border-2 border-slate-200 bg-transparent hover:bg-slate-50 text-slate-700": variant === "outline",
            "hover:bg-slate-100 text-slate-600": variant === "ghost",
            "bg-red-500 text-white hover:bg-red-600 shadow-sm shadow-red-100": variant === "destructive",
            "h-11 px-6": size === "default",
            "h-9 px-4 text-sm": size === "sm",
            "h-14 px-10 text-lg": size === "lg",
            "h-11 w-11": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
