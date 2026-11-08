# Implementation Plan

## Project Summary

Mentor Matching already has a strong frontend skeleton:

- public marketplace routes
- learner, mentor, and admin route groups
- a reusable dashboard shell
- a solid low-level UI primitive layer

The current gap is not route coverage. The gap is alignment.

The next implementation cycle should turn the frontend from a visually polished prototype into a domain-accurate tutoring marketplace by:

- replacing generic mentorship copy and mock structures
- standardizing shared states and reusable UI patterns
- implementing realistic static UI for the highest-value flows
- layering API integration after the UI model is stable

## Project Goal

Prepare the frontend for confident implementation by establishing:

- a domain-aligned static UI baseline
- reusable components and status patterns
- a build order that respects dependencies
- clear screen priorities tied to user value

## Scope

- in scope: public marketplace, learner workspace, mentor workspace, admin workspace, shared foundation, static UI alignment, data integration preparation
- out of scope: full API integration for every screen in the same phase, backend feature invention, brand redesign beyond current framework guidance

## Screen Inventory

### Public Marketplace

- `/`
- `/discover`
- `/mentor/:id`
- `/login`

### Learner Workspace

- `/user`
- `/user/bookings`
- `/user/favorites`
- `/user/messages`
- `/user/profile`

### Mentor Workspace

- `/mentor-panel`
- `/mentor-panel/schedule`
- `/mentor-panel/students`
- `/mentor-panel/earnings`
- `/mentor-panel/profile`

### Admin Workspace

- `/admin`
- `/admin/users`
- `/admin/mentors`
- `/admin/reports`
- `/admin/settings`

## User Flow Mapping

### Public Acquisition Flow

1. Home
2. Discover mentors
3. Mentor profile
4. Login or booking entry

### Learner Learning Flow

1. Login
2. Learner dashboard
3. Discover or revisit mentor
4. Book session
5. Review bookings and payment state
6. Maintain learner profile

### Mentor Operations Flow

1. Login
2. Mentor dashboard
3. Maintain profile and offerings
4. Manage availability
5. Review students and earnings

### Admin Operations Flow

1. Login
2. Admin dashboard
3. Review pending mentors
4. Review users
5. Monitor reports and system state

## Component Inventory Summary

### Existing Strong Reuse Candidates

- `DashboardShell`
- `DashboardPage`
- `MentorCard`
- `SearchBar`
- `FilterSidebar`
- `BookingSidebar`
- `SectionTitle`
- `RoleGuard`
- `app/components/ui/*`

### Components Needing Refactor Before Wider Reuse

- `MentorCard`
- `BookingSidebar`
- `SearchBar`
- `FilterSidebar`
- `DashboardPage` empty state

### Shared Components To Add Early

- status badge system
- dashboard section header
- empty state
- screen error state
- reusable list row/table row shells
- mentor offering selector
- availability picker shell
- trust summary block

## Data And State Requirements

### Domain Types Needed Before Integration

- mentor domain types
- mentor offering types
- mentor availability types
- booking and payment domain types
- approval and verification domain types
- route-local or mapper-owned presentation shapes where needed

### Shared State And Behavior Requirements

- standardized status-to-UI mapping
- shared empty/loading/error behavior
- role-aware navigation and route protection
- filter state model for discover
- booking selection state model for mentor profile
- future query-key and API slices by route area

### Integration Readiness Notes

- Auth flow already exists and can remain the first real-data screen.
- Public and dashboard routes can be stabilized with domain-correct static content before API integration.
- Favorites, messages, reports, and settings should be marked partial until backend support is clarified.

## Build Phases

### Phase 1: Foundation Alignment

Purpose:

- establish domain-correct tokens, copy direction, state mapping, and shared UI primitives

Includes:

- standardize status badge rules
- create shared empty/error states
- normalize dashboard section patterns
- define mentor, booking, payment, approval, and verification domain types clearly
- realign public mock content to tutoring domain

### Phase 2: Static Public Marketplace

Purpose:

- make the public experience domain-accurate and implementation-ready before integration

Includes:

- home
- discover
- mentor profile
- booking sidebar static flow

### Phase 3: Static Dashboard Surfaces

Purpose:

- make learner, mentor, and admin surfaces structurally correct with realistic static states

Includes:

- learner dashboard and bookings
- mentor dashboard and schedule shell
- admin dashboard and mentor review shell

### Phase 4: Shared Forms And Workflow Components

Purpose:

- prepare stable building blocks for integration-heavy screens

Includes:

- learner profile forms
- mentor profile sections
- availability forms
- reusable table/list rows

### Phase 5: Data/API Integration

Purpose:

- progressively connect the most stable and highest-value routes to real data

Suggested order:

1. auth bootstrapping and current user
2. learner profile
3. public discover and mentor profile
4. learner bookings
5. mentor schedule and profile
6. admin mentor review

### Phase 6: QA And Hardening

Purpose:

- verify consistency, responsiveness, accessibility, and state coverage

Includes:

- mobile and desktop review
- loading/error/empty state review
- visual consistency checks
- route and role flow verification

## Build Order

Implementation should follow dependency order, not document order.

1. Resolve content and domain conflicts
2. Establish shared tokens and state display rules
3. Add reusable shared components
4. Rework public marketplace static UI
5. Rework learner bookings and dashboard static UI
6. Rework mentor dashboard and schedule static UI
7. Rework admin review and management static UI
8. Add forms and workflow shells
9. Integrate data route by route
10. Run QA hardening

## Dependency Rules

- Foundation must come before screens.
- Shared components must come before repeated route rewrites.
- Static UI must come before data/API integration.
- View-model and status mapping must come before booking/payment/review integration.
- Public acquisition flow should be stabilized before deeper role dashboards so product language is coherent everywhere.

## Risks

- Generic mock content may keep leaking back into implementation unless replaced early.
- Without a shared status system, booking/payment/admin screens will fragment quickly.
- If availability and mentor offerings are not modeled first, booking UI will need rework later.
- Dashboard visuals may remain too decorative if we skip foundation tightening.
- Screens without backend support can accidentally look more complete than they really are unless documented carefully.

## Dependencies

- `frontend/RULES.md`
- `frontend/docs/framework/*`
- existing route structure under `frontend/app/routes`
- existing component primitives under `frontend/app/components/ui`
- backend domain semantics from migrations and backend docs

## QA Strategy

### Review Layers

- visual consistency
- route-level usability
- status/state correctness
- responsiveness
- accessibility basics
- implementation boundary correctness

### Minimum Validation Gates

- `npm run format:write`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

### High-Risk QA Areas

- discover filters and mentor card semantics
- mentor profile booking summary
- learner bookings status handling
- mentor schedule and availability semantics
- admin mentor approval state handling

## Implementation Recommendation

Start with a foundation milestone plus the public marketplace.

That gives the team:

- a corrected product language
- a reusable UI base
- a strong entry flow for later integrations
- the least risky place to settle mentor, subject, price, trust, and booking semantics
