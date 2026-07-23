# heyalok

Personal portfolio and blog — built with Next.js, deployed on Cloudflare Workers via OpenNext.

## Tech Stack

- **Framework:** Next.js + React
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State:** Zustand, TanStack React Query
- **Infra:** Cloudflare Workers, R2, Upstash Redis
- **Integrations:** GitHub, WakaTime, Spotify, Medium RSS

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `npm run dev`        | Start dev server                            |
| `npm run build`      | Build for Cloudflare (via OpenNext)         |
| `npm run deploy`     | Build and deploy to Cloudflare Workers      |
| `npm run preview`    | Build and preview Cloudflare Worker locally |
| `npm run lint`       | Run ESLint                                  |
| `npm run typecheck`  | Run TypeScript check                        |
| `npm run format`     | Format with Prettier                        |
| `npm run scrape`     | Scrape Medium RSS → blog MDX files          |
| `npm run cf-typegen` | Generate Cloudflare env types               |

## Adding shadcn/ui Components

```bash
npx shadcn@latest add button
```

Import from `@/components/ui/`.

## Deployment

Deploys to Cloudflare Workers via OpenNext:

```bash
npm run deploy
```
