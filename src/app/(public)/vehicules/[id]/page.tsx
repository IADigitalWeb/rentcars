import { getVehicleById } from "@/lib/server/vehicle-data";
import { notFound } from "next/navigation";
import { VehicleDetail } from "@/components/public/vehicle-detail";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: "Véhicule non trouvé — RentCars" };
  return {
    title: `${vehicle.brand} ${vehicle.model} — RentCars`,
    description: vehicle.description || `Louez le ${vehicle.brand} ${vehicle.model} à partir de ${vehicle.pricePerDay}€/jour.`,
  };
}

export default async function VehiculePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const session = await auth();
  let isFavorite = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: {
        userId_vehicleId: { userId: session.user.id, vehicleId: id },
      },
      select: { id: true },
    });
    isFavorite = !!fav;
  }

  const serialized = {
    ...vehicle,
    pricePerDay: Number(vehicle.pricePerDay),
    mileageLimit: vehicle.mileageLimit,
    power: vehicle.power,
    torque: vehicle.torque,
    acceleration: vehicle.acceleration ? Number(vehicle.acceleration) : null,
    topSpeed: vehicle.topSpeed,
    consumption: vehicle.consumption ? Number(vehicle.consumption) : null,
    trunkVolume: vehicle.trunkVolume,
    reviews: vehicle.reviews.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return <VehicleDetail vehicle={serialized} initialFavorite={isFavorite} />;
}
