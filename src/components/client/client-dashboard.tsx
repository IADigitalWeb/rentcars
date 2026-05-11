import { formatPrice, formatDate, RESERVATION_STATUS_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CalendarCheck, History, Heart, Car, Fuel, Users as UsersIcon } from "lucide-react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const CATEGORY_LABELS: Record<string, string> = {
  BERLINE: "Berline",
  SUV: "SUV",
  CITADINE: "Citadine",
  UTILITAIRE: "Utilitaire",
  SPORTIVE: "Sportive",
};

interface FavoriteItem {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  images: string[];
}

interface DashboardData {
  user: { firstName: string; lastName: string };
  activeReservations: number;
  totalReservations: number;
  favoritesCount: number;
  nextReservation: {
    id: string;
    status: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    vehicle: { brand: string; model: string; images: string[] };
  } | null;
  recentFavorites: FavoriteItem[];
}

export function ClientDashboard({ data }: { data: DashboardData }) {
  const counters = [
    { label: "Réservations actives", value: data.activeReservations, icon: CalendarCheck, color: "text-primary" },
    { label: "Historique total", value: data.totalReservations, icon: History, color: "text-blue-600" },
    { label: "Favoris", value: data.favoritesCount, icon: Heart, color: "text-red-500" },
  ];

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">
          Bonjour, {data.user.firstName}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
          Bienvenue sur votre espace personnel
        </p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        {counters.map((counter) => (
          <div key={counter.label} className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{counter.label}</span>
              <counter.icon size={20} className={counter.color} />
            </div>
            <span className="font-headline-xl text-headline-xl text-on-surface">{counter.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Next Reservation */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Prochaine réservation</h2>
          {data.nextReservation ? (
            <>
              <div className="flex items-center gap-md">
                <div className="w-20 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={data.nextReservation.vehicle.images[0] || "/placeholder-car.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-label-bold text-label-bold text-on-surface block">
                    {data.nextReservation.vehicle.brand} {data.nextReservation.vehicle.model}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {formatDate(data.nextReservation.startDate)} → {formatDate(data.nextReservation.endDate)}
                  </span>
                  <span className={cn("inline-block mt-xs px-sm py-xs rounded font-label-sm text-label-sm", RESERVATION_STATUS_COLORS[data.nextReservation.status] || "")}>
                    {STATUS_LABELS[data.nextReservation.status] || data.nextReservation.status}
                  </span>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary">
                  {formatPrice(data.nextReservation.totalPrice)}
                </span>
              </div>
              <Link href="/dashboard/reservations" className="block mt-md">
                <span className="text-primary font-label-bold hover:underline">Voir mes réservations →</span>
              </Link>
            </>
          ) : (
            <div className="text-center py-md">
              <Car size={32} className="text-on-surface-variant mx-auto mb-sm" />
              <p className="font-body-md text-body-md text-on-surface-variant">Aucune réservation à venir</p>
              <Link href="/inventaire" className="inline-block mt-sm text-primary font-label-bold hover:underline">
                Parcourir les véhicules →
              </Link>
            </div>
          )}
        </div>

        {/* Favorites */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <div className="flex items-center justify-between mb-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Mes favoris</h2>
            {data.favoritesCount > 4 && (
              <Link href="/dashboard/favoris" className="text-primary font-label-bold hover:underline">
                Voir tout →
              </Link>
            )}
          </div>
          {data.recentFavorites.length > 0 ? (
            <div className="flex flex-col gap-sm">
              {data.recentFavorites.map((fav) => (
                <Link
                  key={fav.id}
                  href={`/vehicules/${fav.id}`}
                  className="flex items-center gap-sm p-sm rounded-lg hover:bg-surface-container transition-colors"
                >
                  <div className="w-14 h-12 rounded-lg bg-surface-container overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fav.images[0] || "/placeholder-car.jpg"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-label-bold text-label-bold text-on-surface block truncate">
                      {fav.brand} {fav.model}
                    </span>
                    <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                      <span>{CATEGORY_LABELS[fav.category] || fav.category}</span>
                      <span>·</span>
                      <span className="flex items-center gap-xs"><UsersIcon size={12} /> {fav.year}</span>
                      <span>·</span>
                      <span className="flex items-center gap-xs"><Fuel size={12} /></span>
                    </div>
                  </div>
                  <span className="font-label-bold text-label-bold text-primary shrink-0">
                    {formatPrice(fav.pricePerDay)}/j
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-md">
              <Heart size={32} className="text-on-surface-variant mx-auto mb-sm" />
              <p className="font-body-md text-body-md text-on-surface-variant">Aucun favori pour le moment</p>
              <Link href="/inventaire" className="inline-block mt-sm text-primary font-label-bold hover:underline">
                Découvrir des véhicules →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
