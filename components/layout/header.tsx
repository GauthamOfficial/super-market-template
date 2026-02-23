import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import { CartTrigger } from "@/features/cart/CartTrigger";
import { HeaderNav } from "@/components/layout/HeaderNav";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-gradient-to-r from-primary from-0% via-primary via-20% to-transparent to-40% bg-background/98 shadow-sm backdrop-blur-md">
      <Container className="flex h-16 items-center gap-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          {siteConfig.logoUrl ? (
            <Image
              src={siteConfig.logoUrl}
              alt={siteConfig.name}
              width={120}
              height={36}
              className="h-9 w-auto object-contain"
            />
          ) : (
            <>
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xs font-medium text-white sm:h-11 sm:w-11"
                aria-hidden
              >
                Logo
              </span>
              <span className="font-impact text-base font-normal tracking-tight text-white sm:text-lg" style={{ letterSpacing: "0.03em" }}>
                {siteConfig.name}
              </span>
            </>
          )}
        </Link>
        <nav
          className="flex flex-1 items-center justify-center gap-1 text-sm"
          aria-label="Main navigation"
        >
          <HeaderNav />
        </nav>
        <div className="shrink-0">
          <CartTrigger />
        </div>
      </Container>
    </header>
  );
}
