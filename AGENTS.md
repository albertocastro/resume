# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the Next.js App Router entry points (layout, global styles, the main page under `app/[[...project]]/page.tsx`, and the CMS UI at `app/admin`).
- `app/api/cms/` exposes content and upload endpoints used by the CMS.
- `components/ui/` contains shared UI primitives (shadcn-style components like `button.tsx`, `card.tsx`).
- `components/cms/` houses CMS-specific UI (markdown editor, previews).
- `lib/` is for shared utilities and data access (`lib/utils.ts`, `lib/db.ts`).
- `data/` stores site content (`data/content.json`) and notes generated from that content (`data/knowledge.md`).
- `public/` stores static assets (SVGs, icons). CMS uploads are stored in Vercel Blob.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the local dev server at `http://localhost:3000`.
- `npm run build`: create a production build.
- `npm run start`: run the production server from the build output.
- `npm run lint`: run ESLint using the Next.js core-web-vitals + TypeScript config.

## Coding Style & Naming Conventions
- TypeScript + React with Tailwind CSS. Keep changes aligned with existing formatting: 2-space indentation, double quotes, and no semicolons.
- Component names use `PascalCase` (e.g., `RumInit`), while file names are lowercase or kebab-case (e.g., `rum-init.tsx`, `layout.tsx`).
- Place reusable UI pieces in `components/ui/` and utilities in `lib/`; keep page composition in `app/`.

## Testing Guidelines
- No testing framework or coverage requirements are currently configured.
- For changes, rely on `npm run lint`, `npm run build`, and a manual check via `npm run dev`. If you add a test setup, document the runner and commands here.

## Commit & Pull Request Guidelines
- Recent commits use short, direct messages (e.g., "add modal", "Fix build"). Keep messages concise, present-tense, and single-line.
- PRs should include: a brief summary, steps to verify, and screenshots for UI changes. Link relevant issues if applicable.

## Configuration & Deployment Notes
- This is a Next.js 14 App Router project. Any environment secrets should live in `.env.local` and remain out of version control; document new env vars in the PR.
- `CMS_SECRET` (optional) protects `/admin` and the CMS API. If set, include the same secret when editing content.
- The CMS persists to Postgres (Neon) via `DATABASE_URL`/`POSTGRES_URL`. Image uploads use Vercel Blob via `BLOB_READ_WRITE_TOKEN`.
