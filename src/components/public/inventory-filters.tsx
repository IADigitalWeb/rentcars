"use client";

import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  fuels: string[];
  transmissions: string[];
  seats: string[];
  brands: string[];
}

interface InventoryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
  fuelCounts: Record<string, number>;
}

function CheckboxGroup({
  options,
  selected,
  onChange,
  counts,
}: {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  counts?: Record<string, number>;
}) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="flex flex-col gap-xs">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-sm cursor-pointer group">
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary"
          />
          <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors flex-1">
            {opt.label}
          </span>
          {counts && (
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              ({counts[opt.value] || 0})
            </span>
          )}
        </label>
      ))}
    </div>
  );
}

const SEAT_OPTIONS = [
  { value: "2", label: "2 places" },
  { value: "4", label: "4 places" },
  { value: "5", label: "5 places" },
  { value: "7+", label: "7+ places" },
];

export function InventoryFilters({
  filters,
  onFilterChange,
  categoryCounts,
  brandCounts,
  fuelCounts,
}: InventoryFiltersProps) {
  const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  }));
  const fuelOptions = Object.entries(FUEL_LABELS).map(([value, label]) => ({ value, label }));
  const transmissionOptions = Object.entries(TRANSMISSION_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  const brandOptions = Object.entries(brandCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([value]) => ({ value, label: value }));

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      priceMin: 50,
      priceMax: 500,
      fuels: [],
      transmissions: [],
      seats: [],
      brands: [],
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.priceMin > 50 ||
    filters.priceMax < 500 ||
    filters.fuels.length > 0 ||
    filters.transmissions.length > 0 ||
    filters.seats.length > 0 ||
    filters.brands.length > 0;

  return (
    <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-md">
      <div className="flex items-center justify-between">
        <h3 className="font-label-bold text-label-bold text-on-surface uppercase">Filtres</h3>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-xs font-label-sm text-label-sm text-primary hover:underline"
          >
            <RotateCcw size={14} />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="flex flex-col gap-md">
        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
            Catégorie
          </h4>
          <CheckboxGroup
            options={categoryOptions}
            selected={filters.categories}
            onChange={(v) => onFilterChange({ ...filters, categories: v })}
            counts={categoryCounts}
          />
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
            Prix / jour
          </h4>
          <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-sm">
              <input
                type="number"
                min={50}
                max={filters.priceMax}
                value={filters.priceMin}
                onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) })}
                className="w-full bg-surface-container px-sm py-xs rounded border border-outline-variant/50 font-label-sm text-label-sm text-on-surface"
              />
              <span className="text-on-surface-variant">—</span>
              <input
                type="number"
                min={filters.priceMin}
                max={500}
                value={filters.priceMax}
                onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) })}
                className="w-full bg-surface-container px-sm py-xs rounded border border-outline-variant/50 font-label-sm text-label-sm text-on-surface"
              />
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              {filters.priceMin}€ — {filters.priceMax}€
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
            Carburant
          </h4>
          <CheckboxGroup
            options={fuelOptions}
            selected={filters.fuels}
            onChange={(v) => onFilterChange({ ...filters, fuels: v })}
            counts={fuelCounts}
          />
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
            Transmission
          </h4>
          <CheckboxGroup
            options={transmissionOptions}
            selected={filters.transmissions}
            onChange={(v) => onFilterChange({ ...filters, transmissions: v })}
          />
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
            Places
          </h4>
          <CheckboxGroup
            options={SEAT_OPTIONS}
            selected={filters.seats}
            onChange={(v) => onFilterChange({ ...filters, seats: v })}
          />
        </div>

        {brandOptions.length > 1 && (
          <div className="flex flex-col gap-sm">
            <h4 className="font-label-bold text-label-bold text-on-surface-variant uppercase text-label-sm">
              Marque
            </h4>
            <CheckboxGroup
              options={brandOptions}
              selected={filters.brands}
              onChange={(v) => onFilterChange({ ...filters, brands: v })}
              counts={brandCounts}
            />
          </div>
        )}
      </div>
    </aside>
  );
}
