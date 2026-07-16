# Contributing

Thanks for contributing to WriteMyWrongs!

## Tech Stack

**Frontend**

- [Next.js 16](https://nextjs.org/) (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- [shadcn/ui](https://ui.shadcn.com/) (Base UI)
- [Tiptap](https://tiptap.dev/) — rich text editor
- [Framer Motion](https://www.framer.com/motion/) — animation

**Backend**

- Next.js Server Actions + Route Handlers
- PostgreSQL via [Supabase](https://supabase.com/) (+ Realtime, Full-Text Search)

**Infrastructure**

- [Vercel](https://vercel.com/) (hosting) + Supabase (DB, Auth, Storage)

**Auth:** Supabase Auth · **Analytics:** [PostHog](https://posthog.com/) · **Email:** [Resend](https://resend.com/) · **Optional AI:** [OpenRouter](https://openrouter.ai/)

## Getting Started

**Prerequisites:** Node.js 20.9+ and npm.

1. Fork/clone the repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy the environment template and fill in what you have. The app boots
   without real credentials — features that need a service will throw a clear
   error only when used.

   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Workflow

### 1. Create an Issue

Before starting work, make sure there is a GitHub Issue describing the task.

### 2. Create a Branch

Branch from `main`.

Naming conventions:

- feature/auth
- feature/dashboard
- fix/login-bug
- docs/setup-guide

Example:

```bash
git checkout main
git pull
git checkout -b feature/auth
```

### 3. Commit Changes

Use clear, conventional commit messages.

```text
feat: add login page
fix: resolve navbar overflow
docs: update setup instructions
refactor: simplify auth middleware
```

### 4. Open a Pull Request

When your work is ready:

1. Push your branch.
2. Open a Pull Request.
3. Link the related issue (e.g. `Closes #12`).
4. Request a review.

### 5. Review Process

A PR should:

- Pass all CI checks
- Have no merge conflicts
- Receive at least 1 approval

Do not merge your own PR unless explicitly authorized.

## Code Style

Run these before opening a PR (CI enforces them):

```bash
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm run format       # Prettier (write)
```

### TypeScript

- Use strict typing. Avoid `any` unless necessary.

### Naming

- Components: `UserCard.tsx`, `LoginForm.tsx`
- Functions: `getUserById()`, `createPost()`
- Variables: `currentUser`, `postCount`

### Next.js 16 notes

This project runs Next.js 16, which has breaking changes vs. older versions:

- `params` and `searchParams` are **Promises** — `await` them in pages/layouts.
- Request-time middleware lives in `proxy.ts` (not `middleware.ts`).
- Turbopack is the default bundler for `dev` and `build`.

## Project Structure

```text
src/
├── app/              # App Router routes, layouts, route handlers
├── components/
│   ├── ui/           # shadcn/ui primitives
│   └── site/         # Marketing / shared site components
├── lib/              # Clients & helpers (supabase, env, analytics, resend)
├── hooks/            # React hooks
└── types/            # Shared domain types
```

Place files in the appropriate directory.

## Reporting Bugs

Include: expected behavior, actual behavior, steps to reproduce, and
screenshots if relevant.

## Questions

If you're unsure about an implementation, ask in the team Discord before
spending significant time on it.
