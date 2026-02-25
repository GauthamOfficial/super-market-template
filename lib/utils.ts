import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency?: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? siteConfig.currency,
  }).format(price);
}

/** Normalize phone for display/storage (trim, collapse spaces). */
export function normalizePhone(phone: string | null | undefined): string {
  if (phone == null) return "";
  return String(phone).trim().replace(/\s+/g, "");
}

/**
 * Normalize phone for comparison when tracking orders.
 * Strips non-digits, then converts 10-digit numbers starting with 0 (e.g. Sri Lanka 0xx)
 * to 94 + 9 digits so "071 480 7030" and "94714807030" match.
 */
export function normalizePhoneForComparison(phone: string | null | undefined): string {
  if (phone == null) return "";
  const digits = String(phone).replace(/\D/g, "");
  if (digits.length === 10 && digits.startsWith("0")) {
    return "94" + digits.slice(1);
  }
  return digits;
}
