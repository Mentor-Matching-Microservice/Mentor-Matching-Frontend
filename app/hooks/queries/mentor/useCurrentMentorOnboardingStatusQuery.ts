import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentMentorOnboardingStatusApiResponse } from '@/types/api/mentor'

async function fetchCurrentMentorOnboardingStatus(): Promise<CurrentMentorOnboardingStatusApiResponse> {
  return (await mentorApi.getCurrentMentorOnboardingStatus()).data
}

export function getCurrentMentorOnboardingStatusQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
    queryFn: fetchCurrentMentorOnboardingStatus
  })
}

export function useCurrentMentorOnboardingStatusQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentMentorOnboardingStatusQueryOptions(),
    enabled: Boolean(accessToken)
  })
}
