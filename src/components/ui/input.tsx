import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-xs w-full">
        {label && (
          <label htmlFor={inputId} className="font-label-bold text-label-bold text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full bg-surface-container px-md py-md rounded-lg border-b-2 border-outline-variant/50",
              "focus:border-secondary focus:ring-0 focus:outline-none",
              "font-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/60",
              icon && "pl-xl",
              error && "border-error",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <span className="text-error text-label-sm">{error}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
