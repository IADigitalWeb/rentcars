"use client";

import { useState } from "react";
import { cn, formatDate } from "@/lib/utils";
import { Search, UserX, Mail, Phone } from "lucide-react";

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

export function AdminClients({ clients }: { clients: Client[] }) {
  const [search, setSearch] = useState("");

  const filtered = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return `${c.firstName} ${c.lastName} ${c.email}`.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
  });

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
                  "px-xs py-[2px] rounded font-label-sm text-label-sm",
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
              <button className="p-xs rounded hover:bg-error-container/50 transition-colors" title="Suspendre">
                <UserX size={16} className="text-on-surface-variant hover:text-error" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-lg font-body-md text-body-md text-on-surface-variant">
            Aucun client trouvé
          </div>
        )}
      </div>
    </div>
  );
}
