import { keepPreviousData, queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { PageResponse } from '@/types/api/common'
import type { MentorsQueryParams, MentorListItemApiResponse } from '@/types/api/mentor'

export type DiscoverMentorsPage = PageResponse<MentorListItemApiResponse>

async function fetchDiscoverMentors(params: MentorsQueryParams): Promise<DiscoverMentorsPage> {
  return (await mentorApi.getMentors(params)).data
}

export function getDiscoverMentorsQueryOptions(params: MentorsQueryParams) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.list({
      page: params.page ?? 1,
      size: params.size ?? 12,
      search: params.search?.trim() || null,
      gender: params.gender ?? null,
      meetingType: params.meetingType ?? null,
      cityId: params.cityId ?? null,
      districtId: params.districtId ?? null,
      subjectId: params.subjectId ?? null,
      gradeId: params.gradeId ?? null,
      sortBy: params.sortBy ?? null,
      sortDir: params.sortDir ?? null
    }),
    queryFn: () => fetchDiscoverMentors(params),
    placeholderData: keepPreviousData
  })
}

export function useDiscoverMentorsQuery(params: MentorsQueryParams) {
  return useQuery(getDiscoverMentorsQueryOptions(params))
}
