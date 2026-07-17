/**
 * Where a user lands after authenticating. Becomes "/dashboard" once the
 * dashboard ships (issue #25); "/" is the honest placeholder until then.
 */
export const POST_AUTH_REDIRECT = "/";

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
