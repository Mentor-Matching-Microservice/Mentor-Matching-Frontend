import { AlertCircle, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/utils/cn'

type BookingHoldCountdownProps = {
  holdExpiresAt?: string | null
  createdAt?: string | null
  variant?: 'pill' | 'card' | 'inline'
  className?: string
  onExpired?: () => void
}

const DEFAULT_HOLD_DURATION_MS = 15 * 60 * 1000 // 15 minutes standard

export function BookingHoldCountdown({
  holdExpiresAt,
  createdAt,
  variant = 'pill',
  className,
  onExpired
}: BookingHoldCountdownProps) {
  const targetTime = (() => {
    if (holdExpiresAt) {
      const parsed = new Date(holdExpiresAt).getTime()
      if (!Number.isNaN(parsed)) return parsed
    }
    if (createdAt) {
      const parsed = new Date(createdAt).getTime()
      if (!Number.isNaN(parsed)) return parsed + DEFAULT_HOLD_DURATION_MS
    }
    return null
  })()

  const calculateRemaining = () => {
    if (targetTime === null) return null
    return Math.max(0, targetTime - Date.now())
  }

  const [remainingMs, setRemainingMs] = useState<number | null>(calculateRemaining)
  const [hasExpiredFired, setHasExpiredFired] = useState(false)

  useEffect(() => {
    if (targetTime === null) return

    const update = () => {
      const nextRemaining = Math.max(0, targetTime - Date.now())
      setRemainingMs(nextRemaining)
      if (nextRemaining === 0 && !hasExpiredFired) {
        setHasExpiredFired(true)
        onExpired?.()
      }
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [targetTime, hasExpiredFired, onExpired])

  if (remainingMs === null) return null

  const totalSeconds = Math.floor(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isUrgent = remainingMs > 0 && remainingMs <= 3 * 60 * 1000
  const isExpired = remainingMs === 0

  if (isExpired) {
    if (variant === 'card') {
      return (
        <div
          role='status'
          aria-live='polite'
          className={cn(
            'flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50/80 p-3 text-xs text-rose-800',
            className
          )}
        >
          <AlertCircle aria-hidden='true' className='shrink-0 text-rose-600 mt-0.5' size={16} />
          <div>
            <p className='font-semibold'>Đã hết thời gian giữ chỗ</p>
            <p className='mt-0.5 text-rose-700/90 leading-relaxed'>
              Thời hạn giữ chỗ 15 phút đã kết thúc. Slot có thể đã được giải phóng để học viên khác đặt.
            </p>
          </div>
        </div>
      )
    }

    if (variant === 'inline') {
      return (
        <span
          role='status'
          aria-live='polite'
          className={cn('inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700', className)}
        >
          <AlertCircle aria-hidden='true' size={14} />
          Đã hết hạn giữ chỗ
        </span>
      )
    }

    return (
      <span
        role='status'
        aria-live='polite'
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700',
          className
        )}
      >
        <AlertCircle aria-hidden='true' size={13} />
        Hết hạn giữ chỗ
      </span>
    )
  }

  // Active countdown
  if (variant === 'card') {
    return (
      <div
        role='timer'
        aria-live='polite'
        aria-label={`Thời gian giữ chỗ còn lại: ${minutes} phút ${seconds} giây`}
        className={cn(
          'flex items-start gap-2.5 rounded-xl border p-3 text-xs transition-colors',
          isUrgent
            ? 'border-rose-300 bg-rose-50/80 text-rose-900'
            : 'border-amber-200 bg-amber-50/80 text-amber-900',
          className
        )}
      >
        <Clock
          aria-hidden='true'
          className={cn(
            'shrink-0 mt-0.5',
            isUrgent ? 'animate-pulse text-rose-600' : 'text-amber-700'
          )}
          size={16}
        />
        <div className='flex-1'>
          <div className='flex items-center justify-between gap-2'>
            <span className='font-semibold'>
              {isUrgent ? 'Sắp hết thời gian giữ chỗ!' : 'Thời gian giữ chỗ còn lại:'}
            </span>
            <span
              className={cn(
                'rounded-md px-2 py-0.5 font-mono text-xs font-bold tracking-wider',
                isUrgent ? 'bg-rose-200 text-rose-900' : 'bg-amber-200 text-amber-950'
              )}
            >
              {formattedTime}
            </span>
          </div>
          <p className='mt-1 text-slate-600 leading-relaxed'>
            Vui lòng hoàn tất thanh toán trước khi hết giờ để mentor giữ lịch này cho bạn.
          </p>
        </div>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <span
        role='timer'
        aria-live='polite'
        aria-label={`Thời gian giữ chỗ còn lại: ${minutes} phút ${seconds} giây`}
        className={cn(
          'inline-flex items-center gap-1.5 font-mono text-xs font-semibold',
          isUrgent ? 'text-rose-700' : 'text-amber-800',
          className
        )}
      >
        <Clock aria-hidden='true' className={isUrgent ? 'animate-pulse' : ''} size={14} />
        Giữ chỗ còn {formattedTime}
      </span>
    )
  }

  return (
    <span
      role='timer'
      aria-live='polite'
      aria-label={`Thời gian giữ chỗ còn lại: ${minutes} phút ${seconds} giây`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
        isUrgent
          ? 'border-rose-300 bg-rose-50 text-rose-800'
          : 'border-amber-200 bg-amber-50 text-amber-800',
        className
      )}
    >
      <Clock
        aria-hidden='true'
        className={cn(isUrgent ? 'animate-pulse text-rose-600' : 'text-amber-700')}
        size={13}
      />
      Giữ chỗ còn <span className='font-mono font-bold'>{formattedTime}</span>
    </span>
  )
}

