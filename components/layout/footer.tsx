import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socialConfig = [
  { key: "instagram" as const, label: "Instagram", Icon: InstagramIcon, defaultHref: "#" },
  { key: "facebook" as const, label: "Facebook", Icon: FacebookIcon, defaultHref: "#" },
  { key: "tiktok" as const, label: "TikTok", Icon: TikTokIcon, defaultHref: "#" },
  { key: "whatsapp" as const, label: "WhatsApp", Icon: WhatsAppIcon, defaultHref: "#" },
] as const;

export function Footer() {
  const { contact, socials, establishedYear, footerDescription, footerQrCodeUrl } = siteConfig;
  const description = footerDescription ?? siteConfig.tagline;

  return (
    <footer className="mt-auto border-t-0 bg-neutral-900 pt-10 pb-0 text-white sm:pt-14">
      <Container className="pb-12 pt-0">
        {/* Four columns — centered as a block, content in each column left-aligned */}
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 gap-x-16 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            {siteConfig.logoUrl ? (
              <Image
                src={siteConfig.logoUrl}
                alt=""
                width={64}
                height={64}
                className="h-14 w-14 object-contain"
              />
            ) : (
              <span className="text-2xl font-bold text-primary">{siteConfig.name.slice(0, 2)}</span>
            )}
            {establishedYear && (
              <p className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                ESTD. {establishedYear}
              </p>
            )}
            <p className="text-sm leading-relaxed text-neutral-300">
              {description}
            </p>
          </div>

          {/* Column 2: Quick links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick links
            </h3>
            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <Link href="/" className="text-sm text-neutral-300 transition-colors hover:text-primary">
                Home
              </Link>
              <Link href="/find-store" className="text-sm text-neutral-300 transition-colors hover:text-primary">
                Find a store
              </Link>
              <Link href="/products" className="text-sm text-neutral-300 transition-colors hover:text-primary">
                Products
              </Link>
              <Link href="/about" className="text-sm text-neutral-300 transition-colors hover:text-primary">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-neutral-300 transition-colors hover:text-primary">
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              {contact.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="hover:text-primary transition-colors">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" />
                  <span>{contact.address}</span>
                </li>
              )}
              {!contact.phone && !contact.email && !contact.address && (
                <li className="text-neutral-500">Add contact details in config/site.ts</li>
              )}
            </ul>
          </div>

          {/* Column 4: Follow us + QR */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Follow us
            </h3>
            <div className="flex flex-wrap gap-3">
              {socialConfig.map(({ key, label, Icon, defaultHref }) => {
                const href = socials[key] ?? defaultHref;
                return (
                  <a
                    key={key}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-500 text-neutral-400 transition-colors hover:border-primary hover:text-primary hover:bg-primary/10"
                    aria-label={label}
                    title={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
            {footerQrCodeUrl && (
              <div className="mt-4">
                <Image
                  src={footerQrCodeUrl}
                  alt="QR Code"
                  width={120}
                  height={120}
                  className="h-28 w-28 object-contain rounded border border-neutral-700"
                />
              </div>
            )}
            {!footerQrCodeUrl && (
              <div className="mt-4 flex h-28 w-28 items-center justify-center rounded border border-dashed border-neutral-600 bg-neutral-800/50 text-xs text-neutral-500">
                QR code
              </div>
            )}
          </div>
        </div>
        </div>

        {/* Bottom: copyright */}
        <div className="mt-12 border-t border-neutral-800 pt-6 text-center">
          <p className="text-sm text-neutral-400">
            © 2022 {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
