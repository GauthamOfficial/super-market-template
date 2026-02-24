"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const DEBOUNCE_MS = 300;

export function SearchInput() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);

  useEffect(() => {
    setValue(q);
  }, [q]);

  const updateUrl = useCallback(
    (term: string) => {
      const path = pathname ?? "/search";
      const url = term.trim()
        ? `${path}?q=${encodeURIComponent(term.trim())}`
        : path;
      router.replace(url);
    },
    [router, pathname]
  );

  useEffect(() => {
    if (value === q) return;
    const t = setTimeout(() => updateUrl(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, q, updateUrl]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
        aria-label="Search"
      />
    </div>
  );
}
