"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/db";

interface CategoriesSidebarProps {
  categories: Category[];
}

export function CategoriesSidebar({ categories }: CategoriesSidebarProps) {
  const pathname = usePathname();

  const isProducts = pathname === "/products";
  const categorySlug = pathname.startsWith("/category/")
    ? pathname.slice("/category/".length).split("/")[0]
    : null;

  return (
    <>
      {/* Mobile: wrap in one view, smaller buttons */}
      <div className="lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
        <nav
          className="flex flex-wrap gap-1.5 py-1 pb-2 sm:gap-2 sm:gap-3"
          aria-label="Product categories"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.length > 0 ? (
            <>
              <Link
                href="/products"
                className={`shrink-0 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm ${
                  isProducts
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                All products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className={`shrink-0 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap sm:px-4 sm:py-2 sm:text-sm ${
                    categorySlug === cat.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </>
          ) : (
            <p className="shrink-0 rounded-full border border-dashed px-2.5 py-1.5 text-xs text-muted-foreground sm:px-4 sm:py-2 sm:text-sm">
              No categories
            </p>
          )}
        </nav>
      </div>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden shrink-0 lg:block lg:w-56">
        <nav
          className="sticky top-20 rounded-lg border bg-card p-4"
          aria-label="Product categories"
        >
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Categories
          </h2>
          {categories.length > 0 ? (
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/products"
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    isProducts ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  All products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      categorySlug === cat.slug
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-md px-3 py-2 text-sm text-muted-foreground">
              No categories yet.
            </p>
          )}
        </nav>
      </aside>
    </>
  );
}
