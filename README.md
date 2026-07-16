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

## Scripts

| Script              | Description                |
| ------------------- | ------------------------- |
| `npm run dev`       | Start the dev server      |
| `npm run build`     | Production build          |
| `npm run start`     | Serve the production build |
| `npm run lint`      | ESLint                    |
| `npm run typecheck` | Type-check with `tsc`     |
| `npm run format`    | Format with Prettier      |

## Contributing

See [CONTRIBUTING.MD](./CONTRIBUTING.MD) for workflow, branch naming, and code
style. Every change should trace back to a GitHub Issue.
