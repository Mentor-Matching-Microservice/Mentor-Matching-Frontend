import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  // Public marketing site
  layout('layouts/main-layout.tsx', [
    index('routes/home.tsx'),
    route('discover', 'routes/discover.tsx'),
    route('become-mentor', 'routes/become-mentor.tsx'),
    route('mentor-profile/:id', 'routes/mentor-profile.tsx'),
    route('payment/success', 'routes/payment/success.tsx'),
    route('payment/cancel', 'routes/payment/cancel.tsx'),
    route('notifications', 'routes/notifications.tsx')
  ]),

  // User dashboard — /user/*
  route('user', 'routes/user-role-layout.tsx', [
    layout('layouts/user-layout.tsx', [
      index('routes/user/dashboard.tsx'),
      route('bookings', 'routes/user/bookings.tsx'),
      route('payments', 'routes/user/payments.tsx'),
      route('profile', 'routes/user/profile.tsx')
    ])
  ]),

  // Mentor dashboard — /mentor/*
  route('mentor', 'routes/mentor-role-layout.tsx', [
    layout('layouts/mentor-layout.tsx', [
      index('routes/mentor/dashboard.tsx'),
      route('schedule', 'routes/mentor/schedule.tsx'),
      route('students', 'routes/mentor/students.tsx'),
      route('earnings', 'routes/mentor/earnings.tsx'),
      route('profile', 'routes/mentor/profile.tsx'),
      route('verification', 'routes/mentor/verification.tsx')
    ])
  ]),

  // Admin dashboard — /admin/*
  route('admin', 'routes/admin-role-layout.tsx', [
    layout('layouts/admin-layout.tsx', [
      index('routes/admin/dashboard.tsx'),
      route('users', 'routes/admin/users.tsx'),
      route('mentors', 'routes/admin/mentors.tsx'),
      route('bookings', 'routes/admin/bookings.tsx'),
      route('catalog', 'routes/admin/catalog.tsx'),
      route('reports', 'routes/admin/reports.tsx'),
      route('settings', 'routes/admin/settings.tsx')
    ])
  ]),

  // Auth & template routes
  layout('routes/guest-layout.tsx', [route('login', 'routes/login.tsx')]),
  route('forbidden', 'routes/forbidden.tsx')
] satisfies RouteConfig
