"use client";

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { cartItemSubtotal } from "./cartUtils";
import { useCartStore } from "./store";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const open = useCartStore((s) => s.open);
  const setOpen = useCartStore((s) => s.setOpen);

  const subtotal = getSubtotal();
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {isEmpty ? (
            <p className="py-8 text-center text-muted-foreground">
              Your cart is empty.
            </p>
          ) : (
            <ul className="flex-1 space-y-4 overflow-y-auto py-4">
              {items.map((item) => (
                <li
                  key={`${item.branchId}:${item.variantId}`}
                  className="flex gap-3 border-b pb-4 last:border-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.variantLabel}
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {formatPrice(item.unitPrice)} × {item.qty} ={" "}
                      {formatPrice(cartItemSubtotal(item))}
                    </p>
                    <div className="mt-2 flex items-center gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQty(item.branchId, item.variantId, item.qty - 1)
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="min-w-[1.5rem] text-center text-sm">
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
                        className="ml-1 h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.branchId, item.variantId)}
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!isEmpty && (
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <div className="flex w-full items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Button className="w-full" asChild>
              <a href="/checkout">Proceed to checkout</a>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
