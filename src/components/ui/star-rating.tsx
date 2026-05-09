"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  interactive = false,
  onChange,
  size = 20,
  className,
}: StarRatingProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className={cn("flex items-center gap-xs", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starIndex = i + 1;
        const filled = hovered !== null ? starIndex <= hovered : starIndex <= rating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(null)}
            className={cn(
              "transition-colors",
              interactive ? "cursor-pointer" : "cursor-default"
            )}
          >
            <Star
              size={size}
              className={cn(
                filled
                  ? "fill-primary text-primary"
                  : "fill-none text-outline-variant"
              )}
            />
          </button>
        );
      })}
      <span className="font-label-sm text-label-sm text-on-surface-variant ml-xs">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
