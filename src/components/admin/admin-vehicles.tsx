"use client";

import { useState } from "react";
import { cn, formatPrice, CATEGORY_LABELS, FUEL_LABELS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  status: string;
  isFeatured: boolean;
  images: string[];
}

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  MAINTENANCE: "Maintenance",
  OUT_OF_SERVICE: "Hors service",
};

const STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "text-emerald-600 bg-emerald-50",
  MAINTENANCE: "text-amber-600 bg-amber-50",
  OUT_OF_SERVICE: "text-red-600 bg-red-50",
};

export function AdminVehicles({
  vehicles,
}: {
  vehicles: Vehicle[];
  categoryLabels: Record<string, string>;
  fuelLabels: Record<string, string>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = vehicles.filter((v) => {
    const matchSearch = !search || `${v.brand} ${v.model}`.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "ALL" || v.category === categoryFilter;
    const matchStatus = statusFilter === "ALL" || v.status === statusFilter;
    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Véhicules</h1>
        <Button className="gap-xs">
          <Plus size={18} />
          Ajouter un véhicule
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-sm items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par marque ou modèle..."
            className="w-full pl-[40px] pr-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface"
        >
          <option value="ALL">Toutes catégories</option>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface"
        >
          <option value="ALL">Tous statuts</option>
          <option value="AVAILABLE">Disponible</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OUT_OF_SERVICE">Hors service</option>
        </select>
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant">{filtered.length} véhicule(s)</p>

      {/* Table */}
      <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Véhicule</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Catégorie</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Carburant</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Prix/jour</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Statut</th>
                <th className="text-right px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50">
                  <td className="px-md py-sm">
                    <div className="flex items-center gap-sm">
                      <div className="w-12 h-10 rounded bg-surface-container overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.images[0] || "/placeholder-car.jpg"} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="font-label-bold text-label-bold text-on-surface block">{v.brand} {v.model}</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{v.year} · {v.seats} places</span>
                      </div>
                      {v.isFeatured && <span className="text-[10px] bg-primary/10 text-primary px-xs rounded font-bold">PREMIUM</span>}
                    </div>
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface">
                    <Badge variant="category" value={v.category} />
                  </td>
                  <td className="px-md py-sm font-body-md text-body-md text-on-surface">{FUEL_LABELS[v.fuel]}</td>
                  <td className="px-md py-sm font-label-bold text-label-bold text-on-surface">{formatPrice(v.pricePerDay)}</td>
                  <td className="px-md py-sm">
                    <span className={cn("px-sm py-xs rounded font-label-sm text-label-sm", STATUS_COLORS[v.status] || "")}>
                      {STATUS_LABELS[v.status] || v.status}
                    </span>
                  </td>
                  <td className="px-md py-sm">
                    <div className="flex items-center justify-end gap-xs">
                      <Link href={`/vehicules/${v.id}`} className="p-xs rounded hover:bg-surface-container transition-colors">
                        <Eye size={16} className="text-on-surface-variant" />
                      </Link>
                      <button className="p-xs rounded hover:bg-surface-container transition-colors">
                        <Edit size={16} className="text-on-surface-variant" />
                      </button>
                      <button className="p-xs rounded hover:bg-error-container/50 transition-colors">
                        <Trash2 size={16} className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-lg text-center font-body-md text-body-md text-on-surface-variant">
                    Aucun véhicule trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
