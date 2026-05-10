"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { sendMessage } from "@/app/actions/message";

interface FieldErrors {
  firstName?: string[];
  lastName?: string[];
  email?: string[];
  phone?: string[];
  subject?: string[];
  body?: string[];
}

export default function ContactPage() {
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setErrors({});

    const result = await sendMessage(formData);

    if (result.error) {
      setErrors(result.error as FieldErrors);
      setPending(false);
      return;
    }

    setSuccess(true);
    setPending(false);
  }

  if (success) {
    return (
      <div className="max-w-3xl mx-auto px-margin py-xl text-center">
        <div className="bg-surface rounded-xl border border-outline-variant/20 p-xl flex flex-col items-center gap-md">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle size={32} className="text-emerald-600" />
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Message envoye !</h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Merci pour votre message. Notre equipe vous repondra dans les plus brefs delais.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="text-primary font-label-bold text-label-bold hover:underline"
          >
            Envoyer un autre message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-margin py-xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg">Contactez-nous</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <div className="flex flex-col gap-md">
          <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Nos coordonnees</h2>
            <div className="flex flex-col gap-sm">
              <div className="flex items-start gap-sm">
                <MapPin size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Adresse</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">15 Avenue des Champs-Elysees, 75008 Paris</span>
                </div>
              </div>
              <div className="flex items-start gap-sm">
                <Phone size={20} className="text-primary shrink-0 mt-xs" />
                <div>
                  <span className="font-label-bold text-label-bold text-on-surface block">Telephone</span>
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
                    Dim : Ferme
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-md">Envoyez-nous un message</h2>
          <form action={handleSubmit} className="flex flex-col gap-sm">
            <div className="grid grid-cols-2 gap-sm">
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Prenom *</label>
                <input name="firstName" type="text" required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" placeholder="Jean" />
                {errors.firstName && <span className="text-red-600 font-label-sm text-label-sm mt-xs block">{errors.firstName[0]}</span>}
              </div>
              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Nom *</label>
                <input name="lastName" type="text" required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" placeholder="Dupont" />
                {errors.lastName && <span className="text-red-600 font-label-sm text-label-sm mt-xs block">{errors.lastName[0]}</span>}
              </div>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Email *</label>
              <input name="email" type="email" required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" placeholder="jean@exemple.com" />
              {errors.email && <span className="text-red-600 font-label-sm text-label-sm mt-xs block">{errors.email[0]}</span>}
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Telephone</label>
              <input name="phone" type="tel" className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" placeholder="+33 6 12 34 56 78" />
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Sujet *</label>
              <input name="subject" type="text" required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary" placeholder="Objet de votre message" />
              {errors.subject && <span className="text-red-600 font-label-sm text-label-sm mt-xs block">{errors.subject[0]}</span>}
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">Message *</label>
              <textarea name="body" rows={4} required className="w-full bg-surface-container px-sm py-sm rounded-lg border border-outline-variant/30 font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-none" placeholder="Votre message..." />
              {errors.body && <span className="text-red-600 font-label-sm text-label-sm mt-xs block">{errors.body[0]}</span>}
            </div>
            <button type="submit" disabled={pending} className="w-full bg-primary text-on-primary px-md py-sm rounded-lg font-label-bold text-label-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-xs">
              <Send size={16} />
              {pending ? "Envoi en cours..." : "Envoyer"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
