import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/db";
import type { OrderItem } from "@/types/db";
import type { ProductVariant } from "@/types/db";

export interface OrderItemWithVariant extends OrderItem {
  variant?: ProductVariant;
}

/**
 * Build a formatted order summary for WhatsApp (orderId, customer, address, items, totals, payment method).
 */
export function buildOrderSummaryMessage(
  order: Order,
  items: OrderItemWithVariant[],
  total: number
): string {
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);
  const paymentLabel =
    order.payment_method === "bank_transfer"
      ? "Bank transfer"
      : order.payment_method === "cod"
        ? "Cash on delivery (COD)"
        : order.payment_method ?? "—";

  const lines: string[] = [
    `*Order:* ${order.order_number}`,
    `Order ID: ${order.id}`,
    `Customer: ${order.customer_name ?? order.customer_email}`,
    order.customer_phone ? `Phone: ${order.customer_phone}` : null,
    order.delivery_address ? `Address: ${order.delivery_address.replace(/\n/g, ", ")}` : null,
    "",
    "*Items:*",
    ...items.map((i) => {
      const name = i.variant?.name ?? "Item";
      return `• ${name} × ${i.quantity} @ ${formatPrice(i.unit_price)} = ${formatPrice(i.quantity * i.unit_price)}`;
    }),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    total !== subtotal ? `Total: ${formatPrice(total)}` : null,
    `Payment: ${paymentLabel}`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

/**
 * Resolve WhatsApp number: branch whatsapp_phone → branch phone → env NEXT_PUBLIC_WHATSAPP_NUMBER.
 * Returns digits only (no +) for wa.me links.
 */
export function getShopWhatsAppNumber(branch: { whatsapp_phone?: string | null; phone?: string | null } | null): string | null {
  const fromBranch = branch?.whatsapp_phone?.trim() || branch?.phone?.trim();
  if (fromBranch) {
    return fromBranch.replace(/\D/g, "");
  }
  const env =
    typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER : undefined;
  const str = typeof env === "string" ? env.trim() : "";
  if (str) return str.replace(/\D/g, "");
  return null;
}

/**
 * Build wa.me URL with prefilled text. Number must be digits only (no +).
 */
export function getWhatsAppDeepLink(phone: string, text: string): string {
  const base = `https://wa.me/${phone.replace(/\D/g, "")}`;
  if (!text.trim()) return base;
  return `${base}?text=${encodeURIComponent(text.trim())}`;
}
