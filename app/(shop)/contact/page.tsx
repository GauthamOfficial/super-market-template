import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Contact Us",
  description: `Get in touch with ${siteConfig.name}. Phone, email, and address.`,
};

export default function ContactPage() {
  const { contact } = siteConfig;

  return (
    <div className="min-w-0">
      {/* Hero */}
      <section className="full-bleed bg-gradient-to-br from-primary/95 via-primary to-primary/90 py-16 sm:py-20 text-primary-foreground">
        <Container className="text-center">
          <h1 className="font-impact text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight" style={{ letterSpacing: "0.03em" }}>
            Contact Us
          </h1>
          <p className="mt-4 text-primary-foreground/90 max-w-2xl mx-auto text-lg">
            We&apos;d love to hear from you. Reach out anytime.
          </p>
        </Container>
      </section>

      {/* Contact cards + map placeholder */}
      <section className="full-bleed py-12 sm:py-16 bg-background">
        <Container className="max-w-5xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {contact.phone && (
              <a
                href={`tel:${contact.phone.replace(/\D/g, "")}`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md hover:bg-primary/5"
              >
                <div className="rounded-xl bg-primary/10 p-3 w-fit text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground text-sm">{contact.phone}</p>
                <p className="mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to call
                </p>
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary hover:shadow-md hover:bg-primary/5"
              >
                <div className="rounded-xl bg-primary/10 p-3 w-fit text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground text-sm break-all">{contact.email}</p>
                <p className="mt-2 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Send an email
                </p>
              </a>
            )}
            {contact.address && (
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="rounded-xl bg-primary/10 p-3 w-fit text-primary mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <p className="text-muted-foreground text-sm">{contact.address}</p>
              </div>
            )}
          </div>

          {/* Map / location placeholder */}
          <div className="rounded-2xl overflow-hidden border border-border bg-neutral-100">
            <div className="aspect-[21/9] sm:aspect-[3/1] flex items-center justify-center bg-neutral-200 border-2 border-dashed border-neutral-400 text-neutral-500 text-sm">
              Map placeholder — add your Google Maps embed or image
            </div>
          </div>

          {/* WhatsApp CTA if configured */}
          {siteConfig.socials.whatsapp && (
            <div className="mt-10 text-center">
              <Button asChild size="lg" className="bg-[#25D366] hover:bg-[#20BD5A] text-white border-0">
                <a
                  href={siteConfig.socials.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </Button>
            </div>
          )}

          {/* Optional: business hours placeholder */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-medium text-foreground">Business hours</p>
                <p className="text-sm">Contact us during standard business hours. We aim to respond within 24 hours.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Back to home */}
      <section className="full-bleed py-8 bg-muted/40 border-t">
        <Container className="text-center">
          <Link href="/" className="text-primary font-medium hover:underline">
            ← Back to home
          </Link>
        </Container>
      </section>
    </div>
  );
}
