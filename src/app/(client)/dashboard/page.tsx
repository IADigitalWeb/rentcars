import { getClientDashboard } from "@/lib/server/client-data";
import { redirect } from "next/navigation";
import { ClientDashboard } from "@/components/client/client-dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tableau de bord — RentCars",
};

export default async function DashboardPage() {
  const data = await getClientDashboard();
  if (!data) redirect("/auth/connexion");

  return <ClientDashboard data={data} />;
}
