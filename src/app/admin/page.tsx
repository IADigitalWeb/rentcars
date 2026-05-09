import { getAdminKPIs, getMonthlyRevenue, getReservationsByCategory, getFuelDistribution, getRecentReservations } from "@/lib/server/admin-data";
import { AdminOverview } from "@/components/admin/admin-overview";

export default async function AdminDashboardPage() {
  const [kpis, revenue, byCategory, fuelDist, recentReservations] = await Promise.all([
    getAdminKPIs(),
    getMonthlyRevenue(),
    getReservationsByCategory(),
    getFuelDistribution(),
    getRecentReservations(),
  ]);

  const serializedKPIs = {
    ...kpis,
  };

  const serializedRecent = recentReservations.map((r) => ({
    ...r,
    totalPrice: Number(r.totalPrice),
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
  }));

  return (
    <AdminOverview
      kpis={serializedKPIs}
      revenue={revenue}
      byCategory={byCategory}
      fuelDist={fuelDist}
      recentReservations={serializedRecent}
    />
  );
}
