"use server";

import { updateOrderStatus as dalUpdateOrderStatus } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/types/db";

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus
) {
  const result = await dalUpdateOrderStatus(orderId, status);
  if (result.ok) {
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { ok: true as const };
  }
  return { ok: false as const, error: result.error };
}
