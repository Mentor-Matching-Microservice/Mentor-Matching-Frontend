# Component Inventory

## Inventory Scope

- date: 2026-06-07
- source: current frontend implementation plus framework docs
- purpose: identify what we can reuse now, what needs refactor, and what should be added before broader implementation

## Existing Reusable Components

- component: `StatusBadge`
  status: added in Milestone 1
  notes: shared status vocabulary for booking, payment, mentor approval, verification, and user states; now composed on top of `ui/badge` so tone, spacing, and border treatment stay aligned with the primitive layer; currently adopted by learner bookings, mentor cards, mentor profile, mentor dashboard, mentor schedule, mentor students, mentor earnings, admin dashboard queues, admin mentor review, and admin users surfaces

- component: `EmptyState`
  status: added in Milestone 1
  notes: shared empty/placeholder state with icon, title, helper copy, and optional action; now uses `ui/card` and `ui/button` primitives; used by `DashboardPage` default content plus filtered empty states in learner bookings and admin mentor management

- component: `ScreenErrorState`
  status: added in Milestone 1
  notes: shared screen-level error/retry surface built on `EmptyState` and `ui/button`; ready for API-backed routes as data integration expands

- component: `DashboardShell`
  status: stable reusable foundation
  notes: correct choice for all role dashboards; header and shell actions now reuse `ui/button` styling so workspace controls inherit one shared action system

- component: `DashboardPage`
  status: reusable foundation
  notes: good page wrapper; default placeholder delegates to `EmptyState`, keeps dashboard headings compact per design rules, and remains the route-level shell instead of inventing mentor-specific wrappers

- component: `DashboardSectionHeader`
  status: added in Milestone 3
  notes: lightweight shared header for learner, mentor, and admin workspace sections with optional helper copy and right-aligned actions; used to keep dashboard, bookings, schedule, students, earnings, profile, reports, and settings routes focused on composition instead of repeating section chrome

- component: `WorkspacePanel`
  status: added in workspace route refactor
  notes: shared role-workspace section shell composed from `ui/card` plus `DashboardSectionHeader`; now the default panel wrapper for learner, mentor, and admin route sections so route files do not keep rebuilding the same heading, spacing, and border structure

- component: `WorkspaceMetricCard`
  status: added in workspace route refactor
  notes: compact summary card for operational metrics and weekly signals; used across learner, mentor, and admin dashboards plus earnings and users summary surfaces to keep metric density and icon treatment consistent

- component: `WorkspaceActionCard`
  status: added in workspace route refactor
  notes: shared linked action card for role workspaces; keeps quick-action sections on learner, mentor, and admin routes aligned to one buttonless card pattern instead of ad hoc hover panels

- component: `WorkspaceNotice`
  status: added in workspace route refactor
  notes: shared informational or warning notice built from `ui/card`; used for static-phase caveats, route-scope warnings, and implementation notes across learner, mentor, and admin screens

- component: `RoleGuard`
  status: stable reusable foundation
  notes: should remain the standard role gate for learner, mentor, and admin route groups

- component: `Navbar`
  status: reusable with content revision
  notes: public navigation now uses Mentor Matching branding and discovery-first labels; keep it as the shared shell for public routes

- component: `Footer`
  status: reusable with tutoring-domain revision
  notes: footer now reinforces approved mentors, offering-based discovery, and practical discovery/login entry points instead of generic newsletter-style messaging; the current version also mirrors the calmer public card-and-action hierarchy used on Home, Discover, and Mentor Profile

- component: `SearchBar`
  status: reusable with milestone 2 and shared-foundation refactor
  notes: supports tutoring-domain helper copy, controlled keyword/context fields, submit handling, and quick-tag shortcuts for home and discover surfaces; the current composition keeps one search card with labeled fields, helper guidance, and quick tags in the same rhythm, and is built from `ui/card`, `ui/input`, `ui/button`, and `ui/separator`

- component: `FilterSidebar`
  status: reusable with milestone 2 and shared-foundation refactor
  notes: accepts reusable filter groups plus controlled selected values, and groups tutoring criteria such as subject, grade, meeting type, price, availability, and trust for both desktop and mobile discover flows; the current version also surfaces selected-count context and calmer option cards, and is built from `ui/card`, `ui/checkbox`, `ui/button`, `ui/badge`, and `ui/separator`

- component: `MentorCard`
  status: reusable with milestone 2 and shared-foundation refactor
  notes: emphasizes mentor offerings, expertise fit, trust state, availability hint, and comparison-friendly metadata instead of a soft marketing-card treatment; the latest pass tightens header, stats, offering rows, and CTA spacing into one calmer comparison card using `ui/card`, `ui/button`, `ui/badge`, and `ui/separator`

- component: `BookingSidebar`
  status: reusable with milestone 2 and shared-foundation refactor
  notes: summarizes the selected offering, near-term availability windows, weekly schedule, trust badges, next-step guidance, and a session estimate; the latest pass also supports class-based layout control so Mentor Profile can place booking earlier on mobile, and its low-level structure now comes from `ui/card`, `ui/button`, `ui/badge`, and `ui/separator`

- component: `MentorTrustBlock`
  status: added in Milestone 2
  notes: shared public trust summary for approval status, verification status, highlights, and mentor achievements; first used on mentor profile and intended for future admin mentor review reuse; now built from `ui/card` and `ui/badge`

- component: `SectionTitle`
  status: reusable
  notes: suitable for public screens and profile sections; the current version uses tighter title/subtitle rhythm for calmer hierarchy and should still be used more selectively in dense dashboards

- component: `SubjectCard`
  status: reusable with milestone 2 refactor
  notes: now presents subject description and grade coverage through the shared card/badge language so the home page can lead users into discovery from tutoring-domain entry points

- component: `RatingStars`
  status: reusable
  notes: keep as a presentational helper, paired with numeric rating and review count

- component: `TestimonialCard`
  status: reusable with copy refactor
  notes: acceptable for public proof sections until real review excerpts replace generic professional stories

## Existing UI Primitives Ready For Use

- component: `ui/button`
  status: stable
  notes: base action primitive with shared variants and sizes; `app/components/Button` now maps onto this primitive for compatibility

- component: `ui/badge`
  status: stable
  notes: best base for shared status badge system and shared chips/tags such as meeting-type and highlight labels

- component: `ui/card`
  status: stable
  notes: default low-level panel/card surface for shared dashboard and marketplace components

- component: `ui/input`
  status: stable
  notes: default text input for search and form entry before building custom wrappers

- component: `ui/label`
  status: added in workspace route refactor
  notes: lightweight label primitive for learner and mentor profile forms so form copy and spacing stay aligned with the shared primitive layer

- component: `ui/select`
  status: added in workspace route refactor
  notes: shared styled select wrapper currently used by learner profile and admin user filters to avoid falling back to route-local control styling

- component: `ui/table`
  status: added in workspace route refactor
  notes: shared table wrapper for admin user lists and future dense admin or booking views; keeps headers, rows, and cell spacing inside the same low-level vocabulary as cards and inputs

- component: `ui/checkbox`
  status: stable
  notes: default boolean control for shared filter and form patterns

- component: `ui/textarea`
  status: stable
  notes: default multi-line text control for future profile and workflow forms

- component: `ui/separator`
  status: stable
  notes: default low-level divider for dense filter, panel, and dashboard sections

## Additional UI Primitives Worth Adding Later

- component: `ui/sheet`
  reason: mobile filters and future mobile detail panels would benefit from a consistent slide-over primitive

- component: `ui/dialog`
  reason: focused confirmations and future operational actions should share one modal foundation

- component: `ui/radio-group`, `ui/switch`
  reason: schedule and settings forms will need broader form coverage as API integration expands

- component: `ui/skeleton`
  reason: route-level loading states should eventually use one shared placeholder language

- component: `ui/tooltip`
  reason: dense admin and dashboard actions will likely need compact explanatory affordances

## Components Needing Further Evolution Before Broad Reuse

- component: `DashboardPage`
  reason: route teams may still want a light way to override placeholder tone or actions without reimplementing the wrapper
  likely consumers: most dashboard routes

- component: `Data list / table row pattern`
  reason: many dashboard routes still render repeated operational rows directly in route files
  likely consumers: learner bookings, mentor students, mentor earnings, admin users, admin mentors, reports

## Candidate Shared Components To Add

- component: `DashboardSectionHeader`
  reason: role dashboards currently improvise subsection headers and action rows
  likely consumers: learner dashboard, mentor dashboard, admin dashboard

- component: `DataListRow`
  reason: repeated booking, student, user, mentor, and report rows should not each invent their own layout
  likely consumers: learner bookings, mentor students, admin users, admin mentors, reports

- component: `MentorOfferingSelector`
  reason: booking must reflect mentor-specific subject/grade/price offerings
  likely consumers: mentor profile, future booking flow

- component: `AvailabilityPicker`
  reason: mentor schedule and booking need a shared mental model for time windows
  likely consumers: mentor schedule, mentor profile booking section

## Components To Avoid Duplicating

- Do not create separate status pills per screen.
- Do not create separate dashboard page wrappers for learner, mentor, and admin without a proven need.
- Do not create another mentor summary card while `MentorCard` can be refactored.
- Do not create route-specific filter sidebars if `FilterSidebar` can be evolved.
- Do not build custom low-level inputs when `app/components/ui` already provides equivalents.
