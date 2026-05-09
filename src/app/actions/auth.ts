"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import { z } from "zod";

const signUpSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
});

export async function signUp(formData: FormData) {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    password: formData.get("password") as string,
  };

  const result = signUpSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const existing = await prisma.user.findUnique({ where: { email: raw.email } });
  if (existing) {
    return { error: { email: ["Cet email est déjà utilisé"] } };
  }

  const hashedPassword = await bcrypt.hash(raw.password, 12);

  await prisma.user.create({
    data: {
      firstName: raw.firstName,
      lastName: raw.lastName,
      email: raw.email,
      phone: raw.phone || null,
      password: hashedPassword,
      role: "USER",
    },
  });

  await signIn("credentials", {
    email: raw.email,
    password: raw.password,
    redirect: false,
  });

  return { success: true };
}
