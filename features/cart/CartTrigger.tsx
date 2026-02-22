"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "./store";
import { Button } from "@/components/ui/button";

export function CartTrigger() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const setOpen = useCartStore((s) => s.setOpen);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setOpen(true)}
      aria-label={`Open cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
