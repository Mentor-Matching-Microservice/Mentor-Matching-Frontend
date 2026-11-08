import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { catalogApi } from '@/services/catalog.api'
import type { CatalogOptionsApiResponse } from '@/types/api/catalog'

async function fetchCatalogOptions(): Promise<CatalogOptionsApiResponse> {
  return (await catalogApi.getCatalogOptions()).data
}

export function getCatalogOptionsQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.catalog.options,
    queryFn: fetchCatalogOptions
  })
}

export function useCatalogOptionsQuery() {
  return useQuery(getCatalogOptionsQueryOptions())
}

export function useCatalogSubjectsQuery() {
  return useQuery({
    ...getCatalogOptionsQueryOptions(),
    select: (catalogOptions) => catalogOptions.subjects
  })
}

export function useCatalogGradesQuery() {
  return useQuery({
    ...getCatalogOptionsQueryOptions(),
    select: (catalogOptions) => catalogOptions.grades
  })
}
