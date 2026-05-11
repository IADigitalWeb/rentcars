import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getPublicUrl } from "@/lib/supabase";

export async function getClientDashboard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { firstName: true, lastName: true },
  });
  if (!user) return null;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [activeReservations, totalReservations, favoritesCount, nextReservation, recentFavorites] =
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
          status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
          startDate: { gte: todayStart },
        },
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          status: true,
          startDate: true,
          endDate: true,
          totalPrice: true,
          vehicle: { select: { brand: true, model: true, images: true } },
        },
      }),
      prisma.favorite.findMany({
        where: { userId: session.user.id },
        select: {
          vehicle: {
            select: {
              id: true,
              brand: true,
              model: true,
              year: true,
              category: true,
              pricePerDay: true,
              images: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 4,
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
          vehicle: {
            ...nextReservation.vehicle,
            images: nextReservation.vehicle.images.map(getPublicUrl),
          },
        }
      : null,
    recentFavorites: recentFavorites.map((f) => ({
      ...f.vehicle,
      pricePerDay: Number(f.vehicle.pricePerDay),
      images: f.vehicle.images.map(getPublicUrl),
    })),
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
      vehicle: {
        ...r.vehicle,
        images: r.vehicle.images.map(getPublicUrl),
      },
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
