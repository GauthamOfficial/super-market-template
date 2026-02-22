"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Order } from "@/types/db";
import type { OrderItem } from "@/types/db";
import type { ProductVariant } from "@/types/db";

function buildWhatsAppMessage(
  order: Order,
  items: (OrderItem & { variant?: ProductVariant })[],
  total: number
): string {
  const lines: string[] = [
    `Order *${order.order_number}*`,
    `Customer: ${order.customer_name ?? order.customer_email}`,
    order.customer_phone ? `Phone: ${order.customer_phone}` : null,
    order.delivery_address ? `Address: ${order.delivery_address}` : null,
    "",
    "Items:",
    ...items.map((i) => {
      const name = i.variant?.name ?? "Item";
      return `• ${name} x${i.quantity} @ ${formatPrice(i.unit_price)}`;
    }),
    "",
    `Total: ${formatPrice(total)}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

function formatPrice(n: number): string {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

export function CopyWhatsAppButton({
  order,
  items,
  total,
}: {
  order: Order;
  items: (OrderItem & { variant?: ProductVariant })[];
  total: number;
}) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const message = buildWhatsAppMessage(order, items, total);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "WhatsApp message is ready to paste.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="gap-2"
    >
      <MessageCircle className="h-4 w-4" />
      {copied ? "Copied!" : "Copy WhatsApp message"}
    </Button>
  );
}
