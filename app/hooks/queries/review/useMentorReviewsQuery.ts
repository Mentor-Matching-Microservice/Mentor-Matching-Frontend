import { useInfiniteQuery } from '@tanstack/react-query'

import { reviewApi } from '@/services/review.api'
import type { PageQueryParams } from '@/types/api/common'

import { reviewKeys } from './keys'

export function useMentorReviewsQuery(mentorId: number, params?: Omit<PageQueryParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: reviewKeys.list(mentorId, params),
    queryFn: async ({ pageParam = 1 }) => {
      const response = await reviewApi.getMentorReviews(mentorId, {
        ...params,
        page: pageParam as number
      } as PageQueryParams)
      return response.data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage
      return page < totalPages ? page + 1 : undefined
    },
    enabled: !!mentorId
  })
}
