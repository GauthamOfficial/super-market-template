import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import type { Order, OrderStatus } from "@/types/db";
import type { OrderItem } from "@/types/db";
import type { ProductVariant } from "@/types/db";

export interface OrderItemWithVariant extends OrderItem {
  variant?: ProductVariant;
}

/**
 * Build a formatted order summary for WhatsApp — professional layout with clear sections and icons.
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

  const addressLine =
    order.delivery_address && order.delivery_address.trim().toLowerCase() !== "pickup"
      ? order.delivery_address.trim().replace(/\n/g, ", ")
      : "Pickup at store";

  const deliveryFee = order.delivery_fee ?? 0;
  const lines: string[] = [
    "*NEW ORDER*",
    "────────────────",
    "",
    "*Order details*",
    `   ${order.order_number}`,
    `   ID: ${order.id}`,
    "",
    "*Customer*",
    `   ${order.customer_name ?? order.customer_email}`,
    order.customer_phone ? `   Phone: ${order.customer_phone}` : null,
    `   Address: ${addressLine}`,
    "",
    "*Items*",
    ...items.map((i) => {
      const name = i.variant?.name ?? "Item";
      return `   • ${name} x ${i.quantity}   ${formatPrice(i.unit_price)}   = ${formatPrice(i.quantity * i.unit_price)}`;
    }),
    "",
    "*Summary*",
    `   Subtotal:   ${formatPrice(subtotal)}`,
    deliveryFee > 0 ? `   Delivery:   ${formatPrice(deliveryFee)}` : null,
    `   Total:      ${formatPrice(total)}`,
    `   Payment:    ${paymentLabel}`,
    "",
    "────────────────",
    `_${siteConfig.name}_`,
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

function paymentLabel(order: Order): string {
  return order.payment_method === "bank_transfer"
    ? "Bank transfer"
    : order.payment_method === "cod"
      ? "Cash on delivery (COD)"
      : order.payment_method ?? "—";
}

function deliveryLine(order: Order): string {
  if (
    !order.delivery_address ||
    order.delivery_address.trim().toLowerCase() === "pickup"
  ) {
    return "Pickup at store";
  }
  return order.delivery_address.trim().replace(/\n/g, ", ");
}

function statusOpening(status: OrderStatus): string {
  switch (status) {
    case "pending":
      return "We've received your order. Here are the details:";
    case "packed":
      return "Your order is being prepared. Details:";
    case "dispatched":
      return "Your order is on its way!";
    case "completed":
      return "Your order has been completed. Thank you for your order!";
    case "cancelled":
      return "Your order was cancelled.";
    default:
      return "Order details:";
  }
}

/**
 * Build a customer-facing WhatsApp message for "Send to customer" from admin.
 * Includes status-based opening, order details (no Customer/Phone), payment and delivery.
 */
export function buildCustomerOrderMessage(
  order: Order,
  items: OrderItemWithVariant[],
  total: number
): string {
  const opening = statusOpening(order.status);
  const payLabel = paymentLabel(order);
  const delivery = deliveryLine(order);
  const deliveryFee = order.delivery_fee ?? 0;
  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const bodyLines: string[] = [
    "",
    `Order: ${order.order_number}`,
    "",
    "Items:",
    ...items.map((i) => {
      const name = i.variant?.name ?? "Item";
      return `• ${name} x${i.quantity} @ ${formatPrice(i.unit_price)}`;
    }),
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    ...(deliveryFee > 0 ? [`Delivery fee: ${formatPrice(deliveryFee)}`] : []),
    `Total: ${formatPrice(total)}`,
    `Payment: ${payLabel}`,
    `Delivery: ${delivery}`,
  ];

  const closing = ["", `— ${siteConfig.name}`];

  return [opening, ...bodyLines, ...closing].join("\n");
}

/**
 * Resolve WhatsApp number for "Send to Shop" and admin copy.
 * Uses site config contact.phone first so one number can be used for all shop WhatsApp links; falls back to branch then env.
 * Returns digits only (no +) for wa.me links.
 */
export function getShopWhatsAppNumber(branch: { whatsapp_phone?: string | null; phone?: string | null } | null): string | null {
  const sitePhone = siteConfig.contact.phone?.trim();
  if (sitePhone) return sitePhone.replace(/\D/g, "");
  const fromBranch = branch?.whatsapp_phone?.trim() || branch?.phone?.trim();
  if (fromBranch) return fromBranch.replace(/\D/g, "");
  const env =
    typeof process !== "undefined" ? process.env?.NEXT_PUBLIC_WHATSAPP_NUMBER : undefined;
  const envStr = typeof env === "string" ? env.trim() : "";
  if (envStr) return envStr.replace(/\D/g, "");
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
