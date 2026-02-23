/**
 * White-label site config — edit this file to rebrand for another supermarket.
 *
 * To customize for a new store (about 5 minutes):
 * 1. Set name, tagline, and optionally logoUrl, faviconUrl.
 * 2. Set contact (email, phone, address) for footer and SEO.
 * 3. Set currency (e.g. "USD", "EUR", "GBP").
 * 4. Set branchesMode: "single" (one branch, no picker) or "multi" (user picks branch).
 * 5. Optionally set colors.primary / accent (HSL: "H S% L%" e.g. "262 83% 58%").
 * 6. If logo or favicon is from a new domain, add it in next.config.js → images.remotePatterns.
 */

export const siteConfig = {
  /** Store name shown in header, footer, meta titles, and across the site */
  name: "FN FAMILY MART",

  /** Short tagline or description for meta and footer */
  tagline: "Your supermarket — get more of life with FN Family Mart",

  /** Logo image URL. If set, header shows logo instead of text name. */
  logoUrl: "/fn-logo.png",

  /** Favicon URL (optional). Otherwise browser uses default. */
  faviconUrl: null as string | null,

  /** Contact shown in footer and useful for SEO */
  contact: {
    email: "support@fngroup.lk",
    phone: "+94 71 480 7030",
    address: "Kandy Road, Kurnegala, Sri Lanka",
  },

  /** Social media URLs (footer icons). Set when you have the links. */
  socials: {
    whatsapp: null as string | null,
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
  },

  /** Footer: establishment year (e.g. "2021"), shown under logo */
  establishedYear: null as string | null,

  /** Footer: short company description under logo (optional; falls back to tagline) */
  footerDescription: "FN Family Mart is a supermarket network committed to excellence and customer satisfaction, offering convenience and quality products.",

  /** Footer: QR code image URL (e.g. WhatsApp QR). Optional. */
  footerQrCodeUrl: null as string | null,

  /** Currency code for prices (ISO 4217, e.g. USD, EUR, GBP) */
  currency: "USD",

  /**
   * Branches mode:
   * - "multi": user picks a branch (select-branch), can change branch on home.
   * - "single": only one branch; branch picker is skipped and "Change branch" is hidden.
   */
  branchesMode: "multi" as "single" | "multi",

  /**
   * Theme colors (HSL for CSS variables).
   * FN FAMILY MART: Primary White, Brand #00a54f (green) & #e4e30d (yellow), Black.
   * Format: "H S% L%" e.g. "222 47% 11%".
   */
  colors: {
    primary: "149 100% 32%" as string | null,       // #00a54f brand green
    primaryForeground: "0 0% 100%" as string | null,
    accent: "60 91% 47%" as string | null,          // #e4e30d brand yellow
    accentForeground: "0 0% 9%" as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Build page title: "Checkout | Super Market" */
export function pageTitle(page: string): string {
  return `${page} | ${siteConfig.name}`;
}
