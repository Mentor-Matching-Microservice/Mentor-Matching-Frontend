# Design System

## Purpose

This file tracks the reusable design language for Mentor Matching.

Use it when AI needs to create or refactor:

- visual tokens
- shared components
- route layouts
- marketplace cards
- dashboards
- forms
- state patterns

## Current Sources

Primary code anchors:

- `frontend/app/app.css`
- `frontend/app/components/ui`
- `frontend/app/components`
- `frontend/app/layouts`

Engineering rules:

- `frontend/RULES.md`

Product rules:

- `frontend/docs/framework/PROJECT_CONTEXT.md`
- `frontend/docs/framework/DESIGN_RULES.md`

## Current Stack

- React 19
- React Router 7
- TypeScript
- Tailwind CSS v4
- shadcn/Radix-style primitives
- lucide-react icons
- framer-motion
- React Query
- Zustand

## UI Foundation Rule

For this project, `frontend/app/components/ui` is the primary low-level UI foundation.

That means:

- new screens should default to shadcn-based composition
- new domain components should usually be wrappers or compositions around these primitives
- custom visual components should exist for domain meaning, not because the primitive layer was ignored
- when a route looks outdated, first ask whether it should be rebuilt from `Card`, `Button`, `Badge`, `Tabs`, `Sheet`, `Dialog`, `Input`, `Select`, `Table`, `Skeleton`, and related primitives

## Existing Global Tokens

The app currently defines Tailwind theme tokens in `app.css`.

### Font

- Sans: `Public Sans`
- Fallbacks still reference `Inter` and `Outfit`

Guidance:

- Keep `Public Sans` as the practical default unless a brand refresh intentionally changes typography.
- Use compact typography for dashboards.
- Avoid adding new font packages without a specific design reason.
- If a premium accent type treatment is introduced later, limit it to public hero or section titles only.

### Core Colors

Current named colors include:

- `primary`: blue
- `primary-dark`: deeper blue
- `primary-light`: lighter blue
- `secondary`: purple
- `base`: page background
- `surface`: white surface
- `ink`: main text
- `muted`: secondary text
- `line`: border tone

Guidance:

- Keep blue as the primary action color.
- Use purple sparingly until a brand system is formally decided.
- Add semantic color usage in components before expanding decorative colors.
- Build contrast and hierarchy from neutrals first, not from extra accent colors.

### Semantic Colors To Standardize

These should be standardized across future implementation:

- success: approved, verified, confirmed, paid, completed
- warning: pending, attention, expiring
- danger: rejected, cancelled, failed, banned, suspended
- info: neutral system notices and informational states
- muted: inactive or secondary metadata

### Radius

Current code uses large rounded surfaces frequently:

- `rounded-lg`
- `rounded-xl`
- `rounded-2xl`
- `rounded-3xl`

Guidance:

- Use smaller radii for dense operational UI.
- Reserve large radius for a few public marketplace cards or standout moments only.
- Keep repeated item cards consistent within the same screen.

Preferred radius direction:

- controls: small to medium
- repeated data panels: medium
- public featured cards: medium to large, but not oversized everywhere

### Shadows

Current utilities:

- `shadow-soft`
- `shadow-lift`
- `shadow-glow`

Guidance:

- Use `shadow-soft` for light elevation.
- Use `shadow-lift` sparingly for hover or prominent marketplace cards.
- Avoid `shadow-glow` in dense dashboards unless a clear focus state needs it.

Preferred depth direction:

- most surfaces should rely on border and spacing first
- elevation should clarify priority, not decorate emptiness

## Existing Utility Classes

### `glass-panel`

Current use:

- semi-transparent white panel
- border
- soft shadow
- backdrop blur

Guidance:

- Suitable for selective public marketplace and light dashboard panels.
- Avoid overusing it for every surface.
- For operational tables and dense lists, prefer plain white surfaces with borders.
- If a route starts to look like “every section is the same frosted card”, reduce usage immediately.

### `card-hover`

Current use:

- hover lift
- border accent
- transition

Guidance:

- Suitable for clickable marketplace items.
- Avoid hover lift on static data panels.
- Keep motion subtle; the product should not feel like a showcase template.

### `text-gradient`

Current use:

- blue-to-purple gradient text

Guidance:

- Use sparingly on public pages.
- Avoid gradient text in dashboard and admin screens.
- Prefer strong plain text headings over decorative gradient headlines for most screens.

## Existing App Components

### `DashboardShell`

Purpose:

- role-based dashboard layout with sidebar, header, logout, and mobile menu

Used by:

- learner dashboard layout
- mentor dashboard layout
- admin dashboard layout

Guidance:

- Extend this for dashboard navigation consistency.
- Keep dashboard route content inside `DashboardPage` when possible.
- Keep shell styling practical and avoid role-specific visual gimmicks beyond accent-level differences.

### `DashboardPage`

Purpose:

- route title, description, simple page entrance motion, and default empty placeholder

Guidance:

- Use for dashboard screens.
- Keep page titles compact.
- Replace default empty placeholder with role-specific empty states when the route has real workflow meaning.
- Treat it as a structural wrapper, not as the source of visual personality.

### `RoleGuard`

Purpose:

- role-based route protection

Guidance:

- Use existing role guard patterns before adding custom access checks.

### `Navbar` And `Footer`

Purpose:

- public marketplace navigation and footer

Guidance:

- Keep public marketplace routes consistent.
- Update copy to education marketplace language when refactoring.
- Public navigation should feel product-like and direct, not like a marketing microsite.

### `SearchBar`

Purpose:

- public search entry point

Guidance:

- Should eventually support subject, grade, location, format, and goal-oriented search.
- Avoid treating it as only generic keyword search in future specs.
- Search should read like a tutoring tool, not a talent marketplace search box.

### `FilterSidebar`

Purpose:

- discovery filters

Guidance:

- Should align with backend catalog and mentor properties.
- Important future filters: subject, grade, meeting type, price range, availability, approval/trust signals, mentor style.
- Filters should be grouped by how parents and learners actually decide, not by arbitrary metadata buckets.

### `MentorCard`

Purpose:

- repeated public mentor listing card

Guidance:

- Should eventually show real education marketplace data:
  name, headline, subjects/grades, price range, rating, review count, meeting type, trust status.
- Avoid generic professional expertise copy.
- The strongest information should be visible in the top half of the card.
- Repeated mentor cards should feel comparison-friendly before they feel “premium”.

### `BookingSidebar`

Purpose:

- booking summary and action area on mentor profile

Guidance:

- Should reflect mentor offering, availability, selected date/time, total price, and payment next step.
- Must use mentor offering id semantics when integrated.
- It should behave more like a focused booking panel than a pricing promo card.

### `SectionTitle`

Purpose:

- reusable section headings

Guidance:

- Useful for public pages and profile sections.
- Keep dashboard usage restrained.
- Use fewer section headers per page; too many weakens hierarchy.

### `SubjectCard`

Purpose:

- subject/category preview card

Guidance:

- Should align with catalog subjects and grades when integrated.

### `RatingStars`

Purpose:

- visual rating display

Guidance:

- Pair with numeric rating and review count.
- Do not use as the only review signal when tags are available.
- Use as support, not as the main trust signal on its own.

### `TestimonialCard`

Purpose:

- public testimonial display

Guidance:

- Use carefully; real review data should eventually come from booking reviews.
- Avoid leaning on testimonials as the main proof mechanism once real review data is available.

## UI Primitive Inventory

Existing low-level UI primitives include:

- alert dialog
- avatar
- badge
- button
- card
- checkbox
- dialog
- dropdown menu
- input
- label
- radio group
- select
- separator
- sheet
- skeleton
- sonner
- switch
- table
- tabs
- textarea
- tooltip

Guidance:

- Prefer these primitives for new forms, filters, dialogs, status badges, tables, and sheets.
- Import from `@/components/ui/...` according to existing patterns.
- Do not create custom form controls when an existing primitive fits.
- When modernizing old routes, prefer replacing ad hoc panels and controls with these primitives before inventing new visual shells.

## Recommended Shared Patterns To Build

These are good candidates for future shared components.

### Status Badge

Purpose:

- consistent visual mapping for booking, payment, mentor approval, user status, and verification states

Likely consumers:

- learner bookings
- mentor schedule
- admin mentor management
- payment screens
- profile review flows

### Empty State

Purpose:

- reusable empty state with icon, title, description, optional action

Likely consumers:

- favorites
- messages
- bookings
- mentor students
- reports

### Data Row / List Item

Purpose:

- dense repeated row for dashboard entities

Likely consumers:

- bookings
- students
- admin users
- admin mentors
- reports

### Mentor Offering Selector

Purpose:

- choose mentor subject-grade-price offering before booking

Likely consumers:

- mentor profile
- booking flow

### Availability Picker

Purpose:

- choose a real available session window

Likely consumers:

- booking flow
- mentor schedule

### Profile Trust Block

Purpose:

- present verification, approval, highlights, achievements, and review summary consistently

Likely consumers:

- mentor profile
- admin mentor review

### Public Section Band

Purpose:

- create stronger full-width public sections without turning everything into cards

Likely consumers:

- home
- discover supporting sections
- mentor profile summary bands

## State Patterns

### Loading

- Use skeletons for cards, lists, and tables.
- Preserve layout shape where possible.
- Avoid global spinners for screen-level data that has predictable structure.

### Empty

- Show what is missing.
- Explain why the user sees this state.
- Offer one useful next action when possible.

### Error

- State the failed action.
- Preserve user context.
- Offer retry or navigation recovery.

### Success

- Confirm the completed action.
- Show the next useful step.
- Use success color with clear label.

### Disabled

- Explain unavailable actions when the reason is not obvious.
- Avoid disabled primary buttons with no supporting context in workflows.

## Data Display Rules

### Mentor Cards

Prioritize:

- name and headline
- subjects and grade levels
- price range
- rating/reviews
- meeting type
- trust/approval signal

Keep de-emphasized:

- decorative gradients
- non-essential social proof
- long bios in list contexts

### Booking Rows

Prioritize:

- mentor or learner name
- subject and grade snapshot
- date and time
- status
- payment state when relevant
- next action

### Admin Rows

Prioritize:

- entity identity
- current status
- risk or review signal
- timestamp
- primary action

Avoid:

- wide decorative cards when a dense structured row communicates better

## Documentation Rule

When a new reusable pattern is created or a component's meaning changes, update this file and `frontend/docs/generated/COMPONENT_INVENTORY.md`.
