import { getAllClientsAdmin } from "@/lib/server/admin-data";
import { AdminClients } from "@/components/admin/admin-clients";

export default async function AdminClientsPage() {
  const clients = (await getAllClientsAdmin()).map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
  }));

  return <AdminClients clients={clients} />;
}
