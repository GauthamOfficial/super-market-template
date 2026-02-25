"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getBranchImageUrl } from "@/lib/branch-image";

/** Minimal branch shape for hero carousel (id + name from site config). */
export type HeroBranch = { id: string; name: string };

const CARD_WIDTH_PX = 256;
const MOBILE_GAP = 12;
const GAP_PX = 16;
const VISIBLE_CARDS = 3;
const STEP_PX = (CARD_WIDTH_PX + GAP_PX) * VISIBLE_CARDS;
export function HeroBranchCarousel({ branches }: { branches: HeroBranch[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    let stepPx: number;
    if (isMobile && el.firstElementChild) {
      const card = el.firstElementChild as HTMLElement;
      const gap = 12;
      stepPx = card.offsetWidth + gap;
    } else {
      stepPx = STEP_PX;
    }
    const step = direction === "left" ? -stepPx : stepPx;
    el.scrollTo({ left: el.scrollLeft + step, behavior: "smooth" });
  }, []);

  if (branches.length === 0) return null;

  return (
    <div
      className="mt-6 w-full max-w-full overflow-hidden opacity-0 animate-hero-fade-in-up sm:mt-8 sm:max-w-[calc(288px*3+16px*2)]"
      style={{ animationDelay: "0.35s" }}
    >
      {/* Blurred background — stays within bounds */}
      <div
        className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-xl sm:-inset-4 sm:rounded-3xl"
        aria-hidden
      />
      {/* On mobile: padding so card sits inside blur and is slightly smaller than blur area */}
      <div className="relative flex items-center gap-0 px-3 py-2 sm:px-0 sm:py-0 sm:gap-2">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-4 z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 disabled:pointer-events-none disabled:opacity-40 sm:left-0 sm:-left-4 sm:h-12 sm:w-12"
          aria-label="Previous branches"
        >
          <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>

        {/* Viewport — card slightly smaller than blur on mobile (fits inside px-3 + arrow space) */}
        <div className="flex-1 min-w-0 overflow-hidden pl-10 pr-10 sm:px-0">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide [scroll-snap-type:x_mandatory] sm:gap-4"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href="/find-store"
                className="hero-store-card w-[calc(100vw-9.5rem)] min-w-[calc(100vw-9.5rem)] shrink-0 rounded-xl [scroll-snap-align:start] sm:w-72 sm:min-w-0 sm:max-w-none sm:rounded-2xl"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted sm:rounded-2xl">
                  <Image
                    src={getBranchImageUrl(branch)}
                    alt={branch.name}
                    fill
                    className="object-contain object-center sm:object-cover"
                    sizes="(max-width: 640px) calc(100vw - 9.5rem), 288px"
                  />
                </div>
                <div className="absolute left-2 top-2 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
                  <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{branch.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-4 z-10 flex h-9 w-9 shrink-0 sm:right-0 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition hover:bg-black/80 disabled:pointer-events-none disabled:opacity-40 sm:-right-4 sm:h-12 sm:w-12"
          aria-label="Next branches"
        >
          <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}
