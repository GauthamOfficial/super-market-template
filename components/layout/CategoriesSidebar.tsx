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
    <aside className="shrink-0 lg:w-56">
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
  );
}
