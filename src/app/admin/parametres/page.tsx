import { prisma } from "@/lib/prisma";
import { AdminSettings } from "@/components/admin/admin-settings";

export default async function AdminParametresPage() {
  const settings = await prisma.agencySettings.findFirst();

  return <AdminSettings settings={settings ? {
    name: settings.name,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    siret: settings.siret,
  } : null} />;
}
