import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD7WnaAN4Be5HtPHnqGxUCu_CYjem7-8BAYsh4OeZIWpJvhh8IRvbtBpZUjSFKdpvzhR0MjGgZl6TmVXswkNEL56BrqcgUStPTyN0PDvZIENcydw2wP1Gukp8rMhOW3j_MGZ2dX8dOGEtff7wyDc5qnSD11_MLiAWA0vAEJVAT-FkiLyzE_tF_yi1RYFlmLB7UzN1R_wSW4HiDmhWnfb6Zao-OopAzXjMjg5lfoh0GsjVZwGWRYIygY4aOePd6W8WwV35Yy3mSA8P_F";

export function Hero() {
  return (
    <section className="relative w-full min-h-[600px] flex items-center justify-center bg-surface-container-high overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Luxury sports car parked in front of modern architecture"
          className="w-full h-full object-cover object-center opacity-90"
          src={HERO_IMAGE}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto w-full px-margin grid grid-cols-1 lg:grid-cols-2 gap-xl">
        <div className="flex flex-col gap-lg justify-center max-w-2xl">
          <div className="flex flex-col gap-sm">
            <span className="font-label-bold text-label-bold text-primary uppercase tracking-widest">
              Excellence Automobile
            </span>
            <h1 className="font-headline-xl text-headline-xl text-on-background">
              Louez la voiture de vos rêves
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
              Large sélection de véhicules pour tous vos besoins. Du coupé sportif au SUV
              familial, trouvez le véhicule parfait pour votre prochain voyage.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-md">
            <Link href="/reservations/nouvelle">
              <Button size="lg" className="shadow-[0_12px_32px_rgba(35,35,35,0.08)] gap-sm">
                Réserver maintenant
                <ArrowRight size={20} />
              </Button>
            </Link>
            <Link href="/inventaire">
              <Button variant="ghost" size="lg">
                Voir la flotte
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
