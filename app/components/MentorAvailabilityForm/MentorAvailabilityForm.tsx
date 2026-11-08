import { AppSelect } from '@/components/ui/app-select'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/utils/cn'

export type MentorAvailabilityMode = 'RECURRING' | 'SPECIFIC_DATE'

export type MentorAvailabilityDraftValue = {
  mode: MentorAvailabilityMode
  selectedDays: string[]
  specificDate: string
  startTime: string
  endTime: string
}

type MentorAvailabilityFormProps = {
  className?: string
  onChange: (next: MentorAvailabilityDraftValue) => void
  value: MentorAvailabilityDraftValue
}

export const mentorAvailabilityWeekdayOptions = [
  { label: 'T2', value: '1' },
  { label: 'T3', value: '2' },
  { label: 'T4', value: '3' },
  { label: 'T5', value: '4' },
  { label: 'T6', value: '5' },
  { label: 'T7', value: '6' },
  { label: 'CN', value: '7' }
] as const

export const mentorAvailabilityTimeOptions = Array.from({ length: 32 }, (_, index) => {
  const totalMinutes = 6 * 60 + index * 30
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0')
  const minutes = String(totalMinutes % 60).padStart(2, '0')
  const value = `${hours}:${minutes}`

  return { label: value, value }
})

export function isMentorAvailabilityDraftValid(value: MentorAvailabilityDraftValue) {
  if (!value.startTime || !value.endTime) return false
  if (value.mode === 'RECURRING') return value.selectedDays.length > 0
  return Boolean(value.specificDate)
}

export function MentorAvailabilityForm({
  className,
  onChange,
  value
}: MentorAvailabilityFormProps) {
  const toggleDay = (dayValue: string) => {
    const selectedDays = value.selectedDays.includes(dayValue)
      ? value.selectedDays.filter((item) => item !== dayValue)
      : [...value.selectedDays, dayValue]

    onChange({ ...value, selectedDays })
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className='border-b border-slate-200'>
        <div className='flex gap-8'>
          <ModeTab
            active={value.mode === 'RECURRING'}
            label='Lặp lại hàng tuần'
            onClick={() =>
              onChange({
                ...value,
                mode: 'RECURRING',
                specificDate: ''
              })
            }
          />
          <ModeTab
            active={value.mode === 'SPECIFIC_DATE'}
            label='Ngày cụ thể'
            onClick={() =>
              onChange({
                ...value,
                mode: 'SPECIFIC_DATE',
                selectedDays: []
              })
            }
          />
        </div>
      </div>

      {value.mode === 'RECURRING' ? (
        <div className='flex flex-wrap gap-3'>
          {mentorAvailabilityWeekdayOptions.map((day) => {
            const selected = value.selectedDays.includes(day.value)

            return (
              <button
                aria-pressed={selected}
                className={cn(
                  'flex h-13 w-13 items-center justify-center rounded-full border text-[1.02rem] font-medium transition',
                  selected
                    ? 'border-sky-700 bg-sky-700 text-white shadow-[0_10px_24px_rgba(2,132,199,0.25)]'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-sky-300 hover:text-sky-700'
                )}
                key={day.value}
                onClick={() => toggleDay(day.value)}
                type='button'
              >
                {day.label}
              </button>
            )
          })}
        </div>
      ) : (
        <div className='space-y-2'>
          <label className='text-ink text-base font-medium'>Chọn ngày</label>
          <DatePicker
            ariaLabel='Chọn ngày cụ thể'
            onValueChange={(specificDate) => onChange({ ...value, specificDate })}
            placeholder='Chọn ngày cụ thể'
            value={value.specificDate}
          />
        </div>
      )}

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='space-y-2'>
          <label className='text-ink text-base font-medium'>Từ</label>
          <AppSelect
            ariaLabel='Chọn giờ bắt đầu'
            className='z-[95] [&_button]:h-12 [&_button]:rounded-xl [&_button]:text-base [&_button]:text-slate-900! [&_span]:text-slate-900!'
            onValueChange={(startTime) => onChange({ ...value, startTime })}
            options={mentorAvailabilityTimeOptions}
            placeholder='Chọn giờ bắt đầu'
            value={value.startTime}
          />
        </div>

        <div className='space-y-2'>
          <label className='text-ink text-base font-medium'>Đến</label>
          <AppSelect
            ariaLabel='Chọn giờ kết thúc'
            className='z-[95] [&_button]:h-12 [&_button]:rounded-xl [&_button]:text-base [&_button]:text-slate-900! [&_span]:text-slate-900!'
            onValueChange={(endTime) => onChange({ ...value, endTime })}
            options={mentorAvailabilityTimeOptions}
            placeholder='Chọn giờ kết thúc'
            value={value.endTime}
          />
        </div>
      </div>
    </div>
  )
}

function ModeTab({
  active,
  label,
  onClick
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      className={cn(
        'relative px-1 pb-3 text-[1.02rem] font-medium transition',
        active ? 'text-sky-800' : 'text-slate-500 hover:text-slate-700'
      )}
      onClick={onClick}
      type='button'
    >
      {label}
      <span
        className={cn(
          'absolute right-0 bottom-0 left-0 h-[3px] rounded-full bg-sky-700 transition-opacity',
          active ? 'opacity-100' : 'opacity-0'
        )}
      />
    </button>
  )
}
