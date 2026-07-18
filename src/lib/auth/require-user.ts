import "server-only";

import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/server";

/**
 * Enforce authentication in a Server Component / Server Action. Returns the
 * validated user, or redirects to /login when there is none. The proxy guard
 * normally catches unauthenticated requests first; this is the defence-in-
 * depth backstop that keeps a page from ever rendering without a user.
 */
export async function requireUser(): Promise<User> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}
