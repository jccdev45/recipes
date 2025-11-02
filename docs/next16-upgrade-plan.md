---
post_title: "Recipes App Modernization Plan"
author1: "jccdev"
post_slug: "recipes-next16-upgrade-plan"
microsoft_alias: "jccdev"
featured_image: ""
categories:
  - "engineering"
tags:
  - "Next.js"
  - "Tailwind CSS"
  - "UI/UX"
  - "TanStack"
  - "shadcn"
summary: "Step-by-step modernization plan covering the Next.js 16 upgrade, Tailwind CSS v4 migration, shadcn/ui refresh, TanStack Form adoption, and React Query performance improvements."
post_date: "2025-11-02"
---

<!-- markdownlint-disable-next-line MD041 -->
## Family Recipes Upgrade Guide

## Executive Summary

- Modernize the Recipes app by sequentially refreshing Tailwind CSS, shadcn/ui primitives, and the data layer now that the Next.js 16 upgrade is complete.
- Adopt @tanstack/react-form and refreshed shadcn Field primitives to replace react-hook-form and custom wrappers.
- Refresh the visual system via shadcn registry components while aligning Tailwind 4 tokens with the design direction.
- Tighten TanStack Query usage for cache hygiene, stale-time defaults, and Suspense alignment post-upgrade.
- Bake validation, telemetry, and Supabase sessions into the new Next.js 16 proxy pipeline.
- Execute repo-wide dependency refreshes with `bun update --interactive`, prioritizing major frameworks first and sweeping remaining packages after each phase gate.
- Re-evaluate Supabase browser client usage post-upgrade to ensure consistent initialization, session handling, and query ergonomics without touching backend helpers.

## Changelog

- November 2, 2025 – Verified Node 22.14 and Bun toolchain, confirmed clean git state, and documented current package manager usage.
- November 2, 2025 – Ran `npx @next/codemod@canary upgrade latest`; project already on Next.js 16.0.1 and React 19.2.0 with no further codemod changes required.
- November 2, 2025 – Replaced `ThemeProviderProps` import with `React.ComponentProps<typeof NextThemesProvider>` to eliminate reliance on `next-themes/dist/types`.
- November 2, 2025 – Renamed `middleware.ts` to `proxy.ts` and updated the exported handler to `proxy`, keeping Supabase session management intact.
- November 2, 2025 – Removed the deprecated `--turbopack` flag from the `dev` script and accepted Next.js tsconfig updates (`jsx: react-jsx`, `.next/dev/types`).
- November 2, 2025 – Confirmed `bun run build` succeeds and exercised `/`, `/recipes`, and `/recipes/mojito` via browser automation without client-side errors (note: existing image aspect-ratio warning persists).
- November 2, 2025 – Completed the Tailwind CSS v4 migration (ran the upgrade script, converted the config to TypeScript, updated PostCSS, and stabilized global styles).
- November 2, 2025 – Ran `bunx shadcn add -a --overwrite` to sync the UI primitives, adding Field, Item, InputGroup, Sidebar scaffolding, and the `use-mobile` hook baseline.

## Current State Assessment

- Next.js 16.0.1 with Turbopack default tooling, `proxy.ts` entrypoint for Supabase sessions, and codemod-aligned tsconfig.
- Tailwind CSS 3.4 with classic @tailwind directives, PostCSS autoprefixer plugin, and custom config requiring duplication cleanup.
- Forms rely on react-hook-form and bespoke `components/ui/form.tsx`, while Zod schemas already exist for migration.
- TanStack Query v5.56.2 lacks suspense-first hooks and standardized query defaults.
- shadcn/ui catalog predates Field and FieldGroup primitives, leading to inconsistent form markup.

## Phase 1 – Next.js 16 Upgrade (Status)

### Completed Work

- Verified tooling prerequisites (Node 22.14.0, Bun, clean git) and recorded the environment baseline.
- Confirmed application already on Next.js 16.0.1 / React 19.2.0; codemod reported no additional edits.
- Dropped the deprecated `--turbopack` flag from scripts and accepted Next.js tsconfig guidance.
- Migrated from `middleware.ts` to `proxy.ts` with the required handler rename.
- Fixed `ThemeProviderProps` typing to rely on published `next-themes` exports.
- Validated production build and performed browser-based smoke tests on key routes.

### Remaining Tasks

- Review `next.config.js`; consider ESM/TypeScript conversion, promote `turbopack` options, and ensure no deprecated flags linger.
- Audit for parallel route slots requiring `default.tsx` fallbacks (none detected yet; keep check on future additions).
- Address outstanding warnings (Browserslist data freshness, Mojito image aspect ratio) as part of ongoing maintenance.
- Schedule a dependency sweep with `bun update --interactive` for non-framework packages once Tailwind and shadcn upgrades are queued.

## Phase 2 – Tailwind CSS v4 Migration

### Completed

- Executed `npx @tailwindcss/upgrade` to handle dependency bumps and template scaffolding.
- Replaced `tailwind.config.js` with the TypeScript equivalent, keeping shared design tokens intact.
- Updated PostCSS to rely on `@tailwindcss/postcss` and migrated `app/globals.css` to the new `@import "tailwindcss";` entry point while preserving accessibility helpers.

### Remaining

- Re-evaluate plugins: upgrade `tailwindcss-animate`, confirm compatibility, or replace with Tailwind Motion equivalents.
- Normalize utility usage (`grow-*`, `text-ellipsis`, etc.) per upgrade guide; run `bun run lint` to catch stragglers.
- Validate the design token layer (e.g., CSS variables, dark mode) renders correctly under Tailwind 4 JIT behavior.

## Phase 3 – shadcn/ui Catalog Refresh

### Current Status

- Pulled the latest registry with `bunx shadcn add -a --overwrite`, generating Field, Item, InputGroup, Sidebar primitives, the `Empty` layout component, and the `use-mobile` hook.

### Next Actions

- Map legacy components (e.g., `hero`, `featured-recipes`, `recipe-card`) to updated shadcn marketing and list patterns.
- Document component-level swaps in a migration spreadsheet, noting bespoke variants needing Tailwind token alignment.
- Establish shared Field usage across forms by replacing legacy wrappers with the new primitives and reorganizing imports.

## Phase 4 – Forms: TanStack React Form Adoption

- Add `@tanstack/react-form` and optional adapters (`@tanstack/react-form/devtools` if needed); remove react-hook-form and `@hookform/resolvers`.
- Encapsulate Zod parsing via TanStack Form transformers (e.g., `customValidate` or `zodValidator`) inside `lib/zod/schema`.
- Replace `components/ui/form.tsx` with wrappers around shadcn Field primitives plus TanStack Form context helpers (`Form`, `FieldGroup`, `FieldError`).
- In `app/recipes/add/add-recipe-form.tsx`, migrate to `const form = useForm({ defaultValues, validators })`, using `form.Field` render props for each control and `form.Push()` for arrays.
- Swap `useFieldArray` usage for `mode="array"` fields; handle dynamic lists by mapping `field.state.value` and using `field.push`, `field.remove`.
- Reconcile file upload and Supabase actions with TanStack Form submission (e.g., `form.handleSubmit` + `form.Subscribe` for pending state) and integrate server actions where beneficial.
- Ensure form-level errors map to `FieldError` components, preserving accessibility instructions (aria-invalid, descriptions).

## Phase 5 – TanStack Query Enhancements

- Upgrade to the latest `@tanstack/react-query` and Devtools via `bun update --interactive @tanstack/react-query @tanstack/react-query-devtools`.
- Standardize query client configuration: use object signatures (`queryClient.invalidateQueries({ queryKey })`) and establish query defaults ordered by specificity.
- Adopt Suspense-friendly hooks (`useSuspenseQuery`, `useSuspenseInfiniteQuery`) where Next 16 streaming aligns.
- Memoize selectors (`selectTodoCount` pattern) and placeholder data using `useMemo` to reduce re-renders.
- Revisit mutations (e.g., recipe creation) to leverage optimistic UI with `isPending` and `variables`, avoiding manual cache writes.
- Integrate query instrumentation with Next 16 cacheComponents to respect partial pre-rendering boundaries.

## Phase 6 – Supabase Frontend Realignment

- Audit `supabase/client.ts`, `supabase/helpers.ts`, and component-level imports to ensure `createBrowserClient` (or `createClient` with browser context) is initialized once and memoized per Next.js cache segment.
- Align client creation with updated options (`db.schema`, `auth.persistSession`, `realtime.headers`) and adopt custom `fetch` wiring for Next 16 proxy alignment when needed.
- Standardize how Supabase clients are passed into server actions and TanStack Query hooks, preferring context providers exported from `context/root-providers.tsx`.
- Confirm session handling flows through Next 16 `proxy.ts`, updating any legacy middleware references in client-side hooks without modifying server-only helpers.
- Replace ad-hoc `supabase.auth.getSession()` calls with typed helper wrappers that integrate with Suspense-aware data fetching, ensuring loading states remain accessible.

## Phase 7 – UI Overhaul Strategy

- Inventory all top-level screens (landing, recipes list, detail, auth, profile) and map each to candidate shadcn registry blocks.
- Use MCP search outputs to curate layout options, documenting decisions and any token adjustments needed for consistency.
- Rebuild layout scaffolding (headers, nav, footers) with updated components, ensuring skip-link and landmark requirements are maintained.
- Replace custom filters, lists, and cards with shadcn equivalents (e.g., marketing grids, filter pills) while retaining Supabase-driven data bindings.
- Align theme tokens and typography across pages, ensuring accessible contrast and keyboard navigability.

## Testing and Verification

- Regression test flows: authentication, recipe add/edit, comments, and profile updates under Bun + Next 16 dev/build.
- Run `bun run typecheck`, `bun run lint`, and any available Vitest/Playwright suites post-migration; add coverage for form validation edge cases.
- Validate Supabase SSR proxy behavior via integration tests hitting protected routes.
- Perform Lighthouse audits on key pages to confirm performance gains and layout stability.
- Conduct accessibility checks with Accessibility Insights, verifying new shadcn components for semantic correctness.

## Risk & Mitigation

- Tailwind 4 breaking changes may disrupt design tokens—stage changes behind feature branches and use visual regression snapshots.
- TanStack Form migration could introduce validation gaps—pair with Zod integration tests and fallback server validation.
- Supabase session proxying relies on renamed `proxy.ts`; coordinate deployment to prevent transient auth failures.
- Supabase frontend realignment may briefly destabilize auth flows—gate release behind feature flags and ensure browser client swaps are reversible.
- Large UI refactor risks scope creep—lock MVP component swaps before exploring advanced shadcn patterns.
- Dependency updates via `bun update --interactive` may surface peer conflicts; document accepted ranges and rerun after each phase.

## Suggested Timeline

- Week 1 (completed): Next.js 16 upgrade, repo-wide dependency sweep kickoff, config cleanup validation, baseline tests.
- Week 2: Tailwind CSS v4 migration and shadcn registry sync.
- Week 3: TanStack Form conversion for add/edit recipes plus shared components.
- Week 4: Supabase frontend realignment, TanStack Query refinements, UI overhaul rollout, final QA and accessibility review.
