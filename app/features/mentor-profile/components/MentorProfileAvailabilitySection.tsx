import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  formatCalendarDayLabel,
  formatWeekRange
} from '@/features/mentor-profile/mentor-profile-calendar.utils'
import type {
  MentorCalendarSlotViewModel,
  MentorCalendarViewModel
} from '@/features/mentor-profile/mentor-calendar.mapper'
import { formatTimeLabel } from '@/features/mentor-profile/mentor-profile.mapper'
import {
  MentorProfileContentSection,
  MentorProfileInlineEmpty
} from '@/features/mentor-profile/components/MentorProfilePageShell'
import { cn } from '@/utils/cn'

type MentorProfileAvailabilitySectionProps = {
  calendar: MentorCalendarViewModel | null
  isError: boolean
  isLoading: boolean
  onChangeWeek: (weekOffset: number) => void
  onSelectSlot: (slotId: string) => void
  selectedSlotId?: string
  weekStart: string
}

export function MentorProfileAvailabilitySection({
  calendar,
  isError,
  isLoading,
  onChangeWeek,
  onSelectSlot,
  selectedSlotId,
  weekStart
}: MentorProfileAvailabilitySectionProps) {
  return (
    <MentorProfileContentSection
      id='availability'
      title='Khả dụng và lịch dạy'
      subtitle='Chọn một khung giờ còn trống để cập nhật yêu cầu đặt lịch.'
    >
      <div className='flex items-center justify-between gap-3'>
        <Button size='sm' type='button' variant='outline' onClick={() => onChangeWeek(-1)}>
          <ChevronLeft size={16} />
          Tuần trước
        </Button>
        <p className='text-ink text-center text-sm font-bold'>{formatWeekRange(weekStart)}</p>
        <Button size='sm' type='button' variant='outline' onClick={() => onChangeWeek(1)}>
          Tuần sau
          <ChevronRight size={16} />
        </Button>
      </div>

      {isLoading ? (
        <div className='mt-4 h-48 animate-pulse rounded-xl bg-slate-100' />
      ) : isError ? (
        <div className='mt-4'>
          <MentorProfileInlineEmpty text='Không tải được lịch của mentor trong tuần này.' />
        </div>
      ) : calendar?.dates.length ? (
        <div className='mt-4 grid gap-2 md:grid-cols-7'>
          {calendar.dates.map((date) => (
            <CalendarDayColumn
              key={date.date}
              date={date.date}
              selectedSlotId={selectedSlotId}
              slots={date.slots}
              onSelectSlot={onSelectSlot}
            />
          ))}
        </div>
      ) : (
        <div className='mt-4'>
          <MentorProfileInlineEmpty text='Mentor chưa có khung giờ trống trong tuần này.' />
        </div>
      )}
    </MentorProfileContentSection>
  )
}

type CalendarDayColumnProps = {
  date: string
  onSelectSlot: (slotId: string) => void
  selectedSlotId?: string
  slots: MentorCalendarSlotViewModel[]
}

function CalendarDayColumn({ date, onSelectSlot, selectedSlotId, slots }: CalendarDayColumnProps) {
  return (
    <div className='overflow-hidden rounded-xl border border-slate-200 bg-slate-50'>
      <div className='border-b border-slate-200 bg-white px-2 py-2 text-center'>
        <p className='text-ink text-xs font-bold'>{formatCalendarDayLabel(date)}</p>
      </div>
      <div className='min-h-28 space-y-2 p-2'>
        {slots.length ? (
          slots.map((slot) => {
            const selected = slot.id === selectedSlotId

            return (
              <button
                key={slot.id}
                className={cn(
                  'w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition',
                  selected
                    ? 'border-blue-500 bg-blue-600 text-white'
                    : 'border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-400'
                )}
                type='button'
                onClick={() => onSelectSlot(slot.id)}
              >
                {formatTimeLabel(slot.startTime)}-{formatTimeLabel(slot.endTime)}
              </button>
            )
          })
        ) : (
          <p className='pt-3 text-center text-xs text-slate-400'>Không có lịch</p>
        )}
      </div>
    </div>
  )
}
