import { formatPrice, formatDate } from "@/lib/utils";
import { CalendarCheck, History, Heart, Car } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  user: { firstName: string; lastName: string };
  activeReservations: number;
  totalReservations: number;
  favoritesCount: number;
  nextReservation: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    vehicle: { brand: string; model: string; images: string[] };
  } | null;
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

      {/* Next Reservation */}
      {data.nextReservation ? (
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Prochaine réservation</h2>
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
            </div>
            <span className="font-headline-sm text-headline-sm text-primary">
              {formatPrice(data.nextReservation.totalPrice)}
            </span>
          </div>
          <Link href="/dashboard/reservations" className="block mt-md">
            <span className="text-primary font-label-bold hover:underline">Voir mes réservations →</span>
          </Link>
        </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg text-center">
          <Car size={40} className="text-on-surface-variant mx-auto mb-sm" />
          <p className="font-body-md text-body-md text-on-surface-variant">Aucune réservation à venir</p>
          <Link href="/inventaire" className="inline-block mt-sm text-primary font-label-bold hover:underline">
            Parcourir les véhicules →
          </Link>
        </div>
      )}
    </div>
  );
}
