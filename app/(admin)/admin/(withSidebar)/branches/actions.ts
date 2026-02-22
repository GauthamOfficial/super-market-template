"use server";

import {
  createBranch,
  updateBranch,
  deleteBranch,
} from "@/lib/dal";
import { isOk } from "@/lib/dal";
import { revalidatePath } from "next/cache";
import type { BranchInsert } from "@/types/db";

export type BranchActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function createBranchAction(
  input: BranchInsert
): Promise<BranchActionResult> {
  const result = await createBranch(input);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/branches");
  revalidatePath("/select-branch");
  return { ok: true };
}

export async function updateBranchAction(
  id: string,
  input: Partial<BranchInsert>
): Promise<BranchActionResult> {
  const result = await updateBranch(id, input);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/branches");
  revalidatePath("/admin/stock");
  revalidatePath("/select-branch");
  return { ok: true };
}

export async function deleteBranchAction(id: string): Promise<BranchActionResult> {
  const result = await deleteBranch(id);
  if (!isOk(result)) return { ok: false, error: result.error };
  revalidatePath("/admin/branches");
  revalidatePath("/select-branch");
  return { ok: true };
}
