# Project Context

## Purpose

This document is the product and frontend context anchor for AI work on Mentor Matching.

It should help an AI agent answer these questions before designing or coding:

- What product is this?
- Who are the main users?
- What jobs are they trying to complete?
- What backend capabilities already exist?
- Which frontend areas are already present?
- Which parts of the current UI are still demo or mock-driven?

This file is intentionally product-oriented, not just technical.

## Product Summary

Mentor Matching is a marketplace and workflow platform that connects learners with mentors for one-on-one learning sessions.

The current backend direction supports:

- learner and mentor accounts
- mentor profile discovery
- subject and grade-based mentor offerings
- flexible mentor availability windows
- booking creation with historical snapshots
- payment tracking with Stripe-oriented provider fields
- post-session reviews
- notifications
- admin and manager oversight for mentor approval and operations

At a product level, the platform is not only a public directory. It is meant to cover the full lifecycle:

1. a learner or parent discovers a suitable mentor
2. they evaluate the mentor profile, teaching style, and price
3. they book a session in an available time window
4. they pay or proceed through payment workflow
5. the session takes place online or offline
6. both sides continue through dashboards and follow-up actions
7. the learner leaves a review
8. admins oversee mentor quality, approvals, and platform health

## Primary User Roles

The database and route structure indicate four core roles.

### Learner

Represents the customer side of the platform.

This role includes:

- school students
- university students
- working adults
- parents booking on behalf of a child

Important learner goals:

- find the right mentor for a subject or goal
- compare pricing, credibility, and teaching fit
- book and manage sessions
- track learning progress and upcoming lessons
- maintain a learner profile and goals

### Mentor

Represents the teaching side of the marketplace.

Important mentor goals:

- present a trustworthy, approved public profile
- define subjects, grade coverage, and pricing
- manage recurring or specific-date availability
- view upcoming students and sessions
- maintain teaching reputation through reviews and approvals

### Admin

Represents operational control over the system.

Important admin goals:

- review mentor applications and approval state
- oversee users and mentors
- monitor reports, revenue, and system status
- keep the marketplace safe and credible

### Manager

Manager exists in backend roles and should be considered an operational role close to admin.

Likely manager responsibilities:

- support review or moderation workflows
- help process mentor approvals
- assist with operational oversight without full system ownership

The current frontend route map emphasizes admin, not manager-specific screens yet.

## Core Product Domains

The backend schema and modules define the main business areas below.

### 1. Authentication And Account Access

The platform supports:

- login
- register
- refresh token flow
- logout
- persisted hashed refresh tokens
- role-based access

Relevant business impact for frontend:

- authentication is role-sensitive
- role-based routing matters
- guest, protected, user, mentor, and admin experiences must stay clearly separated

### 2. User And Learner Profile

Users have:

- full name
- email
- phone
- role
- user type
- status

Learner profiles extend user data with:

- gender
- birth year
- school name
- grade
- learning goal

This means the learner side is not generic account management only. The platform is expected to capture learning context so matching and bookings can be more personalized.

### 3. Mentor Marketplace

Mentors are modeled as a serious, trust-driven marketplace asset rather than a simple profile card.

Mentor profiles include:

- avatar
- gender
- hometown city and current district
- headline
- introduction
- teaching style
- years of experience
- current position and workplace
- education and major
- meeting type: `ONLINE`, `OFFLINE`, or `HYBRID`
- approval status: `PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`
- approval note and approval history

This implies the public mentor profile UX should balance:

- credibility
- teaching fit
- subject fit
- logistics
- social proof

### 4. Mentor Verification And Approval

Mentor trust is a first-class feature, not a cosmetic badge.

The system supports:

- identity verification records
- admin verification status
- mentor approval status
- approval and rejection notes

Frontend implications:

- mentor status and trust markers should be designed clearly
- admin approval flows are meaningful, not decorative
- suspended or rejected mentor states should be representable in internal dashboards

### 5. Catalog And Subject Taxonomy

The catalog system includes:

- categories
- subjects
- grades
- subject-grade combinations

Important distinction from backend:

- `subject_grades` defines a catalog pairing between subject and grade
- `mentor_subjects` defines a specific mentor offering tied to one of those subject-grade pairs

This is critical for frontend and AI-generated flows:

- mentor offerings are not only "subjects"
- offerings should often be presented as subject plus grade plus price plus proficiency
- booking should be based on the mentor's actual offering, not a generic subject

### 6. Mentor Teaching Offerings

Mentor offerings include:

- subject-grade association
- proficiency level: `BASIC`, `INTERMEDIATE`, `ADVANCED`, `EXPERT`
- teaching note
- price per hour
- active state

This means the discovery and mentor profile experiences should eventually expose:

- what the mentor teaches
- for which grade or target level
- how advanced they are
- how much they charge
- whether the offering is currently active

### 7. Scheduling And Availability

The system uses flexible availability windows, not fixed slot templates.

Availability supports:

- recurring weekly windows
- specific-date windows
- start time and end time

This is a meaningful product choice. The UX should feel like:

- mentor controls availability windows
- learner books against actual time ranges
- schedules can be mixed between recurring patterns and special-date exceptions

### 8. Booking

Booking is a central transaction record in the system.

Booking records store:

- learner identity snapshot
- mentor identity snapshot
- mentor subject snapshot
- subject and grade snapshot
- booking date
- start and end time
- price per hour
- total amount
- meeting type
- meeting link or address
- booking status
- note
- cancellation metadata

Supported statuses:

- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`
- `REJECTED`
- `NO_SHOW`

Important product meaning:

- bookings are historical records, so the UI must treat them as transaction history
- a later change to mentor profile or catalog should not visually rewrite past bookings
- learner and mentor dashboards should revolve around upcoming, active, and completed bookings

### 9. Payments

The payment model is provider-neutral in schema but currently Stripe-oriented in project direction.

Payments support:

- amount
- payment method
- payment provider
- payment status
- payer
- timestamps

Additional provider tracking fields were added later for Stripe-style flows:

- provider reference id
- provider transaction id
- checkout url
- expiry
- failure reason

Frontend implication:

- checkout and payment state should be modeled as a real workflow
- payment is tied to booking
- future UX may need pending, failed, expired, refunded, or paid states

### 10. Reviews

Reviews happen after a booking and include:

- rating from 1 to 5
- comment
- review tags

Review tag options include both praise and improvement signals, for example:

- easy to understand
- patient
- punctual
- good preparation
- tracks progress
- needs more detailed feedback

This indicates the product wants richer feedback than stars alone.

### 11. Notifications

Notifications exist for:

- booking events
- payment events
- mentor approval events
- system notices

This suggests dashboard UX should eventually account for notification surfaces, status cues, or inbox-like interactions.

## Product Shape Inferred From Seed Data

The seed data gives useful clues about intended market positioning.

### Audience Shape

The demo users show a strong focus on education in Vietnam, including:

- secondary school learners
- high school learners
- university students
- parents booking for children
- mentors with academic and tutoring backgrounds

This is more specific than a generic professional mentoring marketplace.

The educational use cases include:

- exam preparation
- foundational subject recovery
- long-term academic support
- language certification support such as IELTS, TOEIC, SAT, JLPT
- practical skill tutoring such as Python, web programming, study methods, and office computing

### Mentor Positioning

Seeded mentor data emphasizes:

- trust and identity verification
- personalized teaching plans
- exam preparation
- compatibility with different student levels
- distinct teaching styles and mentor personality traits

This means the product value proposition is not only “find an expert,” but “find a mentor whose style, strengths, and format match the learner.”

### Marketplace Signals

Mentor seed data includes:

- pricing by subject offering
- approval status variety
- inactive and suspended mentors for state testing
- personality options
- highlight options like verified, approved, flexible schedule, personalized syllabus, feedback after lesson

These should inform future UI language, chips, badges, filters, and trust signals.

## Current Frontend Surface Area

The frontend route map currently covers three major layers.

### 1. Public Marketplace

Current public routes:

- `/`
- `/discover`
- `/mentor/:id`

These represent:

- landing and marketing homepage
- mentor discovery listing
- mentor profile detail

This is the primary acquisition funnel.

### 2. Learner Dashboard

Current learner routes:

- `/user`
- `/user/bookings`
- `/user/favorites`
- `/user/messages`
- `/user/profile`

This suggests the intended learner workspace includes:

- overall dashboard summary
- booking management
- saved mentors or saved items
- messaging
- profile editing

### 3. Mentor Dashboard

Current mentor routes:

- `/mentor-panel`
- `/mentor-panel/schedule`
- `/mentor-panel/students`
- `/mentor-panel/earnings`
- `/mentor-panel/profile`

This suggests the mentor workspace includes:

- business overview
- schedule management
- student management
- revenue tracking
- mentor profile editing

### 4. Admin Dashboard

Current admin routes:

- `/admin`
- `/admin/users`
- `/admin/mentors`
- `/admin/reports`
- `/admin/settings`

This suggests the admin workspace includes:

- system overview
- user management
- mentor approval or moderation
- reporting or abuse handling
- settings

## Important Frontend Reality: Current UI Mixes Real Direction With Demo Data

The current frontend should not be treated as a complete source of truth for product behavior.

There is a mismatch today:

- backend and migrations model a Vietnam-focused tutoring marketplace
- some frontend public demo content still looks like a broader professional mentoring marketplace
- several screens use local mock arrays and hardcoded metrics rather than real backend slices

Examples:

- `frontend/app/constants/mentors.ts` currently contains English-language sample mentors in tech, ML, and product design
- `frontend/app/constants/subjects.ts` still contains broad skill categories like law, finance, and business
- several dashboard screens use placeholder counts, names, and booking data

Therefore, AI should treat:

- backend schema and migrations as the stronger source of product truth
- current frontend visuals as useful layout and component references
- current mock copy as provisional and likely in need of alignment

## Frontend Design Direction Implied By The Product

Because this is an education and trust-based marketplace, the UI should generally optimize for:

### Trust

Users need to feel safe booking a real person.

Design should emphasize:

- approval and verification clarity
- visible subject competence
- honest pricing
- transparent teaching fit

### Clarity

The platform should make it easy to answer:

- who this mentor is
- what they teach
- which learner level they support
- how they teach
- when they are available
- what it will cost

### Decision Support

Learners and parents are making a meaningful choice, not casual browsing only.

Good UI should support:

- filtering
- comparison
- strong profile summaries
- reviews and qualitative cues
- clear booking next steps

### Operational Efficiency

Mentor and admin screens should prioritize:

- fast scanning
- status visibility
- actionability
- schedule and approval clarity

## High-Level User Journeys

These are the most important product flows implied by the repository.

### Learner Journey

1. land on homepage or discovery
2. search or filter by subject, grade, goals, format, or fit
3. open mentor profile
4. review pricing, style, highlights, and availability
5. book a session
6. pay if required
7. attend and manage future bookings
8. leave a review

### Parent Journey

1. create or use learner-side account
2. search for a mentor for a child
3. evaluate teaching fit and reliability
4. book and pay
5. monitor progress and schedule

### Mentor Journey

1. create account or sign in
2. maintain mentor profile and verification
3. define subjects, grade coverage, and price
4. manage availability
5. receive bookings
6. conduct sessions
7. build trust through reviews and consistency

### Admin Journey

1. monitor overall system health
2. review mentor approvals and reports
3. inspect user and mentor records
4. maintain marketplace quality and safety

## Current Gaps And Design Risks

These are important for future AI work.

### Product Alignment Gap

The frontend copy and sample data still need alignment with the backend's actual tutoring domain.

### Feature Completion Gap

The backend models more product depth than the current frontend implements, especially around:

- booking workflows
- real payment states
- review flows
- notification flows
- approval and verification states
- mentor offering detail and availability detail

### Consistency Risk

Because there is no dedicated designer yet, AI-generated UI can drift unless it repeatedly anchors to:

- this file
- `DESIGN_RULES.md`
- `DESIGN_SYSTEM.md`
- `SCREEN_SPECS.md`

## Working Assumptions For AI

Unless another document explicitly overrides them, AI should assume:

1. Mentor Matching is primarily a tutoring and education marketplace, not a generic professional mentor directory.
2. Backend migrations are the strongest source of domain truth.
3. Public discovery, mentor profile, booking, and dashboards are the highest-value product areas.
4. Trust, clarity, and matching quality matter more than flashy visuals.
5. Frontend should progressively replace placeholder data and generic copy with domain-accurate content.
6. Route modules already present in the repo indicate intended product areas even when their content is still mock-based.

## Maintenance Notes

Update this file when any of the following change:

- target audience or market positioning
- core user roles
- route map or major frontend areas
- booking or payment workflow direction
- mentor approval or trust model
- the balance between demo UI and integrated backend reality
