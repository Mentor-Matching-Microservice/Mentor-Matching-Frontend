import { Pencil, Trash2 } from 'lucide-react'

import RatingStars from '@/components/RatingStars/RatingStars'
import type { MentorReviewResponse } from '@/types/api/review'
import { Button } from '@/components/ui/button'

type ReviewItemProps = {
  review: MentorReviewResponse
  isOwner?: boolean
  onEdit?: (review: MentorReviewResponse) => void
  onDelete?: (reviewId: number) => void
}

export function ReviewItem({ review, isOwner, onEdit, onDelete }: ReviewItemProps) {
  const initials = review.studentName
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const formattedDate = new Date(review.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return (
    <div className='flex gap-4 border-b border-slate-200 py-5 last:border-0'>
      <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700'>
        {initials}
      </div>

      <div className='flex-1 space-y-1.5'>
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div>
            <p className='text-ink font-semibold'>{review.studentName}</p>
            <div className='mt-1 flex items-center gap-3'>
              <RatingStars rating={review.rating} size={15} />
              <span className='text-sm text-slate-400'>{formattedDate}</span>
            </div>
          </div>

          {isOwner && (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-500 hover:text-blue-600'
                onClick={() => onEdit?.(review)}
                aria-label='Sửa đánh giá'
              >
                <Pencil size={16} />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-500 hover:text-red-600'
                onClick={() => onDelete?.(review.id)}
                aria-label='Xóa đánh giá'
              >
                <Trash2 size={16} />
              </Button>
            </div>
          )}
        </div>

        {review.comment && (
          <p className='mt-2 text-[0.98rem] leading-relaxed text-slate-700'>{review.comment}</p>
        )}
      </div>
    </div>
  )
}
