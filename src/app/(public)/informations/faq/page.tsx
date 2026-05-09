import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — RentCars",
};

const faqs = [
  {
    q: "Quels documents sont nécessaires pour louer un véhicule ?",
    a: "Vous devez présenter un permis de conduire valide (depuis au moins 2 ans), une pièce d'identité en cours de validité et une carte bancaire au nom du conducteur principal.",
  },
  {
    q: "Quel est le kilométrage inclus ?",
    a: "Chaque location inclut 300 km par jour. Au-delà, un supplément de 0,30€ par kilomètre supplémentaire sera facturé.",
  },
  {
    q: "Puis-je annuler ma réservation ?",
    a: "Oui, vous pouvez annuler gratuitement jusqu'à 48 heures avant le début de la location. Au-delà, des frais de 50% du montant total s'appliquent.",
  },
  {
    q: "L'assurance est-elle incluse ?",
    a: "Une assurance de base (responsabilité civile + dommages avec franchise) est incluse dans tous nos tarifs. Vous pouvez souscrire à une assurance tous risques en option (+25€/jour) pour réduire la franchise à 0€.",
  },
  {
    q: "Où puis-je récupérer et restituer le véhicule ?",
    a: "Notre agence est située au 15 Avenue des Champs-Élysées, 75008 Paris. La restitution s'effectue au même endroit par défaut. Un service de livraison peut être organisé sur demande.",
  },
  {
    q: "Quelles sont les options supplémentaires disponibles ?",
    a: "Nous proposons : siège bébé (10€/jour), GPS additionnel (8€/jour), conducteur additionnel (15€/jour) et conducteur jeune moins de 25 ans (20€/jour).",
  },
  {
    q: "Comment fonctionne le paiement ?",
    a: "Le paiement s'effectue en ligne au moment de la réservation. Nous acceptons les cartes Visa et Mastercard. Le montant total est débité immédiatement.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin py-xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg">Questions Fréquentes</h1>

      <div className="flex flex-col gap-md">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-surface rounded-xl border border-outline-variant/20 p-lg">
            <h2 className="font-label-bold text-label-bold text-on-surface mb-sm">{faq.q}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
