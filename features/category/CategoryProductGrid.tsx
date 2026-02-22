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
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <li key={item.product.id}>
              <Card className="overflow-hidden transition-shadow hover:shadow-md">
                <Link href={`/product/${item.product.slug}`}>
                  <div className="relative aspect-square bg-muted">
                    {item.product.image_url ? (
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                        No image
                      </div>
                    )}
                    {item.inStock && (
                      <Badge className="absolute right-2 top-2 bg-green-600 hover:bg-green-600">
                        In stock
                      </Badge>
                    )}
                  </div>
                </Link>
                <CardContent className="p-4">
                  <h2 className="font-semibold line-clamp-2">
                    <Link
                      href={`/product/${item.product.slug}`}
                      className="hover:underline"
                    >
                      {item.product.name}
                    </Link>
                  </h2>
                  <p className="mt-1 text-lg font-semibold">
                    {formatPrice(item.minPrice)}
                  </p>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch gap-2 p-4 pt-0">
                  {item.primaryVariant && item.inStock ? (
                    <AddToCartButton
                      branchId={branchId}
                      variantId={item.primaryVariant.id}
                      productName={item.product.name}
                      variantLabel={item.primaryVariant.name}
                      unitPrice={item.primaryVariant.price}
                      imageUrl={item.product.image_url}
                    />
                  ) : (
                    <Button variant="outline" disabled>
                      Out of stock
                    </Button>
                  )}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="text-center text-sm font-medium text-primary hover:underline"
                  >
                    View details
                  </Link>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
