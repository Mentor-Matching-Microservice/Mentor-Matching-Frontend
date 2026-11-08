import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Star } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ConfirmModal } from '@/components/ui/confirm-modal'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Vui lòng chọn ít nhất 1 sao').max(5, 'Đánh giá tối đa 5 sao'),
  comment: z.string().optional()
})

export type ReviewFormData = z.infer<typeof reviewSchema>

type ReviewFormModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ReviewFormData
  onSubmit: (data: ReviewFormData) => void
  isSubmitting?: boolean
  title?: string
  isExpired?: boolean
  submitError?: string | null
  onDelete?: () => void
  isDeleting?: boolean
}

export function ReviewFormModal({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
  title = 'Viết đánh giá',
  isExpired,
  submitError,
  onDelete,
  isDeleting
}: ReviewFormModalProps) {
  const [hoveredStar, setHoveredStar] = useState<number>(0)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialData || { rating: 5, comment: '' }
  })

  useEffect(() => {
    if (open) {
      reset(initialData || { rating: 5, comment: '' })
      setHoveredStar(0)
    }
  }, [open, initialData, reset])

  const handleClose = () => {
    onOpenChange(false)
  }

  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/60 p-4 md:p-6'>
      <div className='animate-in fade-in zoom-in-95 max-h-[calc(100vh-32px)] w-full max-w-[600px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200 md:max-h-[calc(100vh-56px)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-7 md:py-5'>
          <h3 className='text-ink text-[1.5rem] font-bold tracking-tight md:text-[1.7rem]'>
            {title}
          </h3>
          <button
            aria-label='Đóng modal'
            className='flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
            onClick={handleClose}
            type='button'
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='max-h-[calc(100vh-176px)] space-y-6 overflow-y-auto px-5 py-5 md:max-h-[calc(100vh-208px)] md:px-7 md:py-6'>
            {isExpired && (
              <div className='rounded-xl bg-amber-50 p-4 text-sm font-medium text-amber-800'>
                Đã quá 30 ngày kể từ ngày đánh giá. Bạn không thể chỉnh sửa đánh giá này nữa.
              </div>
            )}

            <div className='space-y-3 text-center'>
              <label className='text-ink text-[1.1rem] font-semibold'>
                Bạn cảm thấy buổi học như thế nào? <span className='text-red-600'>*</span>
              </label>

              <Controller
                control={control}
                name='rating'
                render={({ field }) => (
                  <div className='flex justify-center gap-2' onMouseLeave={() => setHoveredStar(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type='button'
                        aria-label={`Đánh giá ${star} sao`}
                        onMouseEnter={() => !isExpired && setHoveredStar(star)}
                        onClick={() => !isExpired && field.onChange(star)}
                        className={`transition-transform focus:outline-none ${!isExpired ? 'hover:scale-110' : 'cursor-not-allowed opacity-70'}`}
                        disabled={isExpired}
                      >
                        <Star
                          size={40}
                          className={
                            star <= (hoveredStar || field.value)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 transition-colors'
                          }
                        />
                      </button>
                    ))}
                  </div>
                )}
              />
              {errors.rating && (
                <p className='text-sm font-medium text-red-500'>{errors.rating.message}</p>
              )}
            </div>

            <div className='space-y-2.5'>
              <label className='text-ink text-[1.05rem] font-semibold' htmlFor='review-comment'>
                Chia sẻ thêm trải nghiệm của bạn (Không bắt buộc)
              </label>
              <Controller
                control={control}
                name='comment'
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id='review-comment'
                    className='min-h-[132px] rounded-2xl px-4 py-3 text-[1rem] disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70 md:min-h-[148px] md:text-[1.02rem]'
                    placeholder='Mentor dạy dễ hiểu không? Không khí buổi học thế nào? V.v...'
                    disabled={isExpired}
                  />
                )}
              />
            </div>
          </div>

          <div className='flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-7 md:py-5'>
            <div className='mr-auto flex items-center gap-3'>
              {onDelete && (
                <Button
                  type='button'
                  variant='ghost'
                  className='h-11 rounded-2xl px-4 text-base text-red-600 hover:bg-red-50 hover:text-red-700'
                  disabled={isSubmitting || isDeleting}
                  onClick={() => setIsConfirmDeleteOpen(true)}
                >
                  {isDeleting ? 'Đang xóa...' : 'Xóa'}
                </Button>
              )}
              {submitError && <p className='text-sm font-medium text-red-600'>{submitError}</p>}
            </div>

            {!isExpired && (
              <Button
                type='submit'
                className='h-11 min-w-[160px] rounded-2xl px-6 text-base'
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
            )}
          </div>
        </form>
      </div>

      <ConfirmModal
        open={isConfirmDeleteOpen}
        onOpenChange={setIsConfirmDeleteOpen}
        title='Xóa đánh giá'
        description='Bạn có chắc chắn muốn xóa đánh giá này không? Dữ liệu bị xóa sẽ không thể khôi phục.'
        onConfirm={() => {
          setIsConfirmDeleteOpen(false)
          onDelete?.()
        }}
        confirmText='Xóa'
        destructive
      />
    </div>,
    document.body
  )
}
