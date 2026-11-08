# UI UX Spec

## Scope

- date: 2026-06-05
- source of truth: `frontend/docs/framework/*`
- implementation phase: static UI alignment before broad API integration
- assumption: the request references `docs/...`, but the active repository path is `frontend/docs/...`

## Experience Goal

Mentor Matching should feel like a trustworthy tutoring marketplace with practical dashboards behind it. Public screens should help learners and parents choose the right mentor quickly, while role-based screens should make booking, scheduling, review, and approval workflows easy to scan and act on. The MVP should favor clear structure, realistic states, and reusable interaction patterns over decorative flourish.

## UX Direction

- tone: trustworthy, calm, structured, encouraging
- hierarchy: clear page-level title, obvious primary action, compact sections, visible state labels
- density: medium density in public screens, higher density in dashboard and admin screens
- interaction style: direct, low-friction, mostly list/card/table-based, with mobile sheets for filters and details

## Visual Direction

- overall mode: clean tutoring marketplace with a modern premium finish
- distinctiveness source: hierarchy, copy discipline, content density, and calm contrast
- public pages: curated and confident, not marketing-template heavy
- dashboards: compact, operational, and restrained
- surfaces: fewer, stronger panels instead of many similar frosted cards
- depth: border and spacing first, shadow second
- motion: subtle reveal and focus cues, not constant spectacle

## Shared Patterns

- Use `DashboardShell` for all role workspaces.
- Use `DashboardPage` for route title and description, but replace generic placeholder content with role-specific empty states.
- Use one shared status badge pattern for booking, payment, approval, and verification states.
- Use a shared empty state component with icon, title, helper copy, and optional action.
- Use a shared screen error state with retry action for route-level fetch failures.
- Use cards for repeated marketplace items and concise data panels, not for entire page section wrapping.
- Use mobile sheets for filters and dense detail panels.
- Keep public search/filter interaction simple first; expand after data integration.
- Keep public sections as purposeful bands with clear contrast shifts rather than a stack of equal cards.
- Keep premium cues in typography and rhythm, not in excessive gradient or blur usage.

## MVP Prioritization

### Phase A

- Home
- Discover
- Mentor Profile
- Login
- Learner Dashboard
- Learner Bookings

### Phase B

- Learner Favorites
- Learner Messages
- Learner Profile
- Mentor Dashboard
- Mentor Schedule
- Mentor Profile Management

### Phase C

- Mentor Students
- Mentor Earnings
- Admin Dashboard
- Admin Mentors
- Admin Users
- Admin Reports
- Admin Settings

## Screen Specs

### Home

- purpose: orient new visitors, communicate tutoring marketplace value, and push them to discovery
- layout hierarchy: top nav -> hero search/value proposition -> featured mentors -> subject discovery -> trust/process band -> testimonials -> footer
- content hierarchy: product promise first, search second, mentor fit proof third, explanation last
- main actions: search mentors, go to discover, open mentor detail, start login
- secondary actions: browse subjects, explore testimonials, become a mentor
- state behavior:
  - loading: featured mentor cards and subject cards use skeletons if data becomes dynamic
  - empty: featured sections collapse into curated discovery CTA if no content is available
  - error: hero and static page remain visible; dynamic sections show retry or fallback text
- interaction notes:
  - hero search should accept subject, mentor, or goal keywords
  - featured mentors should link directly to mentor detail
  - CTA copy should focus on learning outcomes, not generic career growth
  - avoid turning the page into a generic “top mentors / stats / testimonials” loop with interchangeable sections
- responsive behavior:
  - hero stacks vertically
  - featured sections move to 1-column or 2-column grids
  - next section should remain visible below the fold on common laptop/mobile heights
- microcopy suggestions:
  - headline: `Tim mentor phu hop de hoc dung thu, dung nhịp`
  - subcopy: `Tim theo mon hoc, lop, muc tieu hoc tap va hinh thuc hoc phu hop.`
  - primary CTA: `Tim mentor`
  - secondary CTA: `Xem tat ca mentor`
- accessibility notes:
  - hero search input needs label
  - CTA labels must be descriptive
  - heading order should remain linear

### Discover

- purpose: help learners and parents compare mentors efficiently
- layout hierarchy: page intro -> search -> selected filters and sort -> filter rail or mobile filter sheet -> mentor results -> pagination or load more
- content hierarchy: narrowing tools first, comparison surface second, detail entry third
- main actions: search, filter, sort, open mentor profile
- secondary actions: reset filters, save favorite in future, paginate
- state behavior:
  - loading: filter summary and mentor cards skeleton
  - empty: no-match state with `Xoa bo loc` and `Quay lai danh sach`
  - error: inline route error with retry and preserved filter context
- interaction notes:
  - filters should use tutoring-domain groups: mon hoc, lop, hinh thuc hoc, muc gia, muc tieu hoc, trust signals
  - result cards should expose mentor fit at a glance
  - sorting can start with `phu hop`, `danh gia`, `gia`, `moi nhat`
  - the page should feel comparison-friendly rather than promotional
- responsive behavior:
  - desktop keeps left filter rail
  - mobile uses sheet filter with sticky apply/reset actions
  - result cards stack cleanly without horizontal overflow
- microcopy suggestions:
  - page title: `Tim mentor`
  - helper text: `Loc theo mon hoc, lop, lich hoc va phong cach day phu hop.`
  - empty state title: `Chua co mentor phu hop`
  - empty state helper: `Thu mo rong bo loc hoac doi tu khoa tim kiem.`
- accessibility notes:
  - selected filters should be visible in text
  - filter controls need labels
  - sort control should be keyboard accessible

### Mentor Profile

- purpose: help users evaluate fit and start booking
- layout hierarchy: back link -> profile summary band -> offering and booking split -> teaching style/trust/reviews -> availability details
- content hierarchy: fit and action first, supporting proof second, deeper reading third
- main actions: choose offering, choose session context, start booking
- secondary actions: go back, save favorite in future, message/contact in future
- state behavior:
  - loading: summary hero skeleton, content skeleton, booking sidebar skeleton
  - empty: not-found state with link back to discover
  - error: retry state within route container
- interaction notes:
  - booking block should focus on session selection, not a generic product checkout
  - offerings should mention subject, grade, proficiency, and price
  - trust block should distinguish verified identity from approved mentor status
  - reviews should combine numeric and qualitative proof
  - avoid long decorative intros before core booking information
- responsive behavior:
  - booking panel moves below summary on mobile
  - trust, offerings, reviews, and teaching style stack in a consistent order
  - long mentor bios should remain readable without huge text blocks
- microcopy suggestions:
  - section title: `Mon hoc va hoc phi`
  - trust label: `Da xac minh`
  - approval label: `Da duoc duyet`
  - booking CTA: `Dat buoi hoc`
  - helper text: `Chon mon hoc va thong tin buoi hoc phu hop truoc khi dat lich.`
- accessibility notes:
  - rating and review counts need text equivalents
  - booking controls and form fields require labels
  - section headings should reflect content order

### Login

- purpose: authenticate users and send them to the right workspace
- layout hierarchy: brand/back link -> title and helper -> login form -> optional test account helper
- content hierarchy: auth form first, support/explanatory content second
- main actions: submit email/password
- secondary actions: use test account in mock mode, go back home, future forgot-password flow
- state behavior:
  - loading: submit button loading state
  - empty: not applicable
  - error: inline validation plus auth failure toast/message
- interaction notes:
  - test account selector is useful in mock mode but should not dominate the layout
  - success should redirect by role
- responsive behavior:
  - visual split layout on large screens
  - single-column form-first experience on mobile
- microcopy suggestions:
  - helper: `Dang nhap de tiep tuc hoc tap, quan ly lich day hoac dieu hanh he thong.`
  - submit: `Dang nhap`
- accessibility notes:
  - form labels and errors must be linked
  - keyboard submit should work cleanly

### Learner Dashboard

- purpose: summarize learning activity and guide next actions
- layout hierarchy: page title -> upcoming session block -> recent bookings -> quick actions -> reminder or recommendation section
- content hierarchy: what is next first, what needs action second, supporting insight third
- main actions: view booking, join upcoming session, find mentor
- secondary actions: open messages, update profile, review completed session
- state behavior:
  - loading: section skeletons
  - empty: no bookings yet with strong CTA to discover
  - error: route-level retry while keeping shell visible
- interaction notes:
  - dashboard should avoid gamified visuals unless they clearly map to real learning behavior
  - quick actions should be role-relevant and few
  - summary surfaces should feel like a learning workspace, not a showcase dashboard
- responsive behavior:
  - blocks stack vertically on mobile
  - no metric row should push important booking info below the fold unnecessarily
- microcopy suggestions:
  - section title: `Buoi hoc sap toi`
  - empty state title: `Ban chua co lich hoc nao`
  - empty state helper: `Bat dau tim mentor phu hop de dat buoi hoc dau tien.`
- accessibility notes:
  - booking action labels should include mentor or subject context
  - cards should preserve logical reading order

### Learner Bookings

- purpose: manage upcoming and past sessions
- layout hierarchy: page title -> filter tabs/search -> booking list -> optional detail or row actions
- content hierarchy: status filter first, booking rows second, actions within each row third
- main actions: join session, view detail, pay if pending, cancel if allowed, review completed session
- secondary actions: search, filter, sort in future
- state behavior:
  - loading: row skeletons
  - empty: no bookings with CTA back to discover
  - error: retry list state
- interaction notes:
  - each row should show subject snapshot, mentor snapshot, time, status, and next action
  - payment and booking statuses should be clearly separated if both exist
  - rows should read more like practical itinerary records than floating promo cards
- responsive behavior:
  - desktop can use list or table-like cards
  - mobile uses stacked booking cards with action row at bottom
- microcopy suggestions:
  - tabs: `Tat ca`, `Sap toi`, `Can thanh toan`, `Hoan thanh`, `Da huy`
  - primary action: `Vao buoi hoc`
  - secondary action: `Xem chi tiet`
- accessibility notes:
  - filter tabs should be keyboard accessible
  - status labels must include text, not color only

### Learner Favorites

- purpose: revisit saved mentors
- layout hierarchy: page title -> summary count -> saved mentor grid/list
- content hierarchy: saved mentors first, sort/filter optional second
- main actions: open mentor profile, remove favorite
- secondary actions: compare saved mentors in future
- state behavior:
  - loading: mentor card skeletons
  - empty: no favorites with CTA to discover
  - error: retry saved-list fetch
- interaction notes:
  - MVP can remain simple as long as it uses domain-correct mentor content
- responsive behavior:
  - cards stack or move to 2-column grid
- microcopy suggestions:
  - empty title: `Chua co mentor da luu`
  - empty helper: `Luu mentor ban quan tam de quay lai nhanh hon sau nay.`
- accessibility notes:
  - remove action must have explicit label

### Learner Messages

- purpose: show learner communication area honestly, even if backend support is partial
- layout hierarchy: page title -> conversation list -> thread panel or placeholder
- content hierarchy: conversations first, current thread second
- main actions: open conversation, send message in future
- secondary actions: search, mark read in future
- state behavior:
  - loading: list skeleton
  - empty: no conversations
  - error: retry state
- interaction notes:
  - MVP should avoid pretending a full chat engine exists if backend is missing
  - focus on route structure and placeholder honesty
- responsive behavior:
  - mobile alternates between conversation list and thread view
- microcopy suggestions:
  - empty title: `Chua co cuoc tro chuyen nao`
  - empty helper: `Khi co trao doi lien quan den buoi hoc, noi dung se hien thi tai day.`
- accessibility notes:
  - message composer labels required if active

### Learner Profile

- purpose: manage account and learning context
- layout hierarchy: page title -> account info section -> learner profile section -> learning goal section -> save actions
- content hierarchy: personal basics first, study context second, freeform goals third
- main actions: edit and save profile
- secondary actions: update phone, school, grade, learning goal
- state behavior:
  - loading: form skeleton
  - empty: incomplete profile checklist
  - error: validation and save error display
- interaction notes:
  - keep form practical and sectioned
  - required fields should be obvious
- responsive behavior:
  - single-column on mobile
  - two-column fields only where space allows and field pairing is natural
- microcopy suggestions:
  - section label: `Muc tieu hoc tap`
  - save CTA: `Luu thong tin`
- accessibility notes:
  - labels, helper text, and errors must be connected

### Mentor Dashboard

- purpose: summarize teaching operations
- layout hierarchy: page title -> today/this week summary -> upcoming sessions -> profile/schedule actions -> approval or review notices
- content hierarchy: next teaching work first, then performance and maintenance
- main actions: manage schedule, edit profile, review upcoming sessions
- secondary actions: open students, open earnings
- state behavior:
  - loading: section skeletons
  - empty: no sessions yet with CTA to complete profile and add schedule
  - error: route-level retry
- interaction notes:
  - avoid decorative metrics with no operational value
  - keep approval/profile completeness visible if relevant
  - use one or two summary rows at most before the actual work list begins
- responsive behavior:
  - summary blocks stack cleanly
  - upcoming sessions remain readable on mobile
- microcopy suggestions:
  - empty title: `Ban chua co buoi day nao`
  - empty helper: `Hoan thien ho so va cap nhat lich day de bat dau nhan hoc vien.`
- accessibility notes:
  - session actions should include context in button text or aria labels

### Mentor Schedule

- purpose: manage availability and see booked sessions
- layout hierarchy: page title -> availability summary -> calendar/list toggle -> availability list -> add/edit availability panel
- content hierarchy: current schedule first, editing tools second
- main actions: add availability, edit/remove availability
- secondary actions: inspect booked sessions
- state behavior:
  - loading: calendar/list skeleton
  - empty: no availability configured
  - error: fetch/save failure with retry
- interaction notes:
  - MVP can split into `Availability` and `Upcoming Sessions` sections instead of building a complex scheduler immediately
  - recurring vs specific-date must be visible in wording
  - avoid over-designed calendar chrome before the availability model is stable
- responsive behavior:
  - desktop can show split list/calendar
  - mobile defaults to agenda/list first
- microcopy suggestions:
  - section label: `Khung gio lap lai`
  - section label: `Lich theo ngay cu the`
  - primary CTA: `Them khung gio`
- accessibility notes:
  - date/time controls need proper labels
  - toggle buttons need text labels

### Mentor Students

- purpose: review learner relationships created by bookings
- layout hierarchy: page title -> active students list -> recent session notes or summary blocks
- content hierarchy: active learners first, recent activity second
- main actions: open student/session detail
- secondary actions: filter active/completed in future
- state behavior:
  - loading: row skeletons
  - empty: no learners yet
  - error: retry state
- interaction notes:
  - avoid making this a generic CRM
  - keep it tied to booked teaching activity
- responsive behavior:
  - rows stack into cards on mobile
- microcopy suggestions:
  - empty title: `Chua co hoc vien nao`
  - empty helper: `Hoc vien se xuat hien tai day sau khi co lich hoc duoc dat.`
- accessibility notes:
  - row actions must identify learner name

### Mentor Earnings

- purpose: show income linked to teaching activity
- layout hierarchy: page title -> earnings summary -> transaction list -> period filter
- content hierarchy: total and recent status first, history second
- main actions: inspect earning/payment detail
- secondary actions: filter by period or status
- state behavior:
  - loading: summary and list skeleton
  - empty: no earnings yet
  - error: retry list state
- interaction notes:
  - earnings should look tied to completed or paid sessions, not arbitrary revenue stats
- responsive behavior:
  - summary cards shrink first
  - list becomes stacked rows on mobile
- microcopy suggestions:
  - empty title: `Chua co thu nhap nao`
  - empty helper: `Thu nhap se duoc cap nhat khi buoi hoc va thanh toan du dieu kien hien thi.`
- accessibility notes:
  - amounts should be clear in text and structure

### Mentor Profile Management

- purpose: maintain public mentor information, offerings, and trust profile
- layout hierarchy: page title -> profile completeness/trust summary -> profile sections -> offerings -> achievements -> save actions
- content hierarchy: profile status first, editable teaching content second, verification/supporting proof third
- main actions: edit profile, manage offerings, save changes
- secondary actions: preview public profile, manage verification in future
- state behavior:
  - loading: form skeleton
  - empty: incomplete profile prompt
  - error: validation and save errors
- interaction notes:
  - split long form into sections
  - offerings need subject/grade/proficiency/price grouping
- responsive behavior:
  - single-column on mobile with collapsible or clearly separated sections
- microcopy suggestions:
  - section title: `Thong tin cong khai`
  - section title: `Mon hoc va hoc phi`
  - save CTA: `Luu thay doi`
- accessibility notes:
  - sections require clear headings and field labels

### Admin Dashboard

- purpose: show operational health and urgent actions
- layout hierarchy: page title -> key counts -> pending approvals -> issue/report summary -> system health
- content hierarchy: action queue first, overview second
- main actions: open mentor review, open reports, open users
- secondary actions: inspect settings/system info
- state behavior:
  - loading: queue and metric skeletons
  - empty: no urgent items
  - error: route-level retry
- interaction notes:
  - queue items should be more important than top-line vanity metrics
  - the first viewport should communicate what needs admin action now
- responsive behavior:
  - queue stacks before system health on mobile
- microcopy suggestions:
  - section title: `Can xu ly hom nay`
  - empty title: `Khong co muc can xu ly gap`
- accessibility notes:
  - action buttons for approval queues need clear labels

### Admin Mentors

- purpose: manage mentor approval and quality oversight
- layout hierarchy: page title -> pending review section -> active mentor list -> detail/review panel
- content hierarchy: pending mentors first, active management second
- main actions: approve, reject, suspend, inspect profile
- secondary actions: search, filter by status or verification
- state behavior:
  - loading: review cards/list skeleton
  - empty: no pending mentors
  - error: retry route state
- interaction notes:
  - approval and verification should be shown separately
  - MVP can use two sections: `Can duyet` and `Dang hoat dong`
  - this route should feel like a review tool, not a mentor showcase
- responsive behavior:
  - mobile uses stacked review cards and bottom/detail sheet
- microcopy suggestions:
  - section title: `Ho so cho duyet`
  - button: `Duyet`
  - button: `Tu choi`
  - button: `Tam dung`
- accessibility notes:
  - destructive and approval actions need confirmation and clear labels

### Admin Users

- purpose: review users by role and status
- layout hierarchy: page title -> search/filter -> user list/table -> detail actions
- content hierarchy: search/filter first, user rows second
- main actions: inspect user, change status in future
- secondary actions: search, filter, paginate
- state behavior:
  - loading: table skeleton
  - empty: no matching users
  - error: retry list state
- interaction notes:
  - use compact repeated row/table format
- responsive behavior:
  - desktop table, mobile stacked rows
- microcopy suggestions:
  - empty title: `Khong tim thay nguoi dung`
- accessibility notes:
  - headers and row actions need text clarity

### Admin Reports

- purpose: review issue reports or operational flags honestly, even if backend support is partial
- layout hierarchy: page title -> status filters -> report list -> detail panel or placeholder
- content hierarchy: report queue first, detail second
- main actions: inspect report, mark progress in future
- secondary actions: filter by severity or status
- state behavior:
  - loading: list skeleton
  - empty: no reports
  - error: retry route state
- interaction notes:
  - MVP should not imply a full moderation engine if backend support is not ready
- responsive behavior:
  - mobile shows list first, detail second
- microcopy suggestions:
  - empty title: `Chua co bao cao nao`
  - empty helper: `Bao cao he thong va van de nguoi dung se hien thi tai day.`
- accessibility notes:
  - severity and status must be readable in text

### Admin Settings

- purpose: provide a clean placeholder or future settings surface without overpromising
- layout hierarchy: page title -> grouped settings cards/forms -> save actions or placeholder
- content hierarchy: current available settings first, future groups second
- main actions: update settings if supported
- secondary actions: inspect configuration state
- state behavior:
  - loading: form skeleton
  - empty: settings unavailable or not configured
  - error: validation/save state
- interaction notes:
  - MVP can be a structured placeholder with clear unsupported messaging
- responsive behavior:
  - stacked settings groups on mobile
- microcopy suggestions:
  - empty title: `Tinh nang cai dat dang duoc hoan thien`
  - empty helper: `Khi co cac cau hinh kha dung, cac nhom cai dat se duoc hien thi tai day.`
- accessibility notes:
  - toggles and fields require labels

## Acceptance Criteria

- Every route in the current screen inventory has a practical MVP UX description.
- Every screen includes loading, empty, and error treatment.
- Layout guidance stays aligned with `DESIGN_SYSTEM.md` and `DESIGN_RULES.md`.
- Wireframing can proceed directly from this document without inventing product behavior.
