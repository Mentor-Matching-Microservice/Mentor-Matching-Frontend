# UI Workflow

## Purpose

This workflow tells AI how to move from product context to frontend implementation for Mentor Matching.

It should be used together with:

- `frontend/RULES.md`
- `frontend/docs/framework/PROJECT_CONTEXT.md`
- `frontend/docs/framework/ROUTER_DATA_STRATEGY.md`
- `frontend/docs/framework/DESIGN_RULES.md`
- `frontend/docs/framework/DESIGN_SYSTEM.md`
- `frontend/docs/framework/SCREEN_SPECS.md`
- `frontend/docs/framework/AI_CONSTRAINTS.md`

## Core Principle

Mentor Matching is a trust-based education marketplace.

AI should optimize the frontend for:

- helping learners and parents choose the right mentor
- helping mentors manage teaching work efficiently
- helping admins maintain quality and safety
- keeping UI behavior aligned with backend domain reality

## Standard AI Delivery Flow

Use this sequence for design-heavy or multi-screen work.

1. Read repo and framework context.
2. Inspect relevant routes, layouts, components, services, hooks, and types.
3. Check backend-driven domain truth when a feature touches booking, payment, mentor profile, review, catalog, or scheduling.
4. Refresh generated docs for the current work cycle.
5. Implement foundations or shared patterns first when needed.
6. Implement one screen or workflow slice at a time.
7. Validate with lint, typecheck, tests, build, and browser checks when feasible.
8. Record decisions and follow-up gaps.

## Source Priority

When sources conflict, use this priority:

1. explicit user instruction in the current task
2. `frontend/RULES.md` for engineering conventions
3. backend docs and migrations for business/domain truth
4. `ROUTER_DATA_STRATEGY.md` for route/data ownership decisions
5. `PROJECT_CONTEXT.md` for product interpretation
6. current frontend code for existing UI and implementation patterns
7. generated docs for current cycle plans

Current frontend mock copy is useful for structure, but backend schema and migrations are stronger product truth.

## Workflow Types

### Product Context Work

Use when defining or updating the product understanding.

Expected output:

- update `PROJECT_CONTEXT.md`
- update `SCREEN_SPECS.md` if route expectations change
- update `DECISIONS.md` when assumptions become decisions

### UI System Work

Use when changing shared layout, visual language, tokens, or reusable components.

Expected output:

- update `DESIGN_RULES.md` if design principles or rules change
- update `DESIGN_SYSTEM.md` if tokens or reusable components change
- implement shared components before screen-specific polish

### Screen Work

Use when implementing or redesigning a route.

Expected output:

- inspect the current route and shared components
- update the relevant screen entry in `SCREEN_SPECS.md`
- implement the smallest useful screen slice
- update `COMPONENT_INVENTORY.md` if new shared components appear

### Workflow Work

Use when implementing a multi-step experience such as booking, payment, mentor approval, or profile completion.

Expected output:

- define states before UI implementation
- document entry points, success states, failure states, and recovery paths
- keep snapshots and backend state semantics visible in the UI
- avoid treating transaction history as live profile data

## Recommended Implementation Order

For major frontend modernization:

1. align mock data and copy with the education marketplace domain
2. tighten global visual tokens and shared layout primitives
3. improve public marketplace screens
4. improve mentor profile and booking entry experience
5. improve learner dashboard and booking history
6. improve mentor schedule and profile management
7. improve admin mentor approval and user management
8. add review, notification, and payment state surfaces

## Foundation Checklist

Before broad screen work, confirm these foundations:

- page shells are consistent
- dashboard shell is consistent across roles
- navigation states are clear
- cards and panels have predictable density and radius
- buttons and form controls reuse `app/components/ui` where possible
- status badges use consistent semantics
- loading, empty, and error states are reusable
- mobile behavior is defined for navigation, filters, and data-heavy views

## Screen Slice Checklist

For each screen slice, define:

- route
- user role
- primary job
- top-level sections
- primary action
- secondary actions
- data required
- backend state mapping
- empty state
- loading state
- error state
- responsive behavior
- accessibility notes

## Domain Checks Before Coding

Run these checks mentally before designing UI:

- If showing mentor subjects, use mentor offerings, not generic subjects.
- If booking a session, use `mentorSubjectId` from `mentor_subjects`.
- If showing past booking data, treat it as snapshot data.
- If showing availability, represent recurring and specific-date windows.
- If showing payment, include pending, paid, failed, cancelled, refunded, and expired-like states when relevant.
- If showing mentor trust, distinguish identity verification from admin approval.
- If showing reviews, include both rating and qualitative tags when possible.

## Review Cycle

After every meaningful implementation step:

1. compare against `PROJECT_CONTEXT.md`
2. compare against `DESIGN_RULES.md`
3. compare against `DESIGN_SYSTEM.md`
4. update `SCREEN_SPECS.md` if screen expectations changed
5. update `DECISIONS.md` for non-obvious tradeoffs
6. update `QA_CHECKLIST.md` when a new validation pattern appears

## Done Criteria

A frontend UI task is done when:

- the result supports the correct user role and job
- data/state semantics match backend domain meaning
- implementation follows `frontend/RULES.md`
- shared components are reused before new ones are created
- mobile and desktop layouts are considered
- affected framework or generated docs are updated
- validation commands are run when feasible, or skipped with a clear reason
