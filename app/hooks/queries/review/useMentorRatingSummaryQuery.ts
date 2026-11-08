import { useQuery } from '@tanstack/react-query'

import { reviewApi } from '@/services/review.api'

import { reviewKeys } from './keys'

export function useMentorRatingSummaryQuery(mentorId: number) {
  return useQuery({
    queryKey: reviewKeys.summary(mentorId),
    queryFn: async () => {
      const response = await reviewApi.getMentorRatingSummary(mentorId)
      return response.data
    },
    enabled: !!mentorId
  })
}
