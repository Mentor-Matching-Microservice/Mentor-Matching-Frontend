# Wireframes

## Scope

- date: 2026-06-05
- level: text wireframes for MVP implementation
- source: framework docs plus generated implementation plan
- assumption: wireframes describe structure, not final visual styling

## Shared Notes

- Use practical blocks that map cleanly to React layout sections.
- Public pages can use cards for repeated content.
- Dashboard pages should prefer structured bands, rows, lists, and tables over decorative section cards.
- Where a screen is too complex, the wireframe is split into MVP sections first.
- Public pages should use fewer, stronger sections instead of many equal-weight card groups.
- Repeated operational content should prefer dense rows over oversized feature cards.

## Home

```text
[Top Nav]
------------------------------------------------
[Brand]                           [Login] [Find Mentor]

[Hero Search]
------------------------------------------------
[Page Title]                      [Primary CTA: Tim mentor]
[Description]
[Search Input..................................]
[Quick Tags: Toan] [Tieng Anh] [On thi] [Online]

[Featured Mentors]
------------------------------------------------
[Section Title]                   [View All]

[Card: Mentor]
  [Avatar] Name                   [Trust Badge]
  Headline
  Subject / Grade / Price
  Rating / Reviews
  [Xem chi tiet]

[Popular Subjects]
------------------------------------------------
[Subject Card] [Subject Card] [Subject Card] [Subject Card]

[Trust / How It Works Band]
------------------------------------------------
[Trust Point]
[Step 1: Tim mentor]
[Step 2: Chon buoi hoc]
[Step 3: Hoc va danh gia]

[Testimonials]
------------------------------------------------
[Testimonial Card] [Testimonial Card] [Testimonial Card]

[Footer]
```

## Discover

```text
[Top Nav]
------------------------------------------------

[Page Title]                         [Sort Select]
[Description]
[Search Input..................................] [Filter Button on mobile]

[Selected Filters]
------------------------------------------------
[Chip] [Chip] [Reset]

[Desktop Layout]
------------------------------------------------
[Filter Rail]
  Subject
  Grade
  Meeting Type
  Price Range
  Trust
  Availability

[Results Column]
  [Result Count]

  [Card: Mentor]
    [Avatar] Name                  [Trust Badge]
    Headline
    Subject / Grade / Price
    Meeting Type / Rating
    [Xem chi tiet]

  [Pagination or Load More]

[Mobile Filter Sheet]
------------------------------------------------
[Sheet Title: Bo loc]
  Subject
  Grade
  Meeting Type
  Price Range
  Trust
  Availability
[Reset]                            [Apply]
```

## Mentor Profile

```text
[Top Nav]
------------------------------------------------
[Back to Discover]

[Profile Summary]
------------------------------------------------
[Avatar] Name                      [Trust Badge] [Approval Badge]
Headline
Rating / Reviews / Meeting Type
Short Intro

[Desktop Layout]
------------------------------------------------
[Offering and Booking Split]
[Offering Column]                 [Booking Column]

[Main Content]
  [Section: Mon hoc va hoc phi]
    [Offering Row]
      Subject / Grade
      Proficiency
      Price
      [Select]

  [Section: Phong cach day]
    Description

  [Section: Thanh tich va diem tin cay]
    Verification
    Approval
    Highlights
    Achievements

  [Section: Danh gia]
    Rating Summary
    Review Snippet

  [Section: Lich trinh / Khung gio]
    Recurring windows
    Specific date windows

[Booking Sidebar]
  [Card: Session Summary]
    Selected Offering
    Date / Time
    Meeting Type
    Estimated Total
    [Primary CTA: Dat buoi hoc]

[Mobile Order]
------------------------------------------------
Summary
Booking Summary
Offerings
Teaching Style
Trust / Achievements
Reviews
Availability
```

## Login

```text
[Desktop Split Layout]
------------------------------------------------
[Left Visual / Brand]
  Brand
  Value Proposition

[Right Form]
  [Back Link]
  [Page Title]
  [Description]

  [Email Field]
  [Password Field]
  [Primary CTA: Dang nhap]

  [Optional: Test Accounts]
    Learner
    Mentor
    Admin

[Mobile Layout]
------------------------------------------------
Brand
Back Link
Title
Description
Form
Optional Test Accounts
```

## Learner Dashboard

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Section: Buoi hoc sap toi]
------------------------------------------------
[Card: Upcoming Session]
  Subject
  Mentor
  Date / Time
  Status
  [Primary CTA: Vao buoi hoc]
  [Secondary CTA: Xem chi tiet]

[Section: Quick Actions]
------------------------------------------------
[Tim mentor] [Xem lich hoc] [Cap nhat ho so]

[Section: Gan day]
------------------------------------------------
[Booking Row]
  Subject
  Status
  Date
  [Action]

[Empty State if no bookings]
------------------------------------------------
Title
Helper text
[Primary CTA: Tim mentor]
```

## Learner Bookings

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]                       [Search]
[Description]

[Tabs]
------------------------------------------------
[Tat ca] [Sap toi] [Can thanh toan] [Hoan thanh] [Da huy]

[Booking List]
------------------------------------------------
[Row/Card: Booking]
  Subject                          [Status Badge]
  Mentor
  Date / Time
  Meeting Type
  Payment State
  [Primary Action]
  [Secondary Action]

[Optional Detail Drawer/Sheet]
------------------------------------------------
Booking Summary
Status Timeline
Available Actions

[Empty State]
------------------------------------------------
Title
Helper text
[Primary CTA: Tim mentor]
```

## Learner Favorites

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]
[Saved Count]

[Mentor Grid/List]
------------------------------------------------
[Card: Mentor]
  Name
  Subject / Grade / Price
  Rating
  [View Profile]
  [Remove]

[Empty State]
------------------------------------------------
Title
Helper text
[Primary CTA: Kham pha mentor]
```

## Learner Messages

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Desktop Layout]
------------------------------------------------
[Conversation List]
  Contact
  Last Message
  Time

[Thread Panel]
  [Thread Header]
  Messages or Placeholder
  [Composer if supported]

[Mobile Layout]
------------------------------------------------
Conversation List
Thread View

[Empty State]
------------------------------------------------
Title
Helper text
```

## Learner Profile

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Form Section: Tai khoan]
------------------------------------------------
Full Name
Email
Phone

[Form Section: Ho so hoc vien]
------------------------------------------------
Gender
Birth Year
School Name
Grade

[Form Section: Muc tieu hoc tap]
------------------------------------------------
Textarea

[Actions]
------------------------------------------------
[Primary CTA: Luu thong tin]
```

## Mentor Dashboard

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Section: Hom nay / Tuan nay]
------------------------------------------------
[Summary Item] Sessions
[Summary Item] Students
[Summary Item] Rating

[Section: Buoi day sap toi]
------------------------------------------------
[Session Row]
  Learner
  Subject
  Time
  [Action]

[Section: Quick Actions]
------------------------------------------------
[Cap nhat lich day] [Sua ho so] [Xem hoc vien]

[Empty State]
------------------------------------------------
Title
Helper text
[Primary CTA]
```

## Mentor Schedule

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]                       [Primary CTA: Them khung gio]
[Description]

[Section: Availability Mode]
------------------------------------------------
[Tab: Lap lai hang tuan] [Tab: Theo ngay cu the]

[Desktop Layout]
------------------------------------------------
[Availability List]
  Day / Date
  Start - End
  Type
  [Edit] [Delete]

[Upcoming Sessions]
  Learner
  Subject
  Time
  Status

[Optional Add/Edit Sheet]
------------------------------------------------
Type
Day or Date
Start Time
End Time
[Save]

[Mobile Layout]
------------------------------------------------
Availability List
Upcoming Sessions

[Empty State]
------------------------------------------------
Title
Helper text
[Primary CTA]
```

## Mentor Students

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Student List]
------------------------------------------------
[Row/Card: Student]
  Name
  Recent Subject
  Next Session
  Status
  [View Detail]

[Empty State]
------------------------------------------------
Title
Helper text
```

## Mentor Earnings

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]                       [Period Filter]
[Description]

[Summary Row]
------------------------------------------------
[Total Earnings]
[Paid Sessions]
[Pending Items]

[Earnings List]
------------------------------------------------
[Row]
  Booking / Subject
  Date
  Amount
  Payment Status
  [View Detail]

[Empty State]
------------------------------------------------
Title
Helper text
```

## Mentor Profile Management

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Trust / Completeness Summary]
------------------------------------------------
Approval Status
Verification Status
Profile Completeness

[Section: Public Profile]
------------------------------------------------
Avatar
Headline
Introduction
Teaching Style

[Section: Mon hoc va hoc phi]
------------------------------------------------
[Offering Row]
  Subject / Grade
  Proficiency
  Price
  Active Toggle

[Section: Thanh tich]
------------------------------------------------
Achievement List

[Actions]
------------------------------------------------
[Primary CTA: Luu thay doi]
```

## Admin Dashboard

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Section: Can xu ly hom nay]
------------------------------------------------
[Pending Mentor Review Row]
  Mentor
  Submitted Time
  Verification
  [Review]

[Section: Overview]
------------------------------------------------
[Metric]
[Metric]
[Metric]

[Section: Reports / System Health]
------------------------------------------------
[Report Count]
[System Status]
```

## Admin Mentors

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]                       [Search]
[Description]

[Section: Ho so cho duyet]
------------------------------------------------
[Review Card/Row]
  Mentor
  Expertise / Subjects
  Verification State
  Submitted Time
  [Duyet] [Tu choi] [Xem chi tiet]

[Section: Mentor dang hoat dong]
------------------------------------------------
[Row]
  Mentor
  Approval Status
  Rating
  Students
  [Tam dung] [Xem]

[Mobile Detail Sheet]
------------------------------------------------
Identity
Trust
Offerings
Action Buttons
```

## Admin Users

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]                       [Search]
[Description]

[Filters]
------------------------------------------------
Role
Status
User Type

[User Table/List]
------------------------------------------------
Name | Email | Role | Type | Status | [Action]

[Mobile Row]
------------------------------------------------
Name
Email
Role / Status
[View]
```

## Admin Reports

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Status Filters]
------------------------------------------------
[Tat ca] [Moi] [Dang xu ly] [Da dong]

[Report List]
------------------------------------------------
[Row]
  Report Type
  Related Entity
  Severity
  Status
  [View]

[Empty State]
------------------------------------------------
Title
Helper text
```

## Admin Settings

```text
[Dashboard Shell]
------------------------------------------------
[Page Title]
[Description]

[Settings Group or Placeholder]
------------------------------------------------
[Card/Group]
  Section Title
  Fields or Placeholder Copy

[Actions]
------------------------------------------------
[Primary CTA: Luu cau hinh] or hidden if unsupported

[Empty State]
------------------------------------------------
Title
Helper text
```
