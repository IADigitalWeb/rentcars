"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserActiveReservations(userId: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return [];
  }

  return prisma.reservation.findMany({
    where: {
      userId,
      status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
    },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
      vehicle: { select: { brand: true, model: true } },
    },
    orderBy: { endDate: "asc" },
  }).then((reservations) =>
    reservations.map((r) => ({
      ...r,
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
    }))
  );
}

export async function updateUserStatus(userId: string, status: "ACTIVE" | "SUSPENDED") {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Accès non autorisé" };
  }

  if (session.user.id === userId) {
    return { error: "Vous ne pouvez pas modifier votre propre statut" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    return { error: "Utilisateur introuvable" };
  }

  if (user.role === "ADMIN") {
    return { error: "Impossible de suspendre un administrateur" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  return { success: true };
}
