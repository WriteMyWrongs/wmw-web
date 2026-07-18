import { NextResponse, type NextRequest } from "next/server";

import { isProtectedPath, safeNext } from "@/lib/auth/redirect";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * Next.js 16 renamed `middleware` to `proxy` (Node runtime, no edge). This
 * runs on every matched request to (1) refresh the Supabase session cookie
 * and (2) redirect unauthenticated visitors away from protected areas.
 *
 * This is a coarse UX gate, not the security boundary — Row Level Security in
 * the database is the real enforcement (see docs/auth-flow.md).
 */
export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  if (isProtectedPath(pathname) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", safeNext(pathname + search) ?? pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Run on everything except static assets and image files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
