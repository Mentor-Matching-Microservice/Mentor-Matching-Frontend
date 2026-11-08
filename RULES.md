# RULES.md

This document defines mandatory engineering rules for this template. All team members must follow these rules for every new change.

## 1) Core Principles

- Keep code predictable, explicit, and easy to maintain.
- Prefer consistency over personal style.
- Optimize for reuse and clear boundaries.
- Avoid hidden side effects.

## 2) Folder Structure

Use this high-level structure under `app/`:

- `components/`: reusable UI components.
- `routes/`: route modules only.
- `hooks/`: reusable hooks and query hooks.
- `services/`: API call functions only.
- `lib/`: app-level clients/singletons (http, queryClient, etc).
- `store/`: Zustand stores.
- `types/`: shared domain types.
- `constants/`: constants and query keys.
- `config/`: environment and app config.
- `utils/`: pure helper functions.

Do not put business logic directly in `routes` when it can be reused in `hooks/services`.

## 3) Naming Convention

### 3.1 Files and folders

- Use `kebab-case` for files and folders by default.
- Do not use `camelCase` for file names.
- Use `PascalCase` only for reusable component file names in `app/components`.

Examples:

- Good: `query-client.ts`, `auth-store.ts`, `use-current-user-query.ts`
- Good: `app/components/Button/Button.tsx`
- Avoid: `queryClient.ts`, `authStore.ts`

### 3.2 Code symbols

- Components: `PascalCase`
- Variables/functions: `camelCase`
- Constants: `UPPER_SNAKE_CASE` when global/static, otherwise `camelCase` object keys
- Types/interfaces: `PascalCase`

## 4) Components and Barrel Pattern

Barrel usage is allowed for `components` only.

### 4.1 UI foundation

- `app/components/ui` is the default low-level UI system for this project.
- Prefer composing screens and domain components from the primitives in `app/components/ui` before creating new custom low-level controls.
- New custom UI components should add domain meaning or shared workflow value, not duplicate available shadcn primitives.

Required pattern for each reusable component:

- One component per folder
- Main component file: `PascalCase.tsx`
- Local barrel file: `index.ts` (or `index.tsx`) that re-exports public component API

Example:

- `app/components/Button/Button.tsx`
- `app/components/Button/index.ts`

Import rule:

- Prefer: `import { Button } from '@/components/Button'`
- Avoid: `import { Button } from '@/components/Button/Button'`

Do not create global barrel files for `utils`, `services`, `lib`, `constants`, or `types`.

## 5) Import Rules

- Use alias `@` for internal imports from `app`.
- Avoid long relative imports such as `../../../`.
- Keep import groups clean and stable:
  1. External packages
  2. Internal alias imports (`@/...`)
  3. Relative imports

## 6) API Layer Pattern (Mandatory)

Use fixed separation:

- `services/*.api.ts`: HTTP calls and response mapping only.
- `hooks/queries/**`: React Query hooks (`useQuery`, `useMutation`) only.

### 6.1 services

- Call `http` client from `app/lib/http.ts`.
- Map backend envelope `ApiResponse<T>` and return `data` only.
- Do not use UI logic (toast, navigate) inside services.

### 6.2 hooks/queries

- Own query keys via `constants/query-keys.ts`.
- Handle enable conditions and mutation side effects here.
- Keep route components thin by consuming these hooks.

## 7) Auth and Route Guards

- Auth source of truth is Zustand `useAuthStore`.
- `ProtectedRoute`/protected layout requires `accessToken`.
- `GuestRoute`/guest layout blocks authenticated users from guest-only pages.
- Keep redirect flow with `redirectTo` query param.
- Logout must clear both `accessToken` and `refreshToken`.

## 8) State Management

- Use Zustand for app/auth state only.
- Use React Query for server state.
- Do not duplicate the same server state in Zustand.

## 9) Environment Variables

- Validate env using zod in `app/config/env.ts`.
- Never read raw `import.meta.env` outside `env.ts`.
- `.env*` files are ignored except `.env.example`.
- Every new env var must be added to:
  1. `env.ts` schema
  2. `.env.example`
  3. docs if needed

## 10) Error Handling

- Backend error shape follows `ErrorResponse`.
- Keep error mapping centralized (http client / helper layer).
- Avoid ad-hoc error string handling in route components.

## 11) Types

- Keep shared domain types in `app/types` with `kebab-case` files.
- Group types by domain (`auth.ts`, `api-response.ts`, `user.ts`).
- Do not use `any`; prefer explicit types or `unknown` with guards.

## 12) Form Rules

- Use `react-hook-form` + `zod` for form validation.
- Define schema close to form or in a dedicated module for reuse.
- Show user-friendly validation messages.

## 13) Code Quality Gates (Before Merge)

Every PR must pass:

- `npm run format:write`
- `npm run lint`
- `npm run typecheck`
- `npm run test` (when tests exist)
- `npm run build`

No merge with failing checks.

## 14) Pull Request Rules

- Keep PR focused and small when possible.
- Include clear description:
  - What changed
  - Why it changed
  - Risk/impact
- Update related docs/rules when introducing new patterns.

## 15) Anti-Patterns (Do Not)

- Do not call API directly inside large route UI code if reusable service/hook can be created.
- Do not mix server-state cache logic into Zustand.
- Do not add hidden global side effects in utility modules.
- Do not bypass env schema validation.
- Do not introduce inconsistent naming conventions.

## 16) Decision Rule

If uncertain, choose the option that improves:

1. Consistency with this file
2. Type safety
3. Reusability
4. Readability for the next teammate
