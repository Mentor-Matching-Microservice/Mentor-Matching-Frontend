import { useMemo, useState } from 'react'
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Link as LinkIcon,
  NotebookText,
  Plus
} from 'lucide-react'
import { Link } from 'react-router'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { MentorAvailabilityModal } from '@/components/MentorAvailabilityModal'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import { useCompleteBookingByMentorMutation } from '@/hooks/queries/booking/useCompleteBookingByMentorMutation'
import { useCurrentMentorBookingsQuery } from '@/hooks/queries/booking/useCurrentMentorBookingsQuery'
import { useCurrentMentorScheduleQuery } from '@/hooks/queries/mentor/useCurrentMentorScheduleQuery'
import type { BookingApiResponse } from '@/types/api/booking'
import type {
  MentorAvailabilityDetailApiResponse,
  MentorAvailabilityTypeApiResponse
} from '@/types/api/mentor'
import type { BookingStatus } from '@/types/models/booking'
import { cn } from '@/utils/cn'
import { formatTimeRange } from '@/utils/format'

type AvailabilityCardItem = {
  id: number
  kind: MentorAvailabilityTypeApiResponse
  title: string
  timeLabel: string
  tagLabel: string
}

type BookedSessionItem = {
  id: number
  learnerName: string
  subjectLabel: string
  dateLabel: string
  timeLabel: string
  meetingTypeLabel: string
  note: string
  bookingStatus: BookingApiResponse['status']
  joinLink: string | null
}

type BookingStatusFilter = 'ALL' | BookingStatus

const bookingStatusFilters: Array<{ key: BookingStatusFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: BOOKING_STATUS_CONFIG.PENDING.label },
  { key: 'CONFIRMED', label: BOOKING_STATUS_CONFIG.CONFIRMED.label },
  { key: 'COMPLETED', label: BOOKING_STATUS_CONFIG.COMPLETED.label },
  { key: 'CANCELLED', label: BOOKING_STATUS_CONFIG.CANCELLED.label },
  { key: 'NO_SHOW', label: BOOKING_STATUS_CONFIG.NO_SHOW.label }
]

const scheduleTips = [
  {
    title: 'Khung giờ lặp lại',
    description: 'Dùng cho lịch cố định mỗi tuần, phù hợp học viên học đều.',
    icon: CalendarDays
  },
  {
    title: 'Khung giờ cụ thể',
    description: 'Dùng cho tăng cường trước kiểm tra hoặc đổi lịch tuần.',
    icon: Clock3
  },
  {
    title: 'Buổi đã được đặt',
    description: 'Cần theo dõi riêng để tránh hiểu availability là lịch đã chốt.',
    icon: BookOpen
  }
] as const

function compareAvailability(
  left: MentorAvailabilityDetailApiResponse,
  right: MentorAvailabilityDetailApiResponse
) {
  if (left.availabilityType !== right.availabilityType) {
    return left.availabilityType === 'RECURRING' ? -1 : 1
  }

  if (left.availabilityType === 'RECURRING' && right.availabilityType === 'RECURRING') {
    return (
      (left.dayOfWeek ?? Number.MAX_SAFE_INTEGER) - (right.dayOfWeek ?? Number.MAX_SAFE_INTEGER) ||
      left.startTime.localeCompare(right.startTime)
    )
  }

  return (
    (left.availableDate ?? '').localeCompare(right.availableDate ?? '') ||
    left.startTime.localeCompare(right.startTime)
  )
}

function compareBookings(left: BookingApiResponse, right: BookingApiResponse) {
  return (
    left.bookingDate.localeCompare(right.bookingDate) ||
    left.startTime.localeCompare(right.startTime)
  )
}

function formatDayOfWeek(dayOfWeek: number | null) {
  if (dayOfWeek === 1) return 'Thứ 2'
  if (dayOfWeek === 2) return 'Thứ 3'
  if (dayOfWeek === 3) return 'Thứ 4'
  if (dayOfWeek === 4) return 'Thứ 5'
  if (dayOfWeek === 5) return 'Thứ 6'
  if (dayOfWeek === 6) return 'Thứ 7'
  if (dayOfWeek === 7) return 'Chủ nhật'

  return 'Lịch lặp lại'
}

function formatSpecificDateLabel(value: string | null) {
  if (!value) return 'Ngày cụ thể'

  const date = new Date(`${value}T00:00:00`)

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('vi-VN', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit'
      }).format(date)
}

function mapAvailabilityItem(item: MentorAvailabilityDetailApiResponse): AvailabilityCardItem {
  return {
    id: item.id,
    kind: item.availabilityType,
    title:
      item.availabilityType === 'RECURRING'
        ? formatDayOfWeek(item.dayOfWeek)
        : formatSpecificDateLabel(item.availableDate),
    timeLabel: formatTimeRange(item.startTime, item.endTime),
    tagLabel: item.availabilityType === 'RECURRING' ? 'Đang mở' : 'Ngắn hạn'
  }
}

function getMeetingTypeLabel(booking: BookingApiResponse) {
  if (booking.meetingType === 'ONLINE') return 'Online'
  return 'Offline'
}

function getBookingNote(booking: BookingApiResponse) {
  if (booking.note?.trim()) return booking.note.trim()
  if (booking.cancelReason?.trim()) return booking.cancelReason.trim()
  return 'Chưa có ghi chú thêm cho buổi học này.'
}

function SchedulePageSkeleton() {
  return (
    <div className='space-y-8'>
      <div className='grid gap-6 xl:grid-cols-[1.55fr_0.95fr]'>
        <div className='space-y-4'>
          <div className='h-10 w-72 animate-pulse rounded-xl bg-slate-100' />
          <div className='grid gap-4 md:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <div className='h-32 animate-pulse rounded-2xl bg-slate-100' key={index} />
            ))}
          </div>
        </div>
        <div className='h-[260px] animate-pulse rounded-[22px] bg-slate-100' />
      </div>

      <div className='space-y-4'>
        <div className='h-10 w-72 animate-pulse rounded-xl bg-slate-100' />
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div className='h-24 animate-pulse rounded-2xl bg-slate-100' key={index} />
          ))}
        </div>
      </div>

      <div className='space-y-4'>
        <div className='h-10 w-60 animate-pulse rounded-xl bg-slate-100' />
        <div className='space-y-3'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div className='h-32 animate-pulse rounded-2xl bg-slate-100' key={index} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function meta() {
  return [{ title: 'Lịch dạy | Mentor' }]
}

export default function MentorSchedulePage() {
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false)
  const [bookingStatusFilter, setBookingStatusFilter] = useState<BookingStatusFilter>('ALL')
  const mentorScheduleQuery = useCurrentMentorScheduleQuery()
  const mentorBookingParams = useMemo(
    () => ({
      page: 1,
      size: 100,
      status: bookingStatusFilter === 'ALL' ? undefined : bookingStatusFilter
    }),
    [bookingStatusFilter]
  )
  const mentorBookingsQuery = useCurrentMentorBookingsQuery(
    mentorBookingParams,
    Boolean(mentorScheduleQuery.data?.currentMentor)
  )
  const completeBookingMutation = useCompleteBookingByMentorMutation()

  const recurringAvailability = useMemo(
    () =>
      (mentorScheduleQuery.data?.availabilities ?? [])
        .filter((item) => item.availabilityType === 'RECURRING')
        .sort(compareAvailability)
        .map(mapAvailabilityItem),
    [mentorScheduleQuery.data?.availabilities]
  )

  const specificDateAvailability = useMemo(
    () =>
      (mentorScheduleQuery.data?.availabilities ?? [])
        .filter((item) => item.availabilityType === 'SPECIFIC_DATE')
        .sort(compareAvailability)
        .map(mapAvailabilityItem),
    [mentorScheduleQuery.data?.availabilities]
  )

  const bookedSessions = useMemo(
    () =>
      (mentorBookingsQuery.data ?? [])
        .slice()
        .sort(compareBookings)
        .map<BookedSessionItem>((booking) => ({
          id: booking.id,
          learnerName: booking.studentName.trim() || 'Học sinh đang cập nhật',
          subjectLabel: [booking.subjectName, booking.gradeName].filter(Boolean).join(' · '),
          dateLabel: formatSpecificDateLabel(booking.bookingDate),
          timeLabel: formatTimeRange(booking.startTime, booking.endTime),
          meetingTypeLabel: getMeetingTypeLabel(booking),
          note: getBookingNote(booking),
          bookingStatus: booking.status,
          joinLink: booking.meetingType === 'ONLINE' ? booking.meetingLink : null
        })),
    [mentorBookingsQuery.data]
  )

  if (mentorScheduleQuery.isLoading && !mentorScheduleQuery.data) {
    return (
      <DashboardPage className='space-y-8' title=''>
        <SchedulePageSkeleton />
      </DashboardPage>
    )
  }

  if (mentorScheduleQuery.isError || !mentorScheduleQuery.data?.currentMentor) {
    return (
      <DashboardPage className='space-y-8' title=''>
        <ScreenErrorState
          description='Không thể tải lịch dạy của mentor lúc này. Vui lòng thử lại.'
          onRetry={() => void mentorScheduleQuery.refetch()}
          retryLabel='Tải lại'
          title='Không tải được lịch dạy'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage className='space-y-8 md:space-y-10' title=''>
      <div className='space-y-3'>
        <div className='flex flex-wrap items-center gap-2 text-sm text-slate-500'>
          <Link className='hover:text-primary transition' to={path.home}>
            Home
          </Link>
          <ChevronRight size={14} />
          <span className='text-ink font-medium'>Lịch dạy</span>
        </div>
      </div>

      <div className='grid gap-8 xl:grid-cols-[1.55fr_0.95fr] xl:items-start'>
        <section className='space-y-5'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-ink text-[2rem] font-bold tracking-tight'>
              Khung giờ lặp lại hằng tuần
            </h2>
            <Button
              className='h-11 rounded-xl px-5 text-sm font-medium'
              onClick={() => setAvailabilityModalOpen(true)}
            >
              <Plus size={16} />
              Thêm khung giờ
            </Button>
          </div>

          {recurringAvailability.length === 0 ? (
            <EmptyState
              className='min-h-[180px] border-solid bg-slate-50'
              description='Hiện chưa có khung giờ lặp lại từ backend.'
              title='Chưa có khung giờ lặp lại'
            />
          ) : (
            <div className='grid gap-4 md:grid-cols-2'>
              {recurringAvailability.map((window) => (
                <Card className='rounded-[18px] border-sky-200 shadow-none' key={window.id}>
                  <CardContent className='space-y-5 p-5'>
                    <div className='flex items-start justify-between gap-3'>
                      <div className='space-y-1'>
                        <p className='text-ink text-[1.05rem] font-semibold'>{window.title}</p>
                        <p className='text-ink text-[0.98rem]'>{window.timeLabel}</p>
                      </div>
                      <span className='inline-flex rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700'>
                        {window.tagLabel}
                      </span>
                    </div>

                    <span className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700'>
                      Linh hoạt
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <aside>
          <Card className='rounded-[22px] border-slate-200 shadow-none'>
            <CardContent className='space-y-6 p-5'>
              <h3 className='text-ink text-[1.9rem] leading-tight font-bold'>Lưu ý khi mở lịch</h3>
              <div className='space-y-5'>
                {scheduleTips.map((tip, index) => (
                  <div className='flex gap-4' key={tip.title}>
                    <div className='flex flex-col items-center'>
                      <div className='flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-700'>
                        <tip.icon size={20} />
                      </div>
                      {index < scheduleTips.length - 1 ? (
                        <span className='mt-2 h-8 w-px bg-slate-200' />
                      ) : null}
                    </div>
                    <div className='space-y-1 pt-1'>
                      <p className='text-ink text-[1.02rem] font-semibold'>
                        {tip.title}: <span className='font-normal'>{tip.description}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className='mt-5 space-y-5'>
        <h2 className='text-ink text-[2rem] font-bold tracking-tight'>
          Khung giờ theo ngày cụ thể
        </h2>

        {specificDateAvailability.length === 0 ? (
          <EmptyState
            className='min-h-[160px] border-solid bg-slate-50'
            description='Hiện chưa có khung giờ theo ngày cụ thể từ backend.'
            title='Chưa có khung giờ cụ thể'
          />
        ) : (
          <div className='grid gap-4 md:max-w-[66%] md:grid-cols-2'>
            {specificDateAvailability.map((window) => (
              <Card className='rounded-[18px] border-sky-200 shadow-none' key={window.id}>
                <CardContent className='flex items-start justify-between gap-3 p-5'>
                  <div className='flex gap-3'>
                    <CalendarDays className='mt-0.5 text-slate-600' size={20} />
                    <div className='space-y-1'>
                      <p className='text-ink text-[1.02rem] font-semibold'>{window.title}</p>
                      <p className='text-ink text-[0.98rem]'>{window.timeLabel}</p>
                    </div>
                  </div>
                  <span className='inline-flex rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700'>
                    Ngắn hạn
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className='mt-5 space-y-5'>
        <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
          <h2 className='text-ink text-[2rem] font-bold tracking-tight'>Buổi đã được đặt</h2>
          <StatusFilterPills
            onValueChange={setBookingStatusFilter}
            options={bookingStatusFilters}
            value={bookingStatusFilter}
          />
        </div>

        {mentorBookingsQuery.isLoading && !mentorBookingsQuery.data ? (
          <div className='space-y-3'>
            {[1, 2].map((item) => (
              <Card className='rounded-[18px] border-slate-200 shadow-none' key={item}>
                <CardContent className='h-28 animate-pulse bg-slate-100/80' />
              </Card>
            ))}
          </div>
        ) : mentorBookingsQuery.isError ? (
          <ScreenErrorState
            description='Không thể tải danh sách buổi đã đặt. Vui lòng thử lại.'
            onRetry={() => void mentorBookingsQuery.refetch()}
            retryLabel='Tải lại'
            title='Không tải được booking'
          />
        ) : bookedSessions.length === 0 ? (
          <EmptyState
            className='min-h-[180px] border-solid bg-slate-50'
            description='Chưa có buổi học nào được đặt.'
            title='Chưa có buổi đã được đặt'
          />
        ) : (
          <div className='space-y-3'>
            {bookedSessions.map((session) => (
              <Card className='rounded-[18px] border-slate-300/90 shadow-none' key={session.id}>
                <CardContent className='space-y-4 p-4 md:p-5'>
                  <div className='flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4'>
                    <div className='space-y-2'>
                      <p className='text-ink text-[1.04rem] font-semibold'>{session.learnerName}</p>
                      <p className='text-muted text-[0.98rem]'>
                        {session.subjectLabel || 'Môn học đang cập nhật'}
                      </p>
                    </div>

                    <div className='flex items-center gap-3'>
                      <StatusBadge kind='booking' status={session.bookingStatus} />
                      {session.bookingStatus === 'CONFIRMED' ? (
                        <Button
                          className='h-10 rounded-xl px-4 text-sm font-medium'
                          isLoading={
                            completeBookingMutation.isPending &&
                            completeBookingMutation.variables === session.id
                          }
                          onClick={() => completeBookingMutation.mutate(session.id)}
                        >
                          <CheckCircle2 aria-hidden='true' size={15} />
                          Đánh dấu hoàn thành
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className='grid gap-3 md:grid-cols-3'>
                    <InfoFact
                      icon={<CalendarDays size={16} />}
                      label='Ngày học'
                      value={session.dateLabel}
                    />
                    <InfoFact
                      icon={<Clock3 size={16} />}
                      label='Giờ học'
                      value={session.timeLabel}
                    />
                    <InfoFact
                      icon={<BookOpen size={16} />}
                      label='Hình thức'
                      value={session.meetingTypeLabel}
                    />
                  </div>

                  <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                    <div className='flex items-start gap-3'>
                      <span className='mt-0.5 text-slate-500'>
                        <NotebookText size={17} />
                      </span>
                      <div className='space-y-1'>
                        <p className='text-ink text-sm font-semibold'>Ghi chú từ học viên</p>
                        <p className='text-[0.98rem] leading-relaxed text-slate-700'>
                          {session.note}
                        </p>
                      </div>
                    </div>
                  </div>

                  {session.joinLink ? (
                    <a
                      className={cn(
                        buttonVariants({ className: 'rounded-xl px-4 text-sm', variant: 'outline' })
                      )}
                      href={session.joinLink}
                      rel='noreferrer'
                      target='_blank'
                    >
                      <LinkIcon size={15} />
                      Mở link học
                    </a>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <MentorAvailabilityModal
        onOpenChange={setAvailabilityModalOpen}
        open={availabilityModalOpen}
      />
    </DashboardPage>
  )
}

function InfoFact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3'>
      <div className='flex items-start gap-3'>
        <span className='mt-0.5 text-slate-500'>{icon}</span>
        <div className='space-y-1'>
          <p className='text-xs font-semibold tracking-[0.08em] text-slate-400 uppercase'>
            {label}
          </p>
          <p className='text-[0.98rem] font-medium text-slate-900'>{value}</p>
        </div>
      </div>
    </div>
  )
}
