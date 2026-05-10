import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";

export async function getAdminKPIs() {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const prevMonthStart = startOfMonth(subMonths(now, 1));
  const prevMonthEnd = endOfMonth(subMonths(now, 1));

  const [
    currentMonthReservations,
    prevMonthReservations,
    currentMonthRevenue,
    prevMonthRevenue,
    activeVehicles,
    totalVehicles,
    reservationsThisMonth,
  ] = await Promise.all([
    prisma.reservation.count({
      where: { createdAt: { gte: monthStart, lte: monthEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.reservation.count({
      where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: monthStart, lte: monthEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.reservation.aggregate({
      _sum: { totalPrice: true },
      where: { createdAt: { gte: prevMonthStart, lte: prevMonthEnd }, status: { not: "CANCELLED" } },
    }),
    prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
    prisma.vehicle.count(),
    prisma.reservation.findMany({
      where: { startDate: { lte: monthEnd }, endDate: { gte: monthStart }, status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
      select: { vehicleId: true },
    }),
  ]);

  const activeVehicleIds = new Set(reservationsThisMonth.map((r) => r.vehicleId));
  const occupancyRate = totalVehicles > 0 ? Math.round((activeVehicleIds.size / totalVehicles) * 100) : 0;

  return {
    reservations: currentMonthReservations,
    reservationsTrend: prevMonthReservations > 0
      ? Math.round(((currentMonthReservations - prevMonthReservations) / prevMonthReservations) * 100)
      : 0,
    revenue: Number(currentMonthRevenue._sum.totalPrice || 0),
    revenueTrend: Number(prevMonthRevenue._sum.totalPrice || 0) > 0
      ? Math.round(((Number(currentMonthRevenue._sum.totalPrice || 0) - Number(prevMonthRevenue._sum.totalPrice || 0)) / Number(prevMonthRevenue._sum.totalPrice || 0)) * 100)
      : 0,
    activeVehicles,
    occupancyRate,
  };
}

export async function getMonthlyRevenue() {
  const months = Array.from({ length: 12 }, (_, i) => subMonths(new Date(), 11 - i));
  const data = await Promise.all(
    months.map(async (month) => {
      const revenue = await prisma.reservation.aggregate({
        _sum: { totalPrice: true },
        where: {
          createdAt: { gte: startOfMonth(month), lte: endOfMonth(month) },
          status: { not: "CANCELLED" },
        },
      });
      return {
        month: month.toLocaleDateString("fr-FR", { month: "short" }),
        revenue: Number(revenue._sum.totalPrice || 0),
      };
    })
  );
  return data;
}

export async function getReservationsByCategory() {
  const categories = await prisma.vehicle.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  return categories.map((c) => ({
    category: c.category,
    count: c._count._all,
  }));
}

export async function getFuelDistribution() {
  const fuels = await prisma.vehicle.groupBy({
    by: ["fuel"],
    _count: { _all: true },
  });
  return fuels.map((f) => ({
    fuel: f.fuel,
    count: f._count._all,
  }));
}

export async function getRecentReservations() {
  return prisma.reservation.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
      totalPrice: true,
      user: { select: { firstName: true, lastName: true } },
      vehicle: { select: { brand: true, model: true } },
    },
  });
}

export async function getAllVehiclesAdmin() {
  return prisma.vehicle.findMany({
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
      status: true,
      isFeatured: true,
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllReservationsAdmin() {
  return prisma.reservation.findMany({
    select: {
      id: true,
      startDate: true,
      endDate: true,
      status: true,
      totalPrice: true,
      options: true,
      createdAt: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      vehicle: { select: { brand: true, model: true, images: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllClientsAdmin() {
  return prisma.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      status: true,
      createdAt: true,
      _count: { select: { reservations: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminStatistics() {
  const yearStart = startOfYear(new Date());

  const [topVehicles, avgBasket, monthlySignups] = await Promise.all([
    prisma.reservation.groupBy({
      by: ["vehicleId"],
      _count: { _all: true },
      where: { createdAt: { gte: yearStart }, status: { not: "CANCELLED" } },
      orderBy: { _count: { vehicleId: "desc" } },
      take: 10,
    }),
    prisma.reservation.aggregate({
      _avg: { totalPrice: true },
      where: { status: { not: "CANCELLED" }, createdAt: { gte: yearStart } },
    }),
    prisma.user.groupBy({
      by: ["createdAt"],
      where: { role: "USER", createdAt: { gte: yearStart } },
    }),
  ]);

  const topVehicleIds = topVehicles.map((tv) => tv.vehicleId);
  const vehicles = await prisma.vehicle.findMany({
    where: { id: { in: topVehicleIds } },
    select: { id: true, brand: true, model: true },
  });
  const vehicleMap = Object.fromEntries(vehicles.map((v) => [v.id, v]));

  return {
    topVehicles: topVehicles.map((tv) => ({
      ...vehicleMap[tv.vehicleId],
      rentalCount: tv._count._all,
    })),
    avgBasket: Number(avgBasket._avg.totalPrice || 0),
  };
}
