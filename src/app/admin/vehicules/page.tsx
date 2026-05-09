import { getAllVehiclesAdmin } from "@/lib/server/admin-data";
import { AdminVehicles } from "@/components/admin/admin-vehicles";
import { CATEGORY_LABELS, FUEL_LABELS } from "@/lib/utils";

export default async function AdminVehiclesPage() {
  const vehicles = (await getAllVehiclesAdmin()).map((v) => ({
    ...v,
    pricePerDay: Number(v.pricePerDay),
  }));

  return <AdminVehicles vehicles={vehicles} categoryLabels={CATEGORY_LABELS} fuelLabels={FUEL_LABELS} />;
}
