export const path = {
  home: '/',
  forbidden: '/forbidden',
  login: '/login',
  becomeMentor: '/become-mentor',
  paymentSuccess: '/payment/success',
  paymentCancel: '/payment/cancel',

  discover: '/discover',
  mentorProfile: (id: string) => `/mentor-profile/${id}`,

  user: {
    root: '/user',
    bookings: '/user/bookings',
    payments: '/user/payments',
    profile: '/user/profile'
  },

  mentorPanel: {
    root: '/mentor',
    schedule: '/mentor/schedule',
    students: '/mentor/students',
    earnings: '/mentor/earnings',
    profile: '/mentor/profile',
    verification: '/mentor/verification'
  },

  admin: {
    root: '/admin',
    users: '/admin/users',
    mentors: '/admin/mentors',
    bookings: '/admin/bookings',
    catalog: '/admin/catalog',
    reports: '/admin/reports',
    settings: '/admin/settings'
  }
} as const
