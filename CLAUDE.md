# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

## Architecture

Single-page React + TypeScript app built with Vite. Three routes:

- `/` — Main portfolio (one long scrollable page)
- `/progress` — Private productivity dashboard (not linked in the main nav)
- `/chat` — Private, PIN-gated chat that logs work into Notion and answers planning/prioritization
  questions (not linked in the main nav)

**Main page composition** ([src/App.tsx](src/App.tsx)): `Header` → `SocialSidebar` → `EasterEgg` → `Hero` → `About` → `Projects` → `Skills` → `Contact` → `Footer`, wrapped in `ScrollProgress`.

### Key directories

- [src/sections/](src/sections/) — Full-page sections (`Hero`, `About`, `Projects`, `Skills`, `Contact`, `Progress`, `Chat`)
- [src/components/](src/components/) — Shared UI (`Header`, `Footer`, `NavLinks`, `SocialSidebar`, `ScrollProgress`, `CVModal`, `EasterEgg`, `GitHubActivity`)
- [src/components/ui/](src/components/ui/) — shadcn primitives, used by `Chat.tsx` (`Progress.tsx` deliberately doesn't use these — see below)
- [src/data/](src/data/) — Static data (`projects.ts` defines the `Project` interface and the three featured projects; `socialLinks.ts` for sidebar links)
- [src/utils/notionClient.ts](src/utils/notionClient.ts) — Fetches the raw task list from a Cloudflare Worker proxy (`notion-proxy.njugunabriian-dev.workers.dev`) that wraps the Notion API. `Progress.tsx` uses this only for its click-a-heatmap-day detail view; `notion-proxy` does not paginate past 100 rows, so don't reuse it as a source of truth for anything computed
- [src/utils/chatClient.ts](src/utils/chatClient.ts) — Talks to the `notion-chat` Cloudflare Worker (sibling project at `/home/Bri/Desktop/work/notion-chat-worker/notion-chat`, deployed as `notion-chat.njugunabriian-dev.workers.dev`): the PIN-gated chat/logging endpoints used by `Chat.tsx`, and `fetchProgressStats()` — the **canonical, paginated** stats calculation used by both `Chat.tsx`'s planning tool and `Progress.tsx`'s dashboard. See that worker's `DECISIONS.md` before adding a second implementation of any of this logic

### Theming

The app uses a custom **"Deep Slate Comfort"** dark theme defined entirely via CSS variables in [src/index.css](src/index.css). All colors are HSL values referenced through Tailwind utility classes (`bg-background`, `text-foreground`, `text-primary`, etc.). The primary accent is electric cyan (`hsl(190 90% 50%)`), secondary is muted violet, accent is deep pink.

Custom Tailwind tokens are in [tailwind.config.ts](tailwind.config.ts): gradient utilities (`bg-gradient-primary`, `bg-gradient-subtle`, `bg-gradient-glow`), and animations (`fade-in`, `fade-in-up`, `slide-in`, `glow-pulse`, `float`).

### shadcn/ui

Component library configured in [components.json](components.json). Import path alias `@/` resolves to `src/`. shadcn components live at `@/components/ui/`. Add new shadcn components with `npx shadcn@latest add <component>`.

### Progress dashboard

[src/sections/Progress.tsx](src/sections/Progress.tsx) is a self-contained analytics dashboard using inline styles (not Tailwind) and its own color tokens (`COLORS` object). It's intentionally separate from the main portfolio theme. It renders streaks, velocity trends, capacity analysis, and burnout detection — but does not compute any of it; those numbers come from `chatClient.ts`'s `fetchProgressStats()` (the `notion-chat` worker). Raw per-task data (via `notionClient.ts`) is only used for the day-detail view under the heatmap.

### Chat (logging + planning assistant)

[src/sections/Chat.tsx](src/sections/Chat.tsx) is a PIN-gated chat page, built with Tailwind/shadcn (unlike Progress, which deliberately isn't). You describe what you worked on; Claude (via the `notion-chat` worker) drafts a Notion entry that you must explicitly confirm before it's written — it never writes silently. The same chat can discuss planning/prioritization, grounded in the real stats from `fetchProgressStats()`. Full design rationale — including why writes are confirm-first, why the stats calculation isn't duplicated between this and `Progress.tsx`, and known v1 limitations — lives in `notion-chat`'s `DECISIONS.md`, not here; read that before changing how logging or stats work.

### Deployment

Deployed to [brian.cnbcode.com](https://brian.cnbcode.com) via Vercel. [vercel.json](vercel.json) rewrites all routes to `index.html` to support client-side routing.
