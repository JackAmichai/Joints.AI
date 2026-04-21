import * as React from "react";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const [checked, setChecked] = React.useState(props.checked || props.defaultChecked || false);

    React.useEffect(() => {
      if (props.checked !== undefined) {
        setChecked(props.checked);
      }
    }, [props.checked]);

    return (
      <div className="flex items-center space-x-2">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="peer h-4 w-4 opacity-0 absolute cursor-pointer"
            ref={ref}
            onChange={(e) => {
              setChecked(e.target.checked);
              props.onChange?.(e);
            }}
            {...props}
          />
          <div
            className={clsx(
              "h-4 w-4 rounded border border-slate-300 bg-white transition-colors",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400 peer-focus-visible:ring-offset-2",
              "peer-checked:bg-slate-900 peer-checked:border-slate-900",
              className
            )}
          >
            {checked && (
              <Check className="h-4 w-4 text-white" />
            )}
          </div>
        </div>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
