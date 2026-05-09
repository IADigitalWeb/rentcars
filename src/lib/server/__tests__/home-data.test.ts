import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    vehicle: { findMany: vi.fn() },
    specialOffer: { findMany: vi.fn() },
  },
}));

import { getFeaturedVehicles, getActiveOffers } from "../home-data";
import { prisma } from "@/lib/prisma";

describe("home-data", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getFeaturedVehicles", () => {
    it("returns vehicles where isFeatured is true", async () => {
      const mockVehicles = [
        {
          id: "1",
          brand: "Porsche",
          model: "911 Carrera",
          category: "LUXURY",
          fuel: "PETROL",
          transmission: "AUTOMATIC",
          seats: 2,
          pricePerDay: 350,
          images: ["https://example.com/porsche.jpg"],
        },
      ];
      (prisma.vehicle.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockVehicles);
      const result = await getFeaturedVehicles();
      expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
        where: { isFeatured: true, status: "AVAILABLE" },
        select: {
          id: true, brand: true, model: true, category: true,
          fuel: true, transmission: true, seats: true,
          pricePerDay: true, images: true,
        },
      });
      expect(result).toEqual(mockVehicles);
    });
  });

  describe("getActiveOffers", () => {
    it("returns active offers with valid dates", async () => {
      const mockOffers = [
        {
          id: "1",
          title: "Location Longue Durée",
          description: "-20%",
          discount: 20,
          category: null,
          startDate: new Date("2024-01-01"),
          endDate: new Date("2025-12-31"),
          isActive: true,
        },
      ];
      (prisma.specialOffer.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockOffers);
      const result = await getActiveOffers();
      expect(prisma.specialOffer.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          startDate: { lte: expect.any(Date) },
          endDate: { gte: expect.any(Date) },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual(mockOffers);
    });
  });
});
