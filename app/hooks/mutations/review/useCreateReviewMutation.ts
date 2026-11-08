import { useMutation, useQueryClient } from '@tanstack/react-query'

import { reviewKeys } from '@/hooks/queries/review/keys'
import { reviewApi } from '@/services/review.api'
import type { CreateReviewRequest } from '@/types/api/review'

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreateReviewRequest) => reviewApi.createReview(payload),
    onSuccess: () => {
      // Invalidate review lists and summaries
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    }
  })
}
