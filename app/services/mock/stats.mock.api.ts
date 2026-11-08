import type { ApiResponse } from '@/types/api/common'
import type {
  AdminStatsDailyPointApiResponse,
  AdminStatsOverviewApiResponse,
  GetAdminStatsQueryParams
} from '@/types/api/stats'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function resolveRange(params?: GetAdminStatsQueryParams) {
  const to = params?.to ? new Date(params.to) : new Date()
  const from = params?.from ? new Date(params.from) : new Date(to.getTime() - 29 * 24 * 60 * 60 * 1000)
  return { from, to }
}

function buildDailyPoints(from: Date, to: Date): AdminStatsDailyPointApiResponse[] {
  const points: AdminStatsDailyPointApiResponse[] = []
  const cursor = new Date(from)

  while (cursor <= to) {
    const seed = cursor.getDate()
    const bookingsCount = 2 + (seed % 6)
    const revenue = bookingsCount * 250000 + (seed % 3) * 50000

    points.push({ date: toIsoDate(cursor), bookingsCount, revenue })
    cursor.setDate(cursor.getDate() + 1)
  }

  return points
}

export const mockStatsApi = {
  async getOverview(
    params?: GetAdminStatsQueryParams
  ): Promise<ApiResponse<AdminStatsOverviewApiResponse>> {
    await delay()

    const { from, to } = resolveRange(params)
    const dailyPoints = buildDailyPoints(from, to)
    const totalBookings = dailyPoints.reduce((sum, point) => sum + point.bookingsCount, 0)
    const completedBookings = Math.round(totalBookings * 0.7)
    const totalRevenue = dailyPoints.reduce((sum, point) => sum + point.revenue, 0)

    return buildSuccessResponse(
      {
        from: toIsoDate(from),
        to: toIsoDate(to),
        newUsersCount: dailyPoints.length * 2,
        newMentorsCount: Math.max(1, Math.round(dailyPoints.length / 5)),
        totalBookings,
        completedBookings,
        completionRate: totalBookings === 0 ? 0 : completedBookings / totalBookings,
        totalRevenue
      },
      'Get admin stats overview successfully'
    )
  },

  async getTimeseries(
    params?: GetAdminStatsQueryParams
  ): Promise<ApiResponse<AdminStatsDailyPointApiResponse[]>> {
    await delay()

    const { from, to } = resolveRange(params)
    return buildSuccessResponse(buildDailyPoints(from, to), 'Get admin stats timeseries successfully')
  }
}
