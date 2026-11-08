import { useQueryClient } from '@tanstack/react-query'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  RefreshCcw,
  Receipt
} from 'lucide-react'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router'

import { EmptyState } from '@/components/EmptyState'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useCurrentUserBookingsQuery } from '@/hooks/queries/booking/useCurrentUserBookingsQuery'
import { usePaymentDetailQuery } from '@/hooks/queries/payment/usePaymentDetailQuery'
import { useAuthStore } from '@/stores/auth-store'
import type { BookingApiResponse } from '@/types/api/booking'
import type { PaymentDetailApiResponse } from '@/types/api/payment'
import { cn } from '@/utils/cn'
import { formatPrice, formatShortBookingDate, formatTimeRange } from '@/utils/format'

function formatDateTime(value: string | null) {
  if (!value) return 'Chưa có'

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(value))
}

function formatBookingMoment(booking: BookingApiResponse) {
  return `${formatShortBookingDate(booking.bookingDate)} · ${formatTimeRange(
    booking.startTime,
    booking.endTime
  )}`
}

function getMeetingLabel(booking: BookingApiResponse) {
  if (booking.meetingType === 'ONLINE') return 'Buổi học online'

  return booking.meetingAddress?.trim() || 'Buổi học trực tiếp'
}

function getPaymentCode(paymentId: number | null, providerReferenceId: string | null) {
  if (providerReferenceId?.trim()) return providerReferenceId.trim()
  if (paymentId !== null) return `PAY-ID-${paymentId}`
  return 'Đang cập nhật'
}

function getCancelExperience(payment: PaymentDetailApiResponse | undefined) {
  if (payment?.status === 'PAID') {
    return {
      badge: 'Giao dịch đã được ghi nhận',
      badgeVariant: 'success' as const,
      title: 'Thanh toán đã hoàn tất',
      description:
        'Giao dịch này đã được hệ thống ghi nhận. Bạn có thể xem lại lịch học và thông tin chi tiết ngay bây giờ.',
      icon: CheckCircle2,
      iconClassName: 'border-emerald-300 bg-emerald-50 text-emerald-500',
      primaryLabel: 'Xem lịch học của tôi'
    }
  }

  return {
    badge: 'Thanh toán chưa hoàn tất',
    badgeVariant: 'warning' as const,
    title: 'Bạn đã rời khỏi trang thanh toán',
    description:
      'Giao dịch của bạn hiện chưa hoàn tất. Bạn có thể quay lại lịch học để tiếp tục thanh toán bất cứ lúc nào.',
    icon: AlertCircle,
    iconClassName: 'border-amber-300 bg-amber-50 text-amber-500',
    primaryLabel: 'Về lịch học để thanh toán lại'
  }
}

type SummaryRowProps = {
  label: string
  value: string
  emphasize?: boolean
}

function SummaryRow({ label, value, emphasize = false }: SummaryRowProps) {
  return (
    <div className='grid grid-cols-1 gap-2 border-b border-slate-100 py-4 last:border-b-0 last:pb-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:gap-4'>
      <span className='text-sm text-slate-500'>{label}</span>
      <span
        className={cn(
          'text-sm break-words text-slate-900',
          emphasize ? 'font-semibold' : 'font-medium'
        )}
      >
        {value}
      </span>
    </div>
  )
}

type DetailPanelProps = {
  icon: React.ComponentType<{ className?: string; size?: number }>
  title: string
  footer?: React.ReactNode
  children: React.ReactNode
}

function DetailPanel({ icon: Icon, title, footer, children }: DetailPanelProps) {
  return (
    <Card className='rounded-[28px] border-amber-100 bg-white shadow-[0_24px_80px_rgba(251,191,36,0.08)]'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-[1.45rem] font-bold tracking-tight text-slate-950'>
          <Icon className='text-slate-700' size={18} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-5'>{children}</div>
        {footer ? (
          <div className='flex justify-center text-sm font-medium text-blue-600'>{footer}</div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function meta() {
  return [{ title: 'Thanh toán chưa hoàn tất' }]
}

export default function PaymentCancelPage() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const sessionId = searchParams.get('session_id')
  const paymentIdParam = searchParams.get('payment_id')
  const parsedPaymentId = paymentIdParam ? Number(paymentIdParam) : Number.NaN
  const paymentId =
    Number.isInteger(parsedPaymentId) && parsedPaymentId > 0 ? parsedPaymentId : null

  const paymentDetailQuery = usePaymentDetailQuery(paymentId)
  const bookingsQuery = useCurrentUserBookingsQuery(undefined)

  const bookingId = paymentDetailQuery.data?.bookingId ?? null
  const relatedBooking =
    bookingId !== null
      ? (bookingsQuery.data?.data.find((booking) => booking.id === bookingId) ?? null)
      : null

  useEffect(() => {
    if (!paymentDetailQuery.data) return

    void queryClient.invalidateQueries({
      queryKey: QUERY_KEYS.booking.me,
      exact: false
    })
  }, [paymentDetailQuery.data, queryClient])

  if (paymentIdParam && paymentId === null) {
    return (
      <section className='py-10'>
        <ScreenErrorState
          title='Không đọc được thông tin giao dịch'
          description='Mã thanh toán không hợp lệ. Hãy quay lại lịch học để kiểm tra lại giao dịch của bạn.'
          retryLabel='Về lịch học của tôi'
          onRetry={() => window.location.assign(path.user.bookings)}
        />
      </section>
    )
  }

  if (!paymentIdParam) {
    return (
      <section className='py-10'>
        <EmptyState
          className='border-slate-200 bg-slate-50/70'
          title='Chưa có thông tin giao dịch'
          description='Bạn có thể quay lại lịch học để tiếp tục các thanh toán còn dang dở.'
          action={
            <Button
              className='rounded-full'
              onClick={() => window.location.assign(path.user.bookings)}
              variant='outline'
            >
              <ArrowLeft aria-hidden='true' size={16} />
              Về lịch học của tôi
            </Button>
          }
        />
      </section>
    )
  }

  if (paymentDetailQuery.isError) {
    return (
      <section className='py-10'>
        <ScreenErrorState
          title='Không tải được trạng thái giao dịch'
          description='Vui lòng quay lại lịch học của bạn để kiểm tra hoặc tiếp tục thanh toán.'
          retryLabel='Thử lại'
          onRetry={() => void paymentDetailQuery.refetch()}
        />
      </section>
    )
  }

  const shouldShowLoading = paymentId !== null && (!hasHydrated || paymentDetailQuery.isLoading)

  if (shouldShowLoading) {
    return (
      <section className='relative overflow-hidden py-16 sm:py-24'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_32%)]' />
        <div className='mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6'>
          <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-amber-200 bg-amber-50 text-amber-500 shadow-[0_18px_48px_rgba(251,191,36,0.16)]'>
            <Spinner size='lg' />
          </div>
          <h1 className='mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
            Đang kiểm tra giao dịch
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-slate-600'>
            Hệ thống đang xác nhận lại trạng thái thanh toán của bạn.
          </p>
          <div className='mt-6 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm'>
            <Spinner label='Vui lòng chờ trong giây lát...' />
          </div>
        </div>
      </section>
    )
  }

  const paymentDetail = paymentDetailQuery.data

  if (!paymentDetail) {
    return (
      <section className='py-10'>
        <EmptyState
          className='border-slate-200 bg-slate-50/70'
          title='Đang cập nhật giao dịch'
          description='Thông tin thanh toán sẽ hiển thị ngay khi hệ thống hoàn tất đồng bộ.'
          actionHref={path.user.bookings}
          actionLabel='Về lịch học của tôi'
        />
      </section>
    )
  }

  const experience = getCancelExperience(paymentDetail)
  const HeroIcon = experience.icon
  const paymentCode = getPaymentCode(paymentId, paymentDetail.providerReferenceId ?? null)

  return (
    <section className='relative overflow-hidden py-10 sm:py-14'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_32%)]' />
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        <div className='mx-auto flex max-w-3xl flex-col items-center px-4 pt-8 text-center sm:px-6 sm:pt-12'>
          <div
            className={cn(
              'flex h-24 w-24 items-center justify-center rounded-full border-4 shadow-[0_18px_48px_rgba(251,191,36,0.14)]',
              experience.iconClassName
            )}
          >
            <HeroIcon aria-hidden='true' size={48} strokeWidth={2.6} />
          </div>
          <Badge className='mt-6 rounded-full px-4 py-2 text-sm' variant={experience.badgeVariant}>
            {experience.badge}
          </Badge>
          <h1 className='mt-6 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl'>
            {experience.title}
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-slate-600'>
            {experience.description}
          </p>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <Link className={buttonVariants({ size: 'lg' })} to={path.user.bookings}>
              {experience.primaryLabel}
            </Link>
            <Link className={buttonVariants({ size: 'lg', variant: 'outline' })} to={path.discover}>
              Tìm thêm buổi học
            </Link>
          </div>
        </div>

        <div className='grid gap-6 px-4 sm:px-6 lg:grid-cols-2'>
          <DetailPanel
            icon={Receipt}
            title='Chi tiết giao dịch'
            footer={
              <Link
                className='inline-flex items-center gap-2 transition hover:text-blue-700'
                to={path.user.bookings}
              >
                <RefreshCcw aria-hidden='true' size={16} />
                Quay lại để tiếp tục thanh toán
              </Link>
            }
          >
            <SummaryRow label='Mã giao dịch' value={paymentCode} />
            <SummaryRow label='Mã thanh toán' value={String(paymentDetail.id)} />
            <SummaryRow label='Mã phiên thanh toán' value={sessionId ?? 'Đang cập nhật'} />
            <SummaryRow label='Tổng số tiền' value={formatPrice(paymentDetail.amount)} emphasize />
            <SummaryRow
              label='Trạng thái hiện tại'
              value={
                paymentDetail.status === 'PAID'
                  ? 'Đã thanh toán'
                  : paymentDetail.status === 'FAILED'
                    ? 'Thanh toán thất bại'
                    : paymentDetail.status === 'CANCELLED'
                      ? 'Đã hủy'
                      : 'Chưa hoàn tất'
              }
              emphasize
            />
            <SummaryRow
              label='Thời điểm cập nhật'
              value={formatDateTime(paymentDetail.updatedAt ?? paymentDetail.createdAt)}
            />
          </DetailPanel>

          <DetailPanel
            icon={CreditCard}
            title='Thông tin buổi học'
            footer={
              <Link
                className='inline-flex items-center gap-2 transition hover:text-blue-700'
                to={path.user.bookings}
              >
                <ExternalLink aria-hidden='true' size={16} />
                Mở trang lịch học
              </Link>
            }
          >
            {relatedBooking ? (
              <>
                <SummaryRow label='Mentor' value={relatedBooking.mentorName} emphasize />
                <SummaryRow
                  label='Môn học'
                  value={`${relatedBooking.subjectName} · ${relatedBooking.gradeName}`}
                />
                <SummaryRow label='Thời gian' value={formatBookingMoment(relatedBooking)} />
                <SummaryRow label='Hình thức' value={getMeetingLabel(relatedBooking)} />
                <SummaryRow
                  label='Tổng tiền booking'
                  value={formatPrice(relatedBooking.totalAmount)}
                  emphasize
                />
                <SummaryRow
                  label='Booking'
                  value={
                    paymentDetail.status === 'PAID'
                      ? 'Đã ghi nhận thanh toán'
                      : 'Bạn có thể quay lại lịch học để tiếp tục thanh toán'
                  }
                />
              </>
            ) : (
              <EmptyState
                className='min-h-[360px] border-slate-200 bg-white/80'
                title='Thông tin buổi học đang cập nhật'
                description='Bạn có thể quay lại lịch học để xem thêm chi tiết và tiếp tục thanh toán.'
                actionHref={path.user.bookings}
                actionLabel='Xem lịch học của tôi'
              />
            )}
          </DetailPanel>
        </div>
      </div>
    </section>
  )
}
