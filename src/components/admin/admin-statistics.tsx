"use client";

import { formatPrice, CATEGORY_LABELS } from "@/lib/utils";
import { Trophy } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";

export function AdminStatistics({
  avgBasket,
  topVehicles,
  revenue,
  byCategory,
}: {
  avgBasket: number;
  topVehicles: { id: string; brand: string; model: string; rentalCount: number }[];
  revenue: { month: string; revenue: number }[];
  byCategory: { category: string; count: number }[];
}) {
  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Statistiques</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Panier moyen</span>
          <p className="font-headline-xl text-headline-xl text-primary">{formatPrice(avgBasket)}</p>
        </div>
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Véhicules dans le parc</span>
          <p className="font-headline-xl text-headline-xl text-on-surface">{topVehicles.length > 0 ? byCategory.reduce((s, c) => s + c.count, 0) : 0}</p>
        </div>
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Catégories</span>
          <p className="font-headline-xl text-headline-xl text-on-surface">{byCategory.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Revenue */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Revenus mensuels</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => formatPrice(value as number)} />
                <Line type="monotone" dataKey="revenue" stroke="#994200" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category distribution */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Par catégorie</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory.map((c) => ({ name: CATEGORY_LABELS[c.category] || c.category, count: c.count }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2e5ea3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Vehicles */}
      <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
          <Trophy size={20} className="text-primary" />
          Top véhicules les plus loués
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/30">
                <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">#</th>
                <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">Véhicule</th>
                <th className="text-right pb-sm font-label-sm text-label-sm text-on-surface-variant">Locations</th>
              </tr>
            </thead>
            <tbody>
              {topVehicles.map((v, i) => (
                <tr key={v.id} className="border-b border-outline-variant/10">
                  <td className="py-sm font-label-bold text-label-bold text-primary">{i + 1}</td>
                  <td className="py-sm font-body-md text-body-md text-on-surface">{v.brand} {v.model}</td>
                  <td className="py-sm font-label-bold text-label-bold text-on-surface text-right">{v.rentalCount}</td>
                </tr>
              ))}
              {topVehicles.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-lg text-center font-body-md text-body-md text-on-surface-variant">
                    Aucune donnée disponible
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
