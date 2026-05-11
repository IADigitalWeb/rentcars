"use client";

import { cn, formatPrice, RESERVATION_STATUS_COLORS, CATEGORY_LABELS, FUEL_LABELS } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  IN_PROGRESS: "En cours",
  COMPLETED: "Terminée",
  CANCELLED: "Annulée",
};
import {
  CalendarCheck,
  Euro,
  Car,
  Percent,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
  PieChart, Pie, Cell,
} from "recharts";

interface KPIs {
  reservations: number;
  reservationsTrend: number;
  revenue: number;
  revenueTrend: number;
  activeVehicles: number;
  occupancyRate: number;
}

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  user: { firstName: string; lastName: string };
  vehicle: { brand: string; model: string };
}

const CHART_COLORS = ["#994200", "#2e5ea3", "#16a34a", "#dc2626", "#7c3aed", "#ea580c"];

export function AdminOverview({
  kpis,
  revenue,
  byCategory,
  fuelDist,
  recentReservations,
}: {
  kpis: KPIs;
  revenue: { month: string; revenue: number }[];
  byCategory: { category: string; count: number }[];
  fuelDist: { fuel: string; count: number }[];
  recentReservations: Reservation[];
}) {
  const kpiCards = [
    {
      label: "Réservations ce mois",
      value: kpis.reservations,
      trend: kpis.reservationsTrend,
      icon: CalendarCheck,
    },
    {
      label: "CA ce mois",
      value: formatPrice(kpis.revenue),
      trend: kpis.revenueTrend,
      icon: Euro,
    },
    {
      label: "Véhicules actifs",
      value: kpis.activeVehicles,
      icon: Car,
    },
    {
      label: "Taux d'occupation",
      value: `${kpis.occupancyRate}%`,
      icon: Percent,
    },
  ];

  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Vue d&apos;ensemble</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {kpiCards.map((kpi) => (
          <div key={kpi.label} className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <div className="flex items-center justify-between mb-sm">
              <span className="font-label-sm text-label-sm text-on-surface-variant">{kpi.label}</span>
              <kpi.icon size={20} className="text-primary" />
            </div>
            <div className="font-headline-xl text-headline-xl text-on-surface">{kpi.value}</div>
            {"trend" in kpi && kpi.trend !== undefined && (
              <div className={cn("flex items-center gap-xs mt-xs font-label-sm text-label-sm", kpi.trend >= 0 ? "text-emerald-600" : "text-red-600")}>
                {kpi.trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {kpi.trend >= 0 ? "+" : ""}{kpi.trend}% vs mois dernier
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* Revenue Line Chart */}
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

        {/* Category Bar Chart */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Réservations par catégorie</h2>
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

      {/* Fuel Distribution + Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Fuel Donut */}
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Parc par carburant</h2>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fuelDist.map((f) => ({ name: FUEL_LABELS[f.fuel] || f.fuel, value: f.count }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {fuelDist.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-sm justify-center">
            {fuelDist.map((f, i) => (
              <span key={f.fuel} className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                {FUEL_LABELS[f.fuel] || f.fuel} ({f.count})
              </span>
            ))}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="lg:col-span-2 bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Dernières réservations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">Client</th>
                  <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">Véhicule</th>
                  <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">Dates</th>
                  <th className="text-left pb-sm font-label-sm text-label-sm text-on-surface-variant">Statut</th>
                  <th className="text-right pb-sm font-label-sm text-label-sm text-on-surface-variant">Montant</th>
                </tr>
              </thead>
              <tbody>
                {recentReservations.map((r) => (
                  <tr key={r.id} className="border-b border-outline-variant/10">
                    <td className="py-sm font-body-md text-body-md text-on-surface">{r.user.firstName} {r.user.lastName}</td>
                    <td className="py-sm font-body-md text-body-md text-on-surface">{r.vehicle.brand} {r.vehicle.model}</td>
                    <td className="py-sm font-body-md text-body-md text-on-surface-variant">
                      {new Date(r.startDate).toLocaleDateString("fr-FR")} → {new Date(r.endDate).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="py-sm">
                      <span className={cn("px-sm py-xs rounded font-label-sm text-label-sm", RESERVATION_STATUS_COLORS[r.status] || "")}>
                        {STATUS_LABELS[r.status] || r.status}
                      </span>
                    </td>
                    <td className="py-sm font-label-bold text-label-bold text-on-surface text-right">{formatPrice(r.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
