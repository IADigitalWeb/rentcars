export const RENTAL_OPTIONS = [
  { id: "fullInsurance", label: "Assurance tous risques", pricePerDay: 25 },
  { id: "babySeat", label: "Siège bébé", pricePerDay: 10 },
  { id: "gpsExtra", label: "GPS additionnel", pricePerDay: 8 },
  { id: "extraDriver", label: "Conducteur additionnel", pricePerDay: 15 },
  { id: "youngDriver", label: "Conducteur jeune (<25 ans)", pricePerDay: 20 },
] as const;
