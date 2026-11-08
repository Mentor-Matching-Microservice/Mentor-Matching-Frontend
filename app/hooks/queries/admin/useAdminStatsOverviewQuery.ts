import { useQuery } from '@tanstack/react-query'

import { statsApi } from '@/services/stats.api'
import type { GetAdminStatsQueryParams } from '@/types/api/stats'

export const adminStatsKeys = {
  all: ['admin-stats'] as const,
  overview: (params: GetAdminStatsQueryParams) => [...adminStatsKeys.all, 'overview', params] as const,
  timeseries: (params: GetAdminStatsQueryParams) =>
    [...adminStatsKeys.all, 'timeseries', params] as const
}

export function useAdminStatsOverviewQuery(params: GetAdminStatsQueryParams = {}) {
  return useQuery({
    queryKey: adminStatsKeys.overview(params),
    queryFn: async () => {
      const response = await statsApi.getOverview(params)
      return response.data
    }
  })
}
