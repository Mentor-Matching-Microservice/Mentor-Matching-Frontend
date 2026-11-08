import { Fragment } from 'react'

import { MentorProfileContentSection } from '@/features/mentor-profile/components/MentorProfilePageShell'
import type { MentorProfileViewModel } from '@/features/mentor-profile/mentor-profile.mapper'
import { useMentorReviewsQuery } from '@/hooks/queries/review/useMentorReviewsQuery'
import { useMentorRatingSummaryQuery } from '@/hooks/queries/review/useMentorRatingSummaryQuery'
import { ReviewRatingSummary } from '@/features/review/components/ReviewRatingSummary'
import { ReviewItem } from '@/features/review/components/ReviewItem'
import { Button } from '@/components/ui/button'

type MentorProfileReviewsSectionProps = {
  mentor: MentorProfileViewModel
}

export function MentorProfileReviewsSection({ mentor }: MentorProfileReviewsSectionProps) {
  const mentorId = mentor.mentorId

  const summaryQuery = useMentorRatingSummaryQuery(mentorId)
  const reviewsQuery = useMentorReviewsQuery(mentorId, {
    size: 5,
    sortBy: 'createdAt',
    sortDir: 'desc'
  } as any)

  const isLoading = summaryQuery.isLoading || reviewsQuery.isLoading
  const hasReviews = summaryQuery.data && summaryQuery.data.totalReviews > 0

  return (
    <MentorProfileContentSection id='reviews' title='Đánh giá'>
      {isLoading ? (
        <div className='flex justify-center p-8'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600' />
        </div>
      ) : hasReviews ? (
        <div className='space-y-8'>
          <ReviewRatingSummary summary={summaryQuery.data} />

          <div className='space-y-0'>
            {reviewsQuery.data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page.data.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </Fragment>
            ))}
          </div>

          {reviewsQuery.hasNextPage && (
            <div className='flex justify-center pt-4'>
              <Button
                variant='outline'
                className='h-11 rounded-2xl px-8 text-base font-semibold'
                onClick={() => void reviewsQuery.fetchNextPage()}
                disabled={reviewsQuery.isFetchingNextPage}
              >
                {reviewsQuery.isFetchingNextPage ? 'Đang tải...' : 'Xem thêm đánh giá'}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className='rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center'>
          <p className='text-ink text-sm font-bold'>Chưa có đánh giá</p>
          <p className='text-muted mt-1 text-sm'>
            Đánh giá sẽ xuất hiện sau khi học viên hoàn thành buổi học.
          </p>
        </div>
      )}
    </MentorProfileContentSection>
  )
}
