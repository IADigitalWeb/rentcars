"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUp } from "@/app/actions/auth";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8 caractères minimum", met: password.length >= 8 },
    { label: "Une majuscule", met: /[A-Z]/.test(password) },
    { label: "Une minuscule", met: /[a-z]/.test(password) },
    { label: "Un chiffre", met: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-xs">
      {checks.map((check) => (
        <span
          key={check.label}
          className={`font-label-sm text-label-sm ${check.met ? "text-green-600" : "text-on-surface-variant"}`}
        >
          {check.met ? "✓" : "○"} {check.label}
        </span>
      ))}
    </div>
  );
}

function InscriptionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const setField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: ["Les mots de passe ne correspondent pas"] });
      return;
    }

    if (!formData.acceptTerms) {
      setErrors({ acceptTerms: ["Vous devez accepter les CGV"] });
      return;
    }

    setLoading(true);
    const form = new FormData();
    form.set("firstName", formData.firstName);
    form.set("lastName", formData.lastName);
    form.set("email", formData.email);
    form.set("phone", formData.phone);
    form.set("password", formData.password);

    const result = await signUp(form);

    if (result.error) {
      setLoading(false);
      setErrors(result.error);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-margin py-xl">
      <div className="w-full max-w-md">
        <div className="text-center mb-lg">
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Créer un compte</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm">
            Rejoignez RentCars pour réserver vos véhicules
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <div className="grid grid-cols-2 gap-sm">
            <Input
              label="Prénom"
              value={formData.firstName}
              onChange={(e) => setField("firstName", e.target.value)}
              error={errors.firstName?.[0]}
              required
            />
            <Input
              label="Nom"
              value={formData.lastName}
              onChange={(e) => setField("lastName", e.target.value)}
              error={errors.lastName?.[0]}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setField("email", e.target.value)}
            error={errors.email?.[0]}
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Téléphone (optionnel)"
            type="tel"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="06 12 34 56 78"
          />

          <div className="flex flex-col gap-xs">
            <Input
              label="Mot de passe"
              type="password"
              value={formData.password}
              onChange={(e) => setField("password", e.target.value)}
              error={errors.password?.[0]}
              placeholder="••••••••"
              required
            />
            <PasswordStrength password={formData.password} />
          </div>

          <Input
            label="Confirmer le mot de passe"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            error={errors.confirmPassword?.[0]}
            placeholder="••••••••"
            required
          />

          <label className="flex items-start gap-sm cursor-pointer">
            <input
              type="checkbox"
              checked={formData.acceptTerms}
              onChange={(e) => setField("acceptTerms", e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-outline-variant accent-primary"
            />
            <span className="font-body-md text-body-md text-on-surface-variant">
              J&apos;accepte les{" "}
              <Link href="/informations/cgv" className="text-primary hover:underline">
                Conditions Générales de Vente
              </Link>{" "}
              et la{" "}
              <Link href="/informations/confidentialite" className="text-primary hover:underline">
                Politique de Confidentialité
              </Link>
            </span>
          </label>
          {errors.acceptTerms && (
            <span className="text-error font-label-sm text-label-sm">{errors.acceptTerms[0]}</span>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="text-center mt-md font-body-md text-body-md text-on-surface-variant">
          Déjà un compte ?{" "}
          <Link
            href={`/auth/connexion${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
            className="text-primary hover:underline font-label-bold"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function InscriptionPage() {
  return (
    <Suspense>
      <InscriptionForm />
    </Suspense>
  );
}
