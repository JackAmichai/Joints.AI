import * as React from "react";
import { clsx } from "clsx";

export interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  max?: number;
  min?: number;
  step?: number;
}

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, max = 10, min = 0, step = 1, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <input
          type="range"
          max={max}
          min={min}
          step={step}
          className={clsx(
            "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900",
            className
          )}
          ref={ref}
          {...props}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-500">{min}</span>
          <span className="text-xs text-slate-500">{max}</span>
        </div>
      </div>
    );
  }
);
Slider.displayName = "Slider";
