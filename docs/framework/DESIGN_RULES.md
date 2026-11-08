# Design Rules

This file defines UI and UX rules for Mentor Matching.

It complements `frontend/RULES.md`. Engineering conventions still live there.

## Product Design Direction

Mentor Matching should feel like a credible education marketplace for learners, parents, mentors, and operators.

The interface should communicate:

- trust without feeling corporate-heavy
- warmth without looking childish
- structure without becoming visually cold
- actionability for dashboards and operational workflows

The intended visual direction is:

- clean tutoring marketplace first
- modern premium in finish, not in decoration
- useful before expressive
- distinctive through hierarchy, tone, and restraint rather than through flashy effects

## Design Principles

### Trust First

Users are choosing real people for real learning sessions.

Prioritize:

- verification and approval clarity
- honest pricing and session details
- clear mentor qualifications
- visible review and feedback signals
- readable policies and state labels

### Matchmaking Clarity

Learners and parents need to answer:

- Does this mentor teach the right subject and grade?
- Is the mentor suitable for this learning goal?
- Is the mentor available in the right format?
- What will a session cost?
- What happens next after booking?

Design discovery, cards, profile pages, and booking UI around those questions.

### Operational Efficiency

Dashboards should be practical and scannable.

Prioritize:

- status visibility
- compact information hierarchy
- clear next actions
- predictable navigation
- tables or dense lists where repeated review is expected

### Consistency Over Novelty

New screens should feel like part of the same product.

Use familiar patterns across:

- learner bookings
- mentor schedule
- admin approval queues
- payment states
- review states

### Avoid Template-Looking UI

The product should not feel like a generic AI-generated marketplace.

Avoid:

- oversized landing-page hero patterns with vague claims
- interchangeable startup-style metric banners
- repeated glass cards for every section
- decorative gradients standing in for product meaning
- identical rounded cards with the same visual weight everywhere
- generic testimonial blocks that could belong to any SaaS site

Prefer:

- domain-specific information hierarchy
- fewer, stronger surfaces
- real content density where users need to compare options
- layouts that reveal tutoring fit, trust, and next action quickly

## Visual Tone

Aim for:

- clean educational marketplace
- calm, modern, and trustworthy
- light surfaces with clear borders
- restrained blue as the primary action color
- semantic status colors for operational states
- premium through typography, spacing rhythm, and disciplined contrast
- less “soft UI”, more editorial clarity on public pages and operational clarity in dashboards

Avoid:

- generic tech-startup mentor marketplace copy
- overly decorative dashboard cards
- excessive gradients
- purple-heavy visual systems
- oversized dashboard headings
- visual effects that reduce readability
- generic “AI template” compositions that look polished but say nothing product-specific

## Color Rules

Use colors semantically.

- Primary: main action, focused navigation, selected filters.
- Success: paid, confirmed, verified, approved, completed.
- Warning: pending, expiring, needs review, attention.
- Danger: rejected, cancelled, failed, banned, suspended.
- Muted: secondary text, helper copy, inactive metadata.
- Border/surface: grouping, separation, and density control.

Do not rely on color alone. Pair color with text, icon, or status label.

Current code contains blue and purple accents. Future UI should keep blue as the main action family and use purple sparingly, unless a later brand decision changes this.

Recommended direction:

- blue for action and navigation focus
- slate/ink neutrals for structure
- warm off-white or cool white surfaces only in small doses where it helps depth
- semantic colors for system status only

Avoid:

- blue-purple gradient dependence
- one-note color stories
- colorful sections that compete with trust and booking information

## Typography Rules

- Use existing project font setup unless the design system is intentionally updated.
- Keep dashboard headings compact.
- Use strong hierarchy for public marketplace screens.
- Use smaller, tighter headings inside cards, sidebars, tables, and panels.
- Avoid negative letter spacing.
- Keep long Vietnamese text readable with comfortable line height.
- Use typography to create distinction instead of oversized decorative containers.
- Keep line lengths disciplined in profile and dashboard copy.

Recommended roles:

- Display: public homepage or major marketplace headline only.
- Page title: route title and dashboard title.
- Section title: card group or screen section label.
- Body: normal content, descriptions, profile copy.
- Metadata: dates, prices, status details, timestamps.
- Data label: compact labels for metrics and transaction records.

## Layout Rules

### Public Marketplace

Use layouts that help users browse and compare:

- clear search and filter entry
- mentor cards with consistent data hierarchy
- profile pages with a strong summary and practical booking area
- visible next action without hiding important trust details
- content bands that feel intentional, not endlessly card-stacked
- one dominant purpose per viewport section

Public pages should feel more like:

- a curated tutoring marketplace
- a serious learning product

Public pages should feel less like:

- a startup landing page template
- a generic freelancer or coach directory

### Dashboards

Use work-focused layouts:

- page title and short description
- metric row only when useful
- main content list/table/calendar
- side panels only when they improve scanning
- compact action areas
- section bands or structured grids over piles of equal-looking cards

Avoid making dashboard sections feel like marketing blocks.

### Forms And Workflows

Use clear progressive structure:

- one primary action per step
- visible required fields
- inline validation
- summary before final booking or payment action
- recovery path for failed or cancelled states

## Component Rules

- Reuse `app/components/ui` primitives before creating custom low-level UI.
- Reuse app components under `app/components` before creating new shared components.
- Build modern screens by composing shadcn primitives first, then layering domain meaning on top.
- Use lucide icons for recognizable actions and states.
- Keep repeated cards visually consistent.
- Prefer badges for statuses and tags.
- Prefer tables or structured lists for admin and operational repeated data.
- Avoid creating multiple nearly identical card variants.
- Prefer panels with distinct roles over grids of decorative summary cards.
- Do not let every component compete equally for attention.
- If an older custom component can be simplified into shadcn-based composition, prefer that direction during refactors.

## Status Design Rules

Backend statuses must map to clear UI states.

### Booking

- `PENDING`: waiting for confirmation or payment action.
- `CONFIRMED`: booked and upcoming.
- `COMPLETED`: session finished and review may be available.
- `CANCELLED`: cancelled by a user or admin context.
- `REJECTED`: mentor/admin declined the booking.
- `NO_SHOW`: session did not happen as expected.

### Payment

- `PENDING`: payment started or waiting.
- `PAID`: payment succeeded.
- `FAILED`: payment failed and needs recovery.
- `CANCELLED`: payment was cancelled.
- `REFUNDED`: money was returned.

### Mentor Approval

- `PENDING`: profile/application needs review.
- `APPROVED`: public-ready mentor.
- `REJECTED`: not approved; show reason internally.
- `SUSPENDED`: disabled by platform action.

## Interaction Rules

- Primary actions should be visible and specific.
- Secondary actions should not compete with the primary action.
- Filters should preserve user context.
- Empty states should guide the next useful action.
- Loading states should preserve layout shape where possible.
- Error states should explain what failed and what can be done next.
- Destructive actions need confirmation.
- Reduce interaction noise. Not every surface needs hover drama or animated emphasis.

## Responsive Rules

- Public discovery should shift from sidebar filters to a mobile filter sheet.
- Mentor profile booking summary should remain reachable on mobile.
- Dashboard navigation should collapse predictably.
- Data-heavy admin screens should use responsive tables or stacked rows.
- Avoid horizontal overflow except for intentionally scrollable tables.

## Accessibility Rules

- Maintain visible focus states.
- Use semantic headings in order.
- Label inputs and icon-only buttons.
- Keep contrast high enough for status text and controls.
- Do not communicate state by color alone.
- Ensure keyboard users can navigate nav, dialogs, filter sheets, and forms.

## Copy Rules

Use product language aligned with the education marketplace.

Prefer:

- mentor
- learner
- parent
- subject
- grade
- session
- booking
- teaching style
- learning goal
- availability

Avoid defaulting to broad professional marketplace language like:

- career coach
- startup mentor
- portfolio mentor
- industry expert

Use Vietnamese copy where the current screen already uses Vietnamese, and keep tone clear, direct, and supportive.

## Anti-Patterns

- treating mentor subjects as generic categories
- hiding price or availability until too late
- showing trust badges without explaining their meaning
- dashboard pages that are mostly decorative
- inconsistent radius and shadow between repeated cards
- status colors without text labels
- mock data that contradicts the backend domain
- homepage sections that could be swapped into any AI-built directory
- too many panels using the same blur, border, radius, and elevation
- premium styling that weakens comparison or scanning
