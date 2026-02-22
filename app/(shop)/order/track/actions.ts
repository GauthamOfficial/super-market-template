"use server";

import { getOrderByOrderNumber, normalizePhone } from "@/lib/dal";
import type { OrderStatus } from "@/types/db";

export type TrackOrderResult =
  | { ok: true; order: { id: string; order_number: string; status: OrderStatus; created_at: string }; items: { quantity: number; unit_price: number; variant?: { name: string } }[] }
  | { ok: false; error: string };

export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<TrackOrderResult> {
  const trimmedOrder = orderNumber.trim();
  const trimmedPhone = phone.trim();
  if (!trimmedOrder) return { ok: false, error: "Order number is required." };
  if (!trimmedPhone) return { ok: false, error: "Phone number is required." };

  const result = await getOrderByOrderNumber(trimmedOrder);
  if (!result.ok) return { ok: false, error: result.error };

  const { order, items } = result.data;
  if (normalizePhone(order.customer_phone) !== normalizePhone(trimmedPhone)) {
    return { ok: false, error: "Order not found or phone does not match." };
  }

  return {
    ok: true,
    order: {
      id: order.id,
      order_number: order.order_number,
      status: order.status,
      created_at: order.created_at,
    },
    items: items.map((i) => ({
      quantity: i.quantity,
      unit_price: i.unit_price,
      variant: i.variant ? { name: i.variant.name } : undefined,
    })),
  };
}
