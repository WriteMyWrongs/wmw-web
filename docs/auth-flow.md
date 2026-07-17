# Authentication Flow Design

Closes [#5](https://github.com/WriteMyWrongs/wmw-web/issues/5). This is the
design that issues #6–#10 implement against. It settles three things: the
auth **method**, the **session mechanism** under Next.js 16, and the
**routes** and their guards.

## Method: email + password, with magic-link sign-in

We use Supabase Auth with:

- **Email + password** as the primary credential (issue #6/#7).
- **Magic link** (one-time email link) offered as a passwordless alternative
  on the same login form — Supabase gives it to us for free and it's the
  gentlest path for a young audience that forgets passwords.
- **No social OAuth for v1.** Google/GitHub buttons imply accounts our target
  users (young writers) often don't have or shouldn't be nudged toward. Easy
  to add later; the flow below doesn't preclude it.

Email confirmation is **on in production** (users must click a link before
their account is active) and **off locally** (`enable_confirmations = false`
in `supabase/config.toml`) so development doesn't require a mail round-trip.

### Why not magic-link only

Passwordless is tempting, but a password gives returning users an instant
login with no inbox detour, and it's the mental model they already have.
Offering both on one form costs us nothing and covers both preferences.

## Session mechanism (Next.js 16)

Supabase issues a JWT access token (~1 hour) plus a refresh token, stored in
cookies by the `@supabase/ssr` clients we already have in
[`src/lib/supabase/`](../src/lib/supabase/). Two responsibilities:

1. **Reading the session** — Server Components and Server Actions call the
   server client ([`server.ts`](../src/lib/supabase/server.ts)); Client
   Components call the browser client ([`client.ts`](../src/lib/supabase/client.ts)).
2. **Refreshing the session** — the access token expires; something must
   refresh it and write the new cookies on every request. That's the job of
   **`proxy.ts`**.

> **Next.js 16 note:** the `middleware` file convention is **deprecated and
> renamed to `proxy`** (confirmed in `node_modules/next/dist/docs/.../proxy.md`).
> The file lives at `src/proxy.ts`, exports a function named `proxy`, and runs
> on the Node.js runtime (the `edge` runtime is not supported in `proxy`).
> Every Supabase "Next.js middleware" snippet from older docs must be adapted:
> rename the file and the exported function.

### `src/proxy.ts` responsibilities

On each matched request, `proxy.ts`:

1. Creates a server client bound to the request/response cookies.
2. Calls `supabase.auth.getUser()` — this refreshes an expired token and
   triggers `setAll`, writing refreshed cookies onto the response.
3. Passes the (possibly refreshed) response through.

It does **not** make authorization decisions beyond a coarse redirect for
unauthenticated users hitting protected paths (see below). Fine-grained
"can this user see this row" is RLS's job, already enforced in the database.

```
matcher: all paths except _next/static, _next/image, favicon, and public assets
```

> **Security note — never trust `getSession()` in server code.** In
> `proxy.ts`, Server Components, and Server Actions, always call
> `supabase.auth.getUser()`, which re-validates the JWT with the Supabase Auth
> server. `getSession()` reads the cookie without verifying its signature, so a
> forged or tampered cookie could pass. `getUser()` is the only trustworthy
> gate on the server.

## Routes

Auth-related pages live under a route group so they can share a centered,
chrome-free layout without affecting the URL:

```
src/app/
  (auth)/
    layout.tsx          # centered card layout, no site navbar
    login/page.tsx      # email+password + "email me a link"       (#7)
    signup/page.tsx     # email, password, username                (#6)
    forgot-password/page.tsx   # request a reset email             (#10)
    reset-password/page.tsx    # set a new password (post-callback)(#10)
  auth/
    callback/route.ts   # Route Handler: exchanges ?code for a session
    confirm/route.ts    # verifies email OTP / magic-link tokens
  (app)/                # authenticated area (dashboard, editor, etc.) — #18
```

The navbar already links to `/login` and `/signup`, so those paths are fixed.

### The callback handler

Email confirmation, magic links, and password-reset links all send the user
to a URL on our domain carrying a `code` (PKCE). `src/app/auth/callback/route.ts`
calls `supabase.auth.exchangeCodeForSession(code)`, which sets the session
cookies, then redirects:

- to the `next` param if it's a safe **relative** path (open-redirect guard:
  reject anything starting with `//` or containing a scheme),
- otherwise to the dashboard.

### Registration (#6) and the profile row

On signup we pass `username` (and optional `display_name`) in the auth
metadata. The `handle_new_user` trigger from the schema migration reads that
metadata and creates the `profiles` row automatically — the app never inserts
profiles directly. Username availability is checked with a lightweight query
before submit, but the unique index on `lower(username)` is the real
guarantee; the form surfaces the constraint error if two signups race.

## Protected routes (#9)

Two layers, defence in depth:

1. **Coarse gate in `proxy.ts`** — if `getUser()` returns no user and the path
   is in the authenticated area (the `(app)` group: `/dashboard`, `/write`,
   `/settings`, …), redirect to `/login?next=<path>`. This is a UX
   convenience (send guests to login), not the security boundary.
2. **Real enforcement in the data layer** — every table has RLS, so even if a
   guard were missed, a signed-out request simply sees no private rows and
   cannot write. Server Components that render user-specific data still call
   `getUser()` and treat "no user" as a redirect.

Signed-in users hitting `/login` or `/signup` are bounced to the dashboard.

## Session management specifics (#8)

- **Logout** is a Server Action calling `supabase.auth.signOut()`, which clears
  the cookies, followed by a redirect to `/`.
- **Token refresh** is automatic via `proxy.ts` on every request — no
  client-side timer needed for SSR.
- **Client-side reactivity** — components that need to react to login/logout
  without a full navigation subscribe to `supabase.auth.onAuthStateChange`.

## Password reset (#10)

1. `/forgot-password` collects an email → `resetPasswordForEmail(email, { redirectTo })`.
2. The email link lands on `auth/callback` → establishes a temporary session →
   redirects to `/reset-password`.
3. `/reset-password` collects a new password → `updateUser({ password })` →
   redirect to the dashboard.

If we ship magic-link login, this is lower priority (a user who can receive a
login link can always get in), but the flow is cheap and expected.

## Validation & errors (ties into #15/#16)

- All form inputs validated with **Zod** (already a dependency) — email
  format, password ≥ 8 chars, username `^[a-z0-9_]{3,24}$` to match the DB
  check constraint.
- Supabase auth errors are mapped to friendly copy ("That email is already
  registered", "Incorrect email or password") rather than raw messages, and
  surfaced via the existing `sonner` toaster.
- Auth server actions never leak whether an email exists on failed login
  (generic "incorrect email or password").

## What #6–#10 each build

| Issue | Deliverable |
| --- | --- |
| #6 | `signup/page.tsx` + signup action; username metadata → trigger creates profile |
| #7 | `login/page.tsx` + login and magic-link actions; logout action |
| #8 | `src/proxy.ts` token refresh; `onAuthStateChange` wiring; logout |
| #9 | `proxy.ts` redirect guard for the `(app)` group; server-component `getUser` checks |
| #10 | `forgot-password` + `reset-password` pages and actions |

## Deferred

- Social OAuth (Google/GitHub) — post-v1.
- MFA / TOTP — not warranted for the audience yet.
- Rate limiting on auth endpoints — handled by Supabase Auth defaults for now;
  revisit before public launch.
