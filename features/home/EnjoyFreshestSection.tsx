"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const FLOATING_ITEMS: { label: string; left: string; top: string; width: number; height: number; speed: number; z: number }[] = [
  { label: "Potatoes", left: "3%", top: "10%", width: 165, height: 142, speed: 0.28, z: 10 },
  { label: "Cucumbers", left: "68%", top: "5%", width: 128, height: 155, speed: 0.4, z: 30 },
  { label: "Tomatoes", left: "85%", top: "14%", width: 178, height: 148, speed: 0.22, z: 20 },
  { label: "Cauliflower", left: "6%", top: "38%", width: 152, height: 168, speed: 0.45, z: 5 },
  { label: "Bell peppers", left: "20%", top: "46%", width: 138, height: 118, speed: 0.32, z: 25 },
  { label: "Onions", left: "2%", top: "68%", width: 188, height: 162, speed: 0.38, z: 15 },
  { label: "Lemons", left: "16%", top: "74%", width: 112, height: 135, speed: 0.3, z: 35 },
  { label: "Eggplants", left: "66%", top: "64%", width: 145, height: 152, speed: 0.35, z: 18 },
  { label: "Carrots", left: "78%", top: "70%", width: 122, height: 178, speed: 0.25, z: 28 },
  { label: "Broccoli", left: "88%", top: "54%", width: 158, height: 138, speed: 0.42, z: 8 },
];

export function EnjoyFreshestSection() {
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
      FLOATING_ITEMS.forEach((item, i) => {
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
      className="full-bleed relative min-h-[100vh] overflow-hidden bg-white"
      style={{ perspective: "1200px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src="/bg-2.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Full white at top and bottom so image edges fade into white (no sharp crop) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white from-[0%] via-transparent via-[25%] to-transparent to-[75%] to-white to-[100%] pointer-events-none"
        aria-hidden
      />

      {/* Floating product boxes with scroll-based 3D parallax */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        aria-hidden
      >
        {FLOATING_ITEMS.map((item, i) => {
          const t = transforms[i] ?? { y: 0, rotate: 0 };
          return (
            <div
              key={item.label}
              className="absolute rounded-xl border-2 border-neutral-500 bg-neutral-300 shadow-xl flex items-center justify-center text-neutral-600 text-xs font-medium text-center"
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

      {/* Central text */}
      <div className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center px-4 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-neutral-800 sm:text-4xl md:text-5xl">
          enjoy the <span className="font-accent italic text-[1.1em]">freshest</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg text-neutral-700 sm:text-xl">
          we handpick the freshest from selected organic farms to your plates
        </p>
      </div>
    </section>
  );
}
