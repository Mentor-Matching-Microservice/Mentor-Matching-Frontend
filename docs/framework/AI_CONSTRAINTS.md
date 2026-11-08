# AI Constraints

## Purpose

This file defines hard constraints for AI agents working on Mentor Matching frontend.

It exists to prevent drift between:

- product reality
- backend domain rules
- frontend conventions
- generated design output

## Must Read Before Frontend Work

Always read:

1. `AGENTS.md`
2. `frontend/RULES.md`
3. `frontend/docs/AI_RUNBOOK.md`
4. `frontend/docs/framework/PROJECT_CONTEXT.md`
5. `frontend/docs/framework/UI_WORKFLOW.md`
6. `frontend/docs/framework/ROUTER_DATA_STRATEGY.md`
7. `frontend/docs/framework/DESIGN_RULES.md`
8. `frontend/docs/framework/DESIGN_SYSTEM.md`
9. `frontend/docs/framework/SCREEN_SPECS.md`
10. this file

## Product Constraints

- Treat Mentor Matching as an education/tutoring marketplace.
- Do not default to generic career coaching or tech mentor marketplace language.
- Treat backend migrations and backend docs as stronger product truth than current frontend mock data.
- Keep learners, parents, mentors, admins, and managers conceptually separate.
- Do not invent permanent product capabilities when the backend has no supporting module; mark them as future or placeholder.

## Domain Constraints

### Catalog And Offerings

- A generic subject is not enough for booking.
- `subject_grades` are catalog subject/grade pairs.
- `mentor_subjects` are mentor-specific offerings.
- Booking should use `mentorSubjectId`, not a generic subject id.
- UI should present subject, grade, price, proficiency, and active state when relevant.

### Availability

- Mentor availability is made of flexible windows.
- Support both recurring weekly windows and specific-date windows in UI models.
- Do not design fixed slot-only behavior unless a later backend change introduces it.

### Booking

- Booking is a transaction record with snapshot data.
- Past booking display should use stored booking snapshots, not live mentor/catalog values.
- Booking statuses are `PENDING`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `REJECTED`, and `NO_SHOW`.
- Any booking UI must include clear status and next action.

### Payment

- Payment is tied to booking.
- Payment status includes `PENDING`, `PAID`, `FAILED`, `CANCELLED`, and `REFUNDED`.
- Stripe checkout direction exists through provider tracking fields.
- UI should allow failed/pending/recovery states when implementing payment flows.

### Mentor Trust

- Identity verification and admin approval are separate ideas.
- Approval statuses are `PENDING`, `APPROVED`, `REJECTED`, and `SUSPENDED`.
- Do not show unapproved or suspended mentors as normal public-ready mentors.

### Reviews

- Reviews are tied to completed bookings.
- Reviews include rating, comment, and optional qualitative tags.
- Do not reduce review design to stars only when implementing real review features.

## Engineering Constraints

- Follow `frontend/RULES.md`.
- Use `@` alias for internal imports from `app`.
- Keep route modules focused on screen composition.
- Put reusable UI in `app/components`.
- Treat `app/components/ui` as the default low-level UI system for frontend implementation.
- Put low-level primitives in `app/components/ui` only when extending that system.
- Put API functions in `app/services/*.api.ts`.
- Put React Query hooks in `app/hooks/queries/**`.
- Put shared domain types in `app/types`.
- Put app/auth state in Zustand only when it is client state.
- Keep server state in React Query.
- Use `loader`, `action`, and `useFetcher` intentionally according to `ROUTER_DATA_STRATEGY.md`.
- Do not use `any`; prefer explicit types or `unknown` with guards.
- Do not read raw `import.meta.env` outside `app/config/env.ts`.

## Component Constraints

- Reuse existing shadcn primitives before creating new controls.
- Reuse app components before creating new shared components.
- Prefer building domain-specific components by composing `Button`, `Card`, `Badge`, `Tabs`, `Sheet`, `Dialog`, `Input`, `Select`, `Table`, `Skeleton`, and related primitives from `app/components/ui`.
- Do not create custom presentation components that duplicate available shadcn primitives unless the domain UI needs a real abstraction on top.
- Use lucide-react for icons.
- Use `DashboardShell` for role dashboard layout.
- Use `DashboardPage` for dashboard route content unless a specific route has a stronger established pattern.
- Use `RoleGuard` patterns for access checks.
- Use `Button`, form, dialog, sheet, table, badge, skeleton, and tooltip primitives where they fit.

## Design Constraints

- Keep public marketplace screens useful for choosing mentors.
- Keep dashboards compact, scannable, and action-oriented.
- Use blue as the main action family unless the design system changes.
- Use semantic status colors consistently.
- Avoid excessive gradients, glow, and decorative effects in operational screens.
- Avoid purple-heavy visual direction.
- Do not use color alone for status.
- Keep text readable on mobile and desktop.
- Do not create UI that depends on hidden hover-only information for core actions.

## Documentation Constraints

- Update `PROJECT_CONTEXT.md` when product assumptions change.
- Update `DESIGN_RULES.md` when visual rules change.
- Update `DESIGN_SYSTEM.md` when tokens or shared components change.
- Update `SCREEN_SPECS.md` when a route's expected behavior changes.
- Update `generated/DECISIONS.md` for non-obvious tradeoffs.
- Update `generated/COMPONENT_INVENTORY.md` when new reusable components are introduced.

## Validation Constraints

For code changes, prefer running from `frontend`:

- `npm run format:write`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

For UI changes, also verify:

- desktop layout
- mobile layout
- no horizontal overflow
- primary actions visible
- loading, empty, and error states considered
- keyboard/focus behavior for dialogs, sheets, forms, and navigation

If validation cannot be run, state why in the final response.

## Anti-Drift Rules

- Do not let existing placeholder copy define future product direction.
- Do not add new visual language for one screen without checking reuse.
- Do not create booking/payment/review UI without mapping backend states.
- Do not create mentor profile UI that omits trust, offering, and availability meaning.
- Do not create admin screens that are only decorative metrics; admin needs action queues and status clarity.
