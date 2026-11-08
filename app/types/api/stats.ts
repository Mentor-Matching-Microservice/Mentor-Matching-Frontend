export type AdminStatsOverviewApiResponse = {
  from: string
  to: string
  newUsersCount: number
  newMentorsCount: number
  totalBookings: number
  completedBookings: number
  completionRate: number
  totalRevenue: number
}

export type AdminStatsDailyPointApiResponse = {
  date: string
  bookingsCount: number
  revenue: number
}

export type GetAdminStatsQueryParams = {
  from?: string
  to?: string
}
