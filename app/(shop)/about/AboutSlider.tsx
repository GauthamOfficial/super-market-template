"use client";

import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const TABS = [
  { id: "who", label: "Who we are" },
  { id: "vision", label: "Our Vision" },
  { id: "mission", label: "Our Mission" },
] as const;

const CONTENT = {
  who: {
    title: "Who We Are",
    body: "FN Family Mart is a trusted supermarket network committed to bringing you the best in quality and convenience. We prioritize customer satisfaction by offering a diverse range of superior products and dependable services to meet your daily needs.",
  },
  vision: {
    title: "Our Vision",
    body: "Our vision is to become the best destination for the customer to fulfill their needs in one place with good quality and affordability.",
  },
  mission: {
    title: "Our Mission",
    body: "Our mission is to provide high-quality products and services to our customers while upholding the values of integrity, excellence, and sustainability. We strive to exceed our customers' expectations through exceptional customer service, a commitment to innovation, and a dedication to social and environmental responsibility. We value our employees and provide a supportive and inclusive work environment that fosters personal and professional growth. We are committed to being a responsible corporate citizen and contributing to the well-being of the communities we serve.",
  },
} as const;

export function AboutSlider() {
  const [active, setActive] = useState<(typeof TABS)[number]["id"]>("who");
  const content = CONTENT[active];
  const logoUrl = siteConfig.logoUrl ?? "/fn-logo.png";

  return (
    <section className="full-bleed py-12 sm:py-16 bg-muted/40 border-y border-border relative overflow-hidden">
      {/* Logo watermark — low opacity background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <div className="relative w-full max-w-[200px] sm:max-w-[240px] aspect-square opacity-[0.07]">
          <Image
            src={logoUrl}
            alt=""
            fill
            className="object-contain"
            sizes="240px"
            priority={false}
          />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Segmented control — pill bar like reference */}
        <div
          className="inline-flex w-full sm:w-auto rounded-full bg-neutral-200 p-1.5 gap-0.5"
          role="tablist"
          aria-label="About: Who we are, Vision, Mission"
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active === tab.id}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`flex-1 sm:flex-none min-w-0 sm:min-w-[7rem] rounded-full px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                active === tab.id
                  ? "bg-neutral-100 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content panel */}
        <div
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="mt-8"
        >
          <h2 className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground">
            {content.title}
            <span className="h-1.5 w-14 sm:w-20 rounded-full bg-primary shrink-0" aria-hidden />
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            {content.body}
          </p>
        </div>
      </div>
    </section>
  );
}
