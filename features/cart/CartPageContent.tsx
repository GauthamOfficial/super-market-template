"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/features/cart/store";
import { cartItemSubtotal } from "@/features/cart/cartUtils";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartPageContent() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  const subtotal = getSubtotal();

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center space-y-4">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild>
          <Link href="/home">Browse products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={`${item.branchId}:${item.variantId}`}
            className="flex gap-4 rounded-lg border p-4"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.productName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No img
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{item.productName}</p>
              <p className="text-sm text-muted-foreground">{item.variantLabel}</p>
              <p className="mt-1 font-semibold">{formatPrice(item.unitPrice)}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateQty(item.branchId, item.variantId, item.qty - 1)
                  }
                  disabled={item.qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="min-w-[2rem] text-center text-sm font-medium">
                  {item.qty}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    updateQty(item.branchId, item.variantId, item.qty + 1)
                  }
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => removeItem(item.branchId, item.variantId)}
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <p className="text-sm font-semibold">
                {formatPrice(cartItemSubtotal(item))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-end gap-4 border-t pt-4">
        <p className="text-lg font-semibold">
          Subtotal: {formatPrice(subtotal)}
        </p>
        <Button asChild>
          <Link href="/checkout">Go to checkout</Link>
        </Button>
      </div>
    </div>
  );
}
