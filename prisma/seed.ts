import { PrismaClient, Role, UserStatus, VehicleStatus, Category, FuelType, Transmission } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  await prisma.reservationStatusHistory.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.specialOffer.deleteMany();
  await prisma.agencySettings.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("AdminRentCars2024!", 12);
  const userPassword = await bcrypt.hash("UserRentCars2024!", 12);

  const admin = await prisma.user.create({
    data: {
      firstName: "Jean",
      lastName: "Dupont",
      email: "admin@rentcars.com",
      password: adminPassword,
      phone: "+33 6 12 34 56 78",
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const user = await prisma.user.create({
    data: {
      firstName: "Marie",
      lastName: "Martin",
      email: "utilisateur@test.com",
      password: userPassword,
      phone: "+33 6 98 76 54 32",
      role: Role.USER,
      status: UserStatus.ACTIVE,
    },
  });

  console.log(`Created users: ${admin.email}, ${user.email}`);

  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        brand: "Porsche", model: "911 Carrera", year: 2024, category: Category.LUXURY,
        fuel: FuelType.PETROL, transmission: Transmission.AUTOMATIC, seats: 2,
        pricePerDay: 350, mileageLimit: 300, power: 385, torque: 450,
        acceleration: 4.2, topSpeed: 293, consumption: 10.1, trunkVolume: 132,
        description: "La Porsche 911 Carrera incarne l'excellence sportive allemande. Son design iconique et ses performances exceptionnelles en font la référence des coupés sportifs.",
        equipments: ["Climatisation bi-zone", "GPS navigation", "Sièges cuir chauffants", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Toit panoramique", "Jantes 20 pouces"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Tesla", model: "Model 3", year: 2024, category: Category.ELECTRIC,
        fuel: FuelType.ELECTRIC, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 120, mileageLimit: 300, power: 283, torque: 420,
        acceleration: 6.1, topSpeed: 225, consumption: 14.9, trunkVolume: 425,
        description: "La Tesla Model 3 révolutionne la conduite avec son autonomie impressionnante et sa technologie de pointe. Zéro émission, maximum de plaisir.",
        equipments: ["Climatisation", "Écran 15 pouces", "Autopilote", "Caméra 360°", "Bluetooth", "Recharge rapide", "Sièges chauffants"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Land Rover", model: "Range Rover Velar", year: 2024, category: Category.SUV,
        fuel: FuelType.DIESEL, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 250, mileageLimit: 300, power: 240, torque: 500,
        acceleration: 7.3, topSpeed: 217, consumption: 7.5, trunkVolume: 552,
        description: "Le Range Rover Velar allie raffinement britannique et capacités tout-terrain. Un SUV de luxe qui ne compromet ni le confort ni la performance.",
        equipments: ["Climatisation quadri-zone", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Toit panoramique", "Suspension pneumatique"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "BMW", model: "Série 3", year: 2024, category: Category.LUXURY,
        fuel: FuelType.HYBRID, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 85, mileageLimit: 300, power: 184, torque: 300,
        acceleration: 7.5, topSpeed: 235, consumption: 5.8, trunkVolume: 480,
        description: "La BMW Série 3 hybride combine sportivité et efficience. Son châssis légendaire et sa motorisation hybride offrent une expérience de conduite unique.",
        equipments: ["Climatisation", "GPS navigation", "Sièges sport", "Caméra de recul", "Régulateur", "Bluetooth", "Apple CarPlay"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Mercedes", model: "Classe C", year: 2024, category: Category.LUXURY,
        fuel: FuelType.ELECTRIC, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 90, mileageLimit: 300, power: 231, torque: 370,
        acceleration: 6.9, topSpeed: 230, consumption: 17.2, trunkVolume: 455,
        description: "La Mercedes Classe C électrique incarne le luxe silencieux. Intérieur raffiné, technologie MBUX et zéro émission pour une mobilité premium.",
        equipments: ["Climatisation", "GPS navigation", "Sièges cuir", "Caméra 360°", "Régulateur adaptatif", "Bluetooth", "MBUX"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Renault", model: "Mégane E-Tech", year: 2024, category: Category.URBAN,
        fuel: FuelType.ELECTRIC, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 55, mileageLimit: 300, power: 218, torque: 300,
        acceleration: 7.4, topSpeed: 160, consumption: 15.4, trunkVolume: 389,
        description: "La Renault Mégane E-Tech est la citadine électrique parfaite. Agile en ville, confortable sur route, elle offre un excellent rapport qualité-prix.",
        equipments: ["Climatisation", "GPS navigation", "Écran 12 pouces", "Caméra de recul", "Bluetooth", "Recharge rapide", "Apple CarPlay"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Peugeot", model: "3008", year: 2024, category: Category.SUV,
        fuel: FuelType.HYBRID, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 60, mileageLimit: 300, power: 225, torque: 360,
        acceleration: 8.7, topSpeed: 206, consumption: 5.9, trunkVolume: 520,
        description: "Le Peugeot 3008 hybride séduit par son design audacieux et son i-Cockpit innovant. Un SUV familial qui ne manque pas de caractère.",
        equipments: ["Climatisation", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "i-Cockpit"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Audi", model: "A4 Avant", year: 2024, category: Category.LUXURY,
        fuel: FuelType.PETROL, transmission: Transmission.AUTOMATIC, seats: 5,
        pricePerDay: 80, mileageLimit: 300, power: 190, torque: 320,
        acceleration: 7.1, topSpeed: 240, consumption: 7.3, trunkVolume: 505,
        description: "L'Audi A4 Avant combine élégance et pragmatisme. Son Virtual Cockpit et sa finition irréprochable en font une berline break de référence.",
        equipments: ["Climatisation tri-zone", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Virtual Cockpit"],
        images: [], status: VehicleStatus.AVAILABLE, isFeatured: false,
      },
    }),
  ]);

  console.log(`Created ${vehicles.length} vehicles`);

  const now = new Date();
  const offers = await Promise.all([
    prisma.specialOffer.create({
      data: {
        title: "Location Longue Durée",
        description: "-20% sur les locations de plus de 14 jours. Idéal pour vos déplacements professionnels.",
        discount: 20, category: null,
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        isActive: true,
      },
    }),
    prisma.specialOffer.create({
      data: {
        title: "Gamme Électrique",
        description: "Roulez propre sans supplément. Bornes de recharge incluses.",
        discount: 10, category: Category.ELECTRIC,
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${offers.length} special offers`);

  await prisma.agencySettings.create({
    data: {
      name: "RentCars",
      address: "15 Avenue des Champs-Élysées, 75008 Paris",
      phone: "+33 1 42 68 53 00",
      email: "contact@rentcars.com",
      siret: "123 456 789 00012",
      openingHours: {
        monday: { open: "08:00", close: "19:00" },
        tuesday: { open: "08:00", close: "19:00" },
        wednesday: { open: "08:00", close: "19:00" },
        thursday: { open: "08:00", close: "19:00" },
        friday: { open: "08:00", close: "19:00" },
        saturday: { open: "09:00", close: "17:00" },
        sunday: { closed: true },
      },
    },
  });

  console.log("Created agency settings");
  console.log("Seeding complete!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
