"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";

const FLOATING_ITEMS: { label: string; src: string; left: string; top: string; width: number; height: number; speed: number; z: number }[] = [
  { label: "Potatoes", src: "/vegetables/veg-1.jpg", left: "3%", top: "10%", width: 165, height: 142, speed: 0.28, z: 10 },
  { label: "Cucumbers", src: "/vegetables/veg-6.jpg", left: "68%", top: "5%", width: 128, height: 155, speed: 0.4, z: 30 },
  { label: "Tomatoes", src: "/vegetables/veg-7.jpg", left: "85%", top: "14%", width: 178, height: 148, speed: 0.22, z: 20 },
  { label: "Cauliflower", src: "/vegetables/veg-2.jpg", left: "2%", top: "36%", width: 152, height: 168, speed: 0.45, z: 5 },
  { label: "Bell peppers", src: "/vegetables/veg-3.jpg", left: "18%", top: "40%", width: 138, height: 118, speed: 0.32, z: 25 },
  { label: "Onions", src: "/vegetables/veg-4.jpg", left: "8%", top: "62%", width: 188, height: 162, speed: 0.38, z: 15 },
  { label: "Lemons", src: "/vegetables/veg-5.jpg", left: "24%", top: "8%", width: 112, height: 135, speed: 0.3, z: 35 },
  { label: "Eggplants", src: "/vegetables/veg-8.jpg", left: "66%", top: "64%", width: 145, height: 152, speed: 0.35, z: 18 },
  { label: "Carrots", src: "/vegetables/veg-9.jpg", left: "78%", top: "70%", width: 122, height: 178, speed: 0.25, z: 28 },
  { label: "Broccoli", src: "/vegetables/veg-10.jpg", left: "88%", top: "54%", width: 158, height: 138, speed: 0.42, z: 8 },
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
      <div className="absolute inset-0 opacity-90" aria-hidden>
        <Image
          src="/bg-2.jpg"
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      {/* Green overlay with soft-light blend */}
      <div
        className="absolute inset-0 bg-green-600/25 mix-blend-soft-light pointer-events-none"
        aria-hidden
      />
      {/* Dark overlay to improve text visibility */}
      <div
        className="absolute inset-0 bg-black/25 pointer-events-none"
        aria-hidden
      />
      {/* White at top; bottom gradient only at the very edge so it doesn't reach text area */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-white from-[0%] via-transparent via-[20%] to-transparent to-[96%] to-white to-[100%] pointer-events-none"
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
              className="absolute rounded-xl border-4 border-white bg-neutral-300 shadow-xl overflow-hidden flex items-center justify-center text-neutral-600 text-xs font-medium text-center"
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
                src={item.src}
                alt={item.label}
                width={item.width}
                height={item.height}
                className="object-cover w-full h-full"
                sizes={`${item.width}px`}
              />
            </div>
          );
        })}
      </div>

      {/* Central text */}
      <div className="relative z-10 flex min-h-[100vh] flex-col items-center justify-center px-4 py-24 text-center -translate-y-12">
        <h2 className="text-3xl font-bold tracking-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.4)] sm:text-4xl md:text-5xl">
          Enjoy the <span className="font-accent italic text-[1.1em]">freshest</span>
        </h2>
        <p className="mt-4 max-w-xl text-lg font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:text-xl">
          we handpick the freshest from selected organic farms to your plates
        </p>
      </div>
    </section>
  );
}
