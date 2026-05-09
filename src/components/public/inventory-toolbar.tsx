"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOption = "price-asc" | "price-desc" | "popular" | "newest";
export type ViewMode = "grid" | "list";

interface InventoryToolbarProps {
  totalResults: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Nouveautés" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "popular", label: "Popularité" },
];

export function InventoryToolbar({
  totalResults,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
}: InventoryToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-md py-md">
      <span className="font-body-md text-body-md text-on-surface-variant">
        <strong className="text-on-surface">{totalResults}</strong> véhicule{totalResults !== 1 ? "s" : ""} trouvé{totalResults !== 1 ? "s" : ""}
      </span>
      <div className="flex items-center gap-md">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="bg-surface-container px-md py-sm rounded-lg border border-outline-variant/50 font-label-bold text-label-bold text-on-surface appearance-none pr-xl cursor-pointer"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="flex items-center border border-outline-variant/30 rounded overflow-hidden">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-sm transition-colors",
              viewMode === "grid" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container"
            )}
            aria-label="Vue grille"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-sm transition-colors",
              viewMode === "list" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-container"
            )}
            aria-label="Vue liste"
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
