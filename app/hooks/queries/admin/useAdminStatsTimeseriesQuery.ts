import { useQuery } from '@tanstack/react-query'

import { statsApi } from '@/services/stats.api'
import type { AdminStatsDailyPointApiResponse, GetAdminStatsQueryParams } from '@/types/api/stats'
import { adminStatsKeys } from './useAdminStatsOverviewQuery'

export function useAdminStatsTimeseriesQuery(params: GetAdminStatsQueryParams = {}) {
  return useQuery({
    queryKey: adminStatsKeys.timeseries(params),
    queryFn: async (): Promise<AdminStatsDailyPointApiResponse[]> => {
      const response = await statsApi.getTimeseries(params)
      const data = response.data
      if (Array.isArray(data)) {
        return data
      }
      if (data && 'points' in data && Array.isArray(data.points)) {
        return data.points
      }
      return []
    }
  })
}

