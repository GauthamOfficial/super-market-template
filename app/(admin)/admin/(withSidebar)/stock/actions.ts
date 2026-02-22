"use server";

import { setInventory, getStockForBranch } from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import type { StockRow } from "@/lib/dal";

export type SaveStockResult =
  | { ok: true }
  | { ok: false; error: string };

export type FetchStockResult =
  | { ok: true; rows: StockRow[] }
  | { ok: false; error: string };

export async function fetchStockAction(
  branchId: string
): Promise<FetchStockResult> {
  const result = await getStockForBranch(branchId);
  if (isOk(result)) return { ok: true, rows: result.data };
  return { ok: false, error: result.error };
}

/** Save multiple inventory updates for a branch. Runs in parallel. */
export async function saveStockAction(
  branchId: string,
  updates: { variantId: string; quantity: number }[]
): Promise<SaveStockResult> {
  if (updates.length === 0) return { ok: true };

  const results = await Promise.all(
    updates.map(({ variantId, quantity }) =>
      setInventory(branchId, variantId, quantity)
    )
  );

  const failed = results.find((r) => !isOk(r));
  if (failed && !isOk(failed)) {
    return { ok: false, error: failed.error };
  }

  revalidatePath("/admin/stock");
  return { ok: true };
}
