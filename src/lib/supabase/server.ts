import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { publicEnv, requireValue } from "@/lib/env";

/**
 * Supabase client for use in Server Components, Server Actions, and Route
 * Handlers. `cookies()` is async in the App Router, so this must be awaited.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireValue(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireValue(
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` call can fail when invoked from a Server Component.
            // This is safe to ignore when session refresh happens in proxy.ts.
          }
        },
      },
    },
  );
}
