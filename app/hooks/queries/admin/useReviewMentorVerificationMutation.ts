import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import type { ReviewMentorVerificationRequest } from '@/types/api/mentor'
import { adminMentorVerificationKeys } from './useAdminMentorVerificationsQuery'

export function useReviewMentorVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReviewMentorVerificationRequest }) => {
      await mentorApi.reviewMentorVerification(id, data)
    },
    onSuccess: () => {
      // Invalidate queries to refresh the lists
      void queryClient.invalidateQueries({ queryKey: adminMentorVerificationKeys.lists() })
    }
  })
}
