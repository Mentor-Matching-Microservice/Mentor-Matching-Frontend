# Screen Specs

## Purpose

This file defines screen-level expectations for the current frontend route map.

Use it before designing or implementing a route so AI does not reinvent the product flow.

## Screen Spec Template

Use this shape when adding or expanding a screen:

```text
### Screen Name

- route:
- audience:
- primary job:
- success state:
- primary actions:
- secondary actions:
- key sections:
- key data:
- backend domain anchors:
- loading state:
- empty state:
- error state:
- responsive notes:
- accessibility notes:
- current implementation notes:
```

## Public Marketplace

### Home

- route: `/`
- audience: guests, learners, parents, prospective mentors
- primary job: introduce the marketplace and drive users to mentor discovery or mentor onboarding
- success state: user understands the platform is for finding education mentors and moves to discovery or login
- primary actions: search/find mentor, browse mentors, start as learner, start as mentor
- secondary actions: view popular subjects, read trust/review signals
- key sections: hero/search, marketplace stats, featured mentors, popular subjects, learner CTA, mentor CTA, testimonials
- key data: subject categories, featured approved mentors, review/testimonial highlights, trust claims
- backend domain anchors: mentor profiles, catalog subjects/grades, reviews, mentor approval status
- loading state: skeleton cards for featured mentors and subjects if data is fetched
- empty state: hide featured sections or show curated category entry if no mentor data is available
- error state: keep static marketing content visible and show retry for dynamic sections
- responsive notes: search stays prominent; mentor cards stack; next section should remain reachable without excessive scrolling
- accessibility notes: hero search must have label; CTAs must be descriptive
- current implementation notes: route exists as `HomeFesba.tsx`; current copy/data is partly generic professional mentorship and should be aligned with tutoring domain

### Discover Mentors

- route: `/discover`
- audience: learners and parents
- primary job: find and compare mentors
- success state: user selects a mentor profile or narrows results confidently
- primary actions: search, filter, sort, open mentor profile
- secondary actions: paginate/load more, save favorite, clear filters
- key sections: page header, search bar, filter sidebar/sheet, result count/sort, mentor result grid/list, pagination
- key data: mentor name, headline, subjects, grades, price, rating, review count, meeting type, availability hint, approval/trust status
- backend domain anchors: mentor profiles, mentor subjects, subject grades, catalog, reviews, availability
- loading state: skeleton filter summary and mentor cards
- empty state: explain no matches and offer clear filters action
- error state: show failed mentor search state with retry
- responsive notes: desktop uses sidebar filters; mobile uses sheet filters; cards should be comparable without horizontal scrolling
- accessibility notes: filters need labels; selected filters should be announced through visible chips/text
- current implementation notes: route exists; uses local `mentors` mock and `FilterSidebar`

### Mentor Profile

- route: `/mentor/:id`
- audience: learners and parents
- primary job: evaluate a mentor and start booking
- success state: user understands fit, price, availability, and next booking action
- primary actions: select offering, choose time, book session
- secondary actions: go back to discovery, save mentor, message/contact when available
- key sections: profile summary, trust/verification, subjects and grades, teaching style, achievements, reviews, availability, booking summary
- key data: mentor identity, approval/verification state, headline, introduction, teaching style, offerings, price per hour, meeting type, achievements, rating, reviews, availability windows
- backend domain anchors: mentor profiles, mentor verifications, mentor subjects, achievements, reviews, mentor availabilities, bookings
- loading state: profile header skeleton plus booking panel skeleton
- empty state: if mentor not found, show not-found state with link to discovery
- error state: show retry and preserve route context
- responsive notes: booking panel should remain easy to reach on mobile; profile sections stack in a clear order
- accessibility notes: booking controls must be labeled; ratings need text equivalent
- current implementation notes: route exists; uses mock mentor data and `BookingSidebar`

## Authentication

### Login

- route: `/login`
- audience: guests
- primary job: sign into the correct role experience
- success state: authenticated user is redirected to their role dashboard or original destination
- primary actions: submit email/password
- secondary actions: navigate home/discovery, register if implemented later
- key sections: form, validation messages, demo account guidance if intentionally shown
- key data: email, password, redirect target, auth response user role
- backend domain anchors: auth login, JWT, refresh token, user role
- loading state: submit button loading state
- empty state: not applicable
- error state: invalid credentials, inactive/banned account, network failure
- responsive notes: form remains centered and readable on mobile
- accessibility notes: labels, validation messages, keyboard submit, password visibility if added
- current implementation notes: route exists under guest layout

## Learner Workspace

### Learner Dashboard

- route: `/user`
- audience: authenticated learners and parents
- primary job: summarize upcoming learning activity and guide next actions
- success state: learner can see next session, progress cues, and quick routes
- primary actions: view upcoming booking, find mentor, enter session if available
- secondary actions: open messages, view profile, review completed session
- key sections: upcoming session, learning goal/progress, recommended mentors/subjects, quick actions, recent booking history
- key data: learner profile, bookings, booking status, subject snapshots, mentor snapshots, review prompts
- backend domain anchors: learner profile, bookings, reviews, mentor summaries
- loading state: dashboard skeleton metrics and booking cards
- empty state: no bookings should guide user to discovery
- error state: show retry while keeping navigation available
- responsive notes: quick actions and upcoming sessions stack cleanly
- accessibility notes: booking action labels should include subject/time context
- current implementation notes: route exists with hardcoded data and gamified progress elements

### Learner Bookings

- route: `/user/bookings`
- audience: authenticated learners and parents
- primary job: manage upcoming and historical sessions
- success state: learner can identify status and next action for each booking
- primary actions: join session, view detail, pay if pending, cancel if allowed, review completed session
- secondary actions: filter by status, search mentor/subject
- key sections: status tabs, search/filter, booking list/table, booking detail action
- key data: booking date/time, mentor snapshot, subject/grade snapshot, meeting type/link/address, booking status, payment status, total amount
- backend domain anchors: bookings, payments, reviews
- loading state: booking row skeletons
- empty state: no bookings should link to discovery
- error state: failed booking fetch with retry
- responsive notes: rows become stacked cards on mobile
- accessibility notes: tabs must be keyboard accessible; status badges include text
- current implementation notes: route exists with hardcoded bookings

### Learner Favorites

- route: `/user/favorites`
- audience: authenticated learners and parents
- primary job: revisit saved mentors
- success state: user can compare saved mentors and continue to profile/booking
- primary actions: open mentor profile, remove favorite
- secondary actions: filter/sort saved mentors
- key sections: saved mentor list, empty state
- key data: mentor summary, offerings, price, rating, meeting type, trust state
- backend domain anchors: no explicit favorites table observed yet; may be frontend-only or future backend feature
- loading state: mentor card skeletons
- empty state: encourage discovery
- error state: retry saved mentors fetch if backed by API
- responsive notes: cards stack on mobile
- accessibility notes: remove action requires clear label
- current implementation notes: route exists; likely placeholder

### Learner Messages

- route: `/user/messages`
- audience: authenticated learners and parents
- primary job: communicate around sessions or support
- success state: user can view conversations and continue a message thread
- primary actions: open conversation, send message
- secondary actions: search conversations, mark read
- key sections: conversation list, message thread, empty state
- key data: counterpart, last message, timestamp, unread count, booking context if available
- backend domain anchors: no message module observed yet; notifications exist
- loading state: conversation skeleton
- empty state: no conversations; link to bookings/discovery
- error state: retry message fetch
- responsive notes: mobile switches between list and thread
- accessibility notes: input labels and live-region-like feedback for send result
- current implementation notes: route exists; likely placeholder

### Learner Profile

- route: `/user/profile`
- audience: authenticated learners and parents
- primary job: manage account and learning context
- success state: learner profile is accurate and useful for matching
- primary actions: edit personal info, edit learning goal, save
- secondary actions: change grade/school context, update phone
- key sections: account info, learner profile, learning goal, preferences
- key data: user, learner profile, grade
- backend domain anchors: users, learner profiles, grades
- loading state: form skeleton
- empty state: incomplete profile prompt
- error state: validation and save errors
- responsive notes: single-column form on mobile
- accessibility notes: form labels, field errors, submit state
- current implementation notes: route exists

## Mentor Workspace

### Mentor Dashboard

- route: `/mentor-panel`
- audience: authenticated mentors
- primary job: summarize teaching activity and next actions
- success state: mentor sees upcoming sessions, active students, reviews, and profile/schedule actions
- primary actions: manage schedule, view upcoming session, edit profile
- secondary actions: view students, view earnings
- key sections: metrics, upcoming sessions, quick actions, review or approval notices
- key data: booking count, upcoming bookings, active learner snapshots, average rating, approval status
- backend domain anchors: bookings, reviews, mentor profile, mentor approval
- loading state: metric and list skeletons
- empty state: no sessions; guide to schedule/profile completion
- error state: retry dashboard data
- responsive notes: metric cards wrap; upcoming sessions list stacks
- accessibility notes: session actions include date/time context
- current implementation notes: route exists with hardcoded metrics

### Mentor Schedule

- route: `/mentor-panel/schedule`
- audience: authenticated mentors
- primary job: manage availability and view teaching calendar
- success state: mentor can create/update recurring and specific-date availability windows
- primary actions: add availability, edit availability, remove availability
- secondary actions: view bookings for selected day/week
- key sections: calendar/week view, availability list, booking list, add/edit form
- key data: recurring windows, specific-date windows, upcoming bookings, meeting type
- backend domain anchors: mentor availabilities, bookings
- loading state: calendar/list skeleton
- empty state: no availability; prompt to add windows
- error state: failed schedule fetch or save with retry
- responsive notes: mobile uses agenda/list first, calendar second
- accessibility notes: date/time controls must be labeled
- current implementation notes: route exists

### Mentor Students

- route: `/mentor-panel/students`
- audience: authenticated mentors
- primary job: track learners connected through bookings
- success state: mentor can see active/recent students and session context
- primary actions: view student/session details
- secondary actions: filter by active/completed, message if supported
- key sections: student list, recent sessions, progress or notes placeholder
- key data: learner snapshot, booking count, recent subject, next session, status
- backend domain anchors: bookings, learner/user summary
- loading state: row skeletons
- empty state: no students; guide to profile/schedule completion
- error state: retry student list
- responsive notes: rows stack on mobile
- accessibility notes: action labels include learner name
- current implementation notes: route exists

### Mentor Earnings

- route: `/mentor-panel/earnings`
- audience: authenticated mentors
- primary job: understand income from completed or paid bookings
- success state: mentor can see revenue summary and transaction history
- primary actions: review payment/earning detail
- secondary actions: filter by period/status
- key sections: earnings summary, payment list, period filter
- key data: booking snapshots, payment status, amount, paid date, payout-like status if future feature exists
- backend domain anchors: payments, bookings
- loading state: metric/table skeletons
- empty state: no earnings yet
- error state: retry earnings fetch
- responsive notes: table becomes stacked rows
- accessibility notes: amounts and statuses are text-readable
- current implementation notes: route exists

### Mentor Profile Management

- route: `/mentor-panel/profile`
- audience: authenticated mentors
- primary job: maintain public profile, teaching offerings, and trust information
- success state: mentor profile is complete and ready for approval/public discovery
- primary actions: edit profile, edit teaching style, manage subjects/prices, upload verification if supported
- secondary actions: preview public profile
- key sections: profile basics, introduction, teaching style, subjects/grades/pricing, achievements, verification/approval status
- key data: mentor profile, mentor subjects, achievements, verification, approval status
- backend domain anchors: mentor profiles, mentor subjects, achievements, mentor verifications
- loading state: form skeleton
- empty state: incomplete profile checklist
- error state: validation and save errors
- responsive notes: long forms split into sections on mobile
- accessibility notes: field groups and validation messages
- current implementation notes: route exists

## Admin Workspace

### Admin Dashboard

- route: `/admin`
- audience: admins and possibly managers
- primary job: monitor platform state and action urgent review items
- success state: admin can see key system/marketplace signals and pending mentor reviews
- primary actions: open mentor approvals, inspect reports, view users
- secondary actions: check settings/system status
- key sections: metrics, pending mentor approvals, reports, system status
- key data: user counts, mentor counts, revenue/payment summary, pending approval count, report count
- backend domain anchors: users, mentor profiles, payments, reports if implemented, approval status
- loading state: metric and queue skeletons
- empty state: no pending approvals or reports
- error state: failed dashboard fetch with retry
- responsive notes: metrics wrap; approval queue becomes full-width list
- accessibility notes: approval actions require clear labels
- current implementation notes: route exists with placeholder data

### Admin Users

- route: `/admin/users`
- audience: admins
- primary job: review and manage user accounts
- success state: admin can locate users and understand role/status
- primary actions: search/filter users, view user detail, change status if supported
- secondary actions: export or paginate if implemented
- key sections: search/filter, user table/list, detail/action area
- key data: name, email, role, user type, status, created date
- backend domain anchors: users, learner profiles, mentor profiles
- loading state: table skeleton
- empty state: no matching users
- error state: retry user fetch
- responsive notes: table rows become stacked summaries
- accessibility notes: table headers and row actions labeled
- current implementation notes: route exists

### Admin Mentors

- route: `/admin/mentors`
- audience: admins and managers
- primary job: review mentor quality, approval, and verification state
- success state: admin can approve, reject, suspend, or inspect mentor profiles
- primary actions: review application, approve, reject, suspend
- secondary actions: filter by approval/verification/status, search
- key sections: approval queue, mentor list/table, profile review drawer/detail
- key data: mentor identity, approval status, verification status, subjects, experience, submitted/updated date, approval note
- backend domain anchors: mentor profiles, mentor verifications, mentor subjects, achievements
- loading state: table/list skeleton
- empty state: no mentors or no pending mentors
- error state: retry mentor fetch
- responsive notes: mobile should show row cards and detail sheet
- accessibility notes: destructive/approval actions need confirmation and labels
- current implementation notes: route exists

### Admin Reports

- route: `/admin/reports`
- audience: admins and managers
- primary job: review platform issues or operational reports
- success state: admin can triage and resolve issues
- primary actions: inspect report, mark resolved if supported
- secondary actions: filter by severity/status
- key sections: report list, status filters, detail panel
- key data: report type, related user/booking/mentor, status, timestamp, severity
- backend domain anchors: no report module observed yet; notifications exist
- loading state: report row skeleton
- empty state: no reports
- error state: retry report fetch
- responsive notes: list and detail become separate mobile views
- accessibility notes: status and severity labels must be text-visible
- current implementation notes: route exists; backend support may be future

### Admin Settings

- route: `/admin/settings`
- audience: admins
- primary job: configure operational platform settings
- success state: admin can review and update supported settings
- primary actions: update settings if backend support exists
- secondary actions: view system configuration summaries
- key sections: account/platform settings, operational toggles, integration status
- key data: depends on future backend settings support
- backend domain anchors: no dedicated settings module observed yet
- loading state: form skeleton
- empty state: not configured or settings unavailable
- error state: validation/save error
- responsive notes: forms stack
- accessibility notes: toggles and inputs labeled
- current implementation notes: route exists; likely placeholder

## Cross-Screen Rules

- Public screens should align copy and data with tutoring/education domain.
- Dashboard screens should use `DashboardPage`.
- Role dashboards should stay visually related but can use role-specific accent details.
- Booking, payment, mentor approval, and review states must use backend status semantics.
- Empty states should guide users to the next product action, not merely say content is missing.
- When backend support is not present yet, document the gap instead of inventing fake permanence.
