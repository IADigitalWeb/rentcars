"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface AgencySettings {
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  siret: string | null;
}

export function AdminSettings({ settings }: { settings: AgencySettings | null }) {
  return (
    <div className="flex flex-col gap-lg">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Paramètres</h1>

      <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg max-w-2xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Informations de l&apos;agence</h2>
        <form className="flex flex-col gap-md">
          <Input
            label="Nom de l'agence"
            defaultValue={settings?.name || "RentCars"}
          />
          <Input
            label="Adresse"
            defaultValue={settings?.address || ""}
            placeholder="15 Avenue des Champs-Élysées, 75008 Paris"
          />
          <div className="grid grid-cols-2 gap-sm">
            <Input
              label="Téléphone"
              defaultValue={settings?.phone || ""}
              placeholder="+33 1 42 68 53 00"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={settings?.email || ""}
              placeholder="contact@rentcars.com"
            />
          </div>
          <Input
            label="SIRET"
            defaultValue={settings?.siret || ""}
            placeholder="123 456 789 00012"
          />
          <Button type="submit" className="gap-xs self-start">
            <Save size={18} />
            Sauvegarder
          </Button>
        </form>
      </div>

      <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg max-w-2xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Options de location</h2>
        <div className="flex flex-col gap-sm">
          {[
            { name: "Assurance tous risques", price: "25€/jour" },
            { name: "Siège bébé", price: "10€/jour" },
            { name: "GPS additionnel", price: "8€/jour" },
            { name: "Conducteur additionnel", price: "15€/jour" },
            { name: "Conducteur jeune (<25 ans)", price: "20€/jour" },
          ].map((opt) => (
            <div key={opt.name} className="flex items-center justify-between p-sm rounded-lg border border-outline-variant/30">
              <div className="flex items-center gap-sm">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-primary" />
                <span className="font-body-md text-body-md text-on-surface">{opt.name}</span>
              </div>
              <span className="font-label-bold text-label-bold text-primary">{opt.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
