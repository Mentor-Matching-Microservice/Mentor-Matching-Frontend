import { CalendarDays, Clock3, Pencil, Plus, Trash2 } from 'lucide-react'
import type { ComponentProps } from 'react'

import { ScreenErrorState } from '@/components/ScreenErrorState'
import {
  isMentorAvailabilityDraftValid,
  MentorAvailabilityForm,
  mentorAvailabilityWeekdayOptions,
  type MentorAvailabilityDraftValue
} from '@/components/MentorAvailabilityForm/MentorAvailabilityForm'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import type { BecomeMentorAvailabilityWindow } from '@/features/become-mentor/become-mentor.types'
import { formatTimeRange } from '@/utils/format'

import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'

type BecomeMentorAvailabilitySectionProps = {
  availabilities: BecomeMentorAvailabilityWindow[]
  availabilityDraft: MentorAvailabilityDraftValue
  formId: string
  isDeleting: boolean
  isEditing: boolean
  isError: boolean
  isLoading: boolean
  isSaving: boolean
  onDraftChange: (value: MentorAvailabilityDraftValue) => void
  onEditAvailability: (availability: BecomeMentorAvailabilityWindow) => void
  onRemoveAvailability: (availabilityId: string) => void | Promise<void>
  onResetDraft: () => void
  onRetry: () => void
  onSaveAvailability: () => void | Promise<void>
  onSubmitStep: () => void
  stepError?: string
}

export function BecomeMentorAvailabilitySection({
  availabilities,
  availabilityDraft,
  formId,
  isDeleting,
  isEditing,
  isError,
  isLoading,
  isSaving,
  onDraftChange,
  onEditAvailability,
  onRemoveAvailability,
  onResetDraft,
  onRetry,
  onSaveAvailability,
  onSubmitStep,
  stepError
}: BecomeMentorAvailabilitySectionProps) {
  if (isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải lịch rảnh đã lưu...' size='lg' />
      </div>
    )
  }

  if (isError) {
    return (
      <ScreenErrorState
        description='Không thể tải lịch rảnh hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={onRetry}
        title='Không tải được lịch rảnh'
      />
    )
  }

  return (
    <BecomeMentorSectionCard
      description='Dùng lại đúng cách chọn khung giờ của khu mentor để hồ sơ ứng tuyển và workspace sau này giữ cùng một logic.'
      eyebrow='Bước 3'
      id='availability'
      title='Lịch rảnh ban đầu'
    >
      <form
        className='space-y-6'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          if (isSaving || isDeleting) return
          onSubmitStep()
        }}
      >
        <section className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='border-b border-slate-100 pb-4'>
            <h3 className='text-xl font-semibold text-slate-900'>Danh sách khung giờ rảnh</h3>
          </div>

          <div className='mt-5 space-y-3'>
            {availabilities.length > 0 ? (
              availabilities.map((availability) => (
                <div
                  className='flex items-start justify-between gap-4 rounded-[22px] border border-sky-200 px-4 py-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)]'
                  key={availability.id}
                >
                  <div className='space-y-2'>
                    <div className='flex items-center gap-2 text-slate-900'>
                      {availability.mode === 'RECURRING' ? (
                        <Clock3 className='text-sky-700' size={18} />
                      ) : (
                        <CalendarDays className='text-sky-700' size={18} />
                      )}
                      <p className='text-lg font-semibold'>
                        {availability.mode === 'RECURRING'
                          ? formatRecurringDays(availability.selectedDays)
                          : formatSpecificDateLabel(availability.specificDate)}
                      </p>
                    </div>
                    <p className='text-base text-slate-600'>
                      {formatTimeRange(availability.startTime, availability.endTime)}
                    </p>
                    <span className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700'>
                      {availability.mode === 'RECURRING' ? 'Lặp lại hằng tuần' : 'Ngày cụ thể'}
                    </span>
                  </div>

                  <div className='flex shrink-0 items-center gap-2'>
                    <IconButton
                      aria-label='Sửa khung giờ'
                      disabled={isSaving || isDeleting}
                      onClick={() => onEditAvailability(availability)}
                      variant='outline'
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      aria-label='Xóa khung giờ'
                      disabled={isSaving || isDeleting}
                      onClick={() => onRemoveAvailability(availability.id)}
                      variant='destructive'
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-6 text-sm leading-6 text-slate-500'>
                Chưa có khung giờ nào. Hãy thêm lịch rảnh đầu tiên để quản trị viên hiểu khả năng
                nhận học viên của bạn.
              </div>
            )}
            {stepError ? <p className='text-sm font-medium text-red-500'>{stepError}</p> : null}
          </div>
        </section>

        <section className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='border-b border-slate-100 pb-4'>
            <h3 className='text-xl font-semibold text-slate-900'>
              {isEditing ? 'Chỉnh sửa khung giờ' : 'Thêm khung giờ mới'}
            </h3>
          </div>

          <div className='mt-5 space-y-5'>
            <MentorAvailabilityForm onChange={onDraftChange} value={availabilityDraft} />

            <div className='rounded-[20px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600'>
              <p className='font-semibold text-slate-900'>Lưu ý</p>
              <p className='mt-1'>
                Đây là lịch rảnh khởi tạo để xét duyệt hồ sơ. Khi vào khu mentor chính thức, bạn có
                thể bổ sung thêm nhiều khung giờ chi tiết hơn.
              </p>
            </div>

            <div className='flex flex-col gap-3 sm:flex-row'>
              {isEditing ? (
                <Button className='rounded-2xl' onClick={onResetDraft} variant='outline'>
                  Hủy chỉnh sửa
                </Button>
              ) : null}
              <Button
                className='w-full rounded-2xl sm:flex-1'
                disabled={
                  !isMentorAvailabilityDraftValid(availabilityDraft) || isSaving || isDeleting
                }
                onClick={onSaveAvailability}
                size='lg'
                type='button'
              >
                <Plus size={18} />
                {isSaving
                  ? 'Đang lưu khung giờ...'
                  : isEditing
                    ? 'Cập nhật khung giờ'
                    : 'Thêm khung giờ'}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </BecomeMentorSectionCard>
  )
}

function IconButton({ children, type = 'button', ...props }: ComponentProps<typeof Button>) {
  return (
    <Button className='h-10 w-10 rounded-xl p-0' size='icon' type={type} {...props}>
      {children}
    </Button>
  )
}

function formatRecurringDays(values: string[]) {
  const labels = values
    .slice()
    .sort((left, right) => Number(left) - Number(right))
    .map(
      (value) => mentorAvailabilityWeekdayOptions.find((option) => option.value === value)?.label
    )
    .filter(Boolean)

  return labels.length ? labels.join(', ') : 'Lặp lại hằng tuần'
}

function formatSpecificDateLabel(value: string) {
  if (!value) return 'Ngày cụ thể'

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit'
  }).format(date)
}
