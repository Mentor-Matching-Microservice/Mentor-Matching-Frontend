# Router Data Strategy

## Purpose

This document defines how Mentor Matching frontend combines React Router Framework features with the existing frontend stack.

It exists to answer these questions consistently:

- when to use `loader`
- when to use `action`
- when to use `useFetcher`
- when to use React Query
- what belongs in Zustand
- how forms, validation, and API calls should fit together

## Core Principle

React Router is the route orchestration layer.

The supporting libraries keep their specialized roles:

- React Router: route data lifecycle, redirects, route params, pending navigation state, form submission semantics, revalidation
- React Query: server-state caching, background refetching, invalidation, optimistic UI, pagination, and reused remote data
- `react-hook-form` + `zod`: client-side form state, validation, field-level UX, and submit preparation
- `axios`: HTTP transport, interceptors, auth headers, and response/error mapping
- Zustand: client-only state such as auth tokens and UI state

Do not force one tool to replace the strengths of another.

## Source Of Truth Rule

For a single resource on a single screen, choose one primary source of truth.

- If the screen renders from `loader` data, then mutations for that resource should usually go through `action` or `useFetcher`, followed by route revalidation.
- If the screen renders from React Query cache, then mutations for that resource should usually go through React Query mutation flows and cache invalidation.

Avoid rendering the same resource from both `loaderData` and `useQuery` unless there is a deliberate cache-seeding strategy.

## Decision Matrix

### Use `loader` when

- the route should not render until required data is known
- the route needs SSR-first data
- the route needs redirect decisions before paint
- the route needs auth or role checks
- the route needs canonical param validation
- the route is a detail page where first-load correctness matters more than client-only cache reuse

Examples:

- current user and role gate for protected routes
- mentor detail page
- booking detail page
- admin route permission checks

### Use `action` with `<Form>` when

- the submit should behave like a route-level mutation
- success should redirect or complete a navigation flow
- the route should naturally revalidate after submission
- the UX maps well to web form semantics

Examples:

- login
- create booking and continue to confirmation
- submit mentor application
- update a profile section and redirect on success

### Use `useFetcher` when

- data should load or mutate without navigation
- the user stays on the same page
- the interaction is local to one panel, card, table row, or dialog
- background or inline submission state is needed

Examples:

- toggle favorite mentor
- approve or reject mentor inline in admin table
- load filtered options in a modal
- autosave or partial-save behavior

### Use React Query when

- remote data is reused across multiple views or widgets
- background refetch is valuable
- pagination, infinite loading, or filter churn is expected
- optimistic update or cache invalidation gives better UX
- the data is not primarily route-blocking

Examples:

- dashboard widgets
- discover/search results with filters
- notifications list
- bookings list with filters and pagination

## Form Strategy

Use `react-hook-form` and `zod` for form UX by default.

- use `zod` to validate and normalize client input
- use `react-hook-form` to manage dirty state, touched state, and field errors
- submit through React Router when route semantics matter
- submit through React Query mutation when the screen is Query-driven and does not benefit from Router form semantics

Preferred combinations:

- route workflow form: `react-hook-form` + `zod` + `fetcher.submit(...)` or `<fetcher.Form>`
- route navigation form: `react-hook-form` + `zod` + `<Form>`
- query-driven modal or settings form: `react-hook-form` + `zod` + `useMutation`

## Service Layer Rule

Keep API calls in `app/services/*.api.ts`.

- `loader`, `action`, and React Query hooks should call service functions instead of duplicating HTTP logic
- keep `axios` configuration and response mapping centralized
- do not put toast, navigate, or component concerns into services

This keeps Router flows and Query flows aligned around the same transport layer.

## Zustand Rule

Zustand is not a replacement for route data or server-state cache.

Use Zustand for:

- access token
- refresh token if the chosen auth flow requires it
- UI-only state such as shell preferences, open panels, or temporary client toggles

Do not copy API resources into Zustand when React Router or React Query already owns them.

## Recommended Hybrid Pattern

For most important screens in this project, prefer this order:

1. use `loader` for auth, role checks, param validation, and first-paint critical data
2. render the page shell from route-safe data
3. use React Query for reusable or frequently refreshed sub-resources
4. use `useFetcher` for inline actions that should not navigate
5. use `react-hook-form` + `zod` for any non-trivial form

This gives the project SSR-aware routing without losing React Query strengths.

## Repo-Specific Guidance

Mentor Matching currently standardizes these patterns:

- API functions live in `app/services/*.api.ts`
- React Query hooks live in `app/hooks/queries/**`
- auth state lives in Zustand
- route modules should stay focused on screen composition

When adding React Router data APIs, preserve those conventions.

Recommended project direction:

- use `loader` more for protected route bootstrapping and route-level detail data
- keep dashboard/list/filter data in React Query where caching helps
- use `useFetcher` for inline admin, learner, and mentor actions
- keep forms on `react-hook-form` + `zod` even when submission goes through Router APIs

## SSR And Query Client Note

If the app starts using React Query together with SSR-prefetched route data, avoid sharing one module-level `QueryClient` across server requests.

Prefer a per-request QueryClient strategy for server rendering paths to avoid cache leakage between users.

## Anti-Patterns

- do not use Zustand as a server-state store
- do not duplicate the same resource in both `loader` and React Query without a clear ownership rule
- do not bypass `services/*.api.ts` from route modules
- do not move all mutations into Router APIs if React Query cache ownership is the better fit
- do not move all route-critical data into React Query if redirect or SSR correctness matters

## Quick Rule Of Thumb

- need redirect or route-safe first paint: use `loader` or `action`
- need inline non-navigation mutation: use `useFetcher`
- need cache and background refetch: use React Query
- need form UX and validation: use `react-hook-form` + `zod`
- need client-only app state: use Zustand
