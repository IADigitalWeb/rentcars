"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  CATEGORY_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  formatPrice,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/ui/star-rating";
import { ReviewForm } from "@/components/public/review-form";
import { toggleFavorite } from "@/app/actions/favorites";
import {
  Users,
  Settings,
  Fuel,
  Gauge,
  Zap,
  Timer,
  Activity,
  Battery,
  Package,
  Heart,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { firstName: string; lastName: string };
}

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
  power: number | null;
  torque: number | null;
  acceleration: number | null;
  topSpeed: number | null;
  consumption: number | null;
  trunkVolume: number | null;
  description: string | null;
  equipments: string[];
  images: string[];
  isFeatured: boolean;
  reviews: Review[];
  isInitiallyFavorite?: boolean;
}

type Tab = "description" | "equipments" | "reviews";

export function VehicleDetail({
  vehicle,
  initialFavorite = false,
}: {
  vehicle: VehicleData;
  initialFavorite?: boolean;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState<Tab>("description");
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [isPending, startTransition] = useTransition();
  const [reviews, setReviews] = useState(vehicle.reviews);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const specs = [
    ...(vehicle.power ? [{ icon: Gauge, label: "Puissance", value: `${vehicle.power} ch` }] : []),
    ...(vehicle.torque ? [{ icon: Zap, label: "Couple", value: `${vehicle.torque} Nm` }] : []),
    ...(vehicle.acceleration ? [{ icon: Timer, label: "0-100 km/h", value: `${vehicle.acceleration}s` }] : []),
    ...(vehicle.topSpeed ? [{ icon: Activity, label: "Vitesse max", value: `${vehicle.topSpeed} km/h` }] : []),
    ...(vehicle.consumption ? [{ icon: vehicle.fuel === "ELECTRIC" ? Battery : Fuel, label: "Conso.", value: vehicle.fuel === "ELECTRIC" ? `${vehicle.consumption} kWh` : `${vehicle.consumption} L` }] : []),
    ...(vehicle.trunkVolume ? [{ icon: Package, label: "Coffre", value: `${vehicle.trunkVolume} L` }] : []),
  ];

  const tabs: { key: Tab; label: string }[] = [
    { key: "description", label: "Description" },
    { key: "equipments", label: `Équipements (${vehicle.equipments.length})` },
    { key: "reviews", label: `Avis (${reviews.length})` },
  ];

  const handleFavorite = () => {
    if (!session?.user?.id) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(`/vehicules/${vehicle.id}`)}`);
      return;
    }
    startTransition(async () => {
      const result = await toggleFavorite(vehicle.id);
      if ("isFavorite" in result && typeof result.isFavorite === "boolean") {
        setIsFavorite(result.isFavorite);
      }
    });
  };

  const handleReviewAdded = (review: Review) => {
    setReviews((prev) => [review, ...prev]);
    setActiveTab("reviews");
  };

  const handleReserve = () => {
    if (!session?.user?.id) {
      router.push(`/auth/connexion?callbackUrl=${encodeURIComponent(`/reservations/nouvelle?vehicleId=${vehicle.id}`)}`);
      return;
    }
    router.push(`/reservations/nouvelle?vehicleId=${vehicle.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-margin py-xl">
      <Link
        href="/inventaire"
        className="inline-flex items-center gap-xs font-label-bold text-label-bold text-on-surface-variant hover:text-primary transition-colors mb-md"
      >
        <ChevronLeft size={18} />
        Retour à l&apos;inventaire
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
        {/* Gallery */}
        <div className="flex flex-col gap-sm">
          <div className="relative h-[400px] bg-surface-container-high rounded-xl overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              src={vehicle.images[selectedImage] || "/placeholder-car.jpg"}
            />
            <button
              onClick={handleFavorite}
              disabled={isPending}
              className="absolute top-md right-md p-sm rounded-full bg-surface/90 backdrop-blur shadow-sm hover:bg-surface transition-colors"
              aria-label="Ajouter aux favoris"
            >
              <Heart
                size={24}
                className={cn(
                  "transition-colors",
                  isFavorite ? "fill-error text-error" : "text-on-surface-variant"
                )}
              />
            </button>
          </div>
          {vehicle.images.length > 1 && (
            <div className="flex gap-sm overflow-x-auto pb-xs">
              {vehicle.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    "w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                    selectedImage === i ? "border-primary" : "border-transparent"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={`${vehicle.brand} ${vehicle.model} ${i + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-md">
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <Badge variant="category" value={vehicle.category} />
              {vehicle.isFeatured && (
                <Badge variant="promo">Premium</Badge>
              )}
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
              {vehicle.year} &middot; {CATEGORY_LABELS[vehicle.category]}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-sm">
            <span className="flex items-center gap-xs bg-surface-container px-sm py-xs rounded font-label-sm text-label-sm text-on-surface">
              <Users size={16} className="text-on-surface-variant" />
              {vehicle.seats} places
            </span>
            <span className="flex items-center gap-xs bg-surface-container px-sm py-xs rounded font-label-sm text-label-sm text-on-surface">
              <Settings size={16} className="text-on-surface-variant" />
              {TRANSMISSION_LABELS[vehicle.transmission]}
            </span>
            <span className="flex items-center gap-xs bg-surface-container px-sm py-xs rounded font-label-sm text-label-sm text-on-surface">
              <Fuel size={16} className="text-on-surface-variant" />
              {FUEL_LABELS[vehicle.fuel]}
            </span>
          </div>

          {/* Technical Specs */}
          {specs.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-sm">
              {specs.map((spec) => (
                <div key={spec.label} className="flex items-center gap-sm bg-surface-container-low p-sm rounded-lg">
                  <spec.icon size={20} className="text-primary shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{spec.label}</span>
                    <span className="font-label-bold text-label-bold text-on-surface">{spec.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="bg-surface-container-lowest rounded-xl p-md border border-outline-variant/20">
            <div className="flex items-baseline gap-xs">
              <span className="font-headline-xl text-headline-xl text-primary">{formatPrice(vehicle.pricePerDay)}</span>
              <span className="font-body-md text-body-md text-on-surface-variant">/jour</span>
            </div>
            <div className="flex flex-col gap-xs mt-sm font-label-sm text-label-sm text-on-surface-variant">
              <span>{vehicle.mileageLimit} km inclus</span>
              <span>Assurance de base incluse</span>
            </div>
            <Button size="lg" className="w-full gap-sm mt-md" onClick={handleReserve}>
              Réserver ce véhicule
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-xl">
        <div className="flex gap-sm border-b border-outline-variant/30 mb-md">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-md py-sm font-label-bold text-label-bold transition-colors border-b-2 -mb-px",
                activeTab === tab.key
                  ? "text-primary border-primary"
                  : "text-on-surface-variant border-transparent hover:text-primary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-md">
          {activeTab === "description" && (
            <div className="max-w-3xl">
              {vehicle.description ? (
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed whitespace-pre-line">
                  {vehicle.description}
                </p>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Aucune description disponible pour ce véhicule.
                </p>
              )}
            </div>
          )}

          {activeTab === "equipments" && (
            <div className="flex flex-wrap gap-sm max-w-3xl">
              {vehicle.equipments.map((eq) => (
                <span
                  key={eq}
                  className="bg-surface-container px-md py-sm rounded-full font-label-sm text-label-sm text-on-surface border border-outline-variant/30"
                >
                  {eq}
                </span>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-3xl flex flex-col gap-md">
              {session?.user?.id && (
                <ReviewForm vehicleId={vehicle.id} onReviewAdded={handleReviewAdded} />
              )}
              {!session?.user?.id && (
                <div className="text-center py-md">
                  <Link
                    href={`/auth/connexion?callbackUrl=${encodeURIComponent(`/vehicules/${vehicle.id}`)}`}
                    className="text-primary hover:underline font-label-bold"
                  >
                    Connectez-vous
                  </Link>
                  {" "}pour laisser un avis
                </div>
              )}

              {reviews.length > 0 ? (
                <>
                  <div className="flex items-center gap-md p-md bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                    <div className="text-center">
                      <span className="font-headline-xl text-headline-xl text-on-surface">{averageRating.toFixed(1)}</span>
                      <span className="font-body-md text-body-md text-on-surface-variant">/5</span>
                    </div>
                    <div>
                      <StarRating rating={averageRating} size={20} />
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-xs block">
                        {reviews.length} avis
                      </span>
                    </div>
                  </div>
                  {reviews.map((review) => (
                    <div key={review.id} className="p-md bg-surface rounded-xl border border-outline-variant/20 flex flex-col gap-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-label-bold text-label-bold text-on-surface">
                          {review.user.firstName} {review.user.lastName}
                        </span>
                        <StarRating rating={review.rating} size={16} />
                      </div>
                      {review.comment && (
                        <p className="font-body-md text-body-md text-on-surface-variant">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </>
              ) : (
                <p className="font-body-md text-body-md text-on-surface-variant text-center py-lg">
                  Aucun avis pour le moment.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
