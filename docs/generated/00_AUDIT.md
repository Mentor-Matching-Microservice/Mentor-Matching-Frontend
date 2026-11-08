# UI Audit

## Scope

- date: 2026-06-05
- branch: current working tree
- reviewer: Codex
- area audited: frontend route map, shared components, design tokens, mock data strategy, and framework alignment

## Conflicts First

### Conflict 1: requested `docs/...` paths vs repo using `frontend/docs/...`

- The request references `docs/AI_RUNBOOK.md` and `docs/framework/...`.
- The repository currently stores these files under `frontend/docs/...`.
- Assumption used for this audit: `frontend/docs/...` is the intended source of truth until the team decides to move docs to the repo root.

### Conflict 2: product truth is education marketplace, but public UI copy still reads like generic professional mentorship

- `PROJECT_CONTEXT.md` defines Mentor Matching as a tutoring and education marketplace.
- Public mock content in `frontend/app/constants/mentors.ts`, `subjects.ts`, `testimonials.ts`, plus parts of `HomeFesba.tsx` and `Discover.tsx`, still describes tech, product, analytics, and career mentorship.
- This is the biggest product-to-UI mismatch in the current frontend.

### Conflict 3: framework prefers practical, trust-driven dashboards, but several dashboard routes are still decorative placeholders

- `DESIGN_RULES.md` prioritizes dense, work-focused dashboards.
- Current learner, mentor, and admin dashboards use attractive static cards and placeholder metrics, but they do not yet reflect backend booking, payment, approval, and review workflows.
- This is acceptable for a prototype, but not stable enough for implementation without a formal plan.

### Conflict 4: design system asks for blue-led semantic UI, while current visual layer still leans on blue-purple gradients and large-radius surfaces

- `DESIGN_SYSTEM.md` and `DESIGN_RULES.md` prefer restrained blue and smaller radii for operational screens.
- Current `app.css` still includes strong purple accents, gradient text, `glass-panel`, `card-hover`, and many `rounded-3xl` surfaces.
- This is not a blocker, but it means foundation work is needed before deeper dashboard implementation.

### Conflict 5: backend domain models real mentor offerings and availability, but current booking/profile UI still uses simplified mock structures

- Backend expects mentor offerings, availability windows, and snapshot-driven bookings.
- `MentorProfile.tsx`, `BookingSidebar.tsx`, and `user/bookings.tsx` still use simplified mock data such as a single hourly price, generic skill labels, and hardcoded booking states.
- This creates risk if screens are implemented directly without a shared UI/data model first.

## Current Findings

### Strengths

- Route architecture is already organized by public, learner, mentor, and admin surfaces.
- `DashboardShell` provides a reusable foundation for role-based workspaces.
- `DashboardPage` gives a consistent page-title and content wrapper for dashboard screens.
- `frontend/RULES.md` defines clear boundaries for routes, services, hooks, store, and types.
- The app already has a useful primitive set in `app/components/ui`, including `badge`, `sheet`, `dialog`, `table`, `tabs`, `select`, `skeleton`, and `tooltip`.
- Login already connects to the real auth flow through React Query and `authApi`, which shows the project is ready for gradual replacement of static UI with real data.

### Inconsistencies

- Public mentor, subject, and testimonial data is in English and mapped to a generic global mentor marketplace, not the tutoring product described by backend and framework docs.
- Several screens mix Vietnamese operational copy with English domain data and role labels.
- Role dashboards share a shell, but each route page invents its own card sizing, spacing density, and decorative intensity.
- Statuses in booking and admin screens are shown as ad hoc display labels instead of a consistent status vocabulary derived from backend enums.
- The UI currently uses both practical shadcn-like primitives and custom decorative surfaces without a firm rule on when each should be used.

### Reusable Components Found

- Layout and role shell: `DashboardShell`, `DashboardPage`, `MainLayout`, `user-layout`, `mentor-layout`, `admin-layout`
- Public marketplace components: `Navbar`, `Footer`, `SearchBar`, `FilterSidebar`, `MentorCard`, `SubjectCard`, `SectionTitle`, `BookingSidebar`, `TestimonialCard`, `RatingStars`
- Access and auth helpers: `RoleGuard`, `auth-store`, auth query hooks
- Low-level UI primitives: `button`, `badge`, `table`, `sheet`, `dialog`, `input`, `select`, `tabs`, `skeleton`, `tooltip`, `switch`, `checkbox`, `avatar`, `textarea`, `radio-group`, `dropdown-menu`, `alert-dialog`, `sonner`

### Missing Shared Patterns

- Shared status badge system for booking, payment, mentor approval, verification, and user state
- Shared empty state component for role dashboards
- Shared error state and retry surface for screen-level data loading
- Shared section header pattern for dashboard subsections
- Shared list row/table row pattern for admin and booking-heavy screens
- Shared mentor offering selector and availability picker for booking
- Shared trust block for mentor profile and admin mentor review

### Design Debt

- `HomeFesba.tsx` behaves like a polished marketing landing page more than a tutoring marketplace entry screen.
- `DashboardPage` default empty state is generic and not tied to role-specific jobs.
- Large radii and glass treatments are used broadly, which will feel too soft once real admin and booking workflows are added.
- Search and filter affordances exist visually, but not yet as a stable domain-aligned filtering model.
- The color and motion language is expressive enough for a showcase, but not yet normalized for repeated operational use.

### Technical Constraints

- There is no root `docs/` tree; all generated docs currently live under `frontend/docs/`.
- Many screens depend on local constants rather than domain-shaped DTOs.
- No shared frontend mapping layer exists yet for backend booking status, payment status, mentor approval status, or mentor offering view models.
- Backend support for favorites, messaging, reports, and settings is partial or future-facing, so those screens need assumption tracking.
- `auth-store` persists tokens but does not yet describe richer session/profile bootstrapping.

### Assumptions Used

- `frontend/docs/framework/*` remains the active source of truth.
- The next implementation cycle should prioritize a realistic static UI aligned to backend domain before broad API integration.
- Favorites, messages, reports, and settings may remain partially mocked in the first pass, but their UI must clearly respect framework constraints.

## Readiness Assessment

- Ready for implementation planning: yes
- Ready for direct large-scale coding across all screens: no
- Recommended next step: implement shared foundation and domain-aligned static UI first, then integrate data route by route

## Recommended Priorities

1. Realign mock content, statuses, and shared UI language to the education marketplace domain.
2. Build foundation components and view models before rewriting screen details.
3. Implement public marketplace and learner booking flows statically before expanding into live data integration.
