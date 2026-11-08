import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { MentorsQueryParams, MentorListItemApiResponse } from '@/types/api/mentor'

export type FeaturedMentorsQueryParams = Pick<
  MentorsQueryParams,
  'page' | 'size' | 'sortBy' | 'sortDir'
>

async function fetchFeaturedMentors(
  params: FeaturedMentorsQueryParams
): Promise<MentorListItemApiResponse[]> {
  const mentorPage = (await mentorApi.getMentors(params)).data

  return mentorPage.data
}

export function getFeaturedMentorsQueryOptions(params: FeaturedMentorsQueryParams) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.featured({
      page: params.page ?? 1,
      size: params.size ?? 3,
      sortBy: params.sortBy ?? 'createdAt',
      sortDir: params.sortDir ?? 'desc'
    }),
    queryFn: () => fetchFeaturedMentors(params)
  })
}

export function useFeaturedMentorsQuery(params: FeaturedMentorsQueryParams) {
  return useQuery(getFeaturedMentorsQueryOptions(params))
}
