"use client";

import { useState, useTransition } from "react";
import { cn, formatPrice, CATEGORY_LABELS, FUEL_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toggleFavorite } from "@/app/actions/favorites";
import { Users, Settings, Fuel, Heart, Trash2 } from "lucide-react";
import Link from "next/link";

interface FavoriteVehicle {
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
}

export function ClientFavorites({ favorites: initialFavorites }: { favorites: FavoriteVehicle[] }) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [isPending, startTransition] = useTransition();

  const handleRemove = (vehicleId: string) => {
    startTransition(async () => {
      const result = await toggleFavorite(vehicleId);
      if ("isFavorite" in result && !result.isFavorite) {
        setFavorites((prev) => prev.filter((v) => v.id !== vehicleId));
      }
    });
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col gap-lg">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Mes Favoris</h1>
        <div className="text-center py-xl">
          <Heart size={40} className="text-on-surface-variant mx-auto mb-sm" />
          <p className="font-body-lg text-body-lg text-on-surface-variant">Aucun véhicule en favori</p>
          <Link href="/inventaire" className="inline-block mt-md">
            <Button>Parcourir les véhicules</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Mes Favoris</h1>
      <p className="font-label-sm text-label-sm text-on-surface-variant">{favorites.length} véhicule(s)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        {favorites.map((v) => (
          <div key={v.id} className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="h-40 bg-surface-container relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={v.images[0] || "/placeholder-car.jpg"}
                alt={`${v.brand} ${v.model}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleRemove(v.id)}
                disabled={isPending}
                className="absolute top-sm right-sm p-xs rounded-full bg-surface/90 hover:bg-surface transition-colors"
                aria-label="Retirer des favoris"
              >
                <Heart size={20} className="fill-error text-error" />
              </button>
            </div>
            <div className="p-md">
              <div className="flex items-center gap-xs mb-xs">
                <Badge variant="category" value={v.category} />
              </div>
              <h3 className="font-label-bold text-label-bold text-on-surface">{v.brand} {v.model}</h3>
              <div className="flex gap-sm mt-xs">
                <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                  <Users size={14} /> {v.seats}
                </span>
                <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                  <Settings size={14} /> {v.transmission === "AUTOMATIC" ? "Auto" : "Manuelle"}
                </span>
                <span className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                  <Fuel size={14} /> {FUEL_LABELS[v.fuel]}
                </span>
              </div>
              <div className="flex items-center justify-between mt-sm">
                <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(v.pricePerDay)}<span className="font-body-sm text-body-sm text-on-surface-variant">/jour</span></span>
                <Link href={`/reservations/nouvelle?vehicleId=${v.id}`}>
                  <Button size="sm">Réserver</Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
