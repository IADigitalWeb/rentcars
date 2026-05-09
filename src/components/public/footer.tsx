import Link from "next/link";

const footerLinks = {
  company: [
    { href: "/informations/agences", label: "Agences" },
    { href: "/informations/contact", label: "Support Client" },
  ],
  legal: [
    { href: "/informations/cgv", label: "Conditions Générales" },
    { href: "/informations/confidentialite", label: "Politique de Confidentialité" },
  ],
  help: [
    { href: "/informations/faq", label: "FAQ" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-container-highest dark:bg-inverse-surface w-full mt-xl border-t border-outline-variant/30">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg max-w-7xl mx-auto px-margin py-lg">
        <div className="flex flex-col gap-md">
          <div className="font-headline-md text-headline-md font-bold text-on-surface dark:text-inverse-on-surface">
            RentCars
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-on-surface-variant/70">
            &copy; {new Date().getFullYear()} RentCars. L&apos;excellence automobile à votre service.
          </p>
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface">Entreprise</h4>
          {footerLinks.company.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-on-surface-variant/70 dark:hover:text-primary-fixed-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface">Légal</h4>
          {footerLinks.legal.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-on-surface-variant/70 dark:hover:text-primary-fixed-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-sm">
          <h4 className="font-label-bold text-label-bold text-on-surface">Aide</h4>
          {footerLinks.help.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body-md text-body-md text-on-surface-variant hover:text-primary dark:text-on-surface-variant/70 dark:hover:text-primary-fixed-dim transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
