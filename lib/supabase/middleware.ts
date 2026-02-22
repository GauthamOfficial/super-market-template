import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Path prefix for admin routes that require auth. */
const ADMIN_PATH_PREFIX = "/admin";

/** Admin login path; this path is allowed without auth. */
const ADMIN_LOGIN_PATH = "/admin/login";

/** Where to send unauthenticated users when they hit an admin route. */
const LOGIN_PATH = ADMIN_LOGIN_PATH;

/**
 * Refresh the Supabase auth session and optionally gate admin routes.
 * Call this from the root middleware.
 *
 * - Refreshes the session so cookies stay valid.
 * - If the request is for /admin/* (except /admin/login) and the user is not signed in, redirects to LOGIN_PATH.
 *
 * @example Root middleware (middleware.ts at project root)
 * ```ts
 * import { type NextRequest } from "next/server";
 * import { updateSession } from "@/lib/supabase/middleware";
 *
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request);
 * }
 *
 * export const config = {
 *   matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
 * };
 * ```
 */
export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options?: object }[]) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAdminRoute = pathname.startsWith(ADMIN_PATH_PREFIX);
  const isAdminLogin = pathname === ADMIN_LOGIN_PATH;

  if (isAdminRoute && !isAdminLogin && !user) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}
