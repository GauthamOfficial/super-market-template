"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  { href: "/find-store", label: "Find a store", match: (path: string) => path === "/find-store" },
  { href: "/products", label: "Products", match: (path: string) => path === "/products" || path.startsWith("/products/") },
] as const;

export function HeaderNav() {
  const pathname = usePathname();
  const path = (pathname ?? "").replace(/\/$/, "") || "/";

  return (
    <>
      {LINKS.map(({ href, label, match }) => {
        const isActive = match(path);
        return (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-2 font-medium transition-colors ${
              isActive
                ? "bg-primary/12 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            } ${isActive ? "ring-1 ring-primary/30" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {label}
          </Link>
        );
      })}
    </>
  );
}
