"use client";

import { useState, useEffect } from "react";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  weight: "700",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

const FULL_TEXT = "Your Place... Your choice...";
const TYPING_MS = 80;
const PAUSE_AFTER_MS = 2500;
const RESTART_DELAY_MS = 800;

export function HeroTagline() {
  const [visibleLength, setVisibleLength] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      const restart = setTimeout(() => {
        setVisibleLength(0);
        setIsPaused(false);
      }, RESTART_DELAY_MS);
      return () => clearTimeout(restart);
    }

    if (visibleLength >= FULL_TEXT.length) {
      const pause = setTimeout(() => setIsPaused(true), PAUSE_AFTER_MS);
      return () => clearTimeout(pause);
    }

    const t = setTimeout(() => {
      setVisibleLength((n) => n + 1);
    }, TYPING_MS);
    return () => clearTimeout(t);
  }, [visibleLength, isPaused]);

  const visibleText = FULL_TEXT.slice(0, visibleLength);
  const showCursor = visibleLength < FULL_TEXT.length || !isPaused;

  return (
    <p
      className={`${cormorant.className} mt-3 text-2xl italic tracking-wide text-accent opacity-0 animate-hero-fade-in-up sm:text-3xl md:text-4xl`}
      style={{ animationDelay: "0.1s" }}
    >
      {visibleText}
      {showCursor && (
        <span className="animate-pulse" aria-hidden>
          |
        </span>
      )}
    </p>
  );
}
