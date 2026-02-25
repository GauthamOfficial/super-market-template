"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/features/cart/AddToCartButton";
import type { ProductWithPriceStockAndVariant } from "@/lib/dal";

interface CategoryProductGridProps {
  branchId: string;
  items: ProductWithPriceStockAndVariant[];
}

export function CategoryProductGrid({ branchId, items }: CategoryProductGridProps) {
  const [inStockOnly, setInStockOnly] = useState(false);

  const filtered = useMemo(() => {
    if (!inStockOnly) return items;
    return items.filter((item) => item.inStock);
  }, [items, inStockOnly]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          In stock only
        </label>
        {inStockOnly && (
          <span className="text-sm text-muted-foreground">
            Showing {filtered.length} of {items.length}
          </span>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          {items.length === 0
            ? "No products in this category at your branch."
            : "No in-stock products. Turn off “In stock only” to see all."}
        </div>
      ) : (
        <ul className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 min-w-0">
          {filtered.map((item) => (
            <li key={item.product.id} className="min-w-0">
              <Card className="min-w-0 overflow-hidden transition-shadow hover:shadow-md">
                <Link href={`/product/${item.product.slug}`}>
                  <div className="relative aspect-square bg-muted">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover object-[55%_50%] sm:object-center"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                    {item.inStock && (
                      <Badge className="absolute right-1.5 top-1.5 bg-green-600 hover:bg-green-600 text-xs">
                        In stock
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-2">
                  <h2 className="font-semibold line-clamp-2 break-words text-xs sm:text-sm">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </h2>
                  <p className="mt-0.5 text-left text-sm font-semibold">
                    {formatPrice(item.minPrice)}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-1.5 p-2 pt-0 text-left">
                  {item.primaryVariant && item.inStock ? (
                    <div className="w-full min-w-0 [&>button]:w-full [&>button]:sm:w-auto [&>button]:text-xs [&>button]:sm:text-sm">
                    <AddToCartButton
                      branchId={branchId}
                      variantId={item.primaryVariant.id}
                      productName={item.product.name}
                      variantLabel={item.primaryVariant.name}
                      unitPrice={item.primaryVariant.price}
                      imageUrl={item.product.image_url}
                    />
                    </div>
                  ) : (
                    <Button variant="outline" disabled size="sm" className="h-7 w-full min-w-0 text-xs sm:w-auto">
                      Out of stock
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
