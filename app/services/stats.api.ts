import { env } from '@/config/env'
import http from '@/libs/http'
import { mockStatsApi } from '@/services/mock/stats.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  AdminStatsDailyPointApiResponse,
  AdminStatsOverviewApiResponse,
  GetAdminStatsQueryParams
} from '@/types/api/stats'

const STATS_ENDPOINTS = {
  overview: 'admin/stats/overview',
  timeseries: 'admin/stats/timeseries'
} as const

const defaultStatsApi = {
  getOverview: async (
    params?: GetAdminStatsQueryParams
  ): Promise<ApiResponse<AdminStatsOverviewApiResponse>> =>
    (
      await http.get<ApiResponse<AdminStatsOverviewApiResponse>>(STATS_ENDPOINTS.overview, {
        params
      })
    ).data,

  getTimeseries: async (
    params?: GetAdminStatsQueryParams
  ): Promise<ApiResponse<AdminStatsDailyPointApiResponse[]>> =>
    (
      await http.get<ApiResponse<AdminStatsDailyPointApiResponse[]>>(STATS_ENDPOINTS.timeseries, {
        params
      })
    ).data
}

export const statsApi = env.useMock ? mockStatsApi : defaultStatsApi
