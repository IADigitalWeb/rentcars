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
