# Decisions Log

## Decision 1: `frontend/docs` remains the active documentation root

- date: 2026-06-05
- context: the planning request referenced `docs/...`, but the repository currently stores framework and generated planning documents under `frontend/docs/...`
- decision: continue using `frontend/docs/...` as the active path for this implementation cycle
- rationale: it matches the repository structure already created and keeps frontend planning close to the frontend codebase
- alternatives considered: moving docs to root-level `docs/` immediately
- follow-up: if the team wants root-level docs later, do it as a separate documentation move rather than mixing it into UI planning

## Decision 2: backend domain truth overrides generic frontend mock content

- date: 2026-06-05
- context: current public mock constants and some route copy describe a broad professional mentor marketplace, while backend schema and framework docs define an education/tutoring platform
- decision: treat backend docs, migrations, and framework docs as the stronger product truth for all upcoming frontend work
- rationale: public copy and mock content can change easily; domain structure and business rules already exist in backend and framework documentation
- alternatives considered: preserving the current generic mentor marketplace direction
- follow-up: public copy and mock datasets should be aligned early in the next implementation cycle

## Decision 3: implementation proceeds in dependency order

- date: 2026-06-05
- context: many routes exist already, but shared states and domain-aligned display models are not yet standardized
- decision: implement foundation before route rewrites, and static UI before data integration
- rationale: this reduces rework and gives later API integration a stable UI target
- alternatives considered: integrating route data immediately screen by screen
- follow-up: the first coding milestone should create shared status, empty, error, and view-model patterns

## Decision 4: public marketplace and learner booking flow are the first high-value surfaces

- date: 2026-06-05
- context: the public route group and learner booking flow represent the clearest user-value path and the strongest product story
- decision: prioritize home, discover, mentor profile, and learner bookings before deeper admin or secondary dashboard polishing
- rationale: these surfaces define the product narrative and the main conversion path
- alternatives considered: starting with admin routes or low-value placeholder pages
- follow-up: milestone sequencing in `IMPLEMENTATION_PLAN.md` and `TASK_BREAKDOWN.md` reflects this order

## Decision 5: unsupported screens should stay honest

- date: 2026-06-05
- context: favorites, messages, reports, and settings do not yet have clear full backend support
- decision: allow these routes to remain partial, but structure them consistently and avoid implying backend capabilities that do not exist
- rationale: this keeps the UI credible while still supporting route completeness and navigation continuity
- alternatives considered: hiding these routes entirely or building misleading fake-complete experiences
- follow-up: these routes should use shared empty/error states and explicit placeholder framing where needed

## Decision 6: MVP wireframes prioritize structure over visual novelty

- date: 2026-06-05
- context: the framework requires practical implementation-ready UX, while the current frontend still contains showcase-style surfaces in some routes
- decision: define text wireframes around implementation-friendly blocks such as headers, cards, lists, tables, summary rows, and sheets
- rationale: this gives the team a stable bridge from planning to React implementation without inventing a visual system that conflicts with the design system
- alternatives considered: creating more editorial or highly visual screen compositions at the planning stage
- follow-up: visual refinement should happen inside the shared design system boundaries after the static structure is implemented

## Decision 7: booking and trust information must stay visible early in the hierarchy

- date: 2026-06-05
- context: mentor selection depends on subject fit, price, availability, approval, and reviews, not just profile storytelling
- decision: mentor profile, discover, and booking-related screens will place offering, trust, and action information near the top of the layout hierarchy
- rationale: this supports fast comparison and reduces the risk of building beautiful but low-utility detail pages
- alternatives considered: leading with long-form profile storytelling or heavily decorative hero sections
- follow-up: public marketplace refactors should preserve this hierarchy even if copy and styling evolve

## Decision 8: complex screens are split into MVP sections before richer interactions

- date: 2026-06-05
- context: schedule, booking, mentor review, messages, and settings can become interaction-heavy quickly
- decision: define MVP layouts in discrete sections first, then expand into richer interactions after static UI and shared components are stable
- rationale: this matches the implementation plan rule of foundation first and static UI before integration
- alternatives considered: designing full-complexity interactive workflows before foundational components are ready
- follow-up: schedule and admin review routes should start with clear list/summary/sheet structures before introducing advanced interaction patterns

## Decision 9: shared status and state components are created before route rewrites

- date: 2026-06-05
- context: learner bookings, mentor cards, admin mentor review, and future payment surfaces all need consistent status semantics before API integration
- decision: add `StatusBadge`, `EmptyState`, and `ScreenErrorState` under `frontend/app/components` using local component barrels
- rationale: one shared vocabulary prevents ad hoc color pills and gives partial routes honest empty/error treatment without bespoke layout work
- alternatives considered: leaving each route to render its own status and placeholder UI until integration
- follow-up: later milestones should replace remaining ad hoc status labels in admin users, mentor schedule, mentor earnings, and dashboard health surfaces

## Decision 10: display-specific shapes do not live in `app/types`

- date: 2026-06-05
- context: backend booking, mentor, approval, offering, and payment semantics are richer than the current static route data
- decision: keep `frontend/app/types` for domain/object types only, and keep display-specific shapes local to the route or in a separate mapper/presenter layer if reuse becomes real
- rationale: this keeps shared types aligned with business objects instead of coupling them to a temporary UI presentation shape
- alternatives considered: adding `booking-display.ts`, `mentor-display.ts`, and `approval-display.ts` under `frontend/app/types`
- follow-up: Milestone 1 keeps initials, decorative color choices, testimonial avatars, and subject preview metadata outside `app/types`; if a presenter layer becomes necessary later, place it outside `app/types`

## Decision 11: Milestone 2 public components favor comparison and booking context over decorative marketing shells

- date: 2026-06-06
- context: Home, Discover, and Mentor Profile needed to feel like a tutoring marketplace, while the older public component set still leaned on softer showcase-style composition
- decision: refactor shared public components so search, filters, mentor cards, subject cards, booking sidebar, footer, and navbar all reinforce subject fit, trust, availability, and booking readiness first
- rationale: these three screens share the same decision journey, so aligning the shell and shared components prevents route-specific one-off UI and keeps route files focused on composition
- alternatives considered: only rewriting route files while leaving the existing public shell and shared components mostly unchanged
- follow-up: later data-integration milestones can attach real filter state and offering selection behavior onto these shared tutoring-domain shells without redoing their structure

## Decision 12: public marketplace surfaces only show approved mentors in the static phase

- date: 2026-06-06
- context: framework and product constraints say unapproved or suspended mentors should not appear as normal public-ready profiles, while the static mentor constant still includes a pending mentor for broader state coverage
- decision: Home, Discover, and Mentor Profile now derive their public lists from approved mentors only, while unapproved mentor records remain available for future internal and admin surfaces
- rationale: this keeps the tutoring marketplace credible and avoids teaching later integration work the wrong public-state behavior
- alternatives considered: rendering every mock mentor publicly and relying only on badges to communicate approval state
- follow-up: future admin and mentor-facing milestones should continue using the full mentor dataset where approval-state review is part of the job

## Decision 13: Discover uses lightweight local search and filter state before API integration

- date: 2026-06-06
- context: Milestone 2 required a practical comparison-ready discover experience, but broad API integration is intentionally deferred to a later milestone
- decision: implement controlled keyword and context search, tutoring-domain filters, and simple client-side sorting over approved static mentor data
- rationale: this makes the route more honest and testable now without polluting `app/types` or prematurely introducing service or query layers for provisional static UI work
- alternatives considered: leaving discover mostly static with non-functional filter chrome, or jumping straight to backend-backed search before the public UI shape was stable
- follow-up: Milestone 6 can replace the local filter helpers with service and query logic while preserving the same shared `SearchBar` and `FilterSidebar` surface area

## Decision 14: learner workspace static data stays outside `app/types` and secondary actions remain explicitly local-only for now

- date: 2026-06-06
- context: Milestone 3 needed the learner dashboard, bookings, favorites, messages, and profile routes to feel practical and tutoring-domain correct, while favorites and messaging backend support remains partial and full profile integration is deferred
- decision: centralize learner workspace mock data and display-only shapes in `frontend/app/mocks/learner-workspace.ts`, add a shared `DashboardSectionHeader`, and allow only clearly-labeled local UI actions such as local-only favorite removal and local draft profile save
- rationale: this keeps route files thin, preserves the rule that `app/types` stays domain-only, and avoids implying that unsupported learner features are already fully backed by server workflows
- alternatives considered: keeping large route-local mock arrays in each screen, or faking complete backend-connected favorites/messages/profile interactions
- follow-up: when learner profile, bookings, and messaging APIs are introduced in Milestone 6, replace the static learner workspace module route by route while preserving the same section hierarchy and honest state language

## Decision 15: mentor workspace reuses shared status and section patterns without adding a new route-specific component layer

- date: 2026-06-06
- context: Milestone 4 needed five mentor workspace routes to become practical teaching-operation screens while still staying static-first and keeping `app/types` domain-only
- decision: centralize mentor workspace mock data in `frontend/app/mocks/mentor-workspace.ts` and build the routes from existing shared components such as `DashboardPage`, `DashboardSectionHeader`, `StatusBadge`, and `EmptyState` instead of introducing a new mentor-specific component family
- rationale: the mentor screens share operational vocabulary more than unique chrome, so thin routes plus one shared static data module reduce duplication without prematurely freezing extra abstractions
- alternatives considered: keeping large route-local mock arrays in each mentor screen, or adding new mentor-only cards/rows before proving broader reuse
- follow-up: when mentor schedule, profile, students, and earnings APIs are integrated later, swap the static mentor workspace module route by route while preserving recurring-vs-specific-date availability semantics and honest earnings/status messaging

## Decision 16: admin workspace keeps one shared static data module and honest partial surfaces

- date: 2026-06-06
- context: Milestone 5 needed the admin dashboard, mentors, users, reports, and settings routes to become operationally useful without inventing backend-complete moderation or configuration tooling
- decision: centralize admin workspace mock data in `frontend/app/mocks/admin-workspace.ts`, reuse existing shared dashboard/state components, and keep reports/settings explicitly framed as partial operational surfaces rather than fake-complete tools
- rationale: the admin routes share queue, status, and oversight language more than they need new custom chrome, and honest placeholder framing reduces future rework when real APIs arrive
- alternatives considered: leaving large route-local arrays in each admin screen, or building interactive moderation/settings flows that imply unsupported backend behavior
- follow-up: later integration work can replace the static admin workspace module route by route, especially for mentor review, user management, reports, and settings, while preserving the current action-first hierarchy

## Decision 17: shared frontend foundation now composes from `app/components/ui` primitives first

- date: 2026-06-07
- context: framework docs and rules already treated `frontend/app/components/ui` as the default low-level UI system, but the codebase still relied heavily on ad hoc Tailwind blocks in shared components and the `ui` directory was missing
- decision: add the missing primitive layer under `frontend/app/components/ui` and refactor shared foundation components such as `DashboardPage`, `DashboardShell`, `StatusBadge`, `EmptyState`, `ScreenErrorState`, `SearchBar`, `FilterSidebar`, `MentorCard`, `BookingSidebar`, `Navbar`, `Footer`, and `MentorTrustBlock` to compose from those primitives where appropriate
- rationale: this aligns implementation with repo rules, reduces duplicated presentation code, and gives future route work a stable low-level system without forcing a broad route rewrite in the same milestone
- alternatives considered: continuing to add one-off class-based shared components, or rewriting all route screens immediately to prove adoption
- follow-up: future screen work should default to `ui/button`, `ui/badge`, `ui/card`, `ui/input`, `ui/checkbox`, `ui/textarea`, and related primitives before introducing new low-level wrappers

## Decision 18: public marketplace surfaces now share one calmer composition language

- date: 2026-06-07
- context: Home, Discover, and Mentor Profile already used tutoring-domain data, but they still mixed route-local styling patterns, oversized soft sections, and inconsistent action/filter hierarchy
- decision: standardize the public marketplace around one card, badge, button, and separator language built from `app/components/ui`, while keeping booking, trust, offering, and comparison signals close to the top of each screen
- rationale: the three public routes represent one continuous learner decision flow, so consistent low-level composition improves readability, keeps route files more compositional, and avoids the “AI-template landing page” feel called out by the framework docs
- alternatives considered: leaving each route to refine its own styling independently, or postponing visual consistency until later API integration
- follow-up: later data integration should preserve the current Home hero/search hierarchy, Discover filter-summary pattern, and Mentor Profile mobile order where booking context appears before deeper detail sections

## Decision 19: workspace routes now share one shadcn-first section vocabulary

- date: 2026-06-07
- context: learner, mentor, and admin routes already had domain-correct static structure, but each screen still rebuilt its own cards, summaries, notices, and quick-action panels with ad hoc Tailwind markup
- decision: add `WorkspacePanel`, `WorkspaceMetricCard`, `WorkspaceActionCard`, and `WorkspaceNotice` on top of `app/components/ui`, then refactor the learner, mentor, and admin workspace routes to compose primarily from those shared pieces plus `ui/input`, `ui/select`, `ui/table`, `ui/textarea`, and `ui/button`
- rationale: this keeps the route files thinner, aligns the operational workspace surfaces with the repo rule that `app/components/ui` is the default low-level base, and reduces drift between learner, mentor, and admin screens
- alternatives considered: leaving each route to style its own sections independently, or jumping straight to role-specific component families before proving broader shared reuse
- follow-up: later API integration work should preserve this shared panel and metric structure, and future dense row patterns can be extracted only if bookings, mentors, reports, or student rows converge enough to justify another shared abstraction
