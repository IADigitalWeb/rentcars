"use client";

import { cn, formatPrice, formatDate, RESERVATION_STATUS_COLORS } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import Link from "next/link";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  paymentRef: string | null;
  vehicle: { brand: string; model: string; images: string[] };
}

export function ClientReservations({ reservations }: { reservations: Reservation[] }) {
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Mes Réservations</h1>

      {reservations.length === 0 ? (
        <div className="text-center py-xl">
          <p className="font-body-lg text-body-lg text-on-surface-variant">Aucune réservation pour le moment</p>
          <Link href="/inventaire" className="inline-block mt-md">
            <Button>Parcourir les véhicules</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {reservations.map((r) => (
            <div key={r.id} className="bg-surface rounded-xl border border-outline-variant/20 p-md">
              <div className="flex items-center gap-md">
                <div className="w-20 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.vehicle.images[0] || "/placeholder-car.jpg"}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <span className="font-label-bold text-label-bold text-on-surface block">
                    {r.vehicle.brand} {r.vehicle.model}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {formatDate(r.startDate)} → {formatDate(r.endDate)}
                  </span>
                </div>
                <div className="text-right flex flex-col items-end gap-xs">
                  <span className={cn("px-sm py-xs rounded font-label-sm text-label-sm", RESERVATION_STATUS_COLORS[r.status] || "")}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                  <span className="font-label-bold text-label-bold text-on-surface">{formatPrice(r.totalPrice)}</span>
                  {r.paymentRef && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Réf: {r.paymentRef}</span>
                  )}
                </div>
              </div>
              {(r.status === "PENDING" || r.status === "CONFIRMED") && (
                <div className="mt-sm pt-sm border-t border-outline-variant/10 flex justify-end">
                  <Button variant="danger" size="sm" onClick={() => setCancelTarget(r.id)}>
                    Annuler
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Annuler la réservation"
      >
        <p className="font-body-md text-body-md text-on-surface-variant mb-md">
          Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible.
        </p>
        <div className="flex gap-sm justify-end">
          <Button variant="ghost" onClick={() => setCancelTarget(null)}>Non, garder</Button>
          <Button variant="danger" onClick={() => setCancelTarget(null)}>Oui, annuler</Button>
        </div>
      </Modal>
    </div>
  );
}
