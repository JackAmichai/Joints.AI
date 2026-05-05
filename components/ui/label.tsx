import * as React from "react";
import { clsx } from "clsx";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={clsx(
        "text-sm font-bold uppercase tracking-widest text-slate-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";
