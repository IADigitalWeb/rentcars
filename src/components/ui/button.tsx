"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantStyles = {
  primary:
    "bg-primary text-on-primary hover:bg-primary/90",
  ghost:
    "border border-secondary text-secondary hover:bg-secondary/5",
  danger:
    "bg-error text-on-error",
} as const;

const sizeStyles = {
  sm: "px-sm py-[8px] text-label-sm",
  md: "px-md py-[12px] text-label-bold",
  lg: "px-lg py-[16px] text-label-bold",
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "font-label-bold inline-flex items-center justify-center gap-xs rounded transition-all duration-150",
          "scale-100 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, type ButtonProps };
