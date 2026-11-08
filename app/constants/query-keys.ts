export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const
  },
  user: {
    learnerProfile: ['user', 'learner-profile'] as const
  },
  catalog: {
    options: ['catalog', 'options'] as const
  },
  mentor: {
    currentProfile: ['mentor', 'current-profile'] as const,
    currentOnboardingStatus: ['mentor', 'current-onboarding-status'] as const,
    currentVerification: ['mentor', 'current-verification'] as const,
    currentSchedule: ['mentor', 'current-schedule'] as const,
    detail: (mentorId: number) => ['mentor', 'detail', mentorId] as const,
    calendar: (params: { mentorId: number; from: string; to: string }) =>
      ['mentor', 'calendar', params] as const,
    list: (params: {
      page: number
      size: number
      search: string | null
      gender: string | null
      meetingType: string | null
      cityId: number | null
      districtId: number | null
      subjectId: number | null
      gradeId: number | null
      sortBy: string | null
      sortDir: string | null
    }) => ['mentor', 'list', params] as const,
    featured: (params: { page: number; size: number; sortBy: string; sortDir: string }) =>
      ['mentor', 'featured', params] as const
  },
  payment: {
    detail: (paymentId: number) => ['payment', 'detail', paymentId] as const,
    my: (params: {
      page: number
      size: number
      status: string | null
      sortBy: string | null
      sortDir: string | null
    }) => ['payment', 'me', params] as const,
    mentorMe: (params: {
      page: number
      size: number
      status: string | null
      sortBy: string | null
      sortDir: string | null
    }) => ['payment', 'mentor-me', params] as const
  },
  booking: {
    me: ['booking', 'me'] as const,
    my: (params: {
      page: number
      size: number
      status: string | null
      meetingType: string | null
    }) => ['booking', 'me', params] as const,
    mentorMeBase: ['booking', 'mentor-me'] as const,
    mentorMe: (params: {
      page: number
      size: number
      status: string | null
      meetingType: string | null
      bookingDateFrom: string | null
      bookingDateTo: string | null
    }) => ['booking', 'mentor-me', params] as const
  },
  location: {
    cities: (search: string) => ['location', 'cities', search] as const,
    districts: (cityId: number, search: string) =>
      ['location', 'districts', cityId, search] as const
  },
  notification: {
    base: ['notification'] as const,
    list: (params: { page: number; size: number }) => ['notification', 'list', params] as const,
    unreadCount: ['notification', 'unreadCount'] as const
  }
} as const
