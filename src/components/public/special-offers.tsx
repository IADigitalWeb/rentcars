import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

interface Offer {
  id: string;
  title: string;
  description: string | null;
  discount: number;
  category: string | null;
  startDate: Date;
  endDate: Date;
}

interface SpecialOffersProps {
  offers: Offer[];
}

const OFFER_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAic_v1NVkfBZ5FWSxPlopeP3OeyuMeBV1XtXwmPcy-HuhFPWKbMMtHP7Zut0DXdRBFfeWXdlXUBrSUtkcr8Cas1qoStJRxPsXw1DpDGZjvwQuRXOyzh-rGts-tIaRGe9o827V9UzX_zKPWn690lR0LcPNxEWUYnK0BRJYgYzgmSJESGNvHvzUtp3OQRto2opyrgN9-fnlP64ZdHuRA7XhbWRHZQINkapVZvQ9JaeDf7XZJNl-FWJwv8rM3T0_5X8ZFlMaTvrQq7oc6",
];

export function SpecialOffers({ offers }: SpecialOffersProps) {
  if (offers.length === 0) return null;

  const primaryOffer = offers[0];
  const secondaryOffer = offers[1] || null;

  return (
    <section className="max-w-7xl mx-auto px-margin py-xl">
      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">Offres Spéciales</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter auto-rows-[250px]">
        <div className="md:col-span-2 relative rounded-xl overflow-hidden group shadow-sm hover:shadow-[0_12px_32px_rgba(35,35,35,0.08)] transition-shadow border border-outline-variant/20">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={primaryOffer.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={OFFER_IMAGES[0]} />
          <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/90 via-inverse-surface/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-lg w-full flex flex-col sm:flex-row justify-between items-end gap-md">
            <div className="flex flex-col gap-xs text-inverse-on-surface">
              <span className="bg-primary text-on-primary font-label-sm text-label-sm px-sm py-xs rounded uppercase tracking-wide w-max">Promo -{primaryOffer.discount}%</span>
              <h3 className="font-headline-lg text-headline-lg leading-tight">{primaryOffer.title}</h3>
              <p className="font-body-md text-body-md opacity-90">{primaryOffer.description}</p>
            </div>
            <Link href="/inventaire" className="bg-surface text-on-surface hover:bg-primary hover:text-on-primary font-label-bold text-label-bold px-md py-[12px] rounded transition-colors whitespace-nowrap">Découvrir</Link>
          </div>
        </div>
        {secondaryOffer ? (
          <div className="relative rounded-xl overflow-hidden group shadow-sm hover:shadow-[0_12px_32px_rgba(35,35,35,0.08)] transition-shadow bg-surface-container-high border border-outline-variant/20 flex flex-col justify-end p-md">
            <div className="absolute top-md right-md bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm px-sm py-xs rounded uppercase tracking-wide z-10">Nouveau</div>
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-12 h-12 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm"><Zap size={24} /></div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{secondaryOffer.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">{secondaryOffer.description}</p>
              <Link href="/inventaire" className="font-label-bold text-label-bold text-primary hover:underline mt-xs flex items-center gap-xs">Voir les modèles <ArrowRight size={16} /></Link>
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-surface-container-high border border-outline-variant/20 flex flex-col justify-end p-md">
            <div className="relative z-10 flex flex-col gap-sm">
              <div className="w-12 h-12 rounded-full bg-surface text-primary flex items-center justify-center shadow-sm"><Zap size={24} /></div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Gamme 100% Électrique</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">Roulez propre sans supplément. Bornes de recharge incluses.</p>
              <Link href="/inventaire" className="font-label-bold text-label-bold text-primary hover:underline mt-xs flex items-center gap-xs">Voir les modèles <ArrowRight size={16} /></Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
