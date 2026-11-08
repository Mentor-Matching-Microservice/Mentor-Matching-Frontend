import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

type DatePickerProps = {
  ariaLabel: string
  className?: string
  onValueChange: (value: string) => void
  placeholder?: string
  value: string
}

const weekdayLabels = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

function getMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('vi-VN', {
    month: 'long',
    year: 'numeric'
  }).format(date)
}

function formatDisplayDate(value: string) {
  if (!value) return ''

  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function buildMonthDays(viewDate: Date) {
  const monthStart = startOfMonth(viewDate)
  const startWeekday = monthStart.getDay()
  const gridStart = new Date(monthStart)
  gridStart.setDate(monthStart.getDate() - startWeekday)

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)
    return date
  })
}

export function DatePicker({
  ariaLabel,
  className,
  onValueChange,
  placeholder = 'Chọn ngày',
  value
}: DatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() =>
    value ? new Date(`${value}T00:00:00`) : new Date()
  )

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const days = useMemo(() => buildMonthDays(viewDate), [viewDate])

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        aria-expanded={open}
        aria-haspopup='dialog'
        aria-label={ariaLabel}
        className={cn(
          'flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 text-left text-base text-slate-900 transition outline-none hover:border-slate-200 focus:border-sky-300 focus:ring-2 focus-visible:ring-sky-100'
        )}
        type='button'
        onClick={() => setOpen((current) => !current)}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-500'}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>
        <CalendarDays aria-hidden='true' className='text-slate-400' size={18} />
      </button>

      {open ? (
        <div className='absolute top-full left-0 z-[110] mt-2 w-[320px] rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_22px_60px_rgba(15,23,42,0.16)] ring-1 ring-slate-200/80'>
          <div className='mb-4 flex items-center justify-between gap-2'>
            <button
              className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'
              type='button'
              onClick={() =>
                setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1))
              }
            >
              <ChevronLeft size={16} />
            </button>
            <p className='text-sm font-semibold text-slate-900 capitalize'>
              {getMonthLabel(viewDate)}
            </p>
            <button
              className='flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50'
              type='button'
              onClick={() =>
                setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1))
              }
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className='grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-400 uppercase'>
            {weekdayLabels.map((label) => (
              <div className='py-1' key={label}>
                {label}
              </div>
            ))}
          </div>

          <div className='mt-2 grid grid-cols-7 gap-1'>
            {days.map((date) => {
              const isoDate = toIsoDate(date)
              const inCurrentMonth = date.getMonth() === viewDate.getMonth()
              const isSelected = value === isoDate
              const isToday = isoDate === toIsoDate(new Date())

              return (
                <button
                  className={cn(
                    'flex h-10 items-center justify-center rounded-lg text-sm transition',
                    isSelected
                      ? 'bg-primary shadow-soft text-white'
                      : inCurrentMonth
                        ? 'text-slate-800 hover:bg-slate-100'
                        : 'text-slate-300 hover:bg-slate-50',
                    isToday && !isSelected && 'border border-blue-200 text-blue-700'
                  )}
                  key={isoDate}
                  type='button'
                  onClick={() => {
                    onValueChange(isoDate)
                    setOpen(false)
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className='mt-4 flex items-center justify-between border-t border-slate-100 pt-3'>
            <button
              className='text-sm font-medium text-slate-500 transition hover:text-slate-700'
              type='button'
              onClick={() => {
                onValueChange('')
                setOpen(false)
              }}
            >
              Xóa
            </button>
            <button
              className='text-sm font-medium text-blue-700 transition hover:text-blue-800'
              type='button'
              onClick={() => {
                const today = toIsoDate(new Date())
                onValueChange(today)
                setViewDate(new Date())
                setOpen(false)
              }}
            >
              Hôm nay
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
