import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Create a Supabase client for use in Server Components and Server Actions.
 * Uses the request cookie store so auth state is in sync with the client.
 *
 * @example Server Component – fetch data
 * ```ts
 * import { createClient } from "@/lib/supabase/server";
 *
 * export default async function Page() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from("products").select("*");
 *   return <pre>{JSON.stringify(data, null, 2)}</pre>;
 * }
 * ```
 *
 * @example Server Action – mutate data
 * ```ts
 * "use server";
 * import { createClient } from "@/lib/supabase/server";
 *
 * export async function addProduct(formData: FormData) {
 *   const supabase = await createClient();
 *   const { error } = await supabase.from("products").insert({ ... });
 *   if (error) return { error: error.message };
 *   revalidatePath("/products");
 * }
 * ```
 */
export async function createClient() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignore in Server Components / Server Actions when response is already sent
        }
      },
    },
  });
}
