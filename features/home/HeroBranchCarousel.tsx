"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { getBranchImageUrl } from "@/lib/branch-image";

/** Minimal branch shape for hero carousel (id + name from site config). */
export type HeroBranch = { id: string; name: string };

const GAP_PX = 16;
const VISIBLE_CARDS = 3;
const DESKTOP_CARD_WIDTH_PX = 288; // sm:w-72
const STEP_PX = (DESKTOP_CARD_WIDTH_PX + GAP_PX) * VISIBLE_CARDS;

export function HeroBranchCarousel({ branches }: { branches: HeroBranch[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    let stepPx: number;
    if (isMobile && el.firstElementChild) {
      const card = el.firstElementChild as HTMLElement;
      stepPx = card.offsetWidth; // no gap on mobile — single slide
    } else {
      stepPx = STEP_PX;
    }
    const step = direction === "left" ? -stepPx : stepPx;
    el.scrollTo({ left: el.scrollLeft + step, behavior: "smooth" });
  }, []);

  if (branches.length === 0) return null;

  return (
    <div
      className="relative mx-auto mt-12 w-[calc(100%-2rem)] max-w-full overflow-visible rounded-2xl opacity-0 animate-hero-fade-in-up aspect-[5/4] sm:mx-0 sm:mt-8 sm:w-full sm:aspect-auto sm:max-w-[calc(288px*3+16px*2)]"
      style={{ animationDelay: "0.35s" }}
    >
      {/* Glassmorphism: frosted panel extends a bit past content (larger width & height) */}
      <div
        className="absolute -inset-3 z-0 rounded-2xl bg-white/20 backdrop-blur-xl sm:-inset-4 sm:rounded-3xl"
        aria-hidden
      />

      {/* Carousel content */}
      <div className="absolute inset-0 z-[2] flex items-stretch gap-0 rounded-2xl sm:relative sm:inset-auto sm:flex sm:items-center sm:gap-2 sm:rounded-3xl">
        {/* Arrows: solid dark circles, overlapping card edges, on top */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute -left-1 top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 shrink-0 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black/85 disabled:pointer-events-none disabled:opacity-40 sm:-left-6 sm:h-12 sm:w-12"
          aria-label="Previous branches"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>

        <div className="flex-1 min-w-0 min-h-0 overflow-hidden sm:min-h-0 sm:h-auto">
          <div
            ref={scrollRef}
            className="flex h-full w-full min-w-0 gap-0 overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide sm:h-auto sm:w-auto sm:min-w-0 sm:gap-4 [scroll-snap-type:x_mandatory]"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {branches.map((branch) => (
              <Link
                key={branch.id}
                href="/find-store"
                className="hero-store-card relative flex h-full w-full min-w-full flex-[0_0_100%] shrink-0 flex-col rounded-xl [scroll-snap-align:start] sm:w-72 sm:min-w-0 sm:flex-none sm:rounded-2xl sm:block"
              >
                {/* Mobile: flex-1 fill. Desktop: 6:5 ratio card */}
                <div className="relative flex-1 min-h-0 w-full overflow-hidden rounded-xl bg-muted sm:aspect-[6/5] sm:flex-none sm:w-full sm:rounded-2xl">
                  <Image
                    src={getBranchImageUrl(branch)}
                    alt={branch.name}
                    fill
                    className="block object-cover object-center"
                    sizes="(max-width: 640px) 100vw, 288px"
                  />
                </div>
                <div className="absolute left-2 top-2 z-10 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm sm:left-3 sm:top-3 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
                  <MapPin className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                  <span className="truncate max-w-[140px] sm:max-w-none">{branch.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute -right-1 top-1/2 z-[3] flex h-10 w-10 -translate-y-1/2 shrink-0 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black/85 disabled:pointer-events-none disabled:opacity-40 sm:-right-6 sm:h-12 sm:w-12"
          aria-label="Next branches"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </div>
    </div>
  );
}
