"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { generatePaymentRef } from "@/lib/utils";
import { checkDateConflicts } from "@/lib/server/reservation-data";

const RENTAL_OPTIONS = [
  { id: "fullInsurance", label: "Assurance tous risques", pricePerDay: 25 },
  { id: "babySeat", label: "Siège bébé", pricePerDay: 10 },
  { id: "gpsExtra", label: "GPS additionnel", pricePerDay: 8 },
  { id: "extraDriver", label: "Conducteur additionnel", pricePerDay: 15 },
  { id: "youngDriver", label: "Conducteur jeune (<25 ans)", pricePerDay: 20 },
] as const;

export { RENTAL_OPTIONS };

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Format invalide (XXXX XXXX XXXX XXXX)"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format invalide (MM/AA)"),
  cvv: z.string().regex(/^\d{3}$/, "3 chiffres requis"),
  cardName: z.string().min(2, "Nom sur la carte requis"),
});

const reservationSchema = z.object({
  vehicleId: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  pickupLocation: z.string().min(1),
  returnLocation: z.string().min(1),
  sameLocation: z.string().optional(),
  options: z.string().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  acceptTerms: z.literal("true"),
  payment: paymentSchema,
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export async function createReservation(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour réserver" };
  }

  const rawData = {
    vehicleId: formData.get("vehicleId") as string,
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    pickupLocation: formData.get("pickupLocation") as string,
    returnLocation: formData.get("returnLocation") as string,
    sameLocation: formData.get("sameLocation") as string,
    options: formData.get("options") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    acceptTerms: formData.get("acceptTerms") as string,
    payment: {
      cardNumber: formData.get("cardNumber") as string,
      expiry: formData.get("expiry") as string,
      cvv: formData.get("cvv") as string,
      cardName: formData.get("cardName") as string,
    },
  };

  const validated = reservationSchema.safeParse(rawData);
  if (!validated.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validated.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { error: fieldErrors };
  }

  const data = validated.data;
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (start < now) {
    return { error: { startDate: ["La date de début ne peut pas être dans le passé"] } };
  }

  if (end <= start) {
    return { error: { endDate: ["La date de fin doit être après la date de début"] } };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: data.vehicleId },
    select: { pricePerDay: true, status: true },
  });

  if (!vehicle || vehicle.status !== "AVAILABLE") {
    return { error: { vehicleId: ["Ce véhicule n'est plus disponible"] } };
  }

  const conflicts = await checkDateConflicts(data.vehicleId, start, end);
  if (conflicts.length > 0) {
    return { error: { startDate: ["Ce véhicule est déjà réservé aux dates sélectionnées"] } };
  }

  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const basePrice = Number(vehicle.pricePerDay) * days;

  const selectedOptions: string[] = data.options ? JSON.parse(data.options) as string[] : [];
  const optionsPrice = selectedOptions.reduce((total, optId) => {
    const option = RENTAL_OPTIONS.find((o) => o.id === optId);
    return total + (option ? option.pricePerDay * days : 0);
  }, 0);

  const totalPrice = basePrice + optionsPrice;
  const paymentRef = generatePaymentRef();

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.user.id,
      vehicleId: data.vehicleId,
      startDate: start,
      endDate: end,
      status: "PENDING",
      basePrice,
      optionsPrice,
      totalPrice,
      options: selectedOptions,
      paymentStatus: "SIMULATED",
      paymentRef,
    },
    select: {
      id: true,
      paymentRef: true,
      totalPrice: true,
      startDate: true,
      endDate: true,
    },
  });

  return {
    success: true,
    reservation: {
      id: reservation.id,
      paymentRef: paymentRef,
      totalPrice,
      basePrice,
      optionsPrice,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
    },
  };
}
