import { useQuery } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import { adminMentorVerificationKeys } from './useAdminMentorVerificationsQuery'

export function useAdminMentorVerificationDetailQuery(verificationId: number | null) {
  return useQuery({
    queryKey: adminMentorVerificationKeys.detail(verificationId ?? 0),
    queryFn: async () => {
      const response = await mentorApi.getAdminMentorVerificationDetail(verificationId as number)
      return response.data
    },
    enabled: verificationId !== null
  })
}
