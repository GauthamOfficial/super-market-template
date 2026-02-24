"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { Branch } from "@/types/db";
import { getBranchImageUrl } from "@/lib/branch-image";

const CARD_WIDTH_PX = 256;
const GAP_PX = 16;
const VISIBLE_CARDS = 3;
const STEP_PX = (CARD_WIDTH_PX + GAP_PX) * VISIBLE_CARDS;

export function HeroBranchCarousel({ branches }: { branches: Branch[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const step = direction === "left" ? -STEP_PX : STEP_PX;
    el.scrollTo({ left: el.scrollLeft + step, behavior: "smooth" });
  }, []);

  if (branches.length === 0) return null;

  return (
    <div
      className="mt-8 w-full max-w-[calc(256px*3+16px*2)] opacity-0 animate-hero-fade-in-up sm:max-w-[calc(288px*3+16px*2)]"
      style={{ animationDelay: "0.35s" }}
    >
      <div className="relative flex items-center gap-2">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-2 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 disabled:pointer-events-none disabled:opacity-40 sm:-left-4 sm:h-12 sm:w-12"
          aria-label="Previous branches"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        {/* Viewport: exactly 3 cards, no scrollbar */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide [scroll-snap-type:x_mandatory]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href="/find-store"
                className="hero-store-card w-64 shrink-0 [scroll-snap-align:start] sm:w-72"
              >
                <div className="relative aspect-[4/3] w-full bg-muted">
                  <Image
                    src={getBranchImageUrl(branch)}
                    alt={branch.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 256px, 288px"
                  />
                </div>
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{branch.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-2 z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 disabled:pointer-events-none disabled:opacity-40 sm:-right-4 sm:h-12 sm:w-12"
          aria-label="Next branches"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}
