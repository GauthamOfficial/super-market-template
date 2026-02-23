"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductSuggestions } from "@/lib/dal";

const DEBOUNCE_MS = 250;

export function HeroProductSearch() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchSuggestions = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    const result = await getProductSuggestions(term);
    setIsLoading(false);
    if (result.ok) {
      setSuggestions(result.data);
      setIsOpen(result.data.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, fetchSuggestions]);

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl sm:max-w-xl">
      <form
        action="/search"
        method="get"
        className="hero-search-glass flex h-12 w-full items-stretch overflow-hidden sm:h-14"
      >
        <label htmlFor="hero-product-search" className="sr-only">
          Search products
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-3 px-4 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-white/80" aria-hidden />
          <input
            id="hero-product-search"
            type="search"
            name="q"
            placeholder="Search products..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => value.trim() && suggestions.length > 0 && setIsOpen(true)}
            onBlur={handleBlur}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none sm:text-base"
            aria-label="Search products"
            aria-expanded={isOpen}
            aria-autocomplete="list"
            aria-controls="hero-search-suggestions"
          />
        </div>
        <Button
          type="submit"
          className="h-full min-w-0 shrink-0 rounded-none rounded-r-full border-0 bg-primary px-5 font-semibold text-primary-foreground shadow-none hover:bg-primary/90 sm:px-6"
        >
          Search
        </Button>
      </form>

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <ul
          id="hero-search-suggestions"
          role="listbox"
          className="absolute top-full left-0 right-0 z-[100] mt-1 max-h-72 overflow-auto rounded-xl border border-white/20 bg-white/95 shadow-xl backdrop-blur-md"
        >
          {isLoading ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">Searching…</li>
          ) : (
            suggestions.map((product) => (
              <li key={product.id} role="option">
                <Link
                  href={`/product/${product.slug}`}
                  className="block px-4 py-3 text-sm text-foreground hover:bg-primary/10 hover:text-primary"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {product.name}
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
