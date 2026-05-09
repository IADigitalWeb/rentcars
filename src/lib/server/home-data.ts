import { prisma } from "@/lib/prisma";

export async function getFeaturedVehicles() {
  return prisma.vehicle.findMany({
    where: { isFeatured: true, status: "AVAILABLE" },
    select: {
      id: true, brand: true, model: true, category: true,
      fuel: true, transmission: true, seats: true,
      pricePerDay: true, images: true,
    },
  });
}

export async function getActiveOffers() {
  const now = new Date();
  return prisma.specialOffer.findMany({
    where: {
      isActive: true,
      startDate: { lte: now },
      endDate: { gte: now },
    },
    orderBy: { createdAt: "desc" },
  });
}
