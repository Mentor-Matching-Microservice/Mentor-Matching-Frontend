import { useQueryClient } from '@tanstack/react-query'
import {
  Check,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  HelpCircle,
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
import { cn } from '@/utils/cn'
import { formatPrice, formatShortBookingDate, formatTimeRange, getInitials } from '@/utils/format'

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

type HeroChipProps = {
  label: string
  value: string
}

function HeroChip({ label, value }: HeroChipProps) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left shadow-sm shadow-slate-100/70'>
      <p className='text-xs font-medium tracking-[0.16em] text-slate-400 uppercase'>{label}</p>
      <p className='mt-1 text-sm font-semibold break-all text-slate-900'>{value}</p>
    </div>
  )
}

type SectionRowProps = {
  label: string
  value: string
  emphasize?: boolean
}

function SectionRow({ label, value, emphasize = false }: SectionRowProps) {
  return (
    <div className='grid grid-cols-1 gap-2 border-b border-slate-100 py-4 last:border-b-0 last:pb-0 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-start sm:gap-4'>
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
    <Card className='rounded-[28px] border-emerald-100 bg-white shadow-[0_24px_80px_rgba(16,185,129,0.08)]'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-2 text-[1.55rem] font-bold tracking-tight text-slate-950'>
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
  return [{ title: 'Thanh toán thành công' }]
}

export default function PaymentSuccessPage() {
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
          title='Không đọc được thông tin thanh toán'
          description='Mã thanh toán không hợp lệ. Hãy quay lại lịch học của bạn để kiểm tra giao dịch.'
          retryLabel='Về lịch học của tôi'
          onRetry={() => window.location.assign(path.user.bookings)}
        />
      </section>
    )
  }

  if (paymentDetailQuery.isError) {
    return (
      <section className='py-10'>
        <ScreenErrorState
          title='Không tải được chi tiết giao dịch'
          description='Thanh toán có thể đã hoàn tất, nhưng thông tin chi tiết chưa hiển thị được lúc này.'
          retryLabel='Thử lại'
          onRetry={() => void paymentDetailQuery.refetch()}
        />
      </section>
    )
  }

  if (!paymentIdParam) {
    return (
      <section className='py-10'>
        <EmptyState
          className='border-sky-200 bg-sky-50/60'
          title='Chưa có thông tin giao dịch'
          description='Chi tiết thanh toán sẽ xuất hiện tại đây sau khi bạn hoàn tất giao dịch.'
          action={
            <Button
              className='rounded-full'
              onClick={() => window.location.assign(path.user.bookings)}
              variant='outline'
            >
              <ExternalLink aria-hidden='true' size={16} />
              Về lịch học của tôi
            </Button>
          }
        />
      </section>
    )
  }

  const shouldShowLoading = paymentId !== null && (!hasHydrated || paymentDetailQuery.isLoading)

  if (shouldShowLoading) {
    return (
      <section className='relative overflow-hidden py-16 sm:py-24'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_32%)]' />
        <div className='mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6'>
          <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-blue-200 bg-blue-50 text-blue-500 shadow-[0_18px_48px_rgba(59,130,246,0.12)]'>
            <Spinner size='lg' />
          </div>
          <h1 className='mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl'>
            Đang xác nhận giao dịch
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-slate-600'>
            Hệ thống đang tải thông tin thanh toán và lịch học của bạn.
          </p>
          <div className='mt-6 rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm'>
            <Spinner label='Vui lòng chờ trong giây lát...' />
          </div>
        </div>
      </section>
    )
  }

  const paymentCode = getPaymentCode(
    paymentId,
    paymentDetailQuery.data?.providerReferenceId ?? null
  )

  return (
    <section className='relative overflow-hidden py-10 sm:py-14'>
      <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_32%)]' />
      <div className='mx-auto flex max-w-6xl flex-col gap-10'>
        <div className='mx-auto flex max-w-3xl flex-col items-center px-4 pt-8 text-center sm:px-6 sm:pt-12'>
          <div className='flex h-24 w-24 items-center justify-center rounded-full border-4 border-emerald-300 bg-emerald-50 text-emerald-500 shadow-[0_18px_48px_rgba(34,197,94,0.18)]'>
            <Check aria-hidden='true' size={48} strokeWidth={3} />
          </div>
          <h1 className='mt-8 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl'>
            Thanh toán thành công!
          </h1>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-slate-600'>
            Cảm ơn bạn đã hoàn tất thanh toán. Buổi học của bạn đã được ghi nhận và thông tin chi
            tiết được tổng hợp ngay bên dưới.
          </p>

          <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
            <Link className={buttonVariants({ size: 'lg' })} to={path.user.bookings}>
              Xem lịch học của tôi
            </Link>
            <Link className={buttonVariants({ size: 'lg', variant: 'outline' })} to={path.discover}>
              Tìm thêm buổi học
            </Link>
          </div>

          <div className='mt-8 grid w-full gap-3 sm:grid-cols-2'>
            <HeroChip label='Mã giao dịch' value={paymentCode} />
            <HeroChip label='Mã phiên thanh toán' value={sessionId ?? 'Đang cập nhật'} />
          </div>
        </div>

        {paymentDetailQuery.data ? (
          <div className='grid gap-6 px-4 sm:px-6 lg:grid-cols-2'>
            <DetailPanel
              icon={Receipt}
              title='Chi tiết giao dịch'
              footer={
                <button
                  className='inline-flex items-center gap-2 transition hover:text-blue-700'
                  type='button'
                >
                  <Download aria-hidden='true' size={16} />
                  Tải xuống biên lai
                </button>
              }
            >
              <SectionRow label='Mã giao dịch' value={paymentCode} />
              <SectionRow label='Mã thanh toán' value={String(paymentDetailQuery.data.id)} />
              <SectionRow label='Mã phiên thanh toán' value={sessionId ?? 'Đang cập nhật'} />
              <SectionRow
                label='Tổng số tiền'
                value={formatPrice(paymentDetailQuery.data.amount)}
                emphasize
              />
              <SectionRow
                label='Thời gian giao dịch'
                value={formatDateTime(
                  paymentDetailQuery.data.paidAt ?? paymentDetailQuery.data.createdAt
                )}
              />
              <div className='border-b border-slate-100 py-4 last:border-b-0 last:pb-0'>
                <p className='text-sm text-slate-500'>Trạng thái thanh toán</p>
                <Badge className='mt-3 rounded-full px-3 py-1.5 text-sm' variant='success'>
                  <CheckCircle2 aria-hidden='true' size={14} />
                  Đã thanh toán
                </Badge>
              </div>
            </DetailPanel>

            <DetailPanel
              icon={Clock3}
              title='Thông tin buổi học'
              footer={
                <button
                  className='inline-flex items-center gap-2 transition hover:text-blue-700'
                  type='button'
                >
                  <HelpCircle aria-hidden='true' size={16} />
                  Cần hỗ trợ?
                </button>
              }
            >
              {relatedBooking ? (
                <>
                  <div className='flex items-center gap-4 border-b border-slate-100 pb-4'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-amber-100 text-base font-bold text-amber-700'>
                      {getInitials(relatedBooking.mentorName)}
                    </div>
                    <div className='min-w-0'>
                      <p className='text-sm text-slate-500'>Mentor</p>
                      <p className='truncate text-lg font-bold text-slate-950'>
                        {relatedBooking.mentorName}
                      </p>
                    </div>
                  </div>
                  <SectionRow
                    label='Môn học'
                    value={`${relatedBooking.subjectName} · ${relatedBooking.gradeName}`}
                    emphasize
                  />
                  <SectionRow label='Thời gian' value={formatBookingMoment(relatedBooking)} />
                  <SectionRow label='Hình thức' value={getMeetingLabel(relatedBooking)} />
                  <SectionRow
                    label='Tổng tiền booking'
                    value={formatPrice(relatedBooking.totalAmount)}
                    emphasize
                  />
                </>
              ) : (
                <EmptyState
                  className='min-h-[420px] border-slate-200 bg-white/80'
                  title='Thông tin buổi học đang cập nhật'
                  description='Bạn có thể xem lịch học của mình để kiểm tra đầy đủ thông tin booking.'
                  action={
                    <Link
                      className={cn(buttonVariants({ variant: 'outline' }), 'rounded-full')}
                      to={path.user.bookings}
                    >
                      Xem lịch học
                    </Link>
                  }
                />
              )}
            </DetailPanel>
          </div>
        ) : null}

        {!paymentDetailQuery.isLoading && !paymentDetailQuery.data ? (
          <div className='px-4 sm:px-6'>
            <EmptyState
              className='border-slate-200 bg-white/80'
              title='Đang cập nhật giao dịch'
              description='Thông tin chi tiết sẽ hiển thị ngay khi hệ thống hoàn tất đồng bộ.'
              actionHref={path.user.bookings}
              actionLabel='Xem lịch học của tôi'
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
