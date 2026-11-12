import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentMentorVerificationStatusApiResponse } from '@/types/api/mentor'

async function fetchCurrentMentorVerificationStatus(): Promise<CurrentMentorVerificationStatusApiResponse> {
  return (await mentorApi.getCurrentMentorVerificationStatus()).data
}

export function getCurrentMentorVerificationStatusQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentVerificationStatus,
    queryFn: fetchCurrentMentorVerificationStatus
  })
}

export function useCurrentMentorVerificationStatusQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentMentorVerificationStatusQueryOptions(),
    enabled: Boolean(accessToken) && enabled
  })
}
