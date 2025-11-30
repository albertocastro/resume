## Resume Website

Personal portfolio for showcasing engineering experience, selected projects, and product-thinking demos. The site highlights employment history, interactive UI behaviors, and theming controls that mirror the way I approach front-end architecture.

## Tech Stack

- [Next.js 14](https://nextjs.org) with the App Router
- [React 18](https://react.dev) client components for interactive demos
- [Tailwind CSS](https://tailwindcss.com) plus shadcn/ui primitives
- [TypeScript](https://www.typescriptlang.org/) for type safety end to end

## Local Development

Install dependencies and start a local dev server:

```bash
npm install
npm run dev
```

The site will be available at [http://localhost:3000](http://localhost:3000). Edit files in `app/` to iterate on sections, projects, or metadata.

## Deployment

Deploy to any Next.js-compatible hosting provider (Vercel, Netlify, etc.). For Vercel, push to the default branch and set up the project in the Vercel dashboard—no extra configuration is required.

## Customization

- Update `app/page.tsx` to change experience timelines, featured work, or live demos.
- Modify `app/layout.tsx` for SEO metadata, analytics, or additional providers.
- Tailor visuals via `app/globals.css` and the shadcn/ui component tokens in `components/ui`.
