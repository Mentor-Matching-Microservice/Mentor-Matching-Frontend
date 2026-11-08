import { useMutation, useQueryClient } from '@tanstack/react-query'

import { reviewKeys } from '@/hooks/queries/review/keys'
import { reviewApi } from '@/services/review.api'

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => reviewApi.deleteReview(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all })
    }
  })
}
