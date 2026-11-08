# QA Checklist

## Scope

Use this checklist during implementation and again before considering a frontend milestone done.

This checklist is tailored to Mentor Matching, not a generic UI project.

## Product Alignment

- Public marketplace copy reflects tutoring and education, not generic career mentorship.
- Subject, grade, session, learner, mentor, and booking language is used consistently.
- Mentors are presented as education providers with trust and teaching fit, not generic experts.
- Favorites, messages, reports, and settings screens do not imply backend completeness that does not exist.

## Visual Consistency

- The screen follows `DESIGN_RULES.md`.
- The screen reuses existing system primitives and shared app components where appropriate.
- Blue remains the primary action family.
- Purple is not overused in operational screens.
- Radius and shadow levels match surrounding route patterns.
- Dashboard screens feel work-focused rather than decorative.

## Component Reuse

- `DashboardShell` is used for role workspaces.
- `DashboardPage` or a stronger shared pattern is used consistently.
- Shared status badges are reused rather than recreated per route.
- Empty and error states reuse shared components.
- No duplicate versions of mentor card, booking card, or row patterns are introduced without justification.

## Public Marketplace Checks

- Home clearly explains the tutoring marketplace value proposition.
- Discover filters reflect subject, grade, meeting type, price, availability, and trust concepts where relevant.
- Mentor cards show domain-correct information.
- Mentor profile exposes trust, offerings, reviews, and booking context.
- Booking entry points are visible without forcing the user to hunt for them.

## Learner Flow Checks

- Learner dashboard highlights upcoming sessions and next actions.
- Learner bookings reflect backend booking semantics.
- Payment and booking statuses are distinguishable.
- Empty states direct learners back to discovery or profile completion when relevant.
- Profile editing is clear and validation messages are helpful.

## Mentor Flow Checks

- Mentor dashboard focuses on teaching operations.
- Schedule UI represents recurring and specific-date availability conceptually.
- Students screen reads like booked learner relationships, not a generic contact list.
- Earnings screen reflects booking-linked income expectations.
- Mentor profile management prioritizes offerings, trust, and teaching content.

## Admin Flow Checks

- Admin dashboard emphasizes action queues and marketplace oversight.
- Admin mentor review clearly distinguishes approval and verification concepts.
- Admin user/report/settings surfaces stay consistent with the operational design language.
- Admin routes do not rely on decorative metrics as the main content.

## Data And State Semantics

- Mentor offerings are treated as mentor-specific subject/grade/price units.
- Past bookings are displayed as snapshots rather than live profile data.
- Booking statuses use backend-supported meanings.
- Payment statuses use backend-supported meanings.
- Approval statuses use backend-supported meanings.
- Review UI allows for both ratings and qualitative feedback/tag concepts where relevant.

## Loading, Empty, Error

- Screen-level loading states preserve layout shape.
- Empty states explain what is missing and suggest a next useful action.
- Error states explain what failed and offer recovery where possible.
- Placeholder content does not masquerade as final integrated data.

## Responsive

- Screen works on mobile widths.
- Screen works on tablet widths.
- Screen works on desktop widths.
- Navigation remains usable on small screens.
- Filters, tables, and side panels degrade gracefully.
- No unintended horizontal overflow exists.

## Accessibility

- Semantic heading order is preserved.
- Inputs and icon buttons are labeled.
- Focus states are visible.
- Keyboard navigation works for nav, tabs, sheets, dialogs, and form controls.
- Status meaning does not rely on color alone.
- Contrast is acceptable for text, badges, and controls.

## Code Quality

- Implementation follows `frontend/RULES.md`.
- Routes remain focused on screen composition.
- Reusable logic is placed in hooks, services, components, or utilities appropriately.
- Shared types are explicit and avoid `any`.
- Internal imports use the `@` alias where applicable.
- New UI abstractions solve real reuse needs rather than adding noise.

## Validation Commands

- `npm run format:write`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Release Readiness

- Framework docs still match the implemented reality.
- `DECISIONS.md` reflects meaningful tradeoffs or assumptions.
- `COMPONENT_INVENTORY.md` includes any new shared components.
- The touched route is ready either for real data integration or for a clearly documented placeholder state.
