import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { CartTrigger } from "@/features/cart/CartTrigger";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container className="flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2 font-semibold">
          {siteConfig.logoUrl ? (
            <Image
              src={siteConfig.logoUrl}
              alt={siteConfig.name}
              width={120}
              height={32}
              className="h-8 w-auto object-contain"
            />
          ) : (
            siteConfig.name
          )}
        </Link>
        <nav className="flex flex-1 items-center gap-6 text-sm" aria-label="Main navigation">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
        </nav>
        <CartTrigger />
      </Container>
    </header>
  );
}
