import { Tag, Car, Headset, MapPin } from "lucide-react";

const advantages = [
  { icon: Tag, title: "Meilleurs prix garantis", description: "Des tarifs transparents sans frais cachés, compétitifs toute l'année." },
  { icon: Car, title: "Large choix", description: "Une flotte variée, de la citadine agile à la supercar exclusive." },
  { icon: Headset, title: "Support 24/7", description: "Une assistance dédiée à votre écoute à tout moment de votre voyage." },
  { icon: MapPin, title: "Agences en France", description: "Retirez et déposez votre véhicule facilement dans notre réseau national." },
];

export function WhyChooseUs() {
  return (
    <section className="bg-surface-container-lowest py-xl border-y border-outline-variant/20">
      <div className="max-w-7xl mx-auto px-margin">
        <div className="text-center mb-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Pourquoi nous choisir</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-sm max-w-2xl mx-auto">
            Notre engagement : vous fournir une expérience de location irréprochable, avec une flotte méticuleusement entretenue et un service sur-mesure.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg">
          {advantages.map((item) => (
            <div key={item.title} className="flex flex-col items-center text-center gap-sm p-md bg-surface rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-sm">
                <item.icon size={32} />
              </div>
              <h3 className="font-label-bold text-label-bold text-on-surface text-lg">{item.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
