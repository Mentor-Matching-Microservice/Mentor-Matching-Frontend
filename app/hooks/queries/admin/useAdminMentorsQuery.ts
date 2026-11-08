import { useQuery } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import type { GetAdminMentorsQueryParams } from '@/types/api/mentor'

export const adminMentorKeys = {
  all: ['admin-mentors'] as const,
  lists: () => [...adminMentorKeys.all, 'list'] as const,
  list: (params: GetAdminMentorsQueryParams) => [...adminMentorKeys.lists(), params] as const,
  details: () => [...adminMentorKeys.all, 'detail'] as const,
  detail: (mentorId: number) => [...adminMentorKeys.details(), mentorId] as const
}

export function useAdminMentorsQuery(params: GetAdminMentorsQueryParams) {
  return useQuery({
    queryKey: adminMentorKeys.list(params),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentors(params)
      return response.data
    }
  })
}
