"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const HERO_IMAGES = ["/sp-1.jpg", "/sp-2.jpg", "/sp-3.jpg", "/sp-4.jpg", "/sp-5.jpg", "/sp-6.jpg", "/sp-7.jpg"];

/* Left and right corners only — inset from edges so images stay fully inside the hero frame */
const FLOATING_BOXES: { left: string; top: string; width: number; height: number; speed: number; z: number }[] = [
  { left: "5%", top: "12%", width: 100, height: 88, speed: 0.28, z: 10 },
  { left: "18%", top: "26%", width: 90, height: 95, speed: 0.4, z: 30 },
  { left: "6%", top: "65%", width: 95, height: 85, speed: 0.22, z: 20 },
  { left: "14%", top: "77%", width: 88, height: 92, speed: 0.38, z: 15 },
  { left: "78%", top: "12%", width: 100, height: 80, speed: 0.35, z: 18 },
  { left: "86%", top: "26%", width: 85, height: 78, speed: 0.3, z: 25 },
  { left: "74%", top: "69%", width: 90, height: 82, speed: 0.42, z: 8 },
  { left: "84%", top: "79%", width: 92, height: 85, speed: 0.32, z: 12 },
];

const MOBILE_BREAKPOINT = 640;

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [transforms, setTransforms] = useState<Record<number, { y: number; rotate: number }>>({});
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const update = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 800;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = viewportHeight / 2;
      const baseOffset = (sectionCenter - viewportCenter) * 0.45;
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height + viewportHeight)));
      const tilt = (progress - 0.5) * 4;
      const next: Record<number, { y: number; rotate: number }> = {};
      FLOATING_BOXES.forEach((item, i) => {
        next[i] = {
          y: baseOffset * item.speed,
          rotate: tilt * (0.3 + (item.z / 50)),
        };
      });
      setTransforms(next);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="full-bleed relative overflow-hidden bg-black py-10 sm:py-20 min-h-0 sm:min-h-[200px]"
      style={{ perspective: "1200px" }}
    >
      {/* Black and green gradient — matches landing hero style */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent pointer-events-none"
        aria-hidden
      />
      {!isMobile && (
        <div
          className="absolute inset-0 pointer-events-none origin-center scale-[0.6] sm:scale-100"
          style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          aria-hidden
        >
          {FLOATING_BOXES.map((item, i) => {
            const t = transforms[i] ?? { y: 0, rotate: 0 };
            const src = HERO_IMAGES[i] ?? HERO_IMAGES[0];
            return (
              <div
                key={i}
                className="absolute rounded-xl overflow-hidden border-2 border-white/20 shadow-xl"
                style={{
                  left: item.left,
                  top: item.top,
                  width: item.width,
                  height: item.height,
                  transform: `translateY(${t.y}px) rotateY(${t.rotate}deg) translateZ(${item.z}px)`,
                  transition: "transform 0.12s ease-out",
                  willChange: "transform",
                  backfaceVisibility: "hidden",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes={`${item.width}px`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Central text — same vertical padding as ContactHero on mobile for consistent hero height */}
      <div className="relative z-10 flex min-w-0 flex-col items-center justify-center px-4 text-center">
        <h1
          className="font-brand text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white break-words"
          style={{ letterSpacing: "0.03em" }}
        >
          About Us
        </h1>
        <p className="mt-3 sm:mt-4 text-white/90 max-w-2xl text-sm sm:text-lg break-words px-1">
          Excellence, integrity, and a commitment to serving you better.
        </p>
      </div>
    </section>
  );
}
