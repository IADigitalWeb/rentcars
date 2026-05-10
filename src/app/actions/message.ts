"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const messageSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Le sujet est requis"),
  body: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export async function sendMessage(formData: FormData) {
  const rawData = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    subject: formData.get("subject") as string,
    body: formData.get("body") as string,
  };

  const validated = messageSchema.safeParse(rawData);
  if (!validated.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of validated.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    }
    return { error: fieldErrors };
  }

  await prisma.message.create({
    data: {
      firstName: validated.data.firstName,
      lastName: validated.data.lastName,
      email: validated.data.email,
      phone: validated.data.phone ?? null,
      subject: validated.data.subject,
      body: validated.data.body,
    },
  });

  return { success: true };
}

export async function markMessageRead(id: string) {
  await prisma.message.update({
    where: { id },
    data: { isRead: true },
  });
}

export async function deleteMessage(id: string) {
  await prisma.message.delete({ where: { id } });
}
