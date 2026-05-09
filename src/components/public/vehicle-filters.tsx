"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const ALL_CATEGORIES = [
  { value: "ALL", label: "Tous" },
  { value: "LUXURY", label: "Luxe" },
  { value: "SUV", label: "SUV" },
  { value: "URBAN", label: "Urbaine" },
  { value: "ELECTRIC", label: "Électrique" },
];

interface VehicleFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function VehicleFilters({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
}: VehicleFiltersProps) {
  return (
    <div className="bg-surface rounded-xl shadow-[0_12px_32px_rgba(35,35,35,0.08)] border border-outline-variant/30 p-lg flex flex-col md:flex-row items-center gap-gutter justify-between">
      <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
        {ALL_CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={cn(
              "px-md py-sm rounded-full font-label-sm text-label-sm uppercase hover:bg-surface-variant transition-colors border",
              activeCategory === cat.value
                ? "bg-primary/10 text-primary border-primary/30"
                : "bg-surface-container-high text-on-surface border-outline-variant/50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="w-full md:w-1/3 relative">
        <Search
          size={18}
          className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un modèle..."
          className="w-full bg-surface-container pl-xl pr-sm py-md rounded-lg border-b-2 border-outline-variant/50 focus:border-secondary focus:ring-0 focus:outline-none font-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/60"
        />
      </div>
    </div>
  );
}
