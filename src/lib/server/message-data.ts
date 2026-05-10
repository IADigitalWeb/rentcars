import { prisma } from "@/lib/prisma";

export async function getAllMessages() {
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getUnreadMessageCount() {
  return prisma.message.count({
    where: { isRead: false },
  });
}
