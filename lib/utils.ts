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
