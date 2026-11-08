import { useState } from 'react'
import { CalendarDays, Clock3, Info, UserRound, X } from 'lucide-react'
import { createPortal } from 'react-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export type MentorRejectBookingModalSession = {
  learnerName: string
  subjectLabel: string
  dateLabel: string
  timeLabel: string
  bookingStatusLabel: string
}

type MentorRejectBookingModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  session: MentorRejectBookingModalSession | null
}

export function MentorRejectBookingModal({
  open,
  onOpenChange,
  session
}: MentorRejectBookingModalProps) {
  const [reason, setReason] = useState('')
  const [alternativeTime, setAlternativeTime] = useState('')

  const handleClose = () => {
    setReason('')
    setAlternativeTime('')
    onOpenChange(false)
  }

  if (typeof document === 'undefined' || !open || !session) return null

  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm md:p-6'>
      <div className='max-h-[calc(100vh-32px)] w-full max-w-[760px] overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)] md:max-h-[calc(100vh-56px)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 md:px-7 md:py-5'>
          <h3 className='text-ink text-[1.7rem] font-bold tracking-tight md:text-[1.95rem]'>
            Từ chối buổi học
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

        <div className='max-h-[calc(100vh-176px)] space-y-6 overflow-y-auto px-5 py-5 md:max-h-[calc(100vh-208px)] md:px-7 md:py-6'>
          <div className='rounded-[20px] border border-blue-200 bg-gradient-to-br from-blue-50 to-slate-50 p-4 md:p-5'>
            <div className='flex flex-wrap items-start justify-between gap-4'>
              <div className='flex items-start gap-4'>
                <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 md:h-14 md:w-14'>
                  <UserRound size={22} />
                </div>
                <div className='space-y-1.5'>
                  <p className='text-base font-medium text-blue-700'>{session.learnerName}</p>
                  <p className='text-ink text-[1.7rem] leading-none font-bold tracking-tight md:text-[1.95rem]'>
                    {session.subjectLabel}
                  </p>
                  <div className='flex flex-wrap items-center gap-4 pt-2.5 text-[0.98rem] text-slate-700 md:text-[1.02rem]'>
                    <span className='inline-flex items-center gap-2'>
                      <CalendarDays size={17} />
                      {session.dateLabel}
                    </span>
                    <span className='inline-flex items-center gap-2'>
                      <Clock3 size={17} />
                      {session.timeLabel}
                    </span>
                  </div>
                </div>
              </div>

              <Badge className='px-3 py-1 text-sm' variant='muted'>
                {session.bookingStatusLabel}
              </Badge>
            </div>
          </div>

          <div className='space-y-2.5'>
            <label className='text-ink text-[1.05rem] font-semibold' htmlFor='mentor-reject-reason'>
              Lý do từ chối <span className='text-red-600'>*</span>
            </label>
            <Textarea
              className='min-h-[132px] rounded-2xl px-4 py-3 text-[1rem] md:min-h-[148px] md:text-[1.02rem]'
              id='mentor-reject-reason'
              onChange={(event) => setReason(event.target.value)}
              placeholder='Nhập lý do chi tiết để học viên nắm thông tin (ví dụ: bận việc đột xuất, trùng lịch cá nhân...)'
              value={reason}
            />
            <p className='text-sm text-slate-500 italic'>
              Thông tin này sẽ được gửi trực tiếp đến học viên.
            </p>
          </div>

          <div className='space-y-2.5'>
            <label
              className='text-ink text-[1.05rem] font-semibold'
              htmlFor='mentor-reject-alternative'
            >
              Đề xuất lịch khác (Không bắt buộc)
            </label>
            <Input
              className='h-[3.25rem] rounded-2xl px-4 text-[1rem] md:h-14 md:text-[1.02rem]'
              id='mentor-reject-alternative'
              onChange={(event) => setAlternativeTime(event.target.value)}
              placeholder='Gợi ý thời gian bạn có thể dạy (VD: 19:00 Thứ Tư)'
              value={alternativeTime}
            />
          </div>

          <div className='flex items-start gap-3 rounded-[20px] bg-slate-100 px-4 py-4 text-slate-700 md:px-5'>
            <span className='mt-0.5 text-slate-500'>
              <Info size={20} />
            </span>
            <p className='text-[0.98rem] leading-relaxed md:text-[1rem]'>
              Việc từ chối quá nhiều buổi học có thể ảnh hưởng đến tỷ lệ phản hồi và độ uy tín của
              bạn trên MentorMatching.
            </p>
          </div>
        </div>

        <div className='flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 md:px-7 md:py-5'>
          <Button
            className='h-11 min-w-[148px] rounded-2xl px-6 text-base'
            onClick={handleClose}
            variant='outline'
          >
            Quay lại
          </Button>
          <Button
            className='h-11 min-w-[208px] rounded-2xl px-6 text-base'
            onClick={handleClose}
            variant='destructive'
          >
            Xác nhận từ chối
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
