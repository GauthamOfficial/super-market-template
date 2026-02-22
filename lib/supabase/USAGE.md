# Supabase client utilities – usage

Next.js App Router helpers using `@supabase/ssr`: server (cookies), client (browser), and middleware (session refresh + optional admin gating).

---

## 1. Server: `createClient()` from `@/lib/supabase/server`

Use in **Server Components** and **Server Actions**. The client reads/writes auth cookies so the session stays in sync with the client.

### Server Component – fetch data

```tsx
// app/products/page.tsx
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) return <p>Failed to load products</p>;
  return (
    <ul>
      {(data as Product[])?.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Server Action – insert/update and revalidate

```tsx
// app/actions/products.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ProductInsert } from "@/types";

export async function createProduct(payload: ProductInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select()
    .single();

  if (error) return { error: error.message };
  revalidatePath("/products");
  return { data };
}
```

### Server – get current user (optional)

```tsx
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (user) {
  // use user.id, user.email, etc.
}
```

---

## 2. Client: `createClient()` from `@/lib/supabase/client`

Use in **Client Components** only. Import from `@/lib/supabase/client` (the file is marked `"use client"`). One client is created per session (singleton).

### Client Component – query and realtime

```tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*");
      setProducts((data ?? []) as Product[]);
    };
    fetchProducts();

    const { data: { subscription } } = supabase
      .from("products")
      .on("INSERT", (payload) =>
        setProducts((p) => [...p, payload.new as Product])
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

### Client – sign in / sign out

```tsx
const supabase = createClient();

// Sign in
await supabase.auth.signInWithPassword({ email, password });

// Sign in with OAuth (e.g. Google)
await supabase.auth.signInWithOAuth({ provider: "google" });

// Sign out
await supabase.auth.signOut();
```

---

## 3. Middleware: `updateSession()` from `@/lib/supabase/middleware`

Call from the **root** `middleware.ts`. It:

- Refreshes the Supabase auth session (so cookies stay valid).
- Redirects unauthenticated users from `/admin/*` to `/login?next=/admin/...`.

### Root middleware

```ts
// middleware.ts (project root)
import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

To change which routes are protected or the login path, edit `ADMIN_PATH_PREFIX` and `LOGIN_PATH` in `lib/supabase/middleware.ts`.

---

## 4. Checklist

| Context              | Import from                      |
|----------------------|----------------------------------|
| Server Component     | `@/lib/supabase/server`          |
| Server Action       | `@/lib/supabase/server`         |
| Client Component     | `@/lib/supabase/client`         |
| Root middleware      | Use `updateSession` from `@/lib/supabase/middleware` |

- Use **server** client for all server-side DB/auth; use **client** client only in `"use client"` code.
- Do not use the server client in middleware; middleware uses its own `createServerClient` with request/response cookies.
