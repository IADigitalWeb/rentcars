# RentCars - Location de Voitures

## Stack
- Next.js 16 (App Router, Server Components par défaut)
- TypeScript strict
- Tailwind CSS v4 (pas de Bootstrap)
- Prisma 7 + Supabase PostgreSQL (adapter-pg)
- Supabase Storage (images véhicules, avatars)
- NextAuth v5 (credentials uniquement, pas de OAuth, pas de vérification email)

## Prisma 7 Notes
- Generator: `prisma-client` (pas `prisma-client-js`)
- Output: `src/generated/prisma`
- Import: `import { PrismaClient } from "@/generated/prisma"`
- Config: `prisma.config.ts` pour les migrations (utilise DIRECT_URL)
- Runtime: `@prisma/adapter-pg` requis — passer `{ adapter }` au constructeur
- Schema: PAS de `url` dans `datasource db` (Prisma 7 l'interdit)

## Design
Sources de vérité : docs/DESIGN.md et docs/rentcars.html
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
- npm test : lancer les tests
- npx prisma studio : visualiser la BDD
- npx prisma migrate dev : créer une migration
- npx prisma db seed : données de test

## Test Users
- Admin: admin@rentcars.com / AdminRentCars2024!
- User: utilisateur@test.com / UserRentCars2024!

## Paiement
Entièrement simulé. Aucune vraie transaction. Statut SIMULATED en base.
