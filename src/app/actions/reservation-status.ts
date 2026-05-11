"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { ReservationStatus } from "@/generated/prisma/enums";

const VALID_TRANSITIONS: Record<string, ReservationStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function updateReservationStatus(reservationId: string, newStatus: ReservationStatus) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Accès non autorisé" };
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { status: true },
  });

  if (!reservation) {
    return { error: "Réservation introuvable" };
  }

  const allowed = VALID_TRANSITIONS[reservation.status];
  if (!allowed || !allowed.includes(newStatus)) {
    return { error: `Transition impossible de ${reservation.status} vers ${newStatus}` };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: newStatus },
  });

  return { success: true };
}

export async function cancelReservation(reservationId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté" };
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { userId: true, status: true },
  });

  if (!reservation) {
    return { error: "Réservation introuvable" };
  }

  if (reservation.userId !== session.user.id && session.user.role !== "ADMIN") {
    return { error: "Accès non autorisé" };
  }

  if (reservation.status !== "PENDING" && reservation.status !== "CONFIRMED") {
    return { error: "Seules les réservations en attente ou confirmées peuvent être annulées" };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });

  return { success: true };
}
