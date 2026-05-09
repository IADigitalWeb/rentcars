"use client";

import { useState, useMemo } from "react";
import { InventoryFilters } from "./inventory-filters";
import { InventoryToolbar, type SortOption, type ViewMode } from "./inventory-toolbar";
import { InventoryGrid } from "./inventory-grid";

interface VehicleItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  images: string[];
  isFeatured: boolean;
  createdAt: string;
  _count: { reservations: number };
}

interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  fuels: string[];
  transmissions: string[];
  seats: string[];
  brands: string[];
}

const ITEMS_PER_PAGE = 10;

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  priceMin: 50,
  priceMax: 500,
  fuels: [],
  transmissions: [],
  seats: [],
  brands: [],
};

export function InventoryPage({ vehicles }: { vehicles: VehicleItem[] }) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      if (filters.categories.length > 0 && !filters.categories.includes(v.category)) return false;
      if (v.pricePerDay < filters.priceMin || v.pricePerDay > filters.priceMax) return false;
      if (filters.fuels.length > 0 && !filters.fuels.includes(v.fuel)) return false;
      if (filters.transmissions.length > 0 && !filters.transmissions.includes(v.transmission)) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(v.brand)) return false;
      if (filters.seats.length > 0) {
        const seatMatch = filters.seats.some((s) => {
          if (s === "7+") return v.seats >= 7;
          return v.seats === Number(s);
        });
        if (!seatMatch) return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    switch (sort) {
      case "price-asc": return copy.sort((a, b) => a.pricePerDay - b.pricePerDay);
      case "price-desc": return copy.sort((a, b) => b.pricePerDay - a.pricePerDay);
      case "popular": return copy.sort((a, b) => b._count.reservations - a._count.reservations);
      case "newest": return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      default: return copy;
    }
  }, [filtered, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => { counts[v.category] = (counts[v.category] || 0) + 1; });
    return counts;
  }, [vehicles]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => { counts[v.brand] = (counts[v.brand] || 0) + 1; });
    return counts;
  }, [vehicles]);

  const fuelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach((v) => { counts[v.fuel] = (counts[v.fuel] || 0) + 1; });
    return counts;
  }, [vehicles]);

  return (
    <div className="max-w-7xl mx-auto px-margin py-xl">
      <div className="flex flex-col gap-sm mb-lg">
        <h1 className="font-headline-xl text-headline-xl text-on-background">Notre Inventaire</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Parcourez notre sélection complète de véhicules disponibles à la location.
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-lg">
        <InventoryFilters
          filters={filters}
          onFilterChange={(f) => { setFilters(f); setPage(1); }}
          categoryCounts={categoryCounts}
          brandCounts={brandCounts}
          fuelCounts={fuelCounts}
        />
        <div className="flex-1 flex flex-col gap-md">
          <InventoryToolbar
            totalResults={sorted.length}
            sort={sort}
            onSortChange={setSort}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
          {paginated.length > 0 ? (
            <InventoryGrid
              vehicles={paginated}
              viewMode={viewMode}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : (
            <div className="text-center py-xl">
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Aucun véhicule ne correspond à vos critères.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
