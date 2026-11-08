import type { PageQueryParams } from '@/types/api/common'

export const reviewKeys = {
  all: ['reviews'] as const,
  lists: () => [...reviewKeys.all, 'list'] as const,
  list: (mentorId: number, filters?: PageQueryParams) =>
    [...reviewKeys.lists(), mentorId, filters] as const,
  myReviews: () => [...reviewKeys.all, 'my-reviews'] as const,
  summaries: () => [...reviewKeys.all, 'summary'] as const,
  summary: (mentorId: number) => [...reviewKeys.summaries(), mentorId] as const,
  details: () => [...reviewKeys.all, 'detail'] as const,
  detail: (id: number) => [...reviewKeys.details(), id] as const
}
