import { NextResponse, type NextRequest } from "next/server";

import { POST_AUTH_REDIRECT, safeNext } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";

/**
 * PKCE callback. Email confirmation, magic links, and password-reset links
 * all land here with a `code`; we exchange it for a session (which sets the
 * auth cookies) and redirect onward. See docs/auth-flow.md.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next")) ?? POST_AUTH_REDIRECT;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=callback`);
}
