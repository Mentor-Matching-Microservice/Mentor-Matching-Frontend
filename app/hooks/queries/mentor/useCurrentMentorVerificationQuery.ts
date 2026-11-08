import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentMentorVerificationApiResponse } from '@/types/api/mentor'

async function fetchCurrentMentorVerification(): Promise<CurrentMentorVerificationApiResponse> {
  return (await mentorApi.getCurrentMentorVerification()).data
}

export function getCurrentMentorVerificationQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentVerification,
    queryFn: fetchCurrentMentorVerification
  })
}

export function useCurrentMentorVerificationQuery(enabled = true) {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentMentorVerificationQueryOptions(),
    enabled: Boolean(accessToken) && enabled
  })
}
