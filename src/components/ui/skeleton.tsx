import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

export function Skeleton({ width, height, className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse bg-surface-container rounded", className)}
      style={{ width, height }}
      {...props}
    />
  );
}
