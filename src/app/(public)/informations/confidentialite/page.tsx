import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — RentCars",
};

export default function ConfidentialitePage() {
  return (
    <div className="max-w-3xl mx-auto px-margin py-xl">
      <h1 className="font-headline-xl text-headline-xl text-on-surface mb-lg">Politique de Confidentialité</h1>

      <div className="flex flex-col gap-md font-body-md text-body-md text-on-surface leading-relaxed">
        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">1. Collecte des données</h2>
          <p>RentCars collecte les données personnelles nécessaires au bon fonctionnement du service : nom, prénom, adresse email, numéro de téléphone, adresse postale, date de naissance et informations de permis de conduire.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">2. Utilisation des données</h2>
          <p>Vos données sont utilisées pour : la gestion de votre compte, le traitement des réservations, la communication liée à vos locations, l&apos;envoi d&apos;offres promotionnelles (avec votre consentement) et le respect des obligations légales.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">3. Protection des données</h2>
          <p>Vos données sont stockées de manière sécurisée. Les mots de passe sont chiffrés et ne sont jamais accessibles en clair. Nous utilisons des protocoles de sécurité standards (HTTPS, chiffrement) pour protéger les transmissions.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">4. Vos droits</h2>
          <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, contactez-nous à contact@rentcars.com.</p>
        </section>

        <section>
          <h2 className="font-headline-sm text-headline-sm text-on-surface mb-sm">5. Cookies</h2>
          <p>Nous utilisons des cookies essentiels au fonctionnement du site et des cookies analytiques (anonymisés) pour améliorer votre expérience. Vous pouvez désactiver les cookies non essentiels dans les paramètres de votre navigateur.</p>
        </section>
      </div>
    </div>
  );
}
