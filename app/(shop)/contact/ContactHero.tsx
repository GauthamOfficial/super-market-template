"use client";

import { useRef, useState, useEffect } from "react";

const FLOATING_BOXES: { label: string; left: string; top: string; width: number; height: number; speed: number; z: number }[] = [
  { label: "Image", left: "3%", top: "15%", width: 100, height: 88, speed: 0.28, z: 10 },
  { label: "Image", left: "78%", top: "10%", width: 90, height: 95, speed: 0.4, z: 30 },
  { label: "Image", left: "88%", top: "35%", width: 95, height: 85, speed: 0.22, z: 20 },
  { label: "Image", left: "5%", top: "55%", width: 88, height: 92, speed: 0.38, z: 15 },
  { label: "Image", left: "82%", top: "62%", width: 100, height: 80, speed: 0.35, z: 18 },
  { label: "Image", left: "12%", top: "75%", width: 85, height: 78, speed: 0.3, z: 25 },
  { label: "Image", left: "70%", top: "78%", width: 90, height: 82, speed: 0.42, z: 8 },
];

export function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [transforms, setTransforms] = useState<Record<number, { y: number; rotate: number }>>({});

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
      className="full-bleed relative overflow-hidden bg-gradient-to-br from-primary/95 via-primary to-primary/90 py-16 sm:py-20"
      style={{ perspective: "1200px" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        aria-hidden
      >
        {FLOATING_BOXES.map((item, i) => {
          const t = transforms[i] ?? { y: 0, rotate: 0 };
          return (
            <div
              key={i}
              className="absolute rounded-xl border-2 border-neutral-400 bg-neutral-200/95 shadow-xl flex items-center justify-center text-neutral-500 text-xs font-medium text-center"
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
              {item.label}
            </div>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <h1
          className="font-impact text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white"
          style={{ letterSpacing: "0.03em" }}
        >
          Contact Us
        </h1>
        <p className="mt-4 text-white/90 max-w-2xl text-lg">
          We&apos;d love to hear from you. Reach out anytime.
        </p>
      </div>
    </section>
  );
}
