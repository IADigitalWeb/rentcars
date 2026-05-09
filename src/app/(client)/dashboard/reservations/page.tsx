import { getClientReservations } from "@/lib/server/client-data";
import { redirect } from "next/navigation";
import { ClientReservations } from "@/components/client/client-reservations";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Réservations — RentCars",
};

export default async function ReservationsPage() {
  const reservations = await getClientReservations();
  if (reservations === null) redirect("/auth/connexion");

  return <ClientReservations reservations={reservations} />;
}
