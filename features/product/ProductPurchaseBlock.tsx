"use client";

import { useMemo, useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/features/cart/store";
import type { Product, ProductVariant } from "@/types/db";
import { Minus, Plus, ShoppingCart } from "lucide-react";

export interface ProductPurchaseBlockProps {
  branchId: string;
  product: Pick<Product, "id" | "name" | "image_url" | "slug">;
  variants: ProductVariant[];
  inventory: { variantId: string; quantity: number }[];
}

export function ProductPurchaseBlock({
  branchId,
  product,
  variants,
  inventory,
}: ProductPurchaseBlockProps) {
  const addItem = useCartStore((s) => s.addItem);

  const inventoryByVariantId = useMemo(
    () => new Map(inventory.map((i) => [i.variantId, i.quantity])),
    [inventory]
  );

  const defaultVariantId = useMemo(() => {
    const firstInStock = variants.find(
      (v) => (inventoryByVariantId.get(v.id) ?? 0) > 0
    );
    return firstInStock?.id ?? variants[0]?.id ?? "";
  }, [variants, inventoryByVariantId]);

  const [selectedVariantId, setSelectedVariantId] = useState(defaultVariantId);
  const [quantity, setQuantity] = useState(1);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const stock = selectedVariantId
    ? inventoryByVariantId.get(selectedVariantId) ?? 0
    : 0;
  const inStock = stock > 0;
  const maxQty = Math.max(0, Math.min(stock, 99));

  const clampedQty = inStock ? Math.max(1, Math.min(quantity, maxQty)) : 0;

  useEffect(() => {
    setQuantity((q) => (maxQty < q ? maxQty : q));
  }, [maxQty]);

  const handleVariantChange = (value: string) => {
    setSelectedVariantId(value);
    const newStock = inventoryByVariantId.get(value) ?? 0;
    setQuantity(newStock > 0 ? 1 : 0);
  };

  const handleAddToCart = () => {
    if (!selectedVariant || !inStock || clampedQty < 1) return;
    addItem({
      branchId,
      variantId: selectedVariant.id,
      productName: product.name,
      variantLabel: selectedVariant.name,
      unitPrice: selectedVariant.price,
      imageUrl: product.image_url,
      qty: clampedQty,
    });
  };

  if (variants.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No variants available for this product.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-2xl font-semibold">
        {selectedVariant ? formatPrice(selectedVariant.price) : "—"}
      </p>

      {variants.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Variant</label>
          <Select
            value={selectedVariantId}
            onValueChange={handleVariantChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose variant" />
            </SelectTrigger>
            <SelectContent>
              {variants.map((v) => {
                const q = inventoryByVariantId.get(v.id) ?? 0;
                return (
                  <SelectItem
                    key={v.id}
                    value={v.id}
                    disabled={q < 1}
                  >
                    {v.name} — {formatPrice(v.price)}
                    {q < 1 ? " (Out of stock)" : ` (${q} left)`}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Stock</label>
        <div>
          {inStock ? (
            <Badge variant="secondary" className="bg-green-600/10 text-green-700 dark:text-green-400">
              In stock ({stock})
            </Badge>
          ) : (
            <span className="text-sm text-destructive font-medium">
              Out of stock
            </span>
          )}
        </div>
      </div>

      {inStock && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Quantity</label>
          <div className="flex items-center gap-2 w-fit">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={clampedQty <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span
              className="min-w-[2.5rem] text-center font-medium tabular-nums"
              role="status"
              aria-live="polite"
            >
              {clampedQty}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10 shrink-0"
              onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
              disabled={clampedQty >= maxQty}
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <Button
          type="button"
          size="lg"
          className="w-full sm:w-auto"
          disabled={!inStock || !selectedVariant}
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
        {selectedVariant && !inStock && (
          <p className="text-sm text-muted-foreground">
            This variant is out of stock at your branch. Choose another or check back later.
          </p>
        )}
      </div>
    </div>
  );
}
