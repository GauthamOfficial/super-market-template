"use client";

import { createBrowserClient } from "@supabase/ssr";

/** Cached browser client so we only create one per session. */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Create a Supabase client for use in Client Components.
 * Returns a singleton so auth state and subscriptions are shared.
 *
 * @example Client Component – fetch and subscribe
 * ```tsx
 * "use client";
 * import { useEffect, useState } from "react";
 * import { createClient } from "@/lib/supabase/client";
 *
 * export function ProductList() {
 *   const [products, setProducts] = useState([]);
 *   const supabase = createClient();
 *
 *   useEffect(() => {
 *     const { data: { subscription } } = supabase
 *       .from("products")
 *       .on("INSERT", (payload) => setProducts((p) => [...p, payload.new]))
 *       .subscribe();
 *     return () => subscription.unsubscribe();
 *   }, [supabase]);
 *   return <ul>{products.map((p) => <li key={p.id}>{p.name}</li>)}</ul>;
 * }
 * ```
 *
 * @example Client Component – sign in
 * ```tsx
 * const supabase = createClient();
 * await supabase.auth.signInWithPassword({ email, password });
 * ```
 */
export function createClient() {
  if (browserClient) return browserClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
}
