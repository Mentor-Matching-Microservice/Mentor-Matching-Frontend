import { useQuery } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import { adminMentorKeys } from './useAdminMentorsQuery'

export function useAdminMentorDetailQuery(mentorId: number | null) {
  return useQuery({
    queryKey: adminMentorKeys.detail(mentorId ?? 0),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorDetail(mentorId as number)
      return response.data
    },
    enabled: mentorId !== null
  })
}
