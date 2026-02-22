"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { setSelectedBranchId } from "@/lib/branch-cookie";

export async function selectBranch(branchId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!branchId?.trim()) return { ok: false, error: "Branch ID required" };
  const cookieStore = await cookies();
  setSelectedBranchId(cookieStore, branchId.trim());
  return { ok: true };
}

export async function selectBranchAndRedirect(branchId: string): Promise<never> {
  const result = await selectBranch(branchId);
  if (!result.ok) redirect("/select-branch");
  redirect("/home");
}
