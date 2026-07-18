import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { User } from "@supabase/supabase-js";

import { publicEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Refresh the Supabase session for a proxy (middleware) request and report
 * the current user.
 *
 * The token in the request cookies may be expired; calling `getUser()` here
 * refreshes it and writes the new cookies onto the response, so Server
 * Components downstream see a valid session. Returns the response to send
 * (carrying any refreshed cookies) and the validated user (or null).
 *
 * If Supabase isn't configured, degrade gracefully: pass the request through
 * unauthenticated rather than taking down the whole site.
 */
export async function updateSession(
  request: NextRequest,
): Promise<{ response: NextResponse; user: User | null }> {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { response, user: null };

  const supabase = createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({
          request: { headers: request.headers },
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // Must be getUser() (validates the JWT), never getSession(). See
  // docs/auth-flow.md.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
