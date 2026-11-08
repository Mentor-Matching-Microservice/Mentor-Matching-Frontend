import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { locationApi } from '@/services/location.api'
import type { CityApiResponse } from '@/types/api/location'

async function fetchCities(search: string): Promise<CityApiResponse[]> {
  return (await locationApi.getCities({ search })).data
}

export function getCitiesQueryOptions(search: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.location.cities(search),
    queryFn: () => fetchCities(search)
  })
}

export function useCitiesQuery(search: string, enabled = true) {
  return useQuery({
    ...getCitiesQueryOptions(search),
    enabled
  })
}
