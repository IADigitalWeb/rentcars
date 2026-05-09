"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";

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
  const [saved, setSaved] = useState(false);
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
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-lg max-w-2xl">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Mon Profil</h1>

      <form onSubmit={handleSubmit} className="bg-surface rounded-xl border border-outline-variant/20 p-lg flex flex-col gap-md">
        <div className="grid grid-cols-2 gap-sm">
          <Input
            label="Prénom"
            value={formData.firstName}
            onChange={(e) => setField("firstName", e.target.value)}
            required
          />
          <Input
            label="Nom"
            value={formData.lastName}
            onChange={(e) => setField("lastName", e.target.value)}
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setField("email", e.target.value)}
          required
        />
        <div className="grid grid-cols-2 gap-sm">
          <Input
            label="Téléphone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="06 12 34 56 78"
          />
          <Input
            label="Date de naissance"
            type="date"
            value={formData.birthDate}
            onChange={(e) => setField("birthDate", e.target.value)}
          />
        </div>
        <Input
          label="Adresse"
          value={formData.address}
          onChange={(e) => setField("address", e.target.value)}
          placeholder="123 Rue de Paris, 75001 Paris"
        />

        <div className="flex items-center gap-sm">
          <Button type="submit" className="gap-xs">
            <Save size={18} />
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
