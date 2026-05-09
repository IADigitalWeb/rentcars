import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getClientDashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true },
  });
  if (!user) return null;

  const [activeReservations, totalReservations, favoritesCount, nextReservation] =
    await Promise.all([
      prisma.reservation.count({
        where: {
          userId: session.user.id,
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        },
      }),
      prisma.reservation.count({
        where: { userId: session.user.id },
      }),
      prisma.favorite.count({
        where: { userId: session.user.id },
      }),
      prisma.reservation.findFirst({
        where: {
          userId: session.user.id,
          status: { in: ["PENDING", "CONFIRMED"] },
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          vehicle: { select: { brand: true, model: true, images: true } },
        },
      }),
    ]);

  return {
    user,
    activeReservations,
    totalReservations,
    favoritesCount,
    nextReservation: nextReservation
      ? {
          ...nextReservation,
          totalPrice: Number(nextReservation.totalPrice),
          startDate: nextReservation.startDate.toISOString(),
          endDate: nextReservation.endDate.toISOString(),
        }
      : null,
  };
}

export async function getClientReservations() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.reservation.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
      totalPrice: true,
      paymentRef: true,
      vehicle: { select: { brand: true, model: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  }).then((reservations) =>
    reservations.map((r) => ({
      ...r,
      totalPrice: Number(r.totalPrice),
      startDate: r.startDate.toISOString(),
      endDate: r.endDate.toISOString(),
    }))
  );
}

export async function getClientProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      birthDate: true,
    },
  });
}
