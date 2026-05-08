# Phase 1 — Setup RentCars : Design Spec

**Date** : 2026-05-08
**Statut** : Approuvé

## Contexte

RentCars est une application de location de voitures pour une seule agence. Stack : Next.js 16, Tailwind v4, Prisma 6, PostgreSQL (Supabase), Supabase Storage, NextAuth v5 Credentials, TypeScript strict.

## Décisions

| Décision | Choix | Raison |
|----------|-------|--------|
| Base de données | Supabase PostgreSQL | Pas de PostgreSQL/Docker local, Supabase gratuit |
| Projet Supabase | À créer par l'utilisateur | Clés à fournir dans `.env` |
| Approche setup | Séquentiel | `create-next-app` doit finir en premier |
| Git | Oui, commit initial après setup | Bonne pratique |

## 1. Initialisation du projet

- `npx create-next-app@latest . --typescript --tailwind --app --src-dir` dans `C:\abcdef\app_cc\futur_projets\rentcars`
- Next.js 16.2.6 (App Router, Server Components par défaut)
- Tailwind v4 configuré automatiquement
- Dossier `src/` créé par `create-next-app`

## 2. Dépendances

```bash
npm install prisma @prisma/client next-auth@beta @supabase/supabase-js zod lucide-react date-fns recharts bcryptjs
npm install -D @types/bcryptjs
```

## 3. Schéma Prisma

Modèles : User, Vehicle, Reservation, ReservationStatusHistory, Favorite, Review, SpecialOffer, AgencySettings.

Enums : Role, UserStatus, VehicleStatus, ReservationStatus, PaymentStatus, Category, FuelType, Transmission.

Prisma 6 avec `prisma.config.ts` si nécessaire. `DATABASE_URL` pointe vers Supabase PostgreSQL.

## 4. Fichiers lib/

- `src/lib/prisma.ts` — Singleton PrismaClient (évite les connexions multiples en dev)
- `src/lib/auth.ts` — NextAuth v5 config avec Credentials provider, hash bcryptjs, callback de session avec rôle
- `src/lib/supabase.ts` — Client Supabase (createClient avec anon key pour public, service role pour admin)
- `src/lib/utils.ts` — `cn()` pour merge de classes, `formatPrice()`, `formatDate()`, constantes de statuts colorés
- `src/proxy.ts` — Protection des routes (remplace middleware.ts en Next.js 16) :
  - `/admin/*` → vérifie rôle ADMIN, sinon redirect
  - `/dashboard/*` → vérifie connexion, sinon redirect vers `/auth/connexion?callbackUrl=...`
  - Routes publiques accessibles par tous

## 5. Seed

Fichier `prisma/seed.ts` :
- 2 utilisateurs : admin@rentcars.com (ADMIN) et utilisateur@test.com (USER), mots de passe hashés avec bcryptjs
- 8 véhicules avec specs complètes (Porsche 911, Tesla Model 3, Range Rover Velar, BMW Série 3, Mercedes Classe C, Renault Mégane E-Tech, Peugeot 3008, Audi A4 Avant)
- 3 véhicules `isFeatured = true` (Porsche, Tesla, Range Rover)
- 2 offres spéciales (Location Longue Durée -20%, Gamme Électrique -10%)
- Paramètres agence (RentCars, Champs-Élysées)

## 6. Configuration

- `.env` (gitignored) — variables DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, Supabase keys, app config
- `.env.example` (commité) — même structure avec placeholders
- `CLAUDE.md` — conventions projet (stack, design, rôles, commandes)
- `package.json` — script seed configuré : `"prisma": {"seed": "npx tsx prisma/seed.ts"}`

## 7. Structure de dossiers attendue après Phase 1

```
rentcars/
├── docs/                    ← existe déjà (plan, design, html, spec)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/                 ← layout + page par défaut de create-next-app
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── proxy.ts
├── .env
├── .env.example
├── CLAUDE.md
├── package.json
└── tsconfig.json
```

## 8. Critères de validation

1. `npx prisma migrate dev --name init` réussit
2. `npx prisma db seed` remplit la base
3. `npm run dev` démarre sans erreur sur localhost:3000
4. `src/proxy.ts` compile sans erreur TypeScript
5. Commit initial Git effectué

## Portée

Phase 1 uniquement. Pas de pages, composants UI, ni logique métier. L'objectif est d'avoir une base saine pour Phase 2 (Layout & Composants UI).
