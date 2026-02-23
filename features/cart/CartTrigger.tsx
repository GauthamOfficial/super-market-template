"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "./store";
import { Button } from "@/components/ui/button";

export function CartTrigger() {
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());
  const setOpen = useCartStore((s) => s.setOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => setOpen(true)}
      aria-label={mounted && itemCount > 0 ? `Open cart (${itemCount} items)` : "Open cart"}
    >
      <ShoppingCart className="h-5 w-5" />
      {mounted && itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Button>
  );
}
