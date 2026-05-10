"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadImage, deleteImage } from "@/lib/supabase";

const vehicleSchema = z.object({
  id: z.string().optional(),
  brand: z.string().min(1, "La marque est requise"),
  model: z.string().min(1, "Le modele est requis"),
  year: z.coerce.number().int().min(2000).max(2030),
  category: z.enum(["LUXURY", "SUV", "URBAN", "ELECTRIC", "UTILITY", "CONVERTIBLE"]),
  fuel: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  seats: z.coerce.number().int().min(1).max(9),
  pricePerDay: z.coerce.number().positive("Le prix doit etre positif"),
  mileageLimit: z.coerce.number().int().min(0).default(300),
  power: z.coerce.number().int().positive().optional().or(z.literal("")),
  torque: z.coerce.number().int().positive().optional().or(z.literal("")),
  acceleration: z.coerce.number().positive().optional().or(z.literal("")),
  topSpeed: z.coerce.number().int().positive().optional().or(z.literal("")),
  consumption: z.coerce.number().positive().optional().or(z.literal("")),
  trunkVolume: z.coerce.number().int().positive().optional().or(z.literal("")),
  description: z.string().optional(),
  equipments: z.string().optional(),
  status: z.enum(["AVAILABLE", "MAINTENANCE", "OUT_OF_SERVICE"]).default("AVAILABLE"),
  isFeatured: z.enum(["true", "false"]).default("false"),
  existingImages: z.string().optional(),
});

function parseOptionalNumber(val: string | number | undefined): number | undefined {
  if (val === undefined || val === "" || val === 0) return undefined;
  const n = typeof val === "string" ? parseFloat(val) : val;
  return isNaN(n) ? undefined : n;
}

export async function createVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Acces non autorise" };
  }

  const rawData = {
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    year: formData.get("year") as string,
    category: formData.get("category") as string,
    fuel: formData.get("fuel") as string,
    transmission: formData.get("transmission") as string,
    seats: formData.get("seats") as string,
    pricePerDay: formData.get("pricePerDay") as string,
    mileageLimit: formData.get("mileageLimit") as string,
    power: formData.get("power") as string,
    torque: formData.get("torque") as string,
    acceleration: formData.get("acceleration") as string,
    topSpeed: formData.get("topSpeed") as string,
    consumption: formData.get("consumption") as string,
    trunkVolume: formData.get("trunkVolume") as string,
    description: formData.get("description") as string,
    equipments: formData.get("equipments") as string,
    status: formData.get("status") as string,
    isFeatured: formData.get("isFeatured") as string,
  };

  const validated = vehicleSchema.safeParse(rawData);
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

  const imagePaths: string[] = [];
  const imageFiles = formData.getAll("images") as File[];
  for (const file of imageFiles) {
    if (file.size > 0) {
      const path = await uploadImage("cars", file);
      imagePaths.push(path);
    }
  }

  const equipments = data.equipments ? JSON.parse(data.equipments) as string[] : [];

  await prisma.vehicle.create({
    data: {
      brand: data.brand,
      model: data.model,
      year: data.year,
      category: data.category,
      fuel: data.fuel,
      transmission: data.transmission,
      seats: data.seats,
      pricePerDay: data.pricePerDay,
      mileageLimit: data.mileageLimit,
      power: parseOptionalNumber(data.power),
      torque: parseOptionalNumber(data.torque),
      acceleration: parseOptionalNumber(data.acceleration),
      topSpeed: parseOptionalNumber(data.topSpeed),
      consumption: parseOptionalNumber(data.consumption),
      trunkVolume: parseOptionalNumber(data.trunkVolume),
      description: data.description || null,
      equipments,
      images: imagePaths,
      status: data.status,
      isFeatured: data.isFeatured === "true",
    },
  });

  return { success: true };
}

export async function updateVehicle(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Acces non autorise" };
  }

  const rawData = {
    id: formData.get("id") as string,
    brand: formData.get("brand") as string,
    model: formData.get("model") as string,
    year: formData.get("year") as string,
    category: formData.get("category") as string,
    fuel: formData.get("fuel") as string,
    transmission: formData.get("transmission") as string,
    seats: formData.get("seats") as string,
    pricePerDay: formData.get("pricePerDay") as string,
    mileageLimit: formData.get("mileageLimit") as string,
    power: formData.get("power") as string,
    torque: formData.get("torque") as string,
    acceleration: formData.get("acceleration") as string,
    topSpeed: formData.get("topSpeed") as string,
    consumption: formData.get("consumption") as string,
    trunkVolume: formData.get("trunkVolume") as string,
    description: formData.get("description") as string,
    equipments: formData.get("equipments") as string,
    status: formData.get("status") as string,
    isFeatured: formData.get("isFeatured") as string,
    existingImages: formData.get("existingImages") as string,
  };

  const validated = vehicleSchema.safeParse(rawData);
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
  if (!data.id) return { error: "ID du vehicule requis" };

  const existingImages: string[] = data.existingImages ? JSON.parse(data.existingImages) as string[] : [];

  const imageFiles = formData.getAll("images") as File[];
  for (const file of imageFiles) {
    if (file.size > 0) {
      const path = await uploadImage("cars", file);
      existingImages.push(path);
    }
  }

  const equipments = data.equipments ? JSON.parse(data.equipments) as string[] : [];

  await prisma.vehicle.update({
    where: { id: data.id },
    data: {
      brand: data.brand,
      model: data.model,
      year: data.year,
      category: data.category,
      fuel: data.fuel,
      transmission: data.transmission,
      seats: data.seats,
      pricePerDay: data.pricePerDay,
      mileageLimit: data.mileageLimit,
      power: parseOptionalNumber(data.power),
      torque: parseOptionalNumber(data.torque),
      acceleration: parseOptionalNumber(data.acceleration),
      topSpeed: parseOptionalNumber(data.topSpeed),
      consumption: parseOptionalNumber(data.consumption),
      trunkVolume: parseOptionalNumber(data.trunkVolume),
      description: data.description || null,
      equipments,
      images: existingImages,
      status: data.status,
      isFeatured: data.isFeatured === "true",
    },
  });

  return { success: true };
}

export async function deleteVehicle(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Acces non autorise" };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    select: { images: true, reservations: { where: { status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] } } } },
  });

  if (!vehicle) return { error: "Vehicule introuvable" };

  if (vehicle.reservations.length > 0) {
    return { error: "Ce vehicule a des reservations actives et ne peut pas etre supprime" };
  }

  for (const imagePath of vehicle.images) {
    try {
      await deleteImage(imagePath);
    } catch {
      // Continue even if image deletion fails
    }
  }

  await prisma.vehicle.delete({ where: { id } });

  return { success: true };
}
