"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Branch } from "@/types/db";
import type { OrderStatus } from "@/types/db";

export function OrderFiltersForm({
  statusOptions,
  branches,
  currentStatus,
  currentBranchId,
}: {
  statusOptions: { value: OrderStatus; label: string }[];
  branches: Branch[];
  currentStatus: string;
  currentBranchId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setFilters = useCallback(
    (status: string, branchId: string) => {
      const next = new URLSearchParams(searchParams);
      if (status) next.set("status", status);
      else next.delete("status");
      if (branchId) next.set("branchId", branchId);
      else next.delete("branchId");
      router.push(`/admin/orders?${next.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <form
      className="flex flex-wrap items-center gap-3"
      onSubmit={(e) => e.preventDefault()}
    >
      <Select
        value={currentStatus || "all"}
        onValueChange={(v) => setFilters(v === "all" ? "" : v, currentBranchId)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          {statusOptions.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={currentBranchId || "all"}
        onValueChange={(v) => setFilters(currentStatus, v === "all" ? "" : v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Branch" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All branches</SelectItem>
          {branches.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {(currentStatus || currentBranchId) && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setFilters("", "")}
        >
          Clear
        </Button>
      )}
    </form>
  );
}
