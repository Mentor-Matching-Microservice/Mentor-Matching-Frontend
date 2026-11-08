import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  MentorAchievementDetailApiResponse,
  MentorDetailApiResponse,
  MentorSubjectDetailApiResponse,
  MentorTraitsDetailApiResponse
} from '@/types/api/mentor'

export type MentorProfileApiBundle = {
  detail: MentorDetailApiResponse
  subjects: MentorSubjectDetailApiResponse[]
  traits: MentorTraitsDetailApiResponse | null
  achievements: MentorAchievementDetailApiResponse[]
}

async function fetchMentorProfile(mentorId: number): Promise<MentorProfileApiBundle> {
  const detail = (await mentorApi.getMentorDetail(mentorId)).data
  const [subjectsResult, traitsResult, achievementsResult] = await Promise.allSettled([
    mentorApi.getMentorSubjects(mentorId),
    mentorApi.getMentorTraits(mentorId),
    mentorApi.getMentorAchievements(mentorId)
  ])

  return {
    detail,
    subjects: subjectsResult.status === 'fulfilled' ? subjectsResult.value.data : [],
    traits: traitsResult.status === 'fulfilled' ? traitsResult.value.data : null,
    achievements: achievementsResult.status === 'fulfilled' ? achievementsResult.value.data : []
  }
}

export function getMentorProfileQueryOptions(mentorId: number) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.detail(mentorId),
    queryFn: () => fetchMentorProfile(mentorId)
  })
}

export function useMentorProfileQuery(mentorId: number | null) {
  return useQuery({
    ...getMentorProfileQueryOptions(mentorId ?? 0),
    enabled: Boolean(mentorId && mentorId > 0)
  })
}
