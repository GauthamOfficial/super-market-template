"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/types/db";

export function ProductCategoryFilter({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId") ?? "";

  const handleChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("categoryId", value);
    else url.searchParams.delete("categoryId");
    router.replace(url.pathname + url.search, { scroll: false });
  };

  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">Category</Label>
      <Select value={categoryId || "all"} onValueChange={(v) => handleChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
