import { useState } from 'react'
import { AlertTriangle, Search } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ReasonModal } from '@/components/ui/reason-modal'
import { useAdminBookingsQuery } from '@/hooks/queries/admin/useAdminBookingsQuery'
import { useForceCancelBookingMutation } from '@/hooks/queries/admin/useForceCancelBookingMutation'
import { formatDateTime, formatPrice } from '@/utils/format'
import type { BookingStatus } from '@/types/models/booking'

type BookingStatusFilter = 'ALL' | BookingStatus

const bookingStatusFilters: Array<{ key: BookingStatusFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ thanh toán' },
  { key: 'CONFIRMED', label: 'Đã xác nhận' },
  { key: 'COMPLETED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
  { key: 'REJECTED', label: 'Bị từ chối' },
  { key: 'NO_SHOW', label: 'Không tham gia' }
]

const FORCE_CANCELLABLE_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED']

export function meta() {
  return [{ title: 'Booking | Admin' }]
}

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<BookingStatusFilter>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [forceCancelId, setForceCancelId] = useState<number | null>(null)

  const { data: bookingsData, isLoading } = useAdminBookingsQuery({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    mentorName: searchQuery || undefined,
    page: 1,
    size: 50
  })
  const bookings = bookingsData?.data ?? []

  const { mutate: forceCancelBooking, isPending: isForceCancelling } =
    useForceCancelBookingMutation()

  const handleForceCancelConfirm = (reason: string) => {
    if (!forceCancelId) return
    forceCancelBooking(
      { id: forceCancelId, data: { cancelReason: reason } },
      {
        onSuccess: () => setForceCancelId(null),
        onError: () => setForceCancelId(null)
      }
    )
  }

  return (
    <DashboardPage
      description='Theo dõi toàn bộ booking trong hệ thống và xử lý tranh chấp bằng cách hủy khẩn cấp (tự động hoàn tiền qua Stripe nếu booking đã thanh toán).'
      title='Quản lý Booking'
    >
      <WorkspacePanel
        title='Danh sách Booking'
        description='Lọc theo trạng thái hoặc tìm theo tên mentor để rà soát các booking cần can thiệp.'
        action={
          <StatusFilterPills
            onValueChange={(val) => setStatusFilter(val as BookingStatusFilter)}
            options={bookingStatusFilters}
            value={statusFilter}
          />
        }
      >
        <div className='flex w-full flex-wrap items-center gap-3'>
          <div className='relative min-w-[260px] flex-1'>
            <Search
              aria-hidden='true'
              className='text-muted absolute top-1/2 left-3 -translate-y-1/2'
              size={16}
            />
            <Input
              className='pl-10'
              id='admin-booking-search'
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder='Tìm theo tên mentor...'
              type='search'
              value={searchQuery}
            />
          </div>
        </div>

        {!isLoading && bookings.length === 0 ? (
          <EmptyState
            description='Hãy thử đổi từ khóa hoặc quay lại trạng thái khác để xem thêm booking.'
            title='Không tìm thấy booking phù hợp'
          />
        ) : (
          <div className='grid gap-4'>
            {bookings.map((booking) => (
              <Card className='rounded-2xl shadow-none' key={booking.id}>
                <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-start'>
                  <div className='min-w-0 flex-1 space-y-4'>
                    <div className='flex flex-wrap items-start justify-between gap-3'>
                      <div>
                        <h2 className='text-ink text-lg font-semibold'>
                          {booking.studentName} → {booking.mentorName}
                        </h2>
                        <p className='text-muted mt-1 text-sm'>
                          {booking.subjectName} · {booking.gradeName}
                        </p>
                      </div>
                      <StatusBadge kind='booking' status={booking.status} />
                    </div>

                    <div className='text-muted grid gap-2 text-sm md:grid-cols-3'>
                      <p>
                        {booking.bookingDate} · {booking.startTime.slice(0, 5)}-
                        {booking.endTime.slice(0, 5)}
                      </p>
                      <p>{formatPrice(booking.totalAmount)}</p>
                      <p>Đặt lúc: {booking.createdAt ? formatDateTime(booking.createdAt) : 'N/A'}</p>
                    </div>

                    {booking.cancelReason && (
                      <p className='text-muted flex items-start gap-1.5 text-sm'>
                        <AlertTriangle
                          aria-hidden='true'
                          className='mt-0.5 shrink-0 text-amber-500'
                          size={14}
                        />
                        Lý do hủy: {booking.cancelReason}
                      </p>
                    )}
                  </div>

                  <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                    {FORCE_CANCELLABLE_STATUSES.includes(booking.status) && (
                      <Button variant='destructive' onClick={() => setForceCancelId(booking.id)}>
                        Hủy khẩn cấp
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </WorkspacePanel>

      <ReasonModal
        open={!!forceCancelId}
        onOpenChange={(open) => !open && setForceCancelId(null)}
        title='Hủy khẩn cấp booking'
        description='Booking sẽ chuyển sang trạng thái Đã hủy. Nếu booking đã được học viên thanh toán, hệ thống sẽ tự động hoàn tiền qua Stripe.'
        placeholder='Ví dụ: Mentor không xác nhận đúng hạn, học viên khiếu nại...'
        confirmLabel='Xác nhận hủy khẩn cấp'
        onConfirm={handleForceCancelConfirm}
        isConfirming={isForceCancelling}
      />
    </DashboardPage>
  )
}
