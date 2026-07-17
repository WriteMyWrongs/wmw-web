import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { publicEnv, requireValue, serverEnv } from "@/lib/env";
import type { Database } from "@/types/database";

/**
 * Supabase client authenticated with the service-role key. Bypasses Row
 * Level Security — use only in trusted server code (admin jobs, webhooks),
 * never to serve a user request that RLS should govern.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    requireValue(
      publicEnv.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    requireValue(
      serverEnv().SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY",
    ),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
