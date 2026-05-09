"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function toggleFavorite(vehicleId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Non connecté" };
  }

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_vehicleId: {
        userId: session.user.id,
        vehicleId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { isFavorite: false };
  }

  await prisma.favorite.create({
    data: {
      userId: session.user.id,
      vehicleId,
    },
  });
  return { isFavorite: true };
}

export async function getUserFavorites() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    select: {
      vehicle: {
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          category: true,
          fuel: true,
          transmission: true,
          seats: true,
          pricePerDay: true,
          images: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => ({
    ...f.vehicle,
    pricePerDay: Number(f.vehicle.pricePerDay),
  }));
}
