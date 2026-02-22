"use server";

import { getDeliveryAreas } from "@/lib/dal";
import {
  createDeliveryArea,
  updateDeliveryArea,
  deleteDeliveryArea,
} from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import type { DeliveryAreaInsert } from "@/types/db";

export type DeliveryActionResult =
  | { ok: true }
  | { ok: false; error: string };

/** All delivery areas (no enabled filter) for admin. */
export async function getDeliveryAreasForAdmin() {
  return getDeliveryAreas();
}

export async function createDeliveryAreaAction(
  input: DeliveryAreaInsert
): Promise<DeliveryActionResult> {
  const result = await createDeliveryArea(input);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function updateDeliveryAreaAction(
  id: string,
  input: Partial<DeliveryAreaInsert>
): Promise<DeliveryActionResult> {
  const result = await updateDeliveryArea(id, input);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function deleteDeliveryAreaAction(
  id: string
): Promise<DeliveryActionResult> {
  const result = await deleteDeliveryArea(id);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
  return { ok: true };
}
