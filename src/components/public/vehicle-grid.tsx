"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VehicleFilters } from "./vehicle-filters";
import { VehicleCard } from "./vehicle-card";

interface FeaturedVehicle {
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

interface VehicleGridProps {
  vehicles: FeaturedVehicle[];
}

export function VehicleGrid({ vehicles }: VehicleGridProps) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return vehicles.filter((v) => {
      const matchesCategory = activeCategory === "ALL" || v.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        v.brand.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        `${v.brand} ${v.model}`.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [vehicles, activeCategory, searchQuery]);

  return (
    <section className="max-w-7xl mx-auto px-margin py-xl flex flex-col gap-xl">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-xs">
          <h2 className="font-headline-lg text-headline-lg text-on-background">Flotte Premium</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Découvrez notre sélection de véhicules haut de gamme disponibles immédiatement.
          </p>
        </div>
        <Link
          href="/inventaire"
          className="hidden md:flex items-center gap-xs font-label-bold text-label-bold text-primary hover:text-surface-tint transition-colors group"
        >
          Voir tout l&apos;inventaire
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="-mt-[40px] relative z-20">
        <VehicleFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} {...vehicle} />
          ))}
        </div>
      ) : (
        <div className="text-center py-xl">
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Aucun véhicule trouvé pour cette recherche.
          </p>
        </div>
      )}
    </section>
  );
}
