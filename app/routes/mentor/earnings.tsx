import { CircleDollarSign, ReceiptText, Search, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { WorkspaceMetricCard } from '@/components/WorkspaceMetricCard'
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
import { useCurrentMentorPaymentsQuery } from '@/hooks/queries/payment/useCurrentMentorPaymentsQuery'
import type { GetMentorPaymentsQueryParams, PaymentListItemApiResponse } from '@/types/api/payment'
import type { PaymentStatus } from '@/types/models/booking'
import { formatDateTime, formatPrice } from '@/utils/format'

type PaymentFilter = 'ALL' | PaymentStatus

const paymentFilters: Array<{ key: PaymentFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PAID', label: 'Đã thanh toán' },
  { key: 'PENDING', label: 'Chờ thanh toán' },
  { key: 'FAILED', label: 'Thanh toán lỗi' },
  { key: 'CANCELLED', label: 'Đã hủy' },
  { key: 'REFUNDED', label: 'Đã hoàn tiền' }
]

function PaymentListSkeleton() {
  return (
    <div className='space-y-5'>
      <div className='grid gap-4 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div className='h-32 animate-pulse rounded-3xl bg-slate-100' key={index} />
        ))}
      </div>
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
  return [{ title: 'Thu nhập | Mentor' }]
}

export default function MentorEarningsPage() {
  const [activeFilter, setActiveFilter] = useState<PaymentFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const paymentQueryParams = useMemo<GetMentorPaymentsQueryParams>(
    () => ({
      page: 1,
      size: 100,
      status: activeFilter === 'ALL' ? undefined : activeFilter,
      sortBy: 'createdAt',
      sortDir: 'desc'
    }),
    [activeFilter]
  )
  const paymentsQuery = useCurrentMentorPaymentsQuery(paymentQueryParams)
  const payments = useMemo(() => paymentsQuery.data?.data ?? [], [paymentsQuery.data?.data])
  const filteredPayments = useMemo(
    () => payments.filter((payment) => matchesPaymentSearch(payment, searchQuery)),
    [payments, searchQuery]
  )
  const paidPayments = payments.filter((payment) => payment.status === 'PAID')
  const pendingPayments = payments.filter((payment) => payment.status === 'PENDING')
  const totalPaidAmount = paidPayments.reduce((total, payment) => total + payment.amount, 0)
  const totalPendingAmount = pendingPayments.reduce((total, payment) => total + payment.amount, 0)

  if (paymentsQuery.isLoading && !paymentsQuery.data) {
    return (
      <DashboardPage
        description='Theo dõi các khoản thanh toán gắn với booking của học viên.'
        title='Thu nhập'
      >
        <PaymentListSkeleton />
      </DashboardPage>
    )
  }

  if (paymentsQuery.isError) {
    return (
      <DashboardPage title='Thu nhập'>
        <ScreenErrorState
          description='Không thể tải dữ liệu thu nhập lúc này. Vui lòng thử lại sau ít phút.'
          onRetry={() => void paymentsQuery.refetch()}
          retryLabel='Tải lại'
          title='Chưa tải được thu nhập'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      description='Theo dõi các khoản thanh toán gắn với booking của học viên.'
      title='Thu nhập'
    >
      <div className='space-y-6'>
        <div className='grid gap-4 lg:grid-cols-3'>
          <WorkspaceMetricCard
            className='rounded-[24px]'
            helper={`${paidPayments.length} khoản đã ghi nhận`}
            icon={Wallet}
            label='Đã thanh toán'
            tone='success'
            value={formatPrice(totalPaidAmount)}
          />
          <WorkspaceMetricCard
            className='rounded-[24px]'
            helper={`${pendingPayments.length} khoản đang chờ learner thanh toán`}
            icon={CircleDollarSign}
            label='Chờ thanh toán'
            tone={pendingPayments.length > 0 ? 'warning' : 'neutral'}
            value={formatPrice(totalPendingAmount)}
          />
          <WorkspaceMetricCard
            className='rounded-[24px]'
            helper='Tổng số payment liên quan đến mentor'
            icon={ReceiptText}
            label='Giao dịch'
            tone='info'
            value={payments.length}
          />
        </div>

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
              <div className='rounded-[24px] border border-slate-200 bg-slate-50 p-6'>
                <div className='flex items-start gap-4'>
                  <div className='bg-primary/10 text-primary flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl'>
                    <ReceiptText aria-hidden='true' size={22} />
                  </div>
                  <div className='space-y-2'>
                    <p className='text-ink text-xl font-semibold'>Chưa có giao dịch phù hợp</p>
                    <p className='text-muted text-sm leading-relaxed'>
                      Khi học viên tạo thanh toán cho booking của bạn, giao dịch sẽ xuất hiện tại
                      đây.
                    </p>
                  </div>
                </div>
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPage>
  )
}
