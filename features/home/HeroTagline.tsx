"use client";

import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

export function HeroTagline() {
  return (
    <p
      className={`${cormorant.className} mt-3 text-xl italic tracking-wide text-accent opacity-0 animate-hero-fade-in-up sm:text-2xl`}
      style={{ animationDelay: "0.1s" }}
    >
      Your Place... Your choice...
    </p>
  );
}
