"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { updateProfile } from "@/app/actions/profile";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: string | null;
  birthDate: string;
}

export function ClientProfile({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone || "",
    address: profile.address || "",
    birthDate: profile.birthDate || "",
  });

  const setField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const fd = new FormData();
    fd.set("firstName", formData.firstName);
    fd.set("lastName", formData.lastName);
    fd.set("email", formData.email);
    fd.set("phone", formData.phone);
    fd.set("address", formData.address);
    fd.set("birthDate", formData.birthDate);

    startTransition(async () => {
      const result = await updateProfile(fd);
      if (result.error) {
        if (typeof result.error === "string") {
          setErrors({ general: result.error });
        } else {
          setErrors(result.error as Record<string, string>);
        }
      } else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 3000);
      }
    });
  };

  return (
    <div className="flex flex-col gap-lg max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Mon Profil</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-outline-variant/20 p-lg flex flex-col gap-md">
        {errors.general && (
          <div className="bg-error-container/50 text-on-error-container px-md py-sm rounded-lg font-body-md text-body-md">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-2 gap-sm">
          <Input
            label="Prénom"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            error={errors.firstName}
            required
          />
          <Input
            label="Nom"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            error={errors.lastName}
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
          error={errors.email}
          required
        />
        <div className="grid grid-cols-2 gap-sm">
          <Input
            label="Téléphone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="06 12 34 56 78"
            error={errors.phone}
          />
          <Input
            label="Date de naissance"
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={(e) => setField("birthDate", e.target.value)}
            error={errors.birthDate}
          />
        </div>
        <Input
          label="Adresse"
          name="address"
          value={formData.address}
          onChange={(e) => setField("address", e.target.value)}
          placeholder="123 Rue de Paris, 75001 Paris"
          error={errors.address}
        />

        <div className="flex items-center gap-sm">
          <Button type="submit" disabled={isPending} className="gap-xs">
            {isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Sauvegarder
          </Button>
          {saved && (
            <span className="flex items-center gap-xs text-emerald-600 font-label-bold text-label-bold">
              <Check size={16} /> Profil mis à jour
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
