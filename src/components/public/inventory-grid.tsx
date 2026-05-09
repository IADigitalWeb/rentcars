"use client";

import { VehicleCard } from "./vehicle-card";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS, formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ViewMode } from "./inventory-toolbar";

interface VehicleItem {
  id: string;
  brand: string;
  model: string;
  category: string;
  fuel: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  images: string[];
}

interface InventoryGridProps {
  vehicles: VehicleItem[];
  viewMode: ViewMode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function VehicleListItem({ vehicle }: { vehicle: VehicleItem }) {
  return (
    <Link
      href={`/vehicules/${vehicle.id}`}
      className="flex flex-col sm:flex-row bg-surface rounded-xl border border-outline-variant/30 overflow-hidden hover:shadow-[0_12px_32px_rgba(35,35,35,0.08)] hover:scale-[1.01] transition-all duration-300 group"
    >
      <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-surface-container-high overflow-hidden shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={vehicle.images[0] || "/placeholder-car.jpg"}
        />
      </div>
      <div className="p-md flex flex-col gap-sm flex-grow justify-between">
        <div>
          <div className="flex items-center gap-sm mb-xs">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant bg-surface-container-high px-sm py-xs rounded">
              {CATEGORY_LABELS[vehicle.category] || vehicle.category}
            </span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            {vehicle.brand} {vehicle.model}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-sm">
          <div className="flex items-center gap-md font-label-sm text-label-sm text-on-surface-variant">
            <span>{vehicle.seats} places</span>
            <span>{TRANSMISSION_LABELS[vehicle.transmission] || vehicle.transmission}</span>
            <span>{FUEL_LABELS[vehicle.fuel] || vehicle.fuel}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-headline-md text-headline-md text-primary">
              {formatPrice(vehicle.pricePerDay)}
            </span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/jour</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function InventoryGrid({
  vehicles,
  viewMode,
  page,
  totalPages,
  onPageChange,
}: InventoryGridProps) {
  return (
    <div className="flex flex-col gap-md">
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} {...v} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-gutter">
          {vehicles.map((v) => (
            <VehicleListItem key={v.id} vehicle={v} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-sm py-md">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-sm rounded hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                "w-10 h-10 rounded font-label-bold text-label-bold transition-colors",
                p === page
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:bg-surface-container"
              )}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-sm rounded hover:bg-surface-container transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
