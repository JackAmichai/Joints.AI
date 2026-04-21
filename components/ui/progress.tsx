import * as React from "react";
import { clsx } from "clsx";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
      <div
        ref={ref}
        className={clsx(
          "relative h-2 w-full overflow-hidden rounded-full bg-slate-200",
          className
        )}
        {...props}
      >
        <div
          className="h-full bg-slate-900 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";
