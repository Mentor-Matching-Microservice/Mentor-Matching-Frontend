import { useQuery } from '@tanstack/react-query'

import { statsApi } from '@/services/stats.api'
import type { GetAdminStatsQueryParams } from '@/types/api/stats'
import { adminStatsKeys } from './useAdminStatsOverviewQuery'

export function useAdminStatsTimeseriesQuery(params: GetAdminStatsQueryParams = {}) {
  return useQuery({
    queryKey: adminStatsKeys.timeseries(params),
    queryFn: async () => {
      const response = await statsApi.getTimeseries(params)
      return response.data
    }
  })
}
