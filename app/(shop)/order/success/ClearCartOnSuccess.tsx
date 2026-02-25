"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/features/cart/store";

/**
 * Clears the cart when the user lands on the order success page with an orderId.
 * This allows checkout to redirect without clearing the cart first, so the form
 * stays visible until the redirect completes (no empty checkout flash).
 */
export function ClearCartOnSuccess() {
  const searchParams = useSearchParams();
  const clearCart = useCartStore((s) => s.clearCart);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    if (orderId) {
      clearCart();
    }
  }, [searchParams, clearCart]);

  return null;
}
