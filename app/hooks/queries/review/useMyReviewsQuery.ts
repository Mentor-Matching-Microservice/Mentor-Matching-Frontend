import { useQuery } from '@tanstack/react-query'

import { reviewApi } from '@/services/review.api'
import { useAuthStore } from '@/stores/auth-store'

import { reviewKeys } from './keys'

export function useMyReviewsQuery() {
  const isAuthenticated = useAuthStore((state) => !!state.accessToken)

  return useQuery({
    queryKey: reviewKeys.myReviews(),
    queryFn: async () => {
      const response = await reviewApi.getMyReviews()
      return response.data
    },
    enabled: isAuthenticated
  })
}
