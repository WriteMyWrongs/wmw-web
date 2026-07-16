# Contributing

Thanks for contributing!

## Getting Started

1. Fork/clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

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

Use clear commit messages.

Examples:

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
3. Link the related issue.
4. Request a review.

Example:

```text
Closes #12
```

### 5. Review Process

A PR should:

- Pass all CI checks
- Have no merge conflicts
- Receive at least 1 approval

Do not merge your own PR unless explicitly authorized.

## Code Style

### TypeScript

- Use strict typing when possible.
- Avoid `any` unless necessary.

### Formatting

Run:

```bash
npm run lint
npm run format
```

before opening a PR.

### Naming

Components:

```text
UserCard.tsx
LoginForm.tsx
```

Functions:

```ts
getUserById()
createPost()
```

Variables:

```ts
const currentUser
const postCount
```

## Project Structure

Example:

```text
src/
├── components/
├── pages/
├── lib/
├── hooks/
├── types/
└── styles/
```

Place files in the appropriate directory.

## Reporting Bugs

Include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Screenshots if relevant

## Questions

If you're unsure about an implementation, ask in the team Discord before spending significant time on it.
