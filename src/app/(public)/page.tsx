import { Hero } from "@/components/public/hero";
import { VehicleGrid } from "@/components/public/vehicle-grid";
import { WhyChooseUs } from "@/components/public/why-choose-us";
import { SpecialOffers } from "@/components/public/special-offers";
import { getFeaturedVehicles, getActiveOffers } from "@/lib/server/home-data";
import { getPublicUrl } from "@/lib/supabase";

export default async function HomePage() {
  const [vehicles, offers] = await Promise.all([
    getFeaturedVehicles(),
    getActiveOffers(),
  ]);

  const serializedVehicles = vehicles.map((v) => ({
    ...v,
    pricePerDay: Number(v.pricePerDay),
    images: v.images.map(getPublicUrl),
  }));

  return (
    <>
      <Hero />
      <VehicleGrid vehicles={serializedVehicles} />
      <WhyChooseUs />
      <SpecialOffers offers={offers} />
    </>
  );
}
