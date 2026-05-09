import { getAllVehicles } from "@/lib/server/inventory-data";
import { InventoryPage } from "@/components/public/inventory-page";

export const metadata = {
  title: "Inventaire — RentCars",
  description: "Parcourez notre sélection complète de véhicules disponibles à la location.",
};

export default async function InventairePage() {
  const vehicles = await getAllVehicles();

  const serialized = vehicles.map((v) => ({
    ...v,
    pricePerDay: Number(v.pricePerDay),
    createdAt: v.createdAt.toISOString(),
  }));

  return <InventoryPage vehicles={serialized} />;
}
