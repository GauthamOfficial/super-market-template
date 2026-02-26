"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Container } from "@/components/layout/container";
import { CartTrigger } from "@/features/cart/CartTrigger";
import { HeaderNav } from "@/components/layout/HeaderNav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const LINKS = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  { href: "/find-store", label: "Find a store", match: (path: string) => path === "/find-store" },
  { href: "/products", label: "Products", match: (path: string) => path === "/products" || path.startsWith("/products/") },
  { href: "/about", label: "About Us", match: (path: string) => path === "/about" },
  { href: "/contact", label: "Contact Us", match: (path: string) => path === "/contact" },
] as const;

export function HeaderWithMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const path = (pathname ?? "").replace(/\/$/, "") || "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-gradient-to-r from-primary from-0% via-primary via-[45%] to-transparent to-[85%] md:via-primary md:via-20% md:to-transparent md:to-40% bg-background/98 shadow-sm backdrop-blur-md">
      <Container className="flex h-14 min-h-14 items-center gap-4 sm:gap-6 md:h-16 md:gap-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-semibold text-white transition-opacity hover:opacity-90 sm:gap-3"
        >
          {siteConfig.logoUrl ? (
            <>
              <Image
                src={siteConfig.logoUrl}
                alt=""
                width={44}
                height={44}
                className="h-9 w-9 object-contain sm:h-10 sm:w-10 md:h-11 md:w-11"
                aria-hidden
              />
              <span className="font-brand text-sm font-normal tracking-tight text-white sm:text-base md:text-lg" style={{ letterSpacing: "0.03em" }}>
                {siteConfig.name}
              </span>
            </>
          ) : (
            <>
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 text-xs font-medium text-white sm:h-10 sm:w-10 md:h-11 md:w-11"
                aria-hidden
              >
                Logo
              </span>
              <span className="font-brand text-sm font-normal tracking-tight text-white sm:text-base md:text-lg" style={{ letterSpacing: "0.03em" }}>
                {siteConfig.name}
              </span>
            </>
          )}
        </Link>

        {/* Desktop nav — hidden on small screens */}
        <nav
          className="hidden flex-1 items-center justify-center gap-1 text-sm md:flex"
          aria-label="Main navigation"
        >
          <HeaderNav />
        </nav>

        {/* Right side: cart then menu (menu only on mobile), right-aligned */}
        <div className="ml-auto flex shrink-0 items-center justify-end gap-1">
          <CartTrigger />
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-black hover:bg-black/10 hover:text-black"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" showClose={false} className="w-[min(100vw-2rem,320px)] p-0">
                <SheetHeader className="flex flex-row items-center gap-3 border-b border-primary/20 bg-gradient-to-r from-primary via-primary/95 to-primary/80 p-4 text-left">
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                  {siteConfig.logoUrl ? (
                    <Image
                      src={siteConfig.logoUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="h-10 w-10 shrink-0 object-contain"
                      aria-hidden
                    />
                  ) : (
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20 text-sm font-medium text-white"
                      aria-hidden
                    >
                      N
                    </span>
                  )}
                  <span className="font-brand text-base font-normal tracking-tight text-white" style={{ letterSpacing: "0.03em" }}>
                    {siteConfig.name}
                  </span>
                </SheetHeader>
                <nav className="flex flex-col p-2" aria-label="Mobile navigation">
                  {LINKS.map(({ href, label, match }) => {
                    const isActive = match(path);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`rounded-md px-3 py-2.5 font-medium transition-colors ${
                          isActive
                            ? "bg-primary/12 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Container>
    </header>
  );
}
