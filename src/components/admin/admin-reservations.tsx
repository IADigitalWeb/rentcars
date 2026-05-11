"use client";

import { useState, useTransition } from "react";
import { cn, formatPrice, RESERVATION_STATUS_COLORS } from "@/lib/utils";
import { Search, CheckCircle, Play, Square, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateReservationStatus } from "@/app/actions/reservation-status";
import { ReservationStatus } from "@/generated/prisma/enums";
import { useRouter } from "next/navigation";

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  options: unknown;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string };
  vehicle: { brand: string; model: string; images: string[] };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

const NEXT_ACTIONS: Record<string, { status: ReservationStatus; label: string; icon: typeof CheckCircle; variant: "primary" | "ghost" | "danger" }[]> = {
  PENDING: [
    { status: "CONFIRMED" as ReservationStatus, label: "Confirmer", icon: CheckCircle, variant: "primary" },
    { status: "CANCELLED" as ReservationStatus, label: "Refuser", icon: XCircle, variant: "danger" },
  ],
  CONFIRMED: [
    { status: "IN_PROGRESS" as ReservationStatus, label: "Démarrer", icon: Play, variant: "primary" },
    { status: "CANCELLED" as ReservationStatus, label: "Annuler", icon: XCircle, variant: "danger" },
  ],
  IN_PROGRESS: [
    { status: "COMPLETED" as ReservationStatus, label: "Terminer", icon: Square, variant: "primary" },
  ],
  COMPLETED: [],
  CANCELLED: [],
};

export function AdminReservations({ reservations }: { reservations: Reservation[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();

  const filtered = reservations.filter((r) => {
    const matchSearch = !search || `${r.user.firstName} ${r.user.lastName} ${r.user.email}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (reservationId: string, newStatus: ReservationStatus) => {
    startTransition(async () => {
      await updateReservationStatus(reservationId, newStatus);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Réservations</h1>

      <div className="flex flex-wrap gap-sm items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par client..."
            className="w-full pl-[40px] pr-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface"
        >
          <option value="ALL">Tous statuts</option>
          <option value="PENDING">En attente</option>
          <option value="CONFIRMED">Confirmée</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="COMPLETED">Terminée</option>
          <option value="CANCELLED">Annulée</option>
        </select>
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant">{filtered.length} réservation(s)</p>

      <div className="bg-surface rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Client</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Véhicule</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Dates</th>
                <th className="text-left px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Statut</th>
                <th className="text-right px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Montant</th>
                <th className="text-right px-md py-sm font-label-sm text-label-sm text-on-surface-variant">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const actions = NEXT_ACTIONS[r.status] || [];
                return (
                  <tr key={r.id} className="border-t border-outline-variant/10 hover:bg-surface-container-low/50">
                    <td className="px-md py-sm">
                      <span className="font-label-bold text-label-bold text-on-surface block">{r.user.firstName} {r.user.lastName}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{r.user.email}</span>
                    </td>
                    <td className="px-md py-sm font-body-md text-body-md text-on-surface">{r.vehicle.brand} {r.vehicle.model}</td>
                    <td className="px-md py-sm font-body-md text-body-md text-on-surface-variant">
                      {new Date(r.startDate).toLocaleDateString("fr-FR")} → {new Date(r.endDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-md py-sm">
                      <span className={cn("px-sm py-xs rounded font-label-sm text-label-sm", RESERVATION_STATUS_COLORS[r.status] || "")}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td className="px-md py-sm font-label-bold text-label-bold text-on-surface text-right">{formatPrice(r.totalPrice)}</td>
                    <td className="px-md py-sm text-right">
                      <div className="flex items-center justify-end gap-xs">
                        {actions.map((action) => (
                          <Button
                            key={action.status}
                            variant={action.variant}
                            size="sm"
                            disabled={isPending}
                            onClick={() => handleStatusChange(r.id, action.status)}
                            className="gap-xs"
                          >
                            <action.icon size={14} />
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-md py-lg text-center font-body-md text-body-md text-on-surface-variant">
                    Aucune réservation trouvée
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
