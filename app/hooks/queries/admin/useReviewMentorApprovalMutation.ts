import { useMutation, useQueryClient } from '@tanstack/react-query'

import { mentorApi } from '@/services/mentor.api'
import type { ReviewMentorApprovalRequest } from '@/types/api/mentor'
import { adminMentorKeys } from './useAdminMentorsQuery'

export function useReviewMentorApprovalMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ReviewMentorApprovalRequest }) => {
      await mentorApi.reviewMentorApproval(id, data)
    },
    onSuccess: () => {
      // Invalidate queries to refresh the lists
      void queryClient.invalidateQueries({ queryKey: adminMentorKeys.lists() })
    }
  })
}
