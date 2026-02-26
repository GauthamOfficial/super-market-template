import { Anton, Oswald } from "next/font/google";

/**
 * Impact-like web font for the brand name. Loaded on all devices (including mobile)
 * so "FN FAMILY MART" looks consistent; system Impact is not available on iOS/Android.
 */
export const fontBrand = Anton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-brand",
});

/** Light weight Oswald for optional alternate brand styling */
export const fontBrandAlt = Oswald({
  weight: "300",
  subsets: ["latin"],
  display: "swap",
});
