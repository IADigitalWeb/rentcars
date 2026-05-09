import { prisma } from "@/lib/prisma";

export async function getAllVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
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
      isFeatured: true,
      createdAt: true,
      _count: { select: { reservations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
