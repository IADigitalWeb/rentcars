"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const reviewSchema = z.object({
  vehicleId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Vous devez être connecté pour laisser un avis" };
  }

  const rawData = {
    vehicleId: formData.get("vehicleId") as string,
    rating: parseInt(formData.get("rating") as string, 10),
    comment: (formData.get("comment") as string) || undefined,
  };

  const validated = reviewSchema.safeParse(rawData);
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

  const existing = await prisma.review.findFirst({
    where: {
      userId: session.user.id,
      vehicleId: data.vehicleId,
    },
  });

  if (existing) {
    return { error: { rating: ["Vous avez déjà laissé un avis pour ce véhicule"] } };
  }

  const review = await prisma.review.create({
    data: {
      userId: session.user.id,
      vehicleId: data.vehicleId,
      rating: data.rating,
      comment: data.comment || null,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: { select: { firstName: true, lastName: true } },
    },
  });

  return {
    success: true,
    review: {
      ...review,
      createdAt: review.createdAt.toISOString(),
    },
  };
}
