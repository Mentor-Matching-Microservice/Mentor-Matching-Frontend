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
  confirmedBookings?: number
  refunded?: number
}

export type AdminStatsTimeseriesApiResponse = {
  from?: string
  to?: string
  currency?: string
  partialData?: boolean
  unavailableMetrics?: string[]
  points: AdminStatsDailyPointApiResponse[]
}

export type GetAdminStatsQueryParams = {
  from?: string
  to?: string
}

