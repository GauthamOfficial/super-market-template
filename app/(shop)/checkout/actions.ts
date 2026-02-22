"use server";

import { createClient } from "@/lib/supabase/server";
import type { CartItem } from "@/features/cart/cartUtils";

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: "delivery" | "pickup";
  address?: string;
  deliveryAreaId?: string;
  paymentMethod: "cod" | "bank_transfer";
}

export type PlaceOrderResult =
  | { ok: true; orderId: string }
  | { ok: false; error: string };

export async function placeOrder(
  cartItems: CartItem[],
  form: CheckoutFormData
): Promise<PlaceOrderResult> {
  if (cartItems.length === 0) {
    return { ok: false, error: "Cart is empty" };
  }

  const branchId = cartItems[0].branchId;
  const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const deliveryAddress =
    form.deliveryMethod === "delivery" && form.address?.trim()
      ? `Name: ${form.name.trim()}\n${form.address.trim()}`
      : form.deliveryMethod === "pickup"
        ? "Pickup"
        : null;

  const supabase = await createClient();

  const insertPayload: Record<string, unknown> = {
    branch_id: branchId,
    order_number: orderNumber,
    status: "pending",
    customer_name: form.name.trim() || null,
    customer_email: form.email.trim(),
    customer_phone: form.phone.trim() || null,
    delivery_address: deliveryAddress,
    payment_method: form.paymentMethod,
  };

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert(insertPayload)
    .select("id")
    .single();

  if (orderError || !order) {
    return { ok: false, error: orderError?.message ?? "Failed to create order" };
  }

  const orderItems = cartItems.map((item) => ({
    order_id: order.id,
    product_variant_id: item.variantId,
    quantity: item.qty,
    unit_price: item.unitPrice,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    return { ok: false, error: itemsError.message };
  }

  return { ok: true, orderId: order.id };
}
