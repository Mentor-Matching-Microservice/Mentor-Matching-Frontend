import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { locationApi } from '@/services/location.api'
import type { DistrictApiResponse } from '@/types/api/location'

async function fetchDistrictsByCity(
  cityId: number,
  search: string
): Promise<DistrictApiResponse[]> {
  return (await locationApi.getDistrictsByCity(cityId, { search })).data
}

export function getDistrictsByCityQueryOptions(cityId: number, search: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.location.districts(cityId, search),
    queryFn: () => fetchDistrictsByCity(cityId, search)
  })
}

export function useDistrictsByCityQuery(cityId: number | null, search = '', enabled = true) {
  return useQuery({
    queryKey: cityId
      ? QUERY_KEYS.location.districts(cityId, search)
      : (['location', 'districts', 'idle'] as const),
    queryFn: () => fetchDistrictsByCity(cityId!, search),
    enabled: Boolean(cityId) && enabled
  })
}
