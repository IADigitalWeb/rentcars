"use client";

import { useState, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formatPrice } from "@/lib/utils";
import { RENTAL_OPTIONS } from "@/lib/constants";
import { createReservation } from "@/app/actions/reservation";
import {
  Calendar,
  MapPin,
  CreditCard,
  Check,
  ChevronLeft,
  Shield,
  Clock,
  Users,
} from "lucide-react";

interface VehicleData {
  id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  fuel: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  mileageLimit: number;
  images: string[];
}

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

interface ReservationResult {
  id: string;
  paymentRef: string;
  totalPrice: number;
  basePrice: number;
  optionsPrice: number;
  startDate: string;
  endDate: string;
}

type Step = "details" | "payment" | "confirmation";

const AGENCY_LOCATION = "RentCars — 15 Avenue des Champs-Élysées, 75008 Paris";

function ReservationFormInner({
  vehicle,
  user,
}: {
  vehicle: VehicleData;
  user: UserProfile;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<Step>("details");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [confirmation, setConfirmation] = useState<ReservationResult | null>(null);
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    pickupLocation: AGENCY_LOCATION,
    returnLocation: AGENCY_LOCATION,
    sameLocation: true,
    selectedOptions: [] as string[],
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone || "",
    acceptTerms: false,
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: `${user.firstName} ${user.lastName}`,
  });

  const setField = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleOption = (optionId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedOptions: prev.selectedOptions.includes(optionId)
        ? prev.selectedOptions.filter((id) => id !== optionId)
        : [...prev.selectedOptions, optionId],
    }));
  };

  const pricing = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return { days: 0, basePrice: 0, optionsPrice: 0, total: 0 };
    }
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));

    const basePrice = vehicle.pricePerDay * days;
    const optionsPrice = formData.selectedOptions.reduce((total, optId) => {
      const option = RENTAL_OPTIONS.find((o) => o.id === optId);
      return total + (option ? option.pricePerDay * days : 0);
    }, 0);

    return { days, basePrice, optionsPrice, total: basePrice + optionsPrice };
  }, [formData.startDate, formData.endDate, formData.selectedOptions, vehicle.pricePerDay]);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    if (!formData.startDate) newErrors.startDate = ["Date de début requise"];
    if (!formData.endDate) newErrors.endDate = ["Date de fin requise"];
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (start < today) newErrors.startDate = ["La date ne peut pas être dans le passé"];
      if (end < start) newErrors.endDate = ["La date de restitution ne peut pas être antérieure au retrait"];
    }
    if (!formData.acceptTerms) newErrors.acceptTerms = ["Vous devez accepter les CGV"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};

    if (!formData.cardNumber.match(/^\d{4} \d{4} \d{4} \d{4}$/))
      newErrors.cardNumber = ["Format invalide"];
    if (!formData.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
      newErrors.expiry = ["Format invalide (MM/AA)"];
    if (!formData.cvv.match(/^\d{3}$/))
      newErrors.cvv = ["3 chiffres requis"];
    if (formData.cardName.length < 2)
      newErrors.cardName = ["Nom requis"];

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const form = new FormData();
    form.set("vehicleId", vehicle.id);
    form.set("startDate", formData.startDate);
    form.set("endDate", formData.endDate);
    form.set("pickupLocation", formData.pickupLocation);
    form.set("returnLocation", formData.sameLocation ? formData.pickupLocation : formData.returnLocation);
    form.set("options", JSON.stringify(formData.selectedOptions));
    form.set("firstName", formData.firstName);
    form.set("lastName", formData.lastName);
    form.set("email", formData.email);
    form.set("phone", formData.phone);
    form.set("acceptTerms", "true");
    form.set("cardNumber", formData.cardNumber);
    form.set("expiry", formData.expiry);
    form.set("cvv", formData.cvv);
    form.set("cardName", formData.cardName);

    startTransition(async () => {
      try {
        const result = await createReservation(form);
        if (result.error) {
          if (typeof result.error === "string") {
            setErrors({ form: [result.error] });
          } else {
            const allErrors: Record<string, string[]> = {};
            for (const [key, val] of Object.entries(result.error)) {
              allErrors[key.includes(".") ? "form" : key] = val as string[];
            }
            setErrors(allErrors);
          }
          return;
        }
        if (result.success && result.reservation) {
          setConfirmation(result.reservation);
          setStep("confirmation");
        }
      } catch {
        setErrors({ form: ["Une erreur inattendue est survenue. Veuillez réessayer."] });
      }
    });
  };

  if (step === "confirmation" && confirmation) {
    return (
      <div className="max-w-2xl mx-auto px-margin py-xl text-center">
        <div className="flex justify-center mb-md">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <Check size={32} className="text-emerald-600" />
          </div>
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-sm">
          Réservation confirmée !
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
          Votre réservation a été enregistrée avec succès.
        </p>

        <div className="bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/20 text-left">
          <div className="grid grid-cols-2 gap-md">
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Véhicule</span>
              <p className="font-label-bold text-label-bold text-on-surface">{vehicle.brand} {vehicle.model}</p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Référence</span>
              <p className="font-label-bold text-label-bold text-primary">{confirmation.paymentRef}</p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Dates</span>
              <p className="font-label-bold text-label-bold text-on-surface">
                {new Date(confirmation.startDate).toLocaleDateString("fr-FR")} → {new Date(confirmation.endDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Montant total</span>
              <p className="font-headline-lg text-headline-lg text-primary">{formatPrice(confirmation.totalPrice)}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-sm justify-center mt-lg">
          <Link href="/dashboard/reservations">
            <Button variant="ghost">Voir mes réservations</Button>
          </Link>
          <Link href="/inventaire">
            <Button>Retour à l&apos;inventaire</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-margin py-xl">
      <Link
        href={`/vehicules/${vehicle.id}`}
        className="inline-flex items-center gap-xs font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors mb-md"
      >
        <ChevronLeft size={18} />
        Retour au véhicule
      </Link>

      {/* Steps indicator */}
      <div className="flex items-center gap-sm mb-lg">
        {[
          { key: "details" as Step, label: "Détails", icon: Calendar },
          { key: "payment" as Step, label: "Paiement", icon: CreditCard },
        ].map((s, i) => (
          <div key={s.key} className="flex items-center gap-xs">
            {i > 0 && <div className={cn("w-12 h-px", step === s.key || (step === "details" && s.key === "details") ? "bg-primary" : "bg-outline-variant/30")} />}
            <div className={cn(
              "flex items-center gap-xs px-md py-xs rounded-full font-label-bold text-label-bold",
              step === s.key ? "bg-primary-container text-on-primary-container" : "bg-surface-container text-on-surface-variant"
            )}>
              <s.icon size={16} />
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Main form */}
        <div className="lg:col-span-2">
          {step === "details" && (
            <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-lg">
              {/* Dates */}
              <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
                  <Calendar size={20} className="text-primary" />
                  Dates de location
                </h2>
                <div className="grid grid-cols-2 gap-md">
                  <Input
                    label="Date de début"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setField("startDate", e.target.value)}
                    min={today}
                    error={errors.startDate?.[0]}
                    required
                  />
                  <Input
                    label="Date de fin"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setField("endDate", e.target.value)}
                    min={formData.startDate || today}
                    error={errors.endDate?.[0]}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
                  <MapPin size={20} className="text-primary" />
                  Lieu de retrait et restitution
                </h2>
                <div className="flex flex-col gap-sm">
                  <Input
                    label="Lieu de retrait"
                    value={formData.pickupLocation}
                    onChange={(e) => setField("pickupLocation", e.target.value)}
                    readOnly
                  />
                  <label className="flex items-center gap-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.sameLocation}
                      onChange={(e) => setField("sameLocation", e.target.checked)}
                      className="w-4 h-4 rounded accent-primary"
                    />
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      Restituer au même endroit
                    </span>
                  </label>
                  {!formData.sameLocation && (
                    <Input
                      label="Lieu de restitution"
                      value={formData.returnLocation}
                      onChange={(e) => setField("returnLocation", e.target.value)}
                    />
                  )}
                </div>
              </div>

              {/* Options */}
              <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
                  <Shield size={20} className="text-primary" />
                  Options supplémentaires
                </h2>
                <div className="flex flex-col gap-sm">
                  {RENTAL_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={cn(
                        "flex items-center justify-between p-sm rounded-lg cursor-pointer border transition-colors",
                        formData.selectedOptions.includes(option.id)
                          ? "border-primary bg-primary/5"
                          : "border-outline-variant/30 hover:border-outline-variant"
                      )}
                    >
                      <div className="flex items-center gap-sm">
                        <input
                          type="checkbox"
                          checked={formData.selectedOptions.includes(option.id)}
                          onChange={() => toggleOption(option.id)}
                          className="w-4 h-4 rounded accent-primary"
                        />
                        <span className="font-body-md text-body-md text-on-surface">{option.label}</span>
                      </div>
                      <span className="font-label-bold text-label-bold text-primary">
                        +{option.pricePerDay}€/jour
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
                  <Users size={20} className="text-primary" />
                  Informations
                </h2>
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
                <div className="grid grid-cols-2 gap-sm mt-sm">
                  <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setField("email", e.target.value)}
                    required
                  />
                  <Input
                    label="Téléphone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setField("phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => {
                    setField("acceptTerms", e.target.checked);
                  }}
                  className="mt-1 w-4 h-4 rounded accent-primary"
                />
                <span className="font-body-md text-body-md text-on-surface-variant">
                  J&apos;accepte les{" "}
                  <Link href="/informations/cgv" className="text-primary hover:underline">
                    Conditions Générales de Vente
                  </Link>
                </span>
              </label>
              {errors.acceptTerms && (
                <span className="text-error font-label-sm text-label-sm">{errors.acceptTerms[0]}</span>
              )}

              {errors.form && (
                <div className="bg-error-container/50 text-on-error-container px-md py-sm rounded-lg font-body-md text-body-md">
                  {errors.form[0]}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={pricing.days < 1}>
                Continuer vers le paiement — {formatPrice(pricing.total)}
              </Button>
            </form>
          )}

          {step === "payment" && (
            <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-lg">
              <div className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-xs mb-md">
                  <CreditCard size={20} className="text-primary" />
                  Paiement sécurisé
                </h2>
                <div className="flex gap-sm mb-md">
                  <div className="px-sm py-xs bg-surface-container rounded text-on-surface-variant font-label-sm text-label-sm">
                    VISA
                  </div>
                  <div className="px-sm py-xs bg-surface-container rounded text-on-surface-variant font-label-sm text-label-sm">
                    MASTERCARD
                  </div>
                </div>

                <div className="flex flex-col gap-sm">
                  <Input
                    label="Numéro de carte"
                    value={formData.cardNumber}
                    onChange={(e) => setField("cardNumber", formatCardNumber(e.target.value))}
                    error={errors.cardNumber?.[0]}
                    placeholder="XXXX XXXX XXXX XXXX"
                    required
                  />
                  <div className="grid grid-cols-2 gap-sm">
                    <Input
                      label="Expiration"
                      value={formData.expiry}
                      onChange={(e) => setField("expiry", formatExpiry(e.target.value))}
                      error={errors.expiry?.[0]}
                      placeholder="MM/AA"
                      required
                    />
                    <Input
                      label="CVV"
                      value={formData.cvv}
                      onChange={(e) => setField("cvv", e.target.value.replace(/\D/g, "").slice(0, 3))}
                      error={errors.cvv?.[0]}
                      placeholder="123"
                      required
                    />
                  </div>
                  <Input
                    label="Nom sur la carte"
                    value={formData.cardName}
                    onChange={(e) => setField("cardName", e.target.value)}
                    error={errors.cardName?.[0]}
                    required
                  />
                </div>
              </div>

              {errors.form && (
                <div className="bg-error-container/50 text-on-error-container px-md py-sm rounded-lg font-body-md text-body-md">
                  {errors.form[0]}
                </div>
              )}

              <div className="flex gap-sm">
                <Button type="button" variant="ghost" onClick={() => setStep("details")}>
                  Retour
                </Button>
                <Button type="submit" size="lg" className="flex-1" loading={isPending}>
                  Payer {formatPrice(pricing.total)}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Sidebar: Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-lg">
            {/* Vehicle image */}
            <div className="h-32 rounded-lg overflow-hidden mb-md bg-surface-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={vehicle.images[0] || "/placeholder-car.jpg"}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-md">
              {vehicle.year} · {vehicle.seats} places
            </p>

            <div className="border-t border-outline-variant/30 pt-md space-y-sm">
              <div className="flex justify-between font-body-md text-body-md">
                <span className="text-on-surface-variant">{formatPrice(vehicle.pricePerDay)} × {pricing.days} jour{pricing.days > 1 ? "s" : ""}</span>
                <span className="text-on-surface">{formatPrice(pricing.basePrice)}</span>
              </div>
              {formData.selectedOptions.map((optId) => {
                const option = RENTAL_OPTIONS.find((o) => o.id === optId);
                if (!option) return null;
                return (
                  <div key={optId} className="flex justify-between font-body-md text-body-md">
                    <span className="text-on-surface-variant">{option.label}</span>
                    <span className="text-on-surface">{formatPrice(option.pricePerDay * pricing.days)}</span>
                  </div>
                );
              })}
              <div className="border-t border-outline-variant/30 pt-sm flex justify-between">
                <span className="font-label-bold text-label-bold text-on-surface">Total TTC</span>
                <span className="font-headline-sm text-headline-sm text-primary">{formatPrice(pricing.total)}</span>
              </div>
            </div>

            <div className="mt-md flex flex-col gap-xs">
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                <Clock size={14} />
                {vehicle.mileageLimit} km inclus
              </div>
              <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
                <Shield size={14} />
                Assurance de base incluse
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReservationPage({
  vehicle,
  user,
}: {
  vehicle: VehicleData;
  user: UserProfile;
}) {
  return (
    <Suspense>
      <ReservationFormInner vehicle={vehicle} user={user} />
    </Suspense>
  );
}
