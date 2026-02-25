"use client";

import { useCartStore } from "@/features/cart/store";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  branchId: string;
  variantId: string;
  productName: string;
  variantLabel: string;
  unitPrice: number;
  imageUrl: string | null;
  disabled?: boolean;
}

export function AddToCartButton({
  branchId,
  variantId,
  productName,
  variantLabel,
  unitPrice,
  imageUrl,
  disabled = false,
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <Button
      type="button"
      variant="default"
      size="sm"
      disabled={disabled}
      className="rounded-md"
      onClick={() =>
        addItem({
          branchId,
          variantId,
          productName,
          variantLabel,
          unitPrice,
          imageUrl,
          qty: 1,
        })
      }
    >
      Add to cart
    </Button>
  );
}
