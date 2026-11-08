import { Link } from 'react-router'
import {
  ArrowRight,
  Bell,
  BookMarked,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  ReceiptText,
  Sparkles,
  UserRound,
  Wallet
} from 'lucide-react'
import { useMemo } from 'react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { path } from '@/config/path'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useCurrentUserBookingsQuery } from '@/hooks/queries/booking/useCurrentUserBookingsQuery'
import { useCurrentLearnerProfileQuery } from '@/hooks/queries/user/useCurrentLearnerProfileQuery'
import type { BookingApiResponse } from '@/types/api/booking'
import { cn } from '@/utils/cn'
import { formatPrice, formatShortBookingDate, formatTimeRange } from '@/utils/format'

type QuickActionItem = {
  title: string
  description: string
  href: string
  icon: typeof BookMarked
}

type SummaryItem = {
  label: string
  value: string
  helper: string
  icon: typeof BookMarked
  tone: 'info' | 'warning' | 'success' | 'neutral'
}

type BookingFactProps = {
  icon: typeof Calendar
  label: string
  value: string
  accent?: 'default' | 'warning'
}

type QuickActionCardProps = {
  title: string
  description: string
  href: string
  icon: typeof BookMarked
}

type SummaryStatCardProps = SummaryItem

function toBookingStartDate(booking: BookingApiResponse) {
  const parsedDate = new Date(`${booking.bookingDate}T${booking.startTime}`)

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function compareUpcomingBookings(left: BookingApiResponse, right: BookingApiResponse) {
  return (
    (toBookingStartDate(left)?.getTime() ?? Number.MAX_SAFE_INTEGER) -
      (toBookingStartDate(right)?.getTime() ?? Number.MAX_SAFE_INTEGER) ||
    left.bookingDate.localeCompare(right.bookingDate) ||
    left.startTime.localeCompare(right.startTime)
  )
}

function compareRecentBookings(left: BookingApiResponse, right: BookingApiResponse) {
  return (
    (right.createdAt ?? '').localeCompare(left.createdAt ?? '') ||
    right.bookingDate.localeCompare(left.bookingDate) ||
    right.startTime.localeCompare(left.startTime)
  )
}

function needsPayment(booking: BookingApiResponse) {
  return booking.status === 'PENDING'
}

function getPaymentCueLabel(booking: BookingApiResponse) {
  if (!needsPayment(booking)) return null

  return 'Cần thanh toán'
}

function getBookingSummary(booking: BookingApiResponse) {
  if (booking.note?.trim()) return booking.note.trim()
  if (booking.cancelReason?.trim()) return `Lý do hủy: ${booking.cancelReason.trim()}`
  if (booking.meetingType === 'ONLINE') {
    return needsPayment(booking)
      ? 'Booking này đang chờ bạn thanh toán để giữ chỗ với mentor.'
      : 'Chi tiết buổi học online sẽ hiển thị đầy đủ trong mục lịch học.'
  }

  return (
    booking.meetingAddress?.trim() || 'Chi tiết buổi học sẽ hiển thị đầy đủ trong mục lịch học.'
  )
}

function DashboardSkeleton() {
  return (
    <div className='space-y-8 lg:space-y-10'>
      <div className={topGridClass}>
        <WorkspacePanel title='Buổi học sắp tới'>
          <div className='animate-pulse space-y-4'>
            <div className='h-9 w-32 rounded-xl bg-slate-100' />
            <div className='h-[380px] rounded-[28px] bg-slate-100' />
          </div>
        </WorkspacePanel>

        <WorkspacePanel title='Tóm tắt tuần này'>
          <div className='animate-pulse space-y-4'>
            <div className='h-24 rounded-[24px] bg-slate-100' />
            <div className='h-24 rounded-[24px] bg-slate-100' />
            <div className='h-24 rounded-[24px] bg-slate-100' />
          </div>
        </WorkspacePanel>
      </div>

      <WorkspacePanel title='Gần đây'>
        <div className='animate-pulse space-y-3'>
          <div className='h-12 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
          <div className='h-16 rounded-2xl bg-slate-100' />
        </div>
      </WorkspacePanel>

      <WorkspacePanel title='Hành động nhanh'>
        <div className='grid gap-4 md:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div className='h-32 animate-pulse rounded-[24px] bg-slate-100' key={index} />
          ))}
        </div>
      </WorkspacePanel>

      <div className='h-24 animate-pulse rounded-[28px] bg-slate-100' />
    </div>
  )
}

export function meta() {
  return [{ title: 'Tổng quan | Học viên' }]
}

const topGridClass = 'grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_320px] xl:items-start'

function BookingFact({ accent = 'default', icon: Icon, label, value }: BookingFactProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] border p-4',
        accent === 'warning' ? 'border-amber-200 bg-amber-50/70' : 'border-slate-200 bg-white'
      )}
    >
      <div className='mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-500'>
        <Icon aria-hidden='true' size={16} />
      </div>
      <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
        {label}
      </p>
      <p className='text-ink mt-1 text-base font-semibold'>{value}</p>
    </div>
  )
}

function SummaryStatCard({ helper, icon: Icon, label, tone, value }: SummaryStatCardProps) {
  return (
    <Card className='rounded-[24px] border-slate-200 shadow-none'>
      <CardContent className='flex items-start gap-4 p-5'>
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl',
            tone === 'warning'
              ? 'bg-amber-50 text-amber-700'
              : tone === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-700'
          )}
        >
          <Icon aria-hidden='true' size={18} />
        </div>
        <div className='space-y-1'>
          <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
            {label}
          </p>
          <p className='text-ink text-4xl leading-none font-semibold'>{value}</p>
          <p className='text-muted text-sm leading-relaxed'>{helper}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function QuickActionCard({ description, href, icon: Icon, title }: QuickActionCardProps) {
  return (
    <Link
      className='group flex h-full items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-sm'
      to={href}
    >
      <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
        <Icon aria-hidden='true' size={20} />
      </div>
      <div className='min-w-0 flex-1 space-y-1.5'>
        <div className='flex items-start justify-between gap-3'>
          <p className='text-ink text-lg font-semibold'>{title}</p>
          <ChevronRight
            aria-hidden='true'
            className='mt-1 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700'
            size={18}
          />
        </div>
        <p className='text-muted text-sm leading-relaxed'>{description}</p>
      </div>
    </Link>
  )
}

export default function UserDashboardPage() {
  const currentUserQuery = useCurrentUserQuery()
  const learnerProfileQuery = useCurrentLearnerProfileQuery()
  const bookingsQuery = useCurrentUserBookingsQuery()

  const bookings = useMemo(() => bookingsQuery.data?.data ?? [], [bookingsQuery.data?.data])

  const upcomingBookings = useMemo(
    () =>
      bookings
        .filter((booking) => {
          if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') return false

          return Boolean(toBookingStartDate(booking))
        })
        .sort(compareUpcomingBookings),
    [bookings]
  )

  const nextBooking = upcomingBookings[0] ?? null
  const paymentDueBookings = useMemo(() => bookings.filter(needsPayment), [bookings])
  const completedBookings = useMemo(
    () => bookings.filter((booking) => booking.status === 'COMPLETED'),
    [bookings]
  )
  const recentBookings = useMemo(
    () => bookings.slice().sort(compareRecentBookings).slice(0, 4),
    [bookings]
  )
  const learnerProfile = learnerProfileQuery.data
  const isLearnerProfileIncomplete = Boolean(
    !learnerProfile ||
    !learnerProfile.gradeId ||
    !learnerProfile.schoolName?.trim() ||
    !learnerProfile.learningGoal?.trim()
  )

  const quickActions = useMemo<QuickActionItem[]>(
    () => [
      {
        title: 'Tìm mentor phù hợp',
        description: 'Khám phá thêm môn học, lớp và lịch phù hợp với mục tiêu hiện tại.',
        href: path.discover,
        icon: BookMarked
      },
      {
        title: 'Lịch sử thanh toán',
        description:
          paymentDueBookings.length > 0
            ? `${paymentDueBookings.length} khoản học phí đang chờ bạn hoàn tất.`
            : 'Xem lại tình trạng thanh toán và các khoản học phí gần đây.',
        href: path.user.payments,
        icon: Wallet
      },
      {
        title: 'Quản lý lịch học',
        description: 'Theo dõi các buổi đã đặt, khoản cần thanh toán và lịch sử học gần đây.',
        href: path.user.bookings,
        icon: Calendar
      },
      {
        title: isLearnerProfileIncomplete ? 'Hoàn thiện hồ sơ' : 'Cập nhật hồ sơ',
        description: learnerProfileQuery.isError
          ? 'Mở hồ sơ để kiểm tra và cập nhật lại thông tin học tập.'
          : isLearnerProfileIncomplete
            ? 'Bổ sung lớp học, trường và mục tiêu để mentor hiểu rõ nhu cầu của bạn.'
            : 'Điều chỉnh mục tiêu học tập và thông tin cá nhân khi kế hoạch học thay đổi.',
        href: path.user.profile,
        icon: UserRound
      }
    ],
    [isLearnerProfileIncomplete, learnerProfileQuery.isError, paymentDueBookings.length]
  )

  const summaryItems = useMemo<SummaryItem[]>(
    () => [
      {
        label: 'Buổi học sắp tới',
        value: `${upcomingBookings.length}`,
        helper: upcomingBookings.length > 0 ? 'Bạn đã có lịch học sắp tới' : 'Chưa có lịch học mới',
        icon: Calendar,
        tone: upcomingBookings.length > 0 ? 'info' : ('neutral' as const)
      },
      {
        label: 'Cần thanh toán',
        value: `${paymentDueBookings.length}`,
        helper:
          paymentDueBookings.length > 0
            ? 'Đi tới mục lịch học để tiếp tục'
            : 'Hiện chưa có khoản cần thanh toán',
        icon: Clock3,
        tone: paymentDueBookings.length > 0 ? 'warning' : ('neutral' as const)
      },
      {
        label: 'Buổi đã hoàn thành',
        value: `${completedBookings.length}`,
        helper:
          completedBookings.length > 0
            ? 'Bạn đã hoàn thành một số buổi học'
            : 'Chưa có buổi hoàn thành nào',
        icon: CheckCircle2,
        tone: completedBookings.length > 0 ? 'success' : 'neutral'
      }
    ],
    [completedBookings.length, paymentDueBookings.length, upcomingBookings.length]
  )

  const notice = useMemo(() => {
    if (paymentDueBookings.length > 0) {
      return {
        title: 'Thông báo hệ thống',
        description: `Bạn đang có ${paymentDueBookings.length} booking chờ thanh toán. Hãy vào lịch học để giữ chỗ với mentor đúng hạn.`,
        icon: Bell,
        tone: 'warning' as const
      }
    }

    if (learnerProfileQuery.isError) {
      return {
        title: 'Thông báo hệ thống',
        description:
          'Một phần thông tin học tập hiện chưa hiển thị đầy đủ. Bạn có thể mở hồ sơ để kiểm tra lại.',
        icon: UserRound,
        tone: 'neutral' as const
      }
    }

    if (isLearnerProfileIncomplete) {
      return {
        title: 'Thông báo hệ thống',
        description:
          'Hoàn thiện hồ sơ học tập sẽ giúp mentor hiểu rõ nhu cầu của bạn hơn khi nhận booking mới.',
        icon: UserRound,
        tone: 'info' as const
      }
    }

    if (bookings.length === 0) {
      return {
        title: 'Thông báo hệ thống',
        description:
          'Bạn chưa có booking nào. Hãy bắt đầu từ trang khám phá để tìm mentor phù hợp.',
        icon: Sparkles,
        tone: 'info' as const
      }
    }

    return {
      title: 'Thông báo hệ thống',
      description: 'Mọi thông tin quan trọng về lịch học và thanh toán sẽ được cập nhật tại đây.',
      icon: Bell,
      tone: 'info' as const
    }
  }, [
    bookings.length,
    isLearnerProfileIncomplete,
    learnerProfileQuery.isError,
    paymentDueBookings.length
  ])

  const isLoading =
    (currentUserQuery.isLoading && !currentUserQuery.data) ||
    (bookingsQuery.isLoading && !bookingsQuery.data)

  if (isLoading) {
    return (
      <DashboardPage title='Tổng quan'>
        <DashboardSkeleton />
      </DashboardPage>
    )
  }

  if (currentUserQuery.isError || bookingsQuery.isError || !currentUserQuery.data) {
    return (
      <DashboardPage title='Tổng quan'>
        <ScreenErrorState
          description='Không thể tải trang tổng quan lúc này. Vui lòng thử lại sau ít phút.'
          onRetry={() => {
            void currentUserQuery.refetch()
            void bookingsQuery.refetch()
            void learnerProfileQuery.refetch()
          }}
          retryLabel='Tải lại'
          title='Chưa tải được tổng quan'
        />
      </DashboardPage>
    )
  }

  const nextBookingStatusLabel =
    nextBooking && needsPayment(nextBooking)
      ? BOOKING_STATUS_CONFIG.PENDING.label
      : nextBooking?.status === 'CONFIRMED'
        ? BOOKING_STATUS_CONFIG.CONFIRMED.label
        : 'Cập nhật lịch học'

  return (
    <DashboardPage title='Tổng quan'>
      <div className='space-y-8 lg:space-y-10'>
        <div className={topGridClass}>
          <WorkspacePanel
            className='overflow-hidden'
            contentClassName='space-y-4'
            title='Buổi học sắp tới'
            description='Ưu tiên xem buổi gần nhất để chuẩn bị và biết ngay khi nào cần thanh toán.'
            action={
              <Link
                className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
                to={path.user.bookings}
              >
                Xem tất cả
                <ArrowRight aria-hidden='true' size={14} />
              </Link>
            }
          >
            {bookings.length === 0 ? (
              <EmptyState
                actionHref={path.discover}
                actionLabel='Tìm mentor'
                description='Bắt đầu từ trang khám phá để đặt buổi học đầu tiên và theo dõi lịch học ngay trên màn hình này.'
                title='Bạn chưa có booking nào'
              />
            ) : nextBooking ? (
              <Card className='overflow-hidden rounded-[28px] border-slate-200 shadow-none'>
                <div
                  className={cn(
                    'border-b px-5 py-3',
                    needsPayment(nextBooking) ? 'bg-amber-300/85' : 'bg-slate-100'
                  )}
                >
                  <Badge
                    className='bg-white/90 text-slate-800 shadow-none'
                    variant={needsPayment(nextBooking) ? 'warning' : 'secondary'}
                  >
                    {nextBookingStatusLabel}
                  </Badge>
                </div>
                <CardContent className='space-y-5 p-5 md:p-6'>
                  <div className='space-y-1.5'>
                    <p className='text-ink text-4xl font-semibold tracking-tight'>
                      {nextBooking.subjectName} · {nextBooking.gradeName}
                    </p>
                    <p className='text-muted text-lg'>
                      Mentor{' '}
                      <span className='text-ink font-semibold'>{nextBooking.mentorName}</span>
                    </p>
                  </div>

                  <div className='grid gap-3 md:grid-cols-2'>
                    <BookingFact
                      icon={Calendar}
                      label='Ngày học'
                      value={formatShortBookingDate(nextBooking.bookingDate)}
                    />
                    <BookingFact
                      icon={ReceiptText}
                      label='Hình thức'
                      value={
                        nextBooking.meetingType === 'ONLINE'
                          ? 'Buổi học online'
                          : nextBooking.meetingAddress?.trim() || 'Buổi học trực tiếp'
                      }
                    />
                    <BookingFact
                      icon={Clock3}
                      label='Khung giờ'
                      value={formatTimeRange(nextBooking.startTime, nextBooking.endTime)}
                    />
                    <BookingFact
                      accent={needsPayment(nextBooking) ? 'warning' : 'default'}
                      icon={CreditCard}
                      label='Học phí'
                      value={formatPrice(nextBooking.totalAmount)}
                    />
                  </div>

                  <div className='grid gap-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center'>
                    <div className='space-y-1.5'>
                      <p className='text-[11px] font-semibold tracking-[0.12em] text-slate-400 uppercase'>
                        Bước tiếp theo
                      </p>
                      <p className='text-ink text-2xl font-semibold'>
                        {needsPayment(nextBooking)
                          ? 'Hoàn tất thanh toán'
                          : nextBooking.status === 'CONFIRMED'
                            ? 'Chuẩn bị vào lớp'
                            : 'Theo dõi lịch học'}
                      </p>
                      <p className='text-muted text-sm leading-relaxed'>
                        {needsPayment(nextBooking)
                          ? 'Mở lịch học để hoàn tất thanh toán cho buổi này.'
                          : nextBooking.status === 'CONFIRMED'
                            ? 'Kiểm tra lại thông tin buổi học và vào lớp đúng giờ.'
                            : 'Mở lịch học để xem đầy đủ các buổi liên quan.'}
                      </p>
                    </div>

                    <div className='flex flex-col gap-2.5'>
                      {needsPayment(nextBooking) ? (
                        <Link
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          to={path.user.bookings}
                        >
                          Hoàn tất thanh toán
                        </Link>
                      ) : nextBooking.status === 'CONFIRMED' &&
                        nextBooking.meetingType === 'ONLINE' &&
                        nextBooking.meetingLink?.trim() ? (
                        <a
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          href={nextBooking.meetingLink}
                          rel='noreferrer'
                          target='_blank'
                        >
                          Vào buổi học
                        </a>
                      ) : (
                        <Link
                          className={buttonVariants({
                            className: 'w-full shadow-none',
                            size: 'lg'
                          })}
                          to={path.user.bookings}
                        >
                          Xem lịch học
                        </Link>
                      )}

                      <Link
                        className={buttonVariants({
                          className: 'w-full shadow-none',
                          size: 'lg',
                          variant: 'outline'
                        })}
                        to={path.discover}
                      >
                        Tìm thêm mentor
                      </Link>
                    </div>
                  </div>

                  <p className='text-sm text-slate-600'>{getBookingSummary(nextBooking)}</p>
                </CardContent>
              </Card>
            ) : (
              <EmptyState
                actionHref={path.user.bookings}
                actionLabel='Xem lịch học'
                description='Bạn đã có booking trong hệ thống nhưng hiện chưa có buổi nào ở phía trước.'
                title='Hiện chưa có buổi sắp tới'
              />
            )}
          </WorkspacePanel>

          <WorkspacePanel contentClassName='space-y-4' title='Tóm tắt tuần này'>
            {summaryItems.map((item) => (
              <SummaryStatCard {...item} key={item.label} />
            ))}
          </WorkspacePanel>
        </div>

        <WorkspacePanel
          contentClassName='space-y-4'
          title='Gần đây'
          description='Các booking gần nhất được gói gọn để bạn nhìn nhanh trạng thái, lịch học và giá tiền.'
        >
          {recentBookings.length > 0 ? (
            <div className='overflow-hidden rounded-[24px] border border-slate-200 bg-white'>
              <div className='overflow-x-auto'>
                <Table className='min-w-[760px]'>
                  <TableHeader>
                    <TableRow className='bg-slate-50'>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Môn học / Cấp độ
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Mentor
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Thời gian
                      </TableHead>
                      <TableHead className='text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Học phí
                      </TableHead>
                      <TableHead className='text-right text-xs font-semibold tracking-normal text-slate-500 normal-case'>
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow className='border-slate-100' key={booking.id}>
                        <TableCell className='space-y-2'>
                          <p className='text-ink text-lg font-semibold'>
                            {booking.subjectName} · {booking.gradeName}
                          </p>
                          <div className='flex flex-wrap gap-2'>
                            <StatusBadge kind='booking' status={booking.status} />
                            {getPaymentCueLabel(booking) ? (
                              <Badge variant='warning'>{getPaymentCueLabel(booking)}</Badge>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className='text-ink font-medium'>{booking.mentorName}</TableCell>
                        <TableCell>
                          <div className='space-y-1 text-sm'>
                            <p className='text-ink font-medium'>
                              {formatShortBookingDate(booking.bookingDate)}
                            </p>
                            <p className='text-muted'>
                              {formatTimeRange(booking.startTime, booking.endTime)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className='text-ink font-semibold'>
                          {formatPrice(booking.totalAmount)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Link
                            className={buttonVariants({ size: 'sm', variant: 'outline' })}
                            to={path.user.bookings}
                          >
                            Xem chi tiết
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <EmptyState
              actionHref={path.discover}
              actionLabel='Tìm mentor'
              description='Khi có booking đầu tiên, lịch sử học gần đây sẽ xuất hiện tại đây.'
              title='Chưa có lịch sử booking'
            />
          )}
        </WorkspacePanel>

        <WorkspacePanel
          contentClassName='space-y-4'
          title='Hành động nhanh'
          description='Chọn nhanh việc bạn muốn thực hiện tiếp theo.'
        >
          <div className='grid gap-4 md:grid-cols-2'>
            {quickActions.map((action) => (
              <QuickActionCard
                description={action.description}
                href={action.href}
                icon={action.icon}
                key={action.title}
                title={action.title}
              />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspaceNotice
          className='rounded-[28px]'
          description={notice.description}
          icon={notice.icon}
          title={notice.title}
          tone={notice.tone}
        />
      </div>
    </DashboardPage>
  )
}
