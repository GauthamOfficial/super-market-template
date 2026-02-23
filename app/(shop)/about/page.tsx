import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { Quote } from "lucide-react";
import { AboutSlider } from "./AboutSlider";
import { AboutHero } from "./AboutHero";

export const metadata = {
  title: "About Us",
  description: `Learn about ${siteConfig.name} and FN Group (Pvt) Ltd — our vision, mission, and leadership.`,
};

export default function AboutPage() {
  return (
    <div className="min-w-0 -mt-8">
      {/* Hero with floating grey image boxes */}
      <AboutHero />

      {/* Who we are / Vision / Mission — slider (segmented control) */}
      <AboutSlider />

      {/* Leadership — Chairman & Director */}
      <section className="full-bleed py-12 sm:py-20 bg-background">
        <Container className="max-w-5xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-12">
            Leadership
          </h2>

          {/* Chairman */}
          <div className="mb-16 sm:mb-20">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
              <div
                className="shrink-0 w-full md:w-56 aspect-[3/4] rounded-2xl bg-neutral-200 border-2 border-dashed border-neutral-400 flex items-center justify-center text-neutral-500 text-sm"
                aria-hidden
              >
                Chairman photo
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Quote className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Chairman&apos;s Note</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Dear Valued Customers,
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is my great pleasure to welcome you to FN Group (Pvt) Ltd, a company that is dedicated to excellence and committed to delivering the very best in products and services. As the Chairman of the FN Group, I am honored to lead this organization and to work with a team of dedicated professionals who share my passion for excellence.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our company is built on a foundation of trust, integrity, and innovation. We have established ourselves as a leading provider of high-quality products and services in a number of key industries. From our super market network distribution company, to our housing projects, luxury wedding car rental service, and fashion store, we are committed to meeting the diverse needs of our customers.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Thank you for considering FN Group for your needs. We are honored to have the opportunity to serve you and look forward to building a lasting relationship with you.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Sincerely,
                </p>
                <p className="font-semibold text-foreground">
                  Mr. Fazmin Mohomed
                </p>
                <p className="text-sm text-muted-foreground">
                  Chairman, FN Group (Pvt) Ltd.
                </p>
              </div>
            </div>
          </div>

          {/* Director — image on right */}
          <div>
            <div className="flex flex-col md:flex-row-reverse gap-8 md:gap-12 items-start">
              <div
                className="shrink-0 w-full md:w-56 aspect-[3/4] rounded-2xl bg-neutral-200 border-2 border-dashed border-neutral-400 flex items-center justify-center text-neutral-500 text-sm"
                aria-hidden
              >
                Director photo
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Quote className="h-5 w-5 opacity-70" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Director&apos;s Note</span>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Welcome to FN Group (Pvt) Ltd,
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  As the Director of FN Group, I extend a warm welcome to you. It gives me immense pleasure to introduce you to our diverse range of products and services.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At FN Group, we are committed to excellence in everything we do. Our dedication to quality, integrity, and innovation is the driving force behind our success. Whether it&apos;s through our supermarket network, distribution channels, housing projects, luxury wedding car rentals, or fashion store, we strive to exceed your expectations.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Our team of professionals shares a common goal: to provide you with the best possible experience. We understand the importance of building lasting relationships with our customers, and we are honored to have the opportunity to serve you.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Thank you for considering FN Group for your needs. We look forward to the opportunity to exceed your expectations and to build a long-lasting partnership with you.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2">
                  Warm regards,
                </p>
                <p className="font-semibold text-foreground">
                  Mrs. Fathima Nuzha
                </p>
                <p className="text-sm text-muted-foreground">
                  Director, FN Group (Pvt) Ltd.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
