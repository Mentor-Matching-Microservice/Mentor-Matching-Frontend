import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { userApi } from '@/services/user.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CurrentUserApiResponse } from '@/types/api/user'
import type { CurrentUser } from '@/types/models/user'

export function mapCurrentUserApiResponse(data: CurrentUserApiResponse): CurrentUser {
  return {
    id: String(data.id),
    email: data.email,
    fullName: data.fullName,
    phone: data.phone,
    userType: data.userType,
    status: data.status,
    roles: data.role ? [data.role] : []
  }
}

async function fetchCurrentUser(): Promise<CurrentUser> {
  return mapCurrentUserApiResponse((await userApi.getCurrentUser()).data)
}

export function getCurrentUserQueryOptions() {
  return queryOptions({
    queryKey: QUERY_KEYS.auth.me,
    queryFn: fetchCurrentUser
  })
}

export function useCurrentUserQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    ...getCurrentUserQueryOptions(),
    enabled: hasHydrated && Boolean(accessToken)
  })
}
