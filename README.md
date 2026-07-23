# WriteMyWrongs

The social writing platform where young people showcase their writing, trade
honest feedback, and get a little better with every draft.

## Tech Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui ·
Tiptap · Framer Motion · Supabase (Postgres, Auth, Realtime, Storage) · PostHog
· Resend · OpenRouter (optional AI). Hosted on Vercel.

## Getting Started

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env.local   # fill in what you have
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Postgres via Supabase. The schema lives in [`supabase/migrations/`](./supabase/migrations/)
(design notes in [`docs/database-schema.md`](./docs/database-schema.md)), and
[`src/types/database.ts`](./src/types/database.ts) mirrors it for typed queries.

For local development, install the
[Supabase CLI](https://supabase.com/docs/guides/local-development) and Docker,
then:

```bash
npm run db:start   # start the local Supabase stack (applies migrations)
```

Copy the printed API URL and anon key into `.env.local` as
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. To point at a
hosted project instead, use the values from Project Settings → API.

After changing a migration, run `npm run db:reset` to rebuild the local
database and `npm run db:types` to regenerate the TypeScript types.

## Scripts

| Script              | Description                                     |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the dev server                            |
| `npm run build`     | Production build                                |
| `npm run start`     | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | Type-check with `tsc`                           |
| `npm run format`    | Format with Prettier                            |
| `npm run test`      | Run unit tests (Vitest)                         |
| `npm run test:watch`| Run tests in watch mode                         |
| `npm run db:start`  | Run Supabase locally (Docker)                   |
| `npm run db:stop`   | Stop the local Supabase stack                   |
| `npm run db:reset`  | Recreate the local DB from migrations           |
| `npm run db:push`   | Apply migrations to the linked hosted project   |
| `npm run db:types`  | Regenerate `src/types/database.ts` from the DB  |

## Contributing

See [CONTRIBUTING.MD](./CONTRIBUTING.MD) for workflow, branch naming, and code
style. Every change should trace back to a GitHub Issue.
