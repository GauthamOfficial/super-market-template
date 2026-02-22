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

/** Normalize phone for comparison (trim, collapse spaces). */
export function normalizePhone(phone: string | null | undefined): string {
  if (phone == null) return "";
  return String(phone).trim().replace(/\s+/g, "");
}
