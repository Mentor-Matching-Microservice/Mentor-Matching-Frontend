import { useMutation, useQueryClient } from '@tanstack/react-query'

import { reviewKeys } from '@/hooks/queries/review/keys'
import { reviewApi } from '@/services/review.api'
import type { UpdateReviewRequest } from '@/types/api/review'

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateReviewRequest }) =>
      reviewApi.updateReview(id, payload),
    onSuccess: (_, { id }) => {
      // Invalidate list and the specific detail query
      void queryClient.invalidateQueries({ queryKey: reviewKeys.lists() })
      void queryClient.invalidateQueries({ queryKey: reviewKeys.summaries() })
      void queryClient.invalidateQueries({ queryKey: reviewKeys.detail(id) })
    }
  })
}
