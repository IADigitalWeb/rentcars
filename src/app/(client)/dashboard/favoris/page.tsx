import { getUserFavorites } from "@/app/actions/favorites";
import { redirect } from "next/navigation";
import { ClientFavorites } from "@/components/client/client-favorites";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes Favoris — RentCars",
};

export default async function FavorisPage() {
  const favorites = await getUserFavorites();
  if (favorites === null) redirect("/auth/connexion");

  return <ClientFavorites favorites={favorites} />;
}
