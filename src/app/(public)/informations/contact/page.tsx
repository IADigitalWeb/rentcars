import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — RentCars",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin py-xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg">Contactez-nous</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-md">
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Nos coordonnées</h2>
            <div className="flex flex-col gap-sm">
              <div className="flex items-start gap-sm">
                <MapPin size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Adresse</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">15 Avenue des Champs-Élysées, 75008 Paris</span>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <Phone size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Téléphone</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">+33 1 42 68 53 00</span>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <Mail size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Email</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">contact@rentcars.com</span>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <Clock size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Horaires</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    Lun-Ven : 8h00 - 19h00<br />
                    Sam : 9h00 - 17h00<br />
                    Dim : 10h00 - 16h00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Envoyez-nous un message</h2>
          <form className="flex flex-col gap-sm">
            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Prénom</label>
                <input
                  type="text"
                  className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Nom</label>
                <input
                  type="text"
                  className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Email</label>
              <input
                type="email"
                className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary"
                placeholder="jean@exemple.com"
              />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Message</label>
              <textarea
                rows={4}
                className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none"
                placeholder="Votre message..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-on-primary px-md py-sm rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
