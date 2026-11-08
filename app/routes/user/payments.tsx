import { ArrowRight, ReceiptText, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router'

import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { path } from '@/config/path'
import { useCurrentUserPaymentsQuery } from '@/hooks/queries/payment/useCurrentUserPaymentsQuery'
import type { GetMyPaymentsQueryParams, PaymentListItemApiResponse } from '@/types/api/payment'
import type { PaymentStatus } from '@/types/models/booking'
import { formatDateTime, formatPrice } from '@/utils/format'

type PaymentFilter = 'ALL' | PaymentStatus

const paymentFilters: Array<{ key: PaymentFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ thanh toán' },
  { key: 'PAID', label: 'Đã thanh toán' },
  { key: 'FAILED', label: 'Thanh toán lỗi' },
  { key: 'CANCELLED', label: 'Đã hủy' },
  { key: 'REFUNDED', label: 'Đã hoàn tiền' }
]

function PaymentListSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='h-12 animate-pulse rounded-2xl bg-slate-100' />
      <div className='h-[420px] animate-pulse rounded-[28px] bg-slate-100' />
    </div>
  )
}

function matchesPaymentSearch(payment: PaymentListItemApiResponse, query: string) {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return true

  return (
    String(payment.id).includes(normalizedQuery) ||
    String(payment.bookingId).includes(normalizedQuery) ||
    payment.status.toLowerCase().includes(normalizedQuery)
  )
}

export function meta() {
  return [{ title: 'Thanh toán | Học viên' }]
}

export default function UserPaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const paymentQueryParams = useMemo<GetMyPaymentsQueryParams>(
    () => ({
      page: 1,
      size: 100,
      status: activeFilter === 'ALL' ? undefined : activeFilter,
      sortBy: 'createdAt',
      sortDir: 'desc'
    }),
    [activeFilter]
  )
  const paymentsQuery = useCurrentUserPaymentsQuery(paymentQueryParams)
  const payments = useMemo(() => paymentsQuery.data?.data ?? [], [paymentsQuery.data?.data])
  const filteredPayments = useMemo(
    () => payments.filter((payment) => matchesPaymentSearch(payment, searchQuery)),
    [payments, searchQuery]
  )

  if (paymentsQuery.isLoading && !paymentsQuery.data) {
    return (
      <DashboardPage
        title='Thanh toán'
        description='Theo dõi các khoản học phí và trạng thái thanh toán của bạn.'
      >
        <PaymentListSkeleton />
      </DashboardPage>
    )
  }

  if (paymentsQuery.isError) {
    return (
      <DashboardPage title='Thanh toán'>
        <ScreenErrorState
          description='Không thể tải danh sách thanh toán lúc này. Vui lòng thử lại sau ít phút.'
          onRetry={() => void paymentsQuery.refetch()}
          retryLabel='Tải lại'
          title='Chưa tải được thanh toán'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      title='Thanh toán'
      description='Theo dõi các khoản học phí và trạng thái thanh toán của bạn.'
    >
      <Card className='rounded-[28px] border-slate-200 shadow-sm'>
        <CardContent className='space-y-5 p-5'>
          <div className='grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center'>
            <div className='relative'>
              <Search
                aria-hidden='true'
                className='text-muted absolute top-1/2 left-4 -translate-y-1/2'
                size={18}
              />
              <Input
                className='h-12 rounded-2xl bg-white pl-11'
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Tìm theo mã thanh toán hoặc mã booking...'
                type='search'
                value={searchQuery}
              />
            </div>

            <StatusFilterPills
              onValueChange={setActiveFilter}
              options={paymentFilters}
              value={activeFilter}
            />
          </div>

          {filteredPayments.length === 0 ? (
            <div className='grid gap-5 rounded-[24px] border border-slate-200 bg-slate-50 p-6 md:grid-cols-[minmax(0,1fr)_220px] md:items-center'>
              <div className='flex items-start gap-4'>
                <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl'>
                  <ReceiptText aria-hidden='true' size={22} />
                </div>
                <div className='space-y-2'>
                  <p className='text-ink text-xl font-semibold'>Chưa có khoản thanh toán nào</p>
                  <p className='text-muted text-sm leading-relaxed'>
                    Khi bạn tạo thanh toán cho một booking, khoản học phí sẽ xuất hiện tại đây.
                  </p>
                </div>
              </div>
              <Link
                className={buttonVariants({
                  className: 'h-11 rounded-xl md:justify-self-end',
                  size: 'lg'
                })}
                to={path.user.bookings}
              >
                Xem lịch học
                <ArrowRight aria-hidden='true' size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className='hidden overflow-hidden rounded-[22px] border border-slate-200 md:block'>
                <Table>
                  <TableHeader className='bg-slate-50'>
                    <TableRow>
                      <TableHead>Mã thanh toán</TableHead>
                      <TableHead>Mã booking</TableHead>
                      <TableHead>Số tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead>Ngày thanh toán</TableHead>
                      <TableHead className='text-right'>Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className='text-ink font-semibold'>#{payment.id}</TableCell>
                        <TableCell>#{payment.bookingId}</TableCell>
                        <TableCell className='text-ink font-semibold'>
                          {formatPrice(payment.amount)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge kind='payment' status={payment.status} />
                        </TableCell>
                        <TableCell className='text-slate-700'>
                          {formatDateTime(payment.createdAt)}
                        </TableCell>
                        <TableCell className='text-slate-700'>
                          {formatDateTime(payment.paidAt)}
                        </TableCell>
                        <TableCell className='text-right'>
                          <Link
                            className={buttonVariants({
                              className: 'rounded-xl',
                              size: 'sm',
                              variant: 'outline'
                            })}
                            to={path.user.bookings}
                          >
                            Xem lịch học
                            <ArrowRight aria-hidden='true' size={14} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className='space-y-3 md:hidden'>
                {filteredPayments.map((payment) => (
                  <Card className='rounded-[22px] border-slate-200 shadow-none' key={payment.id}>
                    <CardContent className='space-y-4 p-4'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='space-y-1'>
                          <p className='text-ink font-semibold'>Thanh toán #{payment.id}</p>
                          <p className='text-muted text-sm'>Booking #{payment.bookingId}</p>
                        </div>
                        <StatusBadge kind='payment' status={payment.status} />
                      </div>
                      <div className='grid gap-3 rounded-2xl bg-slate-50 p-3 text-sm'>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='text-muted'>Số tiền</span>
                          <span className='text-ink font-semibold'>
                            {formatPrice(payment.amount)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='text-muted'>Ngày tạo</span>
                          <span className='text-right text-slate-800'>
                            {formatDateTime(payment.createdAt)}
                          </span>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                          <span className='text-muted'>Ngày thanh toán</span>
                          <span className='text-right text-slate-800'>
                            {formatDateTime(payment.paidAt)}
                          </span>
                        </div>
                      </div>
                      <Link
                        className={buttonVariants({
                          className: 'w-full rounded-xl',
                          size: 'lg',
                          variant: 'outline'
                        })}
                        to={path.user.bookings}
                      >
                        Xem lịch học
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </DashboardPage>
  )
}
