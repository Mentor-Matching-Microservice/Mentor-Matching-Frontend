# Task Breakdown

## Planning Notes

- Complexity scale: `S`, `M`, `L`
- Order is implementation order, not document order
- Acceptance criteria are required for every task
- Static UI work precedes data integration work

## Milestone 1: Foundation Alignment

### Task 1.1: Standardize product copy direction

- suggested order: 1
- complexity: `M`
- dependencies: `PROJECT_CONTEXT.md`, `DESIGN_RULES.md`, existing public mock constants
- goal: replace generic professional mentorship language with tutoring and education marketplace language across shared mock sources
- likely files affected: `frontend/app/constants/mentors.ts`, `subjects.ts`, `testimonials.ts`, public route copy, footer copy, search placeholder copy
- acceptance criteria:
  - public copy consistently reflects learners, parents, mentors, subjects, grades, sessions, and teaching goals
  - generic career or portfolio mentorship language is removed from core public entry surfaces
  - no framework rule is contradicted

### Task 1.2: Create shared status badge pattern

- suggested order: 2
- complexity: `M`
- dependencies: design rules, design system, backend status semantics
- goal: define a single reusable status rendering pattern for booking, payment, mentor approval, and user state
- likely files affected: shared component area under `app/components`, related routes using ad hoc badges
- acceptance criteria:
  - one shared pattern exists for status rendering
  - booking, payment, and approval statuses have clear text and semantic color mapping
  - at least two route surfaces adopt the shared pattern

### Task 1.3: Create shared empty and error states

- suggested order: 3
- complexity: `M`
- dependencies: `DashboardPage`, ui primitives, design rules
- goal: provide reusable role-aware empty and screen error states
- likely files affected: `app/components`, `DashboardPage`, selected placeholder routes
- acceptance criteria:
  - reusable empty state exists
  - reusable screen error/retry state exists
  - placeholder routes can use them without bespoke layout invention

### Task 1.4: Clarify domain types and local presentation shapes

- suggested order: 4
- complexity: `M`
- dependencies: project context, screen specs, backend domain semantics
- goal: keep shared types aligned to domain objects while letting presentation-only shapes stay local or move into a separate mapper layer if reuse becomes necessary
- likely files affected: `app/types`, route modules, maybe dedicated mapper/presenter modules if justified later
- acceptance criteria:
  - shared types describe domain objects and statuses clearly
  - booking and payment statuses live with booking-related types
  - mentor approval and verification statuses live with mentor-related types
  - presentation-only shapes do not pollute `app/types`
  - types align with framework docs and do not use `any`

## Milestone 2: Public Marketplace Static UI

### Task 2.1: Rework home page to match tutoring marketplace

- suggested order: 5
- complexity: `L`
- dependencies: milestone 1 copy alignment, shared components
- goal: make the home page reflect the real product and route users into discovery/bookings logically
- likely files affected: `routes/HomeFesba.tsx`, `MentorCard`, `SubjectCard`, `SectionTitle`, `Footer`, shared constants
- acceptance criteria:
  - homepage clearly communicates tutoring marketplace intent
  - featured mentors, subjects, and testimonials align with domain
  - CTA paths remain coherent on desktop and mobile

### Task 2.2: Rework discover page with domain-correct filter and result semantics

- suggested order: 6
- complexity: `L`
- dependencies: milestone 1 copy alignment, mentor summary model, shared status pattern
- goal: prepare discover for real subject/grade/availability-based search
- likely files affected: `routes/Discover.tsx`, `FilterSidebar.tsx`, `SearchBar.tsx`, `MentorCard.tsx`
- acceptance criteria:
  - result cards show domain-correct mentor information
  - filter groups reflect subject, grade, meeting type, price, trust, and availability concepts
  - mobile filter behavior remains usable

### Task 2.3: Rework mentor profile and booking summary shell

- suggested order: 7
- complexity: `L`
- dependencies: mentor detail model, milestone 1 shared states, public copy alignment
- goal: make mentor profile ready for future offering and availability integration
- likely files affected: `routes/MentorProfile.tsx`, `BookingSidebar.tsx`, `RatingStars.tsx`
- acceptance criteria:
  - profile sections reflect trust, offerings, teaching style, reviews, and booking
  - booking summary refers to sessions and offerings, not a generic flat hourly service
  - mobile layout preserves booking access

## Milestone 3: Learner Static UI

### Task 3.1: Rework learner dashboard around real learner jobs

- suggested order: 8
- complexity: `M`
- dependencies: shared empty/error states, booking view model
- goal: make learner dashboard about upcoming sessions, progress, and next actions instead of decorative metrics
- likely files affected: `routes/user/dashboard.tsx`, shared dashboard helpers
- acceptance criteria:
  - dashboard shows learner-relevant sections
  - empty and active states are both meaningful
  - quick actions point to real route flows

### Task 3.2: Rework learner bookings around backend booking semantics

- suggested order: 9
- complexity: `L`
- dependencies: shared status badge, booking view model
- goal: make bookings list structurally ready for real booking and payment states
- likely files affected: `routes/user/bookings.tsx`
- acceptance criteria:
  - list reflects booking date, time, mentor snapshot, subject snapshot, status, and next action
  - statuses map to backend meaning
  - filters and search work structurally even with static data

### Task 3.3: Normalize learner favorites, messages, and profile placeholders

- suggested order: 10
- complexity: `M`
- dependencies: shared empty state, copy alignment
- goal: make secondary learner routes coherent and honest about current backend support
- likely files affected: `routes/user/favorites.tsx`, `messages.tsx`, `profile.tsx`
- acceptance criteria:
  - favorites uses tutoring-domain mentor content
  - messages and profile routes do not feel like unrelated mock demos
  - unsupported areas are represented clearly without overpromising

## Milestone 4: Mentor Static UI

### Task 4.1: Rework mentor dashboard around teaching operations

- suggested order: 11
- complexity: `M`
- dependencies: shared section/state patterns
- goal: make mentor dashboard about schedule, students, approvals, and teaching activity
- likely files affected: `routes/mentor-panel/dashboard.tsx`
- acceptance criteria:
  - metrics and sections feel operational, not decorative
  - next actions prioritize schedule and profile maintenance
  - approval state can be shown when needed

### Task 4.2: Rework mentor schedule shell around availability windows

- suggested order: 12
- complexity: `L`
- dependencies: availability display model, shared status pattern
- goal: prepare the schedule route for recurring and specific-date availability
- likely files affected: `routes/mentor-panel/schedule.tsx`
- acceptance criteria:
  - schedule distinguishes availability from booked sessions
  - recurring vs specific-date concepts can be represented
  - mobile and desktop remain usable

### Task 4.3: Rework mentor students, earnings, and profile management surfaces

- suggested order: 13
- complexity: `L`
- dependencies: booking and payment view models, shared list/table patterns
- goal: align remaining mentor routes to backend realities before API work
- likely files affected: `routes/mentor-panel/students.tsx`, `earnings.tsx`, `profile.tsx`
- acceptance criteria:
  - students route reflects real session relationships
  - earnings route reflects payment-linked teaching income
  - profile route is organized around offerings, trust, and teaching content

## Milestone 5: Admin Static UI

### Task 5.1: Rework admin dashboard around action queues

- suggested order: 14
- complexity: `M`
- dependencies: shared status badge, approval display model
- goal: make admin dashboard useful for monitoring and triage
- likely files affected: `routes/admin/dashboard.tsx`
- acceptance criteria:
  - dashboard emphasizes pending mentor reviews and operational signals
  - decorative-only metrics are reduced
  - actions point to real admin routes

### Task 5.2: Rework admin mentors around approval and verification workflow

- suggested order: 15
- complexity: `L`
- dependencies: approval display model, shared row/status components
- goal: make admin mentor management the strongest operational screen after public marketplace
- likely files affected: `routes/admin/mentors.tsx`
- acceptance criteria:
  - pending mentor review and active mentor management are clearly separated
  - approval and verification semantics are visible
  - route is ready for future real-data integration

### Task 5.3: Normalize admin users, reports, and settings routes

- suggested order: 16
- complexity: `M`
- dependencies: shared list/table and empty/error patterns
- goal: make admin secondary routes consistent and honest about backend support
- likely files affected: `routes/admin/users.tsx`, `reports.tsx`, `settings.tsx`
- acceptance criteria:
  - routes follow dashboard design language
  - unsupported features are framed clearly
  - tables/lists are structurally reusable for future API integration

## Milestone 6: Data Integration Preparation And Execution

### Task 6.1: Connect current user and learner profile surfaces to real data

- suggested order: 17
- complexity: `M`
- dependencies: auth flow, view models, learner profile UI
- goal: move the most grounded user data surfaces from static to real API-backed data
- likely files affected: auth hooks, learner profile route, related services/types
- acceptance criteria:
  - authenticated user information loads from real APIs
  - learner profile route renders real profile state
  - loading and error states are handled

### Task 6.2: Connect discover and mentor profile to real mentor data

- suggested order: 18
- complexity: `L`
- dependencies: mentor summary/detail models, public route refactors
- goal: integrate public mentor marketplace routes with backend mentor domain
- likely files affected: discover/profile routes, mentor services, query hooks, types
- acceptance criteria:
  - discover can render real mentor summaries
  - mentor profile can render real mentor detail sections
  - mock shapes no longer drive the public marketplace

### Task 6.3: Connect learner bookings, mentor schedule, and admin mentor review

- suggested order: 19
- complexity: `L`
- dependencies: booking, availability, approval display models
- goal: integrate the most workflow-heavy routes after UI structures are stable
- likely files affected: bookings route, schedule route, admin mentors route, services/hooks/types
- acceptance criteria:
  - booking lists reflect real booking states
  - mentor schedule reflects real availability windows
  - admin mentor review reflects real approval data

## Milestone 7: QA And Hardening

### Task 7.1: Cross-route QA pass

- suggested order: 20
- complexity: `M`
- dependencies: prior milestones
- goal: validate consistency and role flow health before wider rollout
- likely files affected: targeted fixes across touched routes/components
- acceptance criteria:
  - desktop and mobile layouts are reviewed
  - loading, empty, and error states exist for touched screens
  - no major framework conflicts remain

### Task 7.2: Validation command pass

- suggested order: 21
- complexity: `S`
- dependencies: prior milestones
- goal: verify engineering quality gates
- likely files affected: none unless fixes are required
- acceptance criteria:
  - `npm run format:write` passes
  - `npm run lint` passes
  - `npm run typecheck` passes
  - `npm run test` passes or documented if no meaningful tests exist
  - `npm run build` passes
