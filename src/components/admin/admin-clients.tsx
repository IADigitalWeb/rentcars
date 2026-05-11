"use client";

import { useState, useTransition } from "react";
import { cn, formatDate } from "@/lib/utils";
import { Search, UserX, UserCheck, Mail, Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserStatus, getUserActiveReservations } from "@/app/actions/user-status";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: string;
  createdAt: string;
  _count: { reservations: number };
}

interface ActiveReservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  vehicle: { brand: string; model: string };
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
};

export function AdminClients({ clients }: { clients: Client[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmTarget, setConfirmTarget] = useState<Client | null>(null);
  const [activeReservations, setActiveReservations] = useState<ActiveReservation[]>([]);

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

  const handleToggleStatus = (client: Client) => {
    if (client.status === "SUSPENDED") {
      startTransition(async () => {
        await updateUserStatus(client.id, "ACTIVE");
        router.refresh();
      });
      return;
    }

    startTransition(async () => {
      const active = await getUserActiveReservations(client.id);
      if (active.length > 0) {
        setActiveReservations(active);
        setConfirmTarget(client);
      } else {
        await updateUserStatus(client.id, "SUSPENDED");
        router.refresh();
      }
    });
  };

  const confirmSuspend = () => {
    if (!confirmTarget) return;
    startTransition(async () => {
      await updateUserStatus(confirmTarget.id, "SUSPENDED");
      setConfirmTarget(null);
      setActiveReservations([]);
      router.refresh();
    });
  };

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Clients</h1>

      <div className="relative">
        <Search size={18} className="absolute left-sm top-1/2 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom, email ou téléphone..."
          className="w-full pl-[40px] pr-sm py-sm bg-surface-container rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
        />
      </div>

      <p className="font-label-sm text-label-sm text-on-surface-variant">{filtered.length} client(s)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        {filtered.map((c) => (
          <div key={c.id} className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <div className="flex items-start justify-between mb-sm">
              <div>
                <span className="font-label-bold text-label-bold text-on-surface block">{c.firstName} {c.lastName}</span>
                <span className={cn(
                  "inline-block mt-xs px-xs py-[2px] rounded font-label-sm text-label-sm",
                  c.status === "ACTIVE" ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"
                )}>
                  {c.status === "ACTIVE" ? "Actif" : "Suspendu"}
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                {c._count.reservations} réservation{c._count.reservations !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex flex-col gap-xs">
              <span className="flex items-center gap-xs font-body-md text-body-md text-on-surface-variant">
                <Mail size={14} /> {c.email}
              </span>
              {c.phone && (
                <span className="flex items-center gap-xs font-body-md text-body-md text-on-surface-variant">
                  <Phone size={14} /> {c.phone}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between mt-sm pt-sm border-t border-outline-variant/10">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Inscrit le {formatDate(c.createdAt)}</span>
              <Button
                variant={c.status === "ACTIVE" ? "danger" : "primary"}
                size="sm"
                disabled={isPending}
                onClick={() => handleToggleStatus(c)}
                className="gap-xs"
              >
                {c.status === "ACTIVE" ? <UserX size={14} /> : <UserCheck size={14} />}
                {c.status === "ACTIVE" ? "Suspendre" : "Réactiver"}
              </Button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-lg font-body-md text-body-md text-on-surface-variant">
            Aucun client trouvé
          </div>
        )}
      </div>

      {confirmTarget && createPortal(
        <div
          style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <div
            style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => { setConfirmTarget(null); setActiveReservations([]); }}
          />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-[600px] mx-4">
            <div className="flex items-center gap-sm p-4 border-b border-gray-200">
              <AlertTriangle size={20} className="text-amber-500 shrink-0" />
              <h2 className="text-lg font-semibold text-gray-900">Attention — Locations en cours</h2>
            </div>
            <div className="p-4">
              <p className="text-gray-700 mb-3">
                <strong>{confirmTarget.firstName} {confirmTarget.lastName}</strong> a {activeReservations.length} réservation{activeReservations.length > 1 ? "s" : ""} active{activeReservations.length > 1 ? "s" : ""}. Le compte sera suspendu mais les réservations resteront actives jusqu&apos;au retour du véhicule.
              </p>
              <div className="flex flex-col gap-2 mb-4">
                {activeReservations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm">
                    <span className="font-medium text-gray-900">{r.vehicle.brand} {r.vehicle.model}</span>
                    <span className="text-gray-500">
                      {new Date(r.startDate).toLocaleDateString("fr-FR")} → {new Date(r.endDate).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-700">
                      {STATUS_LABELS[r.status] || r.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => { setConfirmTarget(null); setActiveReservations([]); }}>
                  Annuler
                </Button>
                <Button variant="danger" disabled={isPending} onClick={confirmSuspend}>
                  Confirmer la suspension
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
