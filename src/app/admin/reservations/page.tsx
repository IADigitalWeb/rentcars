import { getAllReservationsAdmin } from "@/lib/server/admin-data";
import { AdminReservations } from "@/components/admin/admin-reservations";

export default async function AdminReservationsPage() {
  const reservations = (await getAllReservationsAdmin()).map((r) => ({
    ...r,
    totalPrice: Number(r.totalPrice),
    startDate: r.startDate.toISOString(),
    endDate: r.endDate.toISOString(),
    createdAt: r.createdAt.toISOString(),
  }));

  return <AdminReservations reservations={reservations} />;
}
