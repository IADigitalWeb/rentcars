import { cn } from "@/lib/utils";
import { RESERVATION_STATUS_COLORS, CATEGORY_LABELS } from "@/lib/utils";
import { type HTMLAttributes } from "react";

type BadgeVariant = "category" | "status" | "promo";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  value?: string;
}

const getCategoryStyle = (value: string) => {
  return "bg-surface-container-high text-on-surface border border-outline-variant/50";
};

const getStatusStyle = (value: string) => {
  return RESERVATION_STATUS_COLORS[value] || "text-on-surface bg-surface-container";
};

export function Badge({ variant = "category", value, className, children, ...props }: BadgeProps) {
  const displayText = children || (variant === "category" && value ? CATEGORY_LABELS[value] || value : value);

  const styleMap: Record<BadgeVariant, string> = {
    category: value ? getCategoryStyle(value) : "bg-surface-container-high text-on-surface border border-outline-variant/50",
    status: value ? getStatusStyle(value) : "text-on-surface bg-surface-container",
    promo: "bg-primary text-on-primary",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-xs px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider",
        styleMap[variant],
        className
      )}
      {...props}
    >
      {displayText}
    </span>
  );
}
