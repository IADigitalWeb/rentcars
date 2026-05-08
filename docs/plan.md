# Plan : RentCars — Application de Location de Voitures

## Contexte

**RentCars** est une application de location de voitures pour **une seule agence**. Ce n'est pas un marketplace : une seule entreprise gère son propre parc automobile. Les clients (USER) peuvent parcourir le catalogue, réserver une voiture et laisser des avis. L'admin (ADMIN) gère les annonces, les réservations et consulte les statistiques.

---

## Source de Vérité Design

> **IMPORTANT** : Toutes les pages de l'application (publiques et admin) doivent être cohérentes avec le design défini dans les fichiers suivants. Extraire les tokens CSS (couleurs, typographie, espacement, border-radius, ombres) depuis `docs/design.md` et les appliquer globalement via la config Tailwind avant de générer toute page.

- `docs/rentcars.html` — Page d'accueil de référence visuelle
- `docs/design.md` — Design system complet (palette, fonts, composants, tokens)

---

## Stack Technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| **Next.js** | 16 | Framework React fullstack (App Router) |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | v4 | Styling utilitaire — pas de Bootstrap |
| **Prisma** | 6.x | ORM pour PostgreSQL |
| **PostgreSQL** | 16+ | Base de données relationnelle |
| **Supabase Storage** | — | Stockage images (photos véhicules, avatars) |
| **NextAuth.js** | v5 | Authentification **Credentials uniquement** (email + mot de passe, sans vérification email) |
| **Zod** | 3.x | Validation des données côté serveur et client |
| **Lucide React** | latest | Icônes |
| **date-fns** | 3.x | Manipulation des dates |
| **Recharts** | 2.x | Graphiques dashboard admin |


> **Next.js 16 — Notes importantes** :
> - **App Router avec Server Components par défaut** : les composants sont Server Components sauf si marqués `'use client'`
> - **`src/proxy.ts` remplace `middleware.ts`** : en Next.js 16, la protection des routes se configure dans `src/proxy.ts`
> - **NextAuth v5 — Credentials uniquement** : utiliser le provider `Credentials` avec email + mot de passe. Pas de vérification email, pas d'OAuth. Le hash du mot de passe se fait avec `bcryptjs` au moment de l'inscription

---

## Variables d'Environnement

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/rentcars?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generer-avec-openssl-rand-base64-32"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# App
NEXT_PUBLIC_APP_NAME="RentCars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="EUR"
```


---

## Initialisation du Projet

> **IMPORTANT** : Le dossier `rentcars/` est créé manuellement par le développeur avant de lancer la commande. Utiliser la commande suivante **dans** ce dossier déjà créé :

```bash
# Se placer dans le dossier déjà créé
cd rentcars

# Créer le projet dans le dossier courant (le point . est obligatoire)
npx create-next-app@latest . --typescript --tailwind --app --src-dir
```

Ne pas utiliser `npx create-next-app@latest rentcars ...` — cela créerait un sous-dossier `rentcars/rentcars/`.

---

## Structure de Dossiers

```
src/
├── app/
│   ├── (public)/               ← pages publiques (layout avec navbar)
│   │   ├── page.tsx            ← accueil
│   │   ├── inventaire/
│   │   ├── vehicules/[id]/
│   │   ├── reservations/nouvelle/
│   │   ├── auth/
│   │   │   ├── connexion/
│   │   │   └── inscription/
│   │   └── informations/
│   ├── (client)/               ← espace client connecté
│   │   └── dashboard/
│   │       ├── page.tsx
│   │       ├── reservations/
│   │       ├── favoris/
│   │       └── profil/
│   ├── admin/                  ← dashboard admin (layout séparé)
│   │   ├── page.tsx
│   │   ├── vehicules/
│   │   ├── reservations/
│   │   ├── clients/
│   │   ├── statistiques/
│   │   └── parametres/
│   └── api/                    ← route handlers Next.js
├── components/
│   ├── ui/                     ← composants génériques réutilisables
│   ├── public/                 ← composants spécifiques au site public
│   ├── client/                 ← composants espace client
│   └── admin/                  ← composants dashboard admin
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── supabase.ts
│   └── utils.ts
├── types/
└── proxy.ts                  ← protection des routes (Next.js 16)
```

---

## Schéma de Base de Données (Prisma)

```prisma
model User {
  id            String        @id @default(cuid())
  firstName     String
  lastName      String
  email         String        @unique
  password      String
  phone         String?
  address       String?
  birthDate     DateTime?
  role          Role          @default(USER)
  status        UserStatus    @default(ACTIVE)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  reservations  Reservation[]
  favorites     Favorite[]
  reviews       Review[]
}

model Vehicle {
  id            String        @id @default(cuid())
  brand         String
  model         String
  year          Int
  category      Category
  fuel          FuelType
  transmission  Transmission
  seats         Int
  pricePerDay   Decimal
  mileageLimit  Int           @default(300)
  power         Int?
  torque        Int?
  acceleration  Decimal?
  topSpeed      Int?
  consumption   Decimal?
  trunkVolume   Int?
  description   String?       @db.Text
  equipments    String[]
  images        String[]
  status        VehicleStatus @default(AVAILABLE)
  isFeatured    Boolean       @default(false)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  reservations  Reservation[]
  favorites     Favorite[]
  reviews       Review[]
  specialOffers SpecialOffer[]
}

model Reservation {
  id              String            @id @default(cuid())
  userId          String
  vehicleId       String
  startDate       DateTime
  endDate         DateTime
  status          ReservationStatus @default(PENDING)
  basePrice       Decimal
  optionsPrice    Decimal           @default(0)
  totalPrice      Decimal
  options         Json
  paymentStatus   PaymentStatus     @default(SIMULATED)
  paymentRef      String?
  adminNotes      String?           @db.Text
  cancelReason    String?
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  user            User              @relation(fields: [userId], references: [id])
  vehicle         Vehicle           @relation(fields: [vehicleId], references: [id])
  statusHistory   ReservationStatusHistory[]
}

model ReservationStatusHistory {
  id            String            @id @default(cuid())
  reservationId String
  status        ReservationStatus
  changedAt     DateTime          @default(now())
  changedBy     String?
  note          String?
  reservation   Reservation       @relation(fields: [reservationId], references: [id])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  vehicleId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id])

  @@unique([userId, vehicleId])
}

model Review {
  id        String   @id @default(cuid())
  userId    String
  vehicleId String
  rating    Int
  comment   String?  @db.Text
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id])
}

model SpecialOffer {
  id          String   @id @default(cuid())
  title       String
  description String?
  discount    Int
  vehicleId   String?
  category    Category?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  vehicle     Vehicle? @relation(fields: [vehicleId], references: [id])
}

model AgencySettings {
  id          String   @id @default(cuid())
  name        String   @default("RentCars")
  address     String?
  phone       String?
  email       String?
  siret       String?
  openingHours Json?
  updatedAt   DateTime @updatedAt
}

enum Role {
  USER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED
}

enum VehicleStatus {
  AVAILABLE
  MAINTENANCE
  OUT_OF_SERVICE
}

enum ReservationStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

enum PaymentStatus {
  SIMULATED
  REFUNDED
}

enum Category {
  LUXURY
  SUV
  URBAN
  ELECTRIC
  UTILITY
  CONVERTIBLE
}

enum FuelType {
  PETROL
  DIESEL
  ELECTRIC
  HYBRID
}

enum Transmission {
  AUTOMATIC
  MANUAL
}
```

---

## Paiement Simulé

Il n'y a **pas de vrai système de paiement**. Le paiement est entièrement simulé :

- Sur la page de réservation, après le récapitulatif, afficher un formulaire de paiement fictif avec les champs : numéro de carte (format `XXXX XXXX XXXX XXXX`), date d'expiration (MM/AA), CVV (3 chiffres), nom sur la carte
- Ces champs ont une validation de format (Zod) mais ne sont **jamais envoyés à une API externe**
- Afficher les logos Visa/Mastercard à côté du champ carte pour l'aspect réaliste
- Un bouton "Payer [montant] €" déclenche une simulation de 1,5 secondes avec un spinner, puis affiche une confirmation de succès
- Le statut `paymentStatus` est toujours enregistré en base comme `SIMULATED`
- Le champ `paymentRef` est généré côté serveur comme une référence fictive : `SIM-XXXXXXXXXX`

---

## Types d'Utilisateurs et Droits

### 1. Visiteur (non connecté)

Peut uniquement :
- Parcourir la page d'accueil (Hero, Flotte Premium, Offres Spéciales, Pourquoi nous choisir)
- Naviguer sur la page Inventaire et utiliser tous les filtres
- Voir le détail de chaque véhicule (photos, caractéristiques, description, avis)
- Consulter les pages Informations (FAQ, Conditions Générales, Politique de Confidentialité, Contact)

Ne peut PAS réserver ni sauvegarder des favoris. S'il tente de cliquer sur "Réserver" ou le cœur favori → modal de connexion, puis redirection automatique vers la page du véhicule après connexion (`callbackUrl`).

### 2. Client Connecté (USER)

Tout ce que fait le visiteur, plus :
- Réserver un véhicule (formulaire complet + paiement simulé)
- Sauvegarder des favoris (icône cœur, toggle)
- Accéder à son espace personnel : tableau de bord, mes réservations, mes favoris, mon profil
- Annuler une réservation avec statut `PENDING` ou `CONFIRMED`

### 3. Administrateur (ADMIN)

Accède directement à `/admin` — jamais au site public via son rôle. Gère toute la plateforme. En Next.js 16, la protection des routes se fait via `src/proxy.ts` (remplace `middleware.ts`). Ce fichier bloque tout accès à `/admin` pour les utilisateurs avec le rôle `USER`, et redirige vers `/auth/connexion` les routes du dashboard client si non connecté.

---

## Pages et Fonctionnalités

### Page d'Accueil `/`

Voir `docs/rentcars.html` pour le rendu exact et `docs/design.md` pour les tokens visuels.

Sections :
- **Hero** : accroche "Louez la voiture de vos rêves", boutons "Réserver maintenant" et "Voir la flotte"
- **Filtres de catégorie** : boutons labels (Tous, Luxe, SUV, Urbaine, Électrique). Le label actif a un style `primary` avec fond teinté. Filtre immédiatement les véhicules de la section Flotte Premium
- **Recherche** : champ texte filtrant en temps réel les véhicules par nom ou marque
- **Flotte Premium** : grille de 3 véhicules `isFeatured = true`. Chaque carte : photo, nom, catégorie, prix/jour, specs (sièges, transmission, carburant), bouton "Sélectionner"
- **Lien "Voir tout l'inventaire"** → `/inventaire`
- **Pourquoi nous choisir** : 4 avantages (Meilleurs prix, Large choix, Support 24/7, Agence en France)
- **Offres Spéciales** : promotions actives issues de la table `SpecialOffer`

### Page Inventaire `/inventaire`

- **Recherche** par mot-clé (nom, marque)
- **Sidebar de filtres** (cumulatifs, mise à jour instantanée sans rechargement) :
  - Catégorie avec compteur de résultats entre parenthèses
  - Prix min-max (slider dual, 50€–500€/jour)
  - Carburant
  - Transmission
  - Nombre de places (2, 4, 5, 7+)
  - Marque
- **Tri** : Prix croissant, Prix décroissant, Popularité, Nouveautés
- **Toggle vue** grille / liste
- **Pagination** : 10 véhicules par page
- Chaque carte : photo + badge catégorie, nom, prix/jour, specs, bouton "Sélectionner"

### Page Détail Véhicule `/vehicules/[id]`

- **Galerie** : grande image principale + miniatures cliquables (4-5 photos)
- **Informations** : nom, catégorie, badges (transmission, carburant, places)
- **Caractéristiques techniques** : Puissance, Couple, 0-100 km/h, Vitesse max, Consommation/Autonomie, Volume coffre
- **3 onglets** :
  - `Description` (défaut) : texte détaillé + équipements inclus
  - `Équipements` : liste de chips (Climatisation, GPS, Sièges cuir, Caméra recul, Régulateur, Bluetooth, Toit panoramique…)
  - `Avis clients` : note moyenne étoiles /5, nombre d'avis, liste des avis
- **Prix** : montant/jour, km inclus, assurance de base
- **Bouton "Réserver ce véhicule"** :
  - Non connecté → modal de connexion + `callbackUrl`
  - Connecté avec réservation chevauchante → message "Vous avez déjà réservé ce véhicule du [date] au [date]"
  - Connecté sans conflit → formulaire de réservation
- **Bouton favori** (cœur) en haut à droite, toggle avec animation

### Formulaire de Réservation `/reservations/nouvelle?vehicleId=...`

Accessible uniquement aux utilisateurs connectés. Les données du profil sont pré-remplies.

Champs :
- Date de début (date picker, pas dans le passé)
- Date de fin (après la date de début)
- Lieu de retrait (dropdown avec l'agence unique)
- Lieu de restitution (idem, option "Même endroit" cochée par défaut)
- **Options supplémentaires** (checkboxes avec prix) :
  - Assurance tous risques +25€/jour
  - Siège bébé +10€/jour
  - GPS additionnel +8€/jour
  - Conducteur additionnel +15€/jour
  - Conducteur jeune <25 ans +20€/jour
- Nom complet, Email, Téléphone (pré-remplis)
- Checkbox acceptation des CGV

**Récapitulatif en temps réel** : nombre de jours, prix de base, options, total TTC (mise à jour instantanée à chaque changement de date ou d'option).

**Étape paiement simulé** : après validation du formulaire, afficher le formulaire de carte fictif (voir section Paiement Simulé).

**Après confirmation** :
- Confirmation avec icône verte, récapitulatif (véhicule, dates, lieu, référence `SIM-XXXXXXXXXX`, montant)
- Réservation enregistrée en base avec statut `PENDING` et `paymentStatus: SIMULATED`
- Apparaît immédiatement dans "Mes Réservations"

**Gestion des erreurs** :
- Champs invalides : bordure rouge + message descriptif sous le champ
- Véhicule indisponible aux dates choisies : afficher les prochaines dates disponibles

### Authentification

**Connexion** `/auth/connexion` : email + mot de passe. Lien "Créer un compte".

**Inscription** `/auth/inscription` :
- Prénom, Nom, Email, Téléphone
- Mot de passe avec indicateur de force (majuscule, minuscule, chiffre, 8 caractères minimum)
- Confirmation du mot de passe
- Checkbox acceptation CGV + Politique de Confidentialité

Après inscription : connexion automatique + redirection vers l'accueil ou `callbackUrl`.

### Espace Personnel Client `/dashboard`

Layout avec sidebar. Sections :

**Tableau de bord** :
- "Bonjour, [Prénom]"
- Carte "Prochaine réservation" (véhicule, dates, lieu)
- Compteurs : réservations actives, historique total, favoris

**Mes Réservations** `/dashboard/reservations` :
- Liste avec : miniature véhicule, nom, dates, lieu, statut coloré, montant, bouton "Voir le détail"
- Statuts : `PENDING` (orange), `CONFIRMED` (vert), `IN_PROGRESS` (bleu), `COMPLETED` (gris), `CANCELLED` (rouge)
- Page détail réservation : toutes les infos + statut + bouton "Annuler" (si `PENDING` ou `CONFIRMED`)
- Confirmation d'annulation via modal

**Mes Favoris** `/dashboard/favoris` :
- Grille de véhicules sauvegardés
- Chaque carte : photo, nom, catégorie, prix/jour, bouton "Réserver", icône "Retirer"

**Mon Profil** `/dashboard/profil` :
- Formulaire : Prénom, Nom, Email, Téléphone, Adresse, Date de naissance
- Bouton "Sauvegarder" avec feedback succès (message vert temporaire)

### Dashboard Admin `/admin`

Layout avec sidebar dédiée. Jamais accessible aux utilisateurs `USER` (middleware).

**Vue d'ensemble** `/admin` :
- KPIs : réservations du mois + tendance vs mois précédent, CA du mois + tendance, véhicules actifs, taux d'occupation moyen
- Graphique ligne : revenus mensuels (12 derniers mois) — Recharts
- Graphique barres : réservations par catégorie — Recharts
- Graphique donut : répartition du parc par carburant — Recharts
- Tableau des dernières réservations avec actions rapides (changer statut)

**Gestion des Véhicules** `/admin/vehicules` :
- Tableau avec filtres (catégorie, carburant, statut)
- Actions par ligne : modifier, dupliquer, supprimer (avec modal de confirmation)
- Formulaire création/modification : marque, modèle, catégorie, année, carburant, transmission, places, prix/jour, kilométrage inclus, puissance, description, équipements (tags), galerie photos (upload Supabase Storage, réordonnancement), statut, `isFeatured`

**Gestion des Réservations** `/admin/reservations` :
- Tableau de toutes les réservations, filtres par statut, dates, recherche client
- Drawer latéral au clic : infos client, véhicule, dates, options, historique des changements de statut
- Changement de statut : `PENDING → CONFIRMED → IN_PROGRESS → COMPLETED` ou `CANCELLED`
- Notes internes (visibles admin uniquement)

**Gestion des Clients** `/admin/clients` :
- Liste de tous les utilisateurs, recherche par nom/email/téléphone
- Profil client avec historique de réservations
- Actions : suspendre un compte (`status: SUSPENDED`), supprimer avec confirmation (anonymisation des données)

**Statistiques** `/admin/statistiques` :
- Revenus par mois (filtre par année)
- Top 10 véhicules les plus loués
- Répartition des réservations par catégorie
- Taux d'occupation par véhicule
- Durée moyenne de location
- Panier moyen
- Évolution mensuelle des inscriptions clients

**Paramètres** `/admin/parametres` :
- Informations de l'agence : nom, adresse, SIRET, téléphone, email
- Horaires d'ouverture
- Prix minimum par catégorie, montant caution par catégorie
- Gestion des options de location (nom, prix/jour, activer/désactiver)
- Gestion des catégories de véhicules (nom, icône, description, ordre)

---

## Comportements Globaux

- **Redirection après connexion** : toujours utiliser `callbackUrl` pour ramener l'utilisateur là où il était
- **Conflit de réservation** : un utilisateur ne peut pas réserver un véhicule déjà réservé aux mêmes dates. Si conflit → afficher les prochaines dates disponibles
- **Filtres cumulatifs** : les filtres de l'inventaire sont cumulatifs et les résultats se mettent à jour sans rechargement
- **Confirmations modales** : toute action destructrice (supprimer véhicule, annuler réservation, supprimer/suspendre compte) passe par une modal de confirmation
- **Responsive** : toutes les pages fonctionnent sur mobile (375px) et desktop (1280px+)
- **Statuts colorés** (constants dans tout le projet) :
  - `PENDING` → orange
  - `CONFIRMED` → vert
  - `IN_PROGRESS` → bleu
  - `COMPLETED` → gris
  - `CANCELLED` → rouge
- **Feedback formulaires** : erreurs en rouge avec message descriptif sous le champ, succès en vert (temporaire ou page de confirmation)
- **Calcul temps réel** : le récapitulatif de réservation recalcule le total à chaque changement de date ou d'option
- **Compte suspendu** : si `status: SUSPENDED`, NextAuth rejette la connexion avec le message "Votre compte a été suspendu. Contactez le support."


---

## Données Seed

### Catégories de véhicules

| Enum | Nom affiché | Description |
|------|-------------|-------------|
| `LUXURY` | Luxe | Véhicules haut de gamme et sportives |
| `SUV` | SUV | Véhicules tout-terrain et familiaux |
| `URBAN` | Urbaine | Citadines et compactes |
| `ELECTRIC` | Électrique | Véhicules 100% électriques |
| `UTILITY` | Utilitaire | Véhicules utilitaires et fourgons |
| `CONVERTIBLE` | Cabriolet | Véhicules décapotables |

### Véhicules (8 exemples)

| Nom | Marque | Modèle | Catégorie | Prix/jour | Carburant | Transmission | Places | Puissance | Couple | 0-100 km/h | Vitesse max | Conso. | Coffre |
|-----|--------|--------|-----------|-----------|-----------|-------------|--------|-----------|--------|------------|-------------|--------|--------|
| Porsche 911 Carrera | Porsche | 911 Carrera | LUXURY | 350€ | ESSENCE | AUTOMATIC | 2 | 385 ch | 450 Nm | 4.2s | 293 km/h | 10.1 L | 132 L |
| Tesla Model 3 | Tesla | Model 3 | ELECTRIC | 120€ | ELECTRIC | AUTOMATIC | 5 | 283 ch | 420 Nm | 6.1s | 225 km/h | 14.9 kWh | 425 L |
| Range Rover Velar | Land Rover | Range Rover Velar | SUV | 250€ | DIESEL | AUTOMATIC | 5 | 240 ch | 500 Nm | 7.3s | 217 km/h | 7.5 L | 552 L |
| BMW Série 3 | BMW | Série 3 | LUXURY | 85€ | HYBRID | AUTOMATIC | 5 | 184 ch | 300 Nm | 7.5s | 235 km/h | 5.8 L | 480 L |
| Mercedes Classe C | Mercedes | Classe C | LUXURY | 90€ | ELECTRIC | AUTOMATIC | 5 | 231 ch | 370 Nm | 6.9s | 230 km/h | 17.2 kWh | 455 L |
| Renault Mégane E-Tech | Renault | Mégane E-Tech | URBAN | 55€ | ELECTRIC | AUTOMATIC | 5 | 218 ch | 300 Nm | 7.4s | 160 km/h | 15.4 kWh | 389 L |
| Peugeot 3008 | Peugeot | 3008 | SUV | 60€ | HYBRID | AUTOMATIC | 5 | 225 ch | 360 Nm | 8.7s | 206 km/h | 5.9 L | 520 L |
| Audi A4 Avant | Audi | A4 Avant | LUXURY | 80€ | ESSENCE | AUTOMATIC | 5 | 190 ch | 320 Nm | 7.1s | 240 km/h | 7.3 L | 505 L |

**Équipements exemples** (tableau `equipments[]`) :

- **Porsche 911** : Climatisation bi-zone, GPS navigation, Sièges cuir chauffants, Caméra de recul, Régulateur adaptatif, Bluetooth, Toit panoramique, Jantes 20 pouces
- **Tesla Model 3** : Climatisation, Écran 15 pouces, Autopilote, Caméra 360°, Bluetooth, Recharge rapide, Sièges chauffants
- **Range Rover Velar** : Climatisation quadri-zone, GPS navigation, Sièges cuir, Caméra de recul, Régulateur adaptatif, Bluetooth, Toit panoramique, Suspension pneumatique
- **BMW Série 3** : Climatisation, GPS navigation, Sièges sport, Caméra de recul, Régulateur, Bluetooth, Apple CarPlay
- **Mercedes Classe C** : Climatisation, GPS navigation, Sièges cuir, Caméra 360°, Régulateur adaptatif, Bluetooth, MBUX
- **Renault Mégane E-Tech** : Climatisation, GPS navigation, Écran 12 pouces, Caméra de recul, Bluetooth, Recharge rapide, Apple CarPlay
- **Peugeot 3008** : Climatisation, GPS navigation, Sièges cuir, Caméra de recul, Régulateur adaptatif, Bluetooth, i-Cockpit
- **Audi A4 Avant** : Climatisation tri-zone, GPS navigation, Sièges cuir, Caméra de recul, Régulateur adaptatif, Bluetooth, Virtual Cockpit

Véhicules avec `isFeatured = true` : Porsche 911 Carrera, Tesla Model 3, Range Rover Velar

### Utilisateurs de test

| Email | Rôle | Mot de passe | Prénom | Nom |
|-------|------|-------------|--------|-----|
| admin@rentcars.com | ADMIN | AdminRentCars2024! | Jean | Dupont |
| utilisateur@test.com | USER | UserRentCars2024! | Marie | Martin |

### Offres spéciales

| Titre | Réduction | Catégorie | Description |
|-------|-----------|-----------|-------------|
| Location Longue Durée | -20% | Toutes | -20% sur les locations de plus de 14 jours. Idéal pour vos déplacements professionnels. |
| Gamme Électrique | -10% | ELECTRIC | Roulez propre sans supplément. Bornes de recharge incluses. |

### Paramètres agence

| Champ | Valeur |
|-------|--------|
| Nom | RentCars |
| Adresse | 15 Avenue des Champs-Élysées, 75008 Paris |
| Téléphone | +33 1 42 68 53 00 |
| Email | contact@rentcars.com |
| SIRET | 123 456 789 00012 |

---

## Commandes de Démarrage

```bash
# Se placer dans le dossier déjà créé
cd rentcars

# Créer le projet Next.js 16 dans le dossier courant
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# Installer les dépendances
npm install prisma @prisma/client
npm install next-auth@beta
npm install @supabase/supabase-js
npm install zod lucide-react date-fns recharts bcryptjs
npm install -D @types/bcryptjs

# Initialiser Prisma
npx prisma init

# Créer la première migration
npx prisma migrate dev --name init

# Remplir la base avec les données seed
npx prisma db seed

# Lancer le serveur de développement
npm run dev
```

---

## Phases de Développement

### Phase 1 — Setup (1-2h)
1. Créer le projet avec `create-next-app` (dossier courant)
2. Configurer `.env` avec toutes les variables
3. Configurer Prisma + schéma complet
4. Configurer Supabase Storage (buckets : `cars/`, `avatars/`, `categories/`)
5. Créer `src/proxy.ts` (protection des routes)
6. Créer `src/lib/prisma.ts`, `src/lib/auth.ts`, `src/lib/supabase.ts`, `src/lib/utils.ts`
7. Créer le fichier seed (`prisma/seed.ts`) avec les données ci-dessus
8. Créer `CLAUDE.md` (voir template ci-dessous)

### Phase 2 — Layout & Composants UI (2-3h)
1. Composants réutilisables dans `components/ui/` : Button, Input, Select, Card, Badge, Modal, Skeleton, StarRating
2. Navbar responsive (sticky, transparent-to-white on scroll) — `components/public/navbar.tsx`
3. Footer — `components/public/footer.tsx`
4. Admin Sidebar — `components/admin/admin-sidebar.tsx`
5. Client Sidebar — `components/client/client-sidebar.tsx`
6. Appliquer les tokens DESIGN.md dans la config Tailwind

### Phase 3 — Page d'Accueil (3-4h)
1. Section Hero (image plein écran, accroche, 2 CTA)
2. Barre de filtres catégories (chips : Tous, Luxe, SUV, Urbaine, Électrique)
3. Champ de recherche temps réel
4. Section Flotte Premium (grille 3 véhicules `isFeatured`)
5. Section "Pourquoi nous choisir" (4 avantages)
6. Section Offres Spéciales (layout bento)
7. Suivre `rentcars.html` comme référence visuelle exacte

### Phase 4 — Inventaire (2-3h)
1. Page `/inventaire` avec layout sidebar + grille
2. Sidebar filtres cumulatifs (catégorie avec compteurs, prix slider dual, carburant, transmission, places, marque)
3. Tri (prix croissant/décroissant, popularité, nouveautés)
4. Toggle vue grille / liste
5. Pagination (10 véhicules/page)
6. Carte véhicule (photo + badge catégorie, nom, prix, specs, bouton "Sélectionner")

### Phase 5 — Détail Véhicule (2-3h)
1. Galerie photos (grande image + miniatures cliquables)
2. Informations principales (nom, catégorie, badges)
3. Caractéristiques techniques (puissance, couple, 0-100, vitesse max, conso/autonomie, coffre)
4. 3 onglets : Description, Équipements (chips), Avis clients
5. Prix + bouton "Réserver ce véhicule"
6. Bouton favori (cœur toggle)

### Phase 6 — Authentification (2h)
1. Config NextAuth v5 Credentials dans `src/lib/auth.ts`
2. Page `/auth/connexion` (email + mot de passe)
3. Page `/auth/inscription` (prénom, nom, email, téléphone, mot de passe avec indicateur de force, confirmation, checkbox CGV)
4. Hash bcryptjs à l'inscription
5. Connexion automatique après inscription
6. Gestion `callbackUrl` pour redirection

### Phase 7 — Réservation & Paiement (3h)
1. Formulaire `/reservations/nouvelle?vehicleId=...` (dates, lieux, options, infos pré-remplies)
2. Calcul temps réel du récapitulatif (jours x prix + options)
3. Formulaire de paiement simulé (numéro carte, expiration, CVV, nom)
4. Validation Zod sur tous les champs
5. Spinner 1,5s + confirmation avec référence `SIM-XXXXXXXXXX`
6. Gestion des conflits de dates

### Phase 8 — Favoris & Avis (2h)
1. Bouton favori (toggle cœur avec animation)
2. Page `/dashboard/favoris` (grille de véhicules sauvegardés)
3. Formulaire d'avis (étoiles cliquables 1-5 + commentaire)
4. Section avis sur la page détail véhicule
5. Toggle favori accessible uniquement si connecté (sinon modal connexion)

### Phase 9 — Dashboard Admin (3-4h)
1. Layout admin avec sidebar dédiée
2. Vue d'ensemble `/admin` : KPIs (réservations mois, CA, véhicules actifs, taux occupation) + 3 graphiques Recharts
3. Gestion véhicules `/admin/vehicules` : tableau + CRUD + upload multi-images Supabase
4. Gestion réservations `/admin/reservations` : tableau + drawer latéral + changement statut
5. Gestion clients `/admin/clients` : liste + profil + suspendre/supprimer
6. Statistiques `/admin/statistiques` : revenus, top véhicules, répartition, panier moyen
7. Paramètres `/admin/parametres` : infos agence, horaires, options location, catégories

### Phase 10 — Espace Client & Polish (2h)
1. Dashboard client `/dashboard` (bonjour, prochaine réservation, compteurs)
2. Mes réservations `/dashboard/reservations` (liste + détail + annulation)
3. Mon profil `/dashboard/profil` (formulaire édition)
4. Loading states + skeletons
5. Pages Informations (FAQ, CGV, Politique confidentialité, Contact)
6. SEO (metadata)
7. Tests E2E des parcours critiques

---

## Template CLAUDE.md

```markdown
# RentCars - Location de Voitures

## Stack
- Next.js 16 (App Router, Server Components par défaut)
- TypeScript strict
- Tailwind CSS v4 (pas de Bootstrap)
- Prisma 6 + PostgreSQL
- Supabase Storage (images véhicules, avatars)
- NextAuth v5 (credentials uniquement, pas de OAuth, pas de vérification email)

## Design
Sources de vérité : docs/newsplans/docs/DESIGN.md et docs/newsplans/docs/rentcars.html
- Primaire : orange #994200 (CTA, accents)
- Secondaire : bleu #2e5ea3 (liens, infos)
- Typographie : Manrope (titres), Work Sans (body)
- Icônes : Lucide React
- Ombre élévation : 0 12px 32px rgba(35, 35, 35, 0.08)

## Conventions
- Utiliser src/proxy.ts pour la protection des routes (pas middleware.ts)
- Server Components par défaut, "use client" uniquement si nécessaire
- Server Actions pour toutes les mutations
- Validation Zod sur tous les inputs
- Images stockées dans Supabase Storage, jamais en local
- Pas de mutation directe : toujours créer de nouveaux objets
- Fonctions < 50 lignes, fichiers < 800 lignes
- Statuts colorés : PENDING (orange), CONFIRMED (vert), IN_PROGRESS (bleu), COMPLETED (gris), CANCELLED (rouge)

## Rôles
- Visiteur : parcourir, voir détails véhicules, pages infos
- USER : réserver, favoris, avis, espace personnel /dashboard
- ADMIN : gestion complète via /admin (jamais le site public)

## Commandes
- npm run dev : développement
- npx prisma studio : visualiser la BDD
- npx prisma migrate dev : créer une migration
- npx prisma db seed : données de test

## Paiement
Entièrement simulé. Aucune vraie transaction. Statut SIMULATED en base.
```

---

## Skills Superpowers par Phase

### Skills disponibles

| Skill | Rôle | Quand l'utiliser |
|-------|------|-----------------|
| **brainstorming** | Exploration | Avant toute tâche créative — comprendre le besoin. Inclut le **Visual Companion** : serveur navigateur optionnel pour afficher mockups HTML, wireframes, diagrammes d'architecture et comparaisons visuelles. L'utilisateur clique dans le navigateur, l'agent lit les sélections via `state_dir/events`. Activer avec `scripts/start-server.sh --project-dir .` |
| **writing-plans** | Planification | Rédiger un plan détaillé avec tâches 2-5 min |
| **executing-plans** | Exécution | Exécuter un plan avec checkpoints |
| **test-driven-development** | Tests | Cycle RED-GREEN-REFACTOR obligatoire |
| **subagent-driven-development** | Sous-agents | Tâches indépendantes dans la session |
| **dispatching-parallel-agents** | Parallélisme | 2+ tâches sans dépendances |
| **using-git-worktrees** | Isolation | Travail sur feature isolée |
| **systematic-debugging** | Debug | 4 phases : investigate, analyze, hypothesize, implement |
| **requesting-code-review** | Revue demande | Quand le code est terminé |
| **receiving-code-review** | Revue retour | Recevoir du feedback technique |
| **verification-before-completion** | Vérification | Avant de dire "c'est fait" |
| **finishing-a-development-branch** | Livraison | Merge, PR, cleanup |
| **writing-skills** | Méta | Créer de nouveaux skills |
| **using-superpowers** | Maître | Auto-chargé au démarrage de session |

### Workflow Superpowers

1. **brainstorming** — Explorer les besoins et les approches. **Visual Companion** : lancer `scripts/start-server.sh --project-dir .` pour afficher mockups HTML, wireframes et diagrammes dans le navigateur. L'agent décide question par question si le contenu est visuel (→ navigateur) ou textuel (→ terminal)
2. **writing-plans** — Rédiger un plan détaillé validé par l'utilisateur
3. **using-git-worktrees** — Isoler le travail dans un worktree
4. **test-driven-development** — Test d'abord (RED), code ensuite (GREEN), refactor (REFACTOR)
5. **subagent-driven-development** / **dispatching-parallel-agents** — Exécuter via sous-agents
6. **requesting-code-review** + **receiving-code-review** — Double revue
7. **verification-before-completion** — Vérifier avant de claim "terminé"
8. **finishing-a-development-branch** — Merge / PR / cleanup

### Iron Laws

1. **Pas de code sans test** — Si du code est écrit avant le test → supprimer et recommencer
2. **Pas de fix sans root cause** — Si 3+ fixes échouent → remettre en question l'architecture
3. **Pas de claim sans preuve** — Aucune affirmation sans avoir exécuté la commande et lu le résultat

### Exemples concrets par phase

```bash
# Phase 1 - Setup
"Initialise le projet Prisma avec le schéma PostgreSQL pour RentCars"
"Configure le proxy.ts pour protéger /admin (ADMIN only) et /dashboard (connecté only)"

# Phase 2 - Layout
"Crée la Navbar responsive avec les tokens DESIGN.md : sticky, backdrop-blur, liens navigation, bouton Réserver"
"Crée le composant Card réutilisable avec élévation au hover (shadow + scale 1.02)"

# Phase 3 - Accueil
"Crée la section Hero plein écran avec gradient overlay, titre Manrope, et 2 boutons CTA — référence rentcars.html"
"Crée la section Flotte Premium : grille 3 colonnes de véhicules isFeatured avec specs et prix"

# Phase 4 - Inventaire
"Crée la page /inventaire avec sidebar filtres cumulatifs et pagination 10 véhicules"
"Crée le filtre prix slider dual 50€-500€ avec mise à jour instantanée"

# Phase 5 - Détail véhicule
"Crée la galerie photos avec grande image principale + miniatures cliquables"
"Crée les 3 onglets : Description, Équipements (chips), Avis clients (étoiles + commentaires)"

# Phase 6 - Auth
"Configure NextAuth v5 avec provider Credentials, hash bcryptjs, callbackUrl"
"Crée le formulaire d'inscription avec indicateur de force du mot de passe"

# Phase 7 - Réservation
"Crée le formulaire de réservation avec calcul temps réel du total (jours x prix + options)"
"Crée le formulaire de paiement simulé avec spinner 1,5s et référence SIM-XXXXXXXXXX"

# Phase 8 - Favoris & Avis
"Crée le bouton favori toggle avec animation heart et vérification connexion"
"Crée le formulaire d'avis avec StarRating cliquable et champ commentaire"

# Phase 9 - Admin
"Crée le dashboard admin avec KPIs et 3 graphiques Recharts (revenus, catégories, carburant)"
"Crée le CRUD véhicules avec upload multi-images vers Supabase Storage"

# Phase 10 - Client & Polish
"Crée le dashboard client avec carte prochaine réservation et compteurs"
"Ajoute les loading skeletons et les pages Informations (FAQ, CGV, Contact)"
```
