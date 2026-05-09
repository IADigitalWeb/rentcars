import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORY_LABELS, FUEL_LABELS, TRANSMISSION_LABELS, formatPrice } from "@/lib/utils";
import { Users, Settings, Fuel } from "lucide-react";

interface VehicleCardProps {
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

export function VehicleCard({
  id, brand, model, category, fuel, transmission, seats, pricePerDay, images,
}: VehicleCardProps) {
  const categoryLabel = CATEGORY_LABELS[category] || category;
  const isElectric = fuel === "ELECTRIC";

  return (
    <div className="bg-surface rounded-xl border border-outline-variant/30 overflow-hidden flex flex-col hover:shadow-[0_12px_32px_rgba(35,35,35,0.08)] hover:scale-[1.02] transition-all duration-300 group">
      <div className="relative h-48 bg-surface-container-high overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${brand} ${model}`}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          src={images[0] || "/placeholder-car.jpg"}
        />
        <div
          className={cn(
            "absolute top-sm left-sm px-sm py-xs rounded font-label-sm text-label-sm uppercase tracking-wider",
            isElectric ? "bg-primary text-on-primary" : "bg-surface/90 backdrop-blur text-on-surface"
          )}
        >
          {categoryLabel}
        </div>
      </div>
      <div className="p-md flex flex-col gap-md flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-headline-md text-headline-md text-on-surface">{brand} {model}</h3>
            <span className="font-body-md text-body-md text-on-surface-variant">{categoryLabel}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-headline-md text-headline-md text-primary">{formatPrice(pricePerDay)}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">/jour</span>
          </div>
        </div>
        <div className="flex items-center justify-between gap-xs py-sm border-t border-b border-outline-variant/20 mt-auto">
          <div className="flex items-center gap-xs min-w-0">
            <Users size={16} className="text-on-surface-variant shrink-0" />
            <span className="font-label-sm text-label-sm text-on-surface truncate">{seats} pl.</span>
          </div>
          <div className="flex items-center gap-xs min-w-0 border-l border-r border-outline-variant/20 px-sm">
            <Settings size={16} className="text-on-surface-variant shrink-0" />
            <span className="font-label-sm text-label-sm text-on-surface truncate">{TRANSMISSION_LABELS[transmission] || transmission}</span>
          </div>
          <div className="flex items-center gap-xs min-w-0">
            <Fuel size={16} className="text-on-surface-variant shrink-0" />
            <span className="font-label-sm text-label-sm text-on-surface truncate">{FUEL_LABELS[fuel] || fuel}</span>
          </div>
        </div>
        <Link
          href={`/vehicules/${id}`}
          className="w-full bg-inverse-surface text-inverse-on-surface hover:bg-primary hover:text-on-primary font-label-bold text-label-bold py-[12px] rounded transition-all duration-150 text-center"
        >
          Sélectionner
        </Link>
      </div>
    </div>
  );
}
