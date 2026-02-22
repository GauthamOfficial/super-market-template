"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function HomeSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get("q") ?? "";

  return (
    <form
      className="flex w-full max-w-md gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const q = new FormData(form).get("q");
        const query = typeof q === "string" ? q.trim() : "";
        router.push(query ? `/products?q=${encodeURIComponent(query)}` : "/products");
      }}
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Search products..."
          defaultValue={defaultValue}
          className="pl-9"
          aria-label="Search products"
        />
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}
