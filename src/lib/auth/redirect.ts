/** Path prefixes that require an authenticated user (guarded in proxy.ts). */
export const PROTECTED_PREFIXES = ["/dashboard", "/write", "/settings"];

/** Where a user lands after authenticating. */
export const POST_AUTH_REDIRECT = "/dashboard";

/** True when a pathname falls inside a protected area. */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Guard against open redirects. Only same-origin relative paths are allowed
 * as a post-auth `next` destination — anything absolute, protocol-relative
 * (`//evil.com`), or containing a scheme is rejected.
 */
export function safeNext(next: string | null | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith("/")) return null;
  if (next.startsWith("//") || next.startsWith("/\\")) return null;
  return next;
}
