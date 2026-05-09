import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getVehicleForReservation, getUserProfile } from "@/lib/server/reservation-data";
import { ReservationPage } from "@/components/public/reservation-page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nouvelle réservation — RentCars",
};

export default async function NewReservationPage({
  searchParams,
}: {
  searchParams: Promise<{ vehicleId?: string }>;
}) {
  const params = await searchParams;
  const vehicleId = params.vehicleId;

  if (!vehicleId) {
    redirect("/inventaire");
  }

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/connexion?callbackUrl=${encodeURIComponent(`/reservations/nouvelle?vehicleId=${vehicleId}`)}`);
  }

  const [vehicle, user] = await Promise.all([
    getVehicleForReservation(vehicleId),
    getUserProfile(),
  ]);

  if (!vehicle) {
    redirect("/inventaire");
  }

  if (!user) {
    redirect("/auth/connexion");
  }

  const serializedVehicle = {
    ...vehicle,
    pricePerDay: Number(vehicle.pricePerDay),
  };

  return <ReservationPage vehicle={serializedVehicle} user={user} />;
}
