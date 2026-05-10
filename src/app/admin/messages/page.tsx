import { getAllMessages } from "@/lib/server/message-data";
import { AdminMessages } from "@/components/admin/admin-messages";

export default async function AdminMessagesPage() {
  const messages = await getAllMessages();

  const serialized = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt,
  }));

  return <AdminMessages messages={serialized} />;
}
