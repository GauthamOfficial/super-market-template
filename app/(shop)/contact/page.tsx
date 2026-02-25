import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}. Send a message or call us.`,
};

function ContactBlock({
  icon: Icon,
  topic,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  topic: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-foreground mb-1">{topic}</p>
        <div className="text-muted-foreground text-sm">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <div className="min-w-0 -mt-8">
      <ContactHero />

      {/* Get In Touch + Contact details (left) | Form (right) — fit to screen width */}
      <section className="full-bleed py-12 sm:py-16 bg-muted/30">
        <Container className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            {/* Left: Get In Touch + contact details */}
            <div className="space-y-8 order-2 lg:order-1">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Get In Touch</h2>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-lg">
                  We&apos;d love to hear from you. Whether you have questions about our products, need support, or want to partner with us, reach out and we&apos;ll get back to you as soon as we can.
                </p>
              </div>

              <div className="space-y-6">
                {contact.phone && (
                  <ContactBlock icon={Phone} topic="Phone">
                    <a
                      href={`tel:${contact.phone.replace(/\D/g, "")}`}
                      className="hover:text-primary transition-colors"
                    >
                      {contact.phone}
                    </a>
                  </ContactBlock>
                )}
                {contact.email && (
                  <ContactBlock icon={Mail} topic="Email">
                    <a
                      href={`mailto:${contact.email}`}
                      className="hover:text-primary transition-colors break-all"
                    >
                      {contact.email}
                    </a>
                  </ContactBlock>
                )}
                {contact.address && (
                  <ContactBlock icon={MapPin} topic="Address">
                    <span>{contact.address}</span>
                  </ContactBlock>
                )}
                <ContactBlock icon={Clock} topic="Business Hours">
                  <span>Mon – Sat: 8:00 AM – 8:00 PM. We aim to respond within 24 hours.</span>
                </ContactBlock>
                {siteConfig.socials.whatsapp && (
                  <Button asChild variant="outline" className="gap-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10">
                    <a href={siteConfig.socials.whatsapp} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Right: Form card */}
            <div className="order-1 lg:order-2">
              <div className="rounded-2xl border border-border bg-card shadow-md p-4 sm:p-8">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-1">Send Us a Message</h2>
                <p className="text-muted-foreground text-sm mb-4 sm:mb-6">
                  Fill out the form below and we&apos;ll get back to you as soon as we can.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* Map: FN Family Mart — Kandy road, Theliyagonna, Kurunegala */}
          <div className="mt-12 rounded-2xl overflow-hidden border border-border bg-neutral-100">
            <div className="relative w-full aspect-[21/9] sm:aspect-[3/1]">
              <iframe
                title="Map — FN Family Mart, Kandy road, Theliyagonna, Kurunegala"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3955.9025305274145!2d80.37732737476423!3d7.476015011362607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3398e15ac93af%3A0xaae4ae49ee60d85d!2sFN%20Family%20mart!5e0!3m2!1sen!2slk!4v1771960218172!5m2!1sen!2slk"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="full-bleed border-b-0 pb-16 bg-muted/40">
        <Container className="text-center">
          <Button asChild size="default">
            <Link href="/">Back to home</Link>
          </Button>
        </Container>
      </section>
    </div>
  );
}
