# Phase 1 — Setup RentCars : Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the complete development environment for RentCars — project init, database, auth, storage clients, seed data.

**Architecture:** Sequential setup. `create-next-app` first, then dependencies, then config files in dependency order (prisma → auth → proxy). Validation at the end with migration + seed + dev server.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4, Prisma 6, Supabase PostgreSQL + Storage, NextAuth v5 (Credentials), Zod, Lucide React, date-fns, Recharts, bcryptjs

---

## File Structure

| File | Purpose | Created in |
|------|---------|-----------|
| `prisma/schema.prisma` | Database models + enums | Task 4 |
| `prisma/seed.ts` | Test data (users, vehicles, offers, agency) | Task 10 |
| `src/lib/prisma.ts` | PrismaClient singleton | Task 5 |
| `src/lib/utils.ts` | cn(), formatPrice(), formatDate(), status colors | Task 5 |
| `src/lib/auth.ts` | NextAuth v5 Credentials config | Task 7 |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth route handler | Task 7 |
| `src/lib/supabase.ts` | Supabase browser + server clients | Task 8 |
| `src/proxy.ts` | Route protection (admin + dashboard) | Task 9 |
| `src/types/next-auth.d.ts` | Extended session types (role, id) | Task 7 |
| `.env` | Environment variables (gitignored) | Task 3 |
| `.env.example` | Template with placeholders | Task 3 |
| `vitest.config.ts` | Test runner config | Task 6 |
| `src/lib/__tests__/utils.test.ts` | Unit tests for utils | Task 6 |
| `CLAUDE.md` | Project conventions | Task 12 |

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: project skeleton via `create-next-app`

- [ ] **Step 1: Run create-next-app in the current directory**

```bash
cd C:/abcdef/app_cc/futur_projets/rentcars
npx create-next-app@latest . --typescript --tailwind --app --src-dir --yes
```

Expected: Project initialized. Files created: `package.json`, `tsconfig.json`, `next.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.

- [ ] **Step 2: Verify project structure**

```bash
ls src/app/
```

Expected: `favicon.ico  globals.css  layout.tsx  page.tsx`

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1 2>/dev/null
```

Expected: HTTP 200

---

### Task 2: Install Dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install production dependencies**

```bash
npm install prisma @prisma/client next-auth@beta @supabase/supabase-js zod lucide-react date-fns recharts bcryptjs clsx tailwind-merge
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install -D @types/bcryptjs tsx vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 3: Verify installations**

```bash
npx prisma --version
node -e "require('next-auth'); console.log('next-auth OK')"
node -e "require('@supabase/supabase-js'); console.log('supabase OK')"
```

Expected: Prisma 6.x, all modules load without error.

---

### Task 3: Configure Environment Files

**Files:**
- Create: `.env`
- Create: `.env.example`

- [ ] **Step 1: Create `.env.example`**

```bash
cat > .env.example << 'ENVEOF'
# Database — Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# NextAuth v5
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""

# App
NEXT_PUBLIC_APP_NAME="RentCars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_CURRENCY="EUR"
ENVEOF
```

- [ ] **Step 2: Create `.env` (copy of example — user fills in real values later)**

```bash
cp .env.example .env
```

- [ ] **Step 3: Generate NEXTAUTH_SECRET**

```bash
npx --yes auth secret
```

This command generates a secret and writes it to `.env`. If it doesn't work, generate manually:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then paste the value as `NEXTAUTH_SECRET` in `.env`.

- [ ] **Step 4: Verify .gitignore includes .env**

```bash
grep -q ".env" .gitignore && echo ".env is gitignored" || echo ".env NOT in .gitignore"
```

Expected: `.env is gitignored`

---

### Task 4: Initialize Prisma + Write Schema

**Files:**
- Create: `prisma/schema.prisma`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init
```

Expected: Creates `prisma/schema.prisma` with default content. Overwrites `DATABASE_URL` in `.env` — re-check `.env` after.

- [ ] **Step 2: Write the complete Prisma schema**

Replace the entire content of `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(cuid())
  firstName    String
  lastName     String
  email        String        @unique
  password     String
  phone        String?
  address      String?
  birthDate    DateTime?
  role         Role          @default(USER)
  status       UserStatus    @default(ACTIVE)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  reservations Reservation[]
  favorites    Favorite[]
  reviews      Review[]
}

model Vehicle {
  id            String          @id @default(cuid())
  brand         String
  model         String
  year          Int
  category      Category
  fuel          FuelType
  transmission  Transmission
  seats         Int
  pricePerDay   Decimal         @db.Decimal(10, 2)
  mileageLimit  Int             @default(300)
  power         Int?
  torque        Int?
  acceleration  Decimal?        @db.Decimal(4, 1)
  topSpeed      Int?
  consumption   Decimal?        @db.Decimal(4, 1)
  trunkVolume   Int?
  description   String?         @db.Text
  equipments    String[]
  images        String[]
  status        VehicleStatus   @default(AVAILABLE)
  isFeatured    Boolean         @default(false)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  reservations  Reservation[]
  favorites     Favorite[]
  reviews       Review[]
  specialOffers SpecialOffer[]
}

model Reservation {
  id             String                  @id @default(cuid())
  userId         String
  vehicleId      String
  startDate      DateTime
  endDate        DateTime
  status         ReservationStatus       @default(PENDING)
  basePrice      Decimal                 @db.Decimal(10, 2)
  optionsPrice   Decimal                 @default(0) @db.Decimal(10, 2)
  totalPrice     Decimal                 @db.Decimal(10, 2)
  options        Json
  paymentStatus  PaymentStatus           @default(SIMULATED)
  paymentRef     String?
  adminNotes     String?                 @db.Text
  cancelReason   String?
  createdAt      DateTime                @default(now())
  updatedAt      DateTime                @updatedAt
  user           User                    @relation(fields: [userId], references: [id])
  vehicle        Vehicle                 @relation(fields: [vehicleId], references: [id])
  statusHistory  ReservationStatusHistory[]

  @@index([userId])
  @@index([vehicleId])
  @@index([status])
  @@index([startDate, endDate])
}

model ReservationStatusHistory {
  id            String              @id @default(cuid())
  reservationId String
  status        ReservationStatus
  changedAt     DateTime            @default(now())
  changedBy     String?
  note          String?
  reservation   Reservation         @relation(fields: [reservationId], references: [id])

  @@index([reservationId])
}

model Favorite {
  id        String   @id @default(cuid())
  userId    String
  vehicleId String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id])
  vehicle   Vehicle  @relation(fields: [vehicleId], references: [id])

  @@unique([userId, vehicleId])
  @@index([userId])
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

  @@index([vehicleId])
}

model SpecialOffer {
  id          String    @id @default(cuid())
  title       String
  description String?
  discount    Int
  vehicleId   String?
  category    Category?
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  vehicle     Vehicle?  @relation(fields: [vehicleId], references: [id])
}

model AgencySettings {
  id           String   @id @default(cuid())
  name         String   @default("RentCars")
  address      String?
  phone        String?
  email        String?
  siret        String?
  openingHours Json?
  updatedAt    DateTime @updatedAt
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

- [ ] **Step 3: Validate schema syntax**

```bash
npx prisma validate
```

Expected: "The Prisma schema is valid"

---

### Task 5: Create lib/prisma.ts and lib/utils.ts

**Files:**
- Create: `src/lib/prisma.ts`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Create Prisma client singleton**

```bash
mkdir -p src/lib
```

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Create utility functions**

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number | string, currency = "EUR"): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function generatePaymentRef(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let ref = "SIM-";
  for (let i = 0; i < 10; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export const RESERVATION_STATUS_COLORS: Record<string, string> = {
  PENDING: "text-amber-600 bg-amber-50",
  CONFIRMED: "text-emerald-600 bg-emerald-50",
  IN_PROGRESS: "text-blue-600 bg-blue-50",
  COMPLETED: "text-gray-600 bg-gray-50",
  CANCELLED: "text-red-600 bg-red-50",
} as const;

export const CATEGORY_LABELS: Record<string, string> = {
  LUXURY: "Luxe",
  SUV: "SUV",
  URBAN: "Urbaine",
  ELECTRIC: "Électrique",
  UTILITY: "Utilitaire",
  CONVERTIBLE: "Cabriolet",
} as const;

export const FUEL_LABELS: Record<string, string> = {
  PETROL: "Essence",
  DIESEL: "Diesel",
  ELECTRIC: "Électrique",
  HYBRID: "Hybride",
} as const;

export const TRANSMISSION_LABELS: Record<string, string> = {
  AUTOMATIC: "Automatique",
  MANUAL: "Manuelle",
} as const;
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit src/lib/prisma.ts src/lib/utils.ts
```

Expected: No errors.

---

### Task 6: Setup Vitest + Test utils.ts

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/__tests__/utils.test.ts`
- Modify: `package.json` (test script)

- [ ] **Step 1: Create Vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: [],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `scripts`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 3: Write failing tests for utils**

```bash
mkdir -p src/lib/__tests__
```

Create `src/lib/__tests__/utils.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import {
  cn,
  formatPrice,
  formatDate,
  generatePaymentRef,
  RESERVATION_STATUS_COLORS,
  CATEGORY_LABELS,
  FUEL_LABELS,
  TRANSMISSION_LABELS,
} from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "active")).toBe("base active");
  });

  it("merges tailwind conflict (last wins)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });
});

describe("formatPrice", () => {
  it("formats a number as EUR currency", () => {
    const result = formatPrice(350);
    expect(result).toContain("350");
    expect(result).toMatch(/€/);
  });

  it("formats a string number", () => {
    const result = formatPrice("120");
    expect(result).toContain("120");
  });

  it("formats 0 correctly", () => {
    const result = formatPrice(0);
    expect(result).toMatch(/0/);
  });
});

describe("formatDate", () => {
  it("formats a Date object in French", () => {
    const result = formatDate(new Date("2024-06-15"));
    expect(result).toContain("juin");
    expect(result).toContain("2024");
  });

  it("formats an ISO string", () => {
    const result = formatDate("2024-01-20");
    expect(result).toContain("janvier");
    expect(result).toContain("2024");
  });
});

describe("generatePaymentRef", () => {
  it("starts with SIM-", () => {
    const ref = generatePaymentRef();
    expect(ref).toMatch(/^SIM-/);
  });

  it("has 14 characters total (SIM- + 10)", () => {
    const ref = generatePaymentRef();
    expect(ref).toHaveLength(14);
  });

  it("generates unique refs", () => {
    const refs = new Set(Array.from({ length: 100 }, () => generatePaymentRef()));
    expect(refs.size).toBe(100);
  });
});

describe("status color constants", () => {
  it("has all 5 reservation statuses", () => {
    expect(Object.keys(RESERVATION_STATUS_COLORS)).toEqual(
      expect.arrayContaining(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"])
    );
  });

  it("has all 6 category labels", () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(6);
    expect(CATEGORY_LABELS.ELECTRIC).toBe("Électrique");
  });

  it("has all 4 fuel labels", () => {
    expect(Object.keys(FUEL_LABELS)).toHaveLength(4);
    expect(FUEL_LABELS.PETROL).toBe("Essence");
  });

  it("has all 2 transmission labels", () => {
    expect(Object.keys(TRANSMISSION_LABELS)).toHaveLength(2);
    expect(TRANSMISSION_LABELS.AUTOMATIC).toBe("Automatique");
  });
});
```

- [ ] **Step 4: Run tests — should PASS (implementation already exists)**

```bash
npm test
```

Expected: All tests pass. Since we wrote implementation and tests together (infrastructure), they should all pass on first run.

---

### Task 7: Configure NextAuth v5

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/types/next-auth.d.ts`

- [ ] **Step 1: Create NextAuth type declarations**

```bash
mkdir -p src/types
```

Create `src/types/next-auth.d.ts`:

```typescript
import { Role } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: Role;
    };
  }

  interface User {
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
  }
}
```

- [ ] **Step 2: Create auth configuration**

Create `src/lib/auth.ts`:

```typescript
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        if (user.status === "SUSPENDED") {
          throw new Error("ACCOUNT_SUSPENDED");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/connexion",
  },
  session: {
    strategy: "jwt",
  },
});
```

- [ ] **Step 3: Create the auth route handler**

```bash
mkdir -p src/app/api/auth/\\[...nextauth\\]
```

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

- [ ] **Step 4: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors (or only errors related to missing Prisma client generation — acceptable at this stage).

---

### Task 8: Create Supabase Client

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Create Supabase client utilities**

Create `src/lib/supabase.ts`:

```typescript
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

export function createAdminClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceRoleKey);
}

export const STORAGE_BUCKETS = {
  CARS: "cars",
  AVATARS: "avatars",
  CATEGORIES: "categories",
} as const;
```

- [ ] **Step 2: Verify compilation**

```bash
npx tsc --noEmit src/lib/supabase.ts
```

Expected: No errors.

---

### Task 9: Create Route Protection (proxy.ts)

**Files:**
- Create: `src/proxy.ts`

> **Note:** Next.js 16 uses `src/proxy.ts` for route protection. If compilation fails, the fallback is `src/middleware.ts` with the same API.

- [ ] **Step 1: Create proxy.ts**

Create `src/proxy.ts`:

```typescript
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const PUBLIC_ROUTES = ["/", "/inventaire", "/vehicules", "/auth", "/informations"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and API routes (except auth-protected ones)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Public routes — always accessible
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  const session = await auth();

  // Not authenticated — redirect to login
  if (!session) {
    const loginUrl = new URL("/auth/connexion", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes — ADMIN role required
  if (pathname.startsWith("/admin")) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

- [ ] **Step 2: Verify TypeScript compilation**

```bash
npx tsc --noEmit src/proxy.ts
```

Expected: No errors.

---

### Task 10: Write Seed Data

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Step 1: Create the seed file**

Create `prisma/seed.ts`:

```typescript
import { PrismaClient, Role, UserStatus, VehicleStatus, Category, FuelType, Transmission } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.reservationStatusHistory.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.specialOffer.deleteMany();
  await prisma.agencySettings.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
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

  // --- Vehicles ---
  const vehicles = await Promise.all([
    prisma.vehicle.create({
      data: {
        brand: "Porsche",
        model: "911 Carrera",
        year: 2024,
        category: Category.LUXURY,
        fuel: FuelType.PETROL,
        transmission: Transmission.AUTOMATIC,
        seats: 2,
        pricePerDay: 350,
        mileageLimit: 300,
        power: 385,
        torque: 450,
        acceleration: 4.2,
        topSpeed: 293,
        consumption: 10.1,
        trunkVolume: 132,
        description: "La Porsche 911 Carrera incarne l'excellence sportive allemande. Son design iconique et ses performances exceptionnelles en font la référence des coupés sportifs.",
        equipments: ["Climatisation bi-zone", "GPS navigation", "Sièges cuir chauffants", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Toit panoramique", "Jantes 20 pouces"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Tesla",
        model: "Model 3",
        year: 2024,
        category: Category.ELECTRIC,
        fuel: FuelType.ELECTRIC,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 120,
        mileageLimit: 300,
        power: 283,
        torque: 420,
        acceleration: 6.1,
        topSpeed: 225,
        consumption: 14.9,
        trunkVolume: 425,
        description: "La Tesla Model 3 révolutionne la conduite avec son autonomie impressionnante et sa technologie de pointe. Zéro émission, maximum de plaisir.",
        equipments: ["Climatisation", "Écran 15 pouces", "Autopilote", "Caméra 360°", "Bluetooth", "Recharge rapide", "Sièges chauffants"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Land Rover",
        model: "Range Rover Velar",
        year: 2024,
        category: Category.SUV,
        fuel: FuelType.DIESEL,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 250,
        mileageLimit: 300,
        power: 240,
        torque: 500,
        acceleration: 7.3,
        topSpeed: 217,
        consumption: 7.5,
        trunkVolume: 552,
        description: "Le Range Rover Velar allie raffinement britannique et capacités tout-terrain. Un SUV de luxe qui ne compromet ni le confort ni la performance.",
        equipments: ["Climatisation quadri-zone", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Toit panoramique", "Suspension pneumatique"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: true,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "BMW",
        model: "Série 3",
        year: 2024,
        category: Category.LUXURY,
        fuel: FuelType.HYBRID,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 85,
        mileageLimit: 300,
        power: 184,
        torque: 300,
        acceleration: 7.5,
        topSpeed: 235,
        consumption: 5.8,
        trunkVolume: 480,
        description: "La BMW Série 3 hybride combine sportivité et efficience. Son châssis légendaire et sa motorisation hybride offrent une expérience de conduite unique.",
        equipments: ["Climatisation", "GPS navigation", "Sièges sport", "Caméra de recul", "Régulateur", "Bluetooth", "Apple CarPlay"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Mercedes",
        model: "Classe C",
        year: 2024,
        category: Category.LUXURY,
        fuel: FuelType.ELECTRIC,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 90,
        mileageLimit: 300,
        power: 231,
        torque: 370,
        acceleration: 6.9,
        topSpeed: 230,
        consumption: 17.2,
        trunkVolume: 455,
        description: "La Mercedes Classe C électrique incarne le luxe silencieux. Intérieur raffiné, technologie MBUX et zéro émission pour une mobilité premium.",
        equipments: ["Climatisation", "GPS navigation", "Sièges cuir", "Caméra 360°", "Régulateur adaptatif", "Bluetooth", "MBUX"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Renault",
        model: "Mégane E-Tech",
        year: 2024,
        category: Category.URBAN,
        fuel: FuelType.ELECTRIC,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 55,
        mileageLimit: 300,
        power: 218,
        torque: 300,
        acceleration: 7.4,
        topSpeed: 160,
        consumption: 15.4,
        trunkVolume: 389,
        description: "La Renault Mégane E-Tech est la citadine électrique parfaite. Agile en ville, confortable sur route, elle offre un excellent rapport qualité-prix.",
        equipments: ["Climatisation", "GPS navigation", "Écran 12 pouces", "Caméra de recul", "Bluetooth", "Recharge rapide", "Apple CarPlay"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Peugeot",
        model: "3008",
        year: 2024,
        category: Category.SUV,
        fuel: FuelType.HYBRID,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 60,
        mileageLimit: 300,
        power: 225,
        torque: 360,
        acceleration: 8.7,
        topSpeed: 206,
        consumption: 5.9,
        trunkVolume: 520,
        description: "Le Peugeot 3008 hybride séduit par son design audacieux et son i-Cockpit innovant. Un SUV familial qui ne manque pas de caractère.",
        equipments: ["Climatisation", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "i-Cockpit"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: false,
      },
    }),
    prisma.vehicle.create({
      data: {
        brand: "Audi",
        model: "A4 Avant",
        year: 2024,
        category: Category.LUXURY,
        fuel: FuelType.PETROL,
        transmission: Transmission.AUTOMATIC,
        seats: 5,
        pricePerDay: 80,
        mileageLimit: 300,
        power: 190,
        torque: 320,
        acceleration: 7.1,
        topSpeed: 240,
        consumption: 7.3,
        trunkVolume: 505,
        description: "L'Audi A4 Avant combine élégance et pragmatisme. Son Virtual Cockpit et sa finition irréprochable en font une berline break de référence.",
        equipments: ["Climatisation tri-zone", "GPS navigation", "Sièges cuir", "Caméra de recul", "Régulateur adaptatif", "Bluetooth", "Virtual Cockpit"],
        images: [],
        status: VehicleStatus.AVAILABLE,
        isFeatured: false,
      },
    }),
  ]);

  console.log(`Created ${vehicles.length} vehicles`);

  // --- Special Offers ---
  const now = new Date();
  const offers = await Promise.all([
    prisma.specialOffer.create({
      data: {
        title: "Location Longue Durée",
        description: "-20% sur les locations de plus de 14 jours. Idéal pour vos déplacements professionnels.",
        discount: 20,
        category: null,
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        isActive: true,
      },
    }),
    prisma.specialOffer.create({
      data: {
        title: "Gamme Électrique",
        description: "Roulez propre sans supplément. Bornes de recharge incluses.",
        discount: 10,
        category: Category.ELECTRIC,
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        isActive: true,
      },
    }),
  ]);

  console.log(`Created ${offers.length} special offers`);

  // --- Agency Settings ---
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
```

---

### Task 11: Configure Seed Script + Run Migration

**Files:**
- Modify: `package.json` (seed config)

- [ ] **Step 1: Add seed configuration to package.json**

Add this to `package.json`:

```json
{
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 2: Run the initial migration**

```bash
npx prisma migrate dev --name init
```

Expected: Migration created and applied. Prisma Client generated.

- [ ] **Step 3: Generate Prisma Client**

```bash
npx prisma generate
```

Expected: "Prisma Client generated successfully"

- [ ] **Step 4: Run the seed**

```bash
npx prisma db seed
```

Expected: "Seeding complete!" — 2 users, 8 vehicles, 2 offers, 1 agency settings created.

- [ ] **Step 5: Verify seed data**

```bash
npx prisma studio &
sleep 3
echo "Prisma Studio running at http://localhost:5555"
```

Open Prisma Studio to visually verify data. Or query from CLI:

```bash
npx tsx -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const users = await p.user.count();
  const vehicles = await p.vehicle.count();
  const offers = await p.specialOffer.count();
  const agency = await p.agencySettings.count();
  console.log({ users, vehicles, offers, agency });
  await p.\$disconnect();
})();
"
```

Expected: `{ users: 2, vehicles: 8, offers: 2, agency: 1 }`

---

### Task 12: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md with project conventions**

Create `CLAUDE.md`:

```markdown
# RentCars - Location de Voitures

## Stack
- Next.js 16 (App Router, Server Components par défaut)
- TypeScript strict
- Tailwind CSS v4 (pas de Bootstrap)
- Prisma 6 + Supabase PostgreSQL
- Supabase Storage (images véhicules, avatars)
- NextAuth v5 (credentials uniquement, pas de OAuth, pas de vérification email)

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
```

---

### Task 13: Validate + Git Commit

**Files:**
- None (validation only)

- [ ] **Step 1: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 2: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 3: Start dev server and verify**

```bash
npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
kill %1 2>/dev/null
```

Expected: HTTP 200

- [ ] **Step 4: Initialize Git and create initial commit**

```bash
git init
git add .
git commit -m "feat: initial project setup — Next.js 16, Prisma 6, NextAuth v5, Supabase

Phase 1 complete:
- Next.js 16 with App Router and Tailwind v4
- Prisma 6 schema with 8 models and 9 enums
- NextAuth v5 Credentials provider with role-based auth
- Supabase client for PostgreSQL and Storage
- Route protection via proxy.ts
- Seed data: 2 users, 8 vehicles, 2 offers, agency settings
- Vitest configured with utility function tests
- CLAUDE.md with project conventions"
```

Expected: Commit created successfully.
