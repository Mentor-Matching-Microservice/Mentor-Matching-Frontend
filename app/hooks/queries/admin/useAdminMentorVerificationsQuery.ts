import { useQuery } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import type { GetAdminMentorVerificationsQueryParams } from '@/types/api/mentor'

export const adminMentorVerificationKeys = {
  all: ['admin-mentor-verifications'] as const,
  lists: () => [...adminMentorVerificationKeys.all, 'list'] as const,
  list: (params: GetAdminMentorVerificationsQueryParams) =>
    [...adminMentorVerificationKeys.lists(), params] as const,
  details: () => [...adminMentorVerificationKeys.all, 'detail'] as const,
  detail: (id: number) => [...adminMentorVerificationKeys.details(), id] as const
}

export function useAdminMentorVerificationsQuery(params: GetAdminMentorVerificationsQueryParams) {
  return useQuery({
    queryKey: adminMentorVerificationKeys.list(params),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorVerifications(params)
      return response.data
    }
  })
}
