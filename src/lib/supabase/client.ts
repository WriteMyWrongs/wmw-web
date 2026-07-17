import { createBrowserClient } from "@supabase/ssr";

import { publicEnv, requireValue } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Supabase client for use in Client Components (browser).
 */
export function createClient() {
  return createBrowserClient<Database>(
    requireValue(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireValue(
      publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  );
}
