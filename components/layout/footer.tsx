import Link from "next/link";
import { Container } from "@/components/layout/container";
import { siteConfig } from "@/config/site";

export function Footer() {
  const { contact } = siteConfig;
  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <footer className="mt-auto border-t bg-muted/30">
      <Container className="py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </p>
            {hasContact && (
              <div className="text-xs text-muted-foreground space-y-0.5">
                {contact.email && (
                  <p>
                    <a href={`mailto:${contact.email}`} className="hover:text-foreground underline">
                      {contact.email}
                    </a>
                  </p>
                )}
                {contact.phone && (
                  <p>
                    <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="hover:text-foreground underline">
                      {contact.phone}
                    </a>
                  </p>
                )}
                {contact.address && <p>{contact.address}</p>}
              </div>
            )}
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href="/select-branch"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Find a store
            </Link>
            <Link
              href="/products"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Products
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
