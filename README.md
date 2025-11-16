
# Family Recipes

Family Recipes is a Next.js 16 application for browsing, searching, and contributing to a shared cookbook powered by Supabase. The focus is on polished UI patterns, accessibility, and a smooth user experience.

## Highlights

- **Recipe gallery with theming:** Responsive hero section, rich cards, and a dark/light toggle provide an inviting browsing experience across devices.
- **Instant search:** The command-style search bar queries Supabase in real time with debounced input, keyboard navigation, and helpful status messaging.
- **Filterable sidebar:** Authors, tags, and ingredients can be combined via a floating sidebar whose state is synced to the URL for shareable filtered views.
- **Authenticated contributions:** Supabase Auth gates the “Add Recipe” page, which ships with image uploads, slug generation, and accessible skip links so contributors can publish quickly.
- **Personal favorites:** Signed-in users can toggle favorites directly from recipe cards; state is persisted in Supabase and reflected immediately via React Query cache updates.

## Tech Stack

- **Framework:** Next.js App Router (v16) with React 19 and TypeScript 5
- **Styling:** Tailwind CSS v4, shadcn/ui primitives
- **Data & Auth:** Supabase (Auth, Postgres, Storage) with @supabase/ssr helpers
- **Client State:** TanStack Query, custom hooks, and context providers
- **Animations & UX:** Framer Motion, cmdk-style command palette, lucide icons

## Prerequisites

- Node.js 18.18+ or 20+
- bun (or another Node-compatible package manager)
- A Supabase project with the schema from `supabase` already applied

## Getting Started

1. **Clone the repository**

  ```bash
  git clone https://github.com/jccdev45/family-recipes.git
  cd family-recipes
  ```

1. **Install dependencies**

  ```bash
  bun install
  ```

1. **Configure environment variables** – create `.env.local` and provide at least:

  ```bash
  NEXT_PUBLIC_SUPABASE_URL=your-project-url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  NEXT_PUBLIC_SITE_URL=http://localhost:3000 # optional, used for share links
  ```

1. **Run the development server**

  ```bash
  bun run dev
  ```

1. Visit <http://localhost:3000> and sign in to unlock contributor-only flows such as adding recipes or managing favorites.

## Useful Scripts

| Script              | Description                                              |
| ------------------- | -------------------------------------------------------- |
| `bun run dev`       | Starts the Next.js dev server with hot reload.           |
| `bun run build`     | Creates an optimized production build.                   |
| `bun run start`     | Runs the production build locally.                       |
| `bun run typecheck` | Uses `bunx tsc` to run TypeScript checks (Bun required). |

## Project Structure (excerpt)

```text
app/                # Next.js App Router routes and layouts
components/         # Reusable UI components (navigation, forms, etc.)
hooks/              # Custom hooks, including Supabase data hooks
lib/                # Utilities, constants, and shared types
queries/            # Supabase query helpers for recipes, comments, users
supabase/           # Client/server helpers plus generated types
```

## Contributing

Contributions are welcome! Please open an issue or pull request with a clear description of the change. A dedicated `CONTRIBUTING.md` will land once the workflow stabilizes.
