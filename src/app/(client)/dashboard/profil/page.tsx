import { getClientProfile } from "@/lib/server/client-data";
import { redirect } from "next/navigation";
import { ClientProfile } from "@/components/client/client-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon Profil — RentCars",
};

export default async function ProfilPage() {
  const profile = await getClientProfile();
  if (!profile) redirect("/auth/connexion");

  return <ClientProfile profile={{
    ...profile,
    birthDate: profile.birthDate ? profile.birthDate.toISOString().split("T")[0] : "",
  }} />;
}
