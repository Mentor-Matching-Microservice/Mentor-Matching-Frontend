import RatingStars from '@/components/RatingStars/RatingStars'
import type { MentorRatingSummaryResponse } from '@/types/api/review'

type ReviewRatingSummaryProps = {
  summary: MentorRatingSummaryResponse
}

export function ReviewRatingSummary({ summary }: ReviewRatingSummaryProps) {
  const { averageRating, totalReviews, ratingDistribution } = summary

  return (
    <div className='flex flex-col gap-6 md:flex-row md:items-center md:gap-12'>
      <div className='flex flex-col items-center justify-center text-center md:w-32'>
        <span className='text-ink text-5xl leading-none font-bold tracking-tight'>
          {averageRating.toFixed(1)}
        </span>
        <div className='mt-2 mb-1'>
          <RatingStars rating={averageRating} size={18} />
        </div>
        <span className='text-sm text-slate-500'>
          {totalReviews} {totalReviews > 1 ? 'đánh giá' : 'đánh giá'}
        </span>
      </div>

      <div className='flex-1 space-y-2'>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratingDistribution[star.toString()] || 0
          const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0

          return (
            <div key={star} className='flex items-center gap-3 text-sm'>
              <span className='w-12 font-medium text-slate-600'>{star} sao</span>
              <div className='relative h-2 flex-1 overflow-hidden rounded-full bg-slate-100'>
                <div
                  className='absolute top-0 left-0 h-full rounded-full bg-amber-400 transition-all duration-500'
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className='w-10 text-right text-slate-500'>{percentage}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
