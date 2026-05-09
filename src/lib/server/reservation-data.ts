import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getVehicleForReservation(vehicleId: string) {
  return prisma.vehicle.findUnique({
    where: { id: vehicleId, status: "AVAILABLE" },
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
      mileageLimit: true,
      images: true,
    },
  });
}

export async function checkDateConflicts(
  vehicleId: string,
  startDate: Date,
  endDate: Date,
  excludeReservationId?: string
) {
  const conflicts = await prisma.reservation.findMany({
    where: {
      vehicleId,
      status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      startDate: { lt: endDate },
      endDate: { gt: startDate },
      ...(excludeReservationId ? { id: { not: excludeReservationId } } : {}),
    },
    select: { startDate: true, endDate: true },
    orderBy: { startDate: "asc" },
  });
  return conflicts;
}

export async function getUserProfile() {
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
    },
  });
}
