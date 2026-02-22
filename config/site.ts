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
  name: "Super Market",

  /** Short tagline or description for meta and footer */
  tagline: "Supermarket e-commerce template",

  /** Logo image URL. If set, header shows logo instead of text name. */
  logoUrl: null as string | null,

  /** Favicon URL (optional). Otherwise browser uses default. */
  faviconUrl: null as string | null,

  /** Contact shown in footer and useful for SEO */
  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
  },

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
   * Format: "H S% L%" e.g. "222 47% 11%".
   * Leave null to use default theme in globals.css.
   */
  colors: {
    primary: null as string | null,
    primaryForeground: null as string | null,
    accent: null as string | null,
    accentForeground: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Build page title: "Checkout | Super Market" */
export function pageTitle(page: string): string {
  return `${page} | ${siteConfig.name}`;
}
