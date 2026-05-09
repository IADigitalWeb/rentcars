import { getAdminStatistics, getMonthlyRevenue, getReservationsByCategory } from "@/lib/server/admin-data";
import { AdminStatistics } from "@/components/admin/admin-statistics";

export default async function AdminStatistiquesPage() {
  const [stats, revenue, byCategory] = await Promise.all([
    getAdminStatistics(),
    getMonthlyRevenue(),
    getReservationsByCategory(),
  ]);

  const serializedTopVehicles = stats.topVehicles.map((v) => ({
    ...v,
  }));

  return (
    <AdminStatistics
      avgBasket={stats.avgBasket}
      topVehicles={serializedTopVehicles}
      revenue={revenue}
      byCategory={byCategory}
    />
  );
}
