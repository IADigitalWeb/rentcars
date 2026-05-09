import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — RentCars",
};

export default function CGVPage() {
  return (
    <div className="max-w-3xl mx-auto px-margin py-xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg">Conditions Générales de Vente</h1>

      <div className="flex flex-col gap-md font-body-md text-body-md text-on-surface leading-relaxed">
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">1. Objet</h2>
          <p>Les présentes conditions générales de vente régissent les relations entre RentCars et ses clients pour la location de véhicules automobiles. Toute réservation implique l&apos;acceptation intégrale de ces conditions.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">2. Réservation</h2>
          <p>La réservation est confirmée après paiement en ligne. Le client reçoit une confirmation par email avec la référence de la réservation. Toute réservation est personnelle et ne peut être cédée à un tiers.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">3. Annulation</h2>
          <p>L&apos;annulation est possible jusqu&apos;à 48 heures avant le début de la location sans frais. Au-delà, des frais d&apos;annulation de 50% du montant total seront appliqués. Aucun remboursement en cas d&apos;annulation après le début de la location.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">4. Conditions de location</h2>
          <p>Le locataire doit être titulaire d&apos;un permis de conduire valide depuis au moins 2 ans. Le véhicule doit être restitué dans l&apos;état où il a été remis, avec le niveau de carburant initial. Le kilométrage inclus est de 300 km/jour, au-delà un supplément de 0,30€/km sera facturé.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">5. Assurance</h2>
          <p>Une assurance de base est incluse dans le tarif. Elle couvre la responsabilité civile et les dommages au véhicule avec une franchise variable selon la catégorie. L&apos;assurance tous risques est disponible en option supplémentaire.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">6. Responsabilité</h2>
          <p>RentCars ne saurait être tenu responsable des dommages indirects résultant de la location. Le locataire reste responsable de toute infraction au code de la route commise pendant la durée de la location.</p>
        </section>
      </div>
    </div>
  );
}
