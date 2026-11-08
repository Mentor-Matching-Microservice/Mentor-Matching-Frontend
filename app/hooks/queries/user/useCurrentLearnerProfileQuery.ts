import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { userApi } from '@/services/user.api'
import { useAuthStore } from '@/stores/auth-store'
import type { LearnerProfileApiResponse } from '@/types/api/user'

async function fetchCurrentLearnerProfile(): Promise<LearnerProfileApiResponse> {
  return (await userApi.getCurrentLearnerProfile()).data
}

export function getCurrentLearnerProfileQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.user.learnerProfile,
    queryFn: fetchCurrentLearnerProfile
  })
}

export function useCurrentLearnerProfileQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentLearnerProfileQueryOptions(),
    enabled: Boolean(accessToken)
  })
}
