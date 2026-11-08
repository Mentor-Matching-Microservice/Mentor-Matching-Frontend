import { BellOff, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

import { NotificationItem } from '@/components/Notification/NotificationItem'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { useDeleteNotificationMutation } from '@/hooks/queries/notifications/useDeleteNotificationMutation'
import { useMarkAllAsReadMutation } from '@/hooks/queries/notifications/useMarkAllAsReadMutation'
import { useMarkAsReadMutation } from '@/hooks/queries/notifications/useMarkAsReadMutation'
import { useNotificationsQuery } from '@/hooks/queries/notifications/useNotificationsQuery'
import { NotificationStatus } from '@/types/models/notification'

export default function NotificationsPage() {
  const [page, setPage] = useState(1)
  const size = 10

  const { data: notificationsData, isLoading } = useNotificationsQuery({ page, size })
  const notifications = notificationsData?.data || []
  const totalPages = notificationsData?.totalPages || 0

  const markAsReadMutation = useMarkAsReadMutation()
  const markAllAsReadMutation = useMarkAllAsReadMutation()
  const deleteMutation = useDeleteNotificationMutation()

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate()
  }

  const hasUnread = notifications.some((n) => n.status === NotificationStatus.UNREAD)

  return (
    <div className='mx-auto max-w-3xl py-8'>
      <div className='mb-6 flex items-center justify-between'>
        <h1 className='text-2xl font-bold text-slate-800'>Thông báo của bạn</h1>
        <Button
          variant='outline'
          size='sm'
          onClick={handleMarkAllAsRead}
          disabled={!hasUnread || markAllAsReadMutation.isPending}
          className='flex items-center gap-2'
        >
          <CheckCircle2 size={16} />
          Đánh dấu tất cả đã đọc
        </Button>
      </div>

      <div className='rounded-xl border border-slate-200 bg-white shadow-sm'>
        {isLoading ? (
          <div className='flex items-center justify-center py-20'>
            <Spinner size='lg' />
          </div>
        ) : notifications.length > 0 ? (
          <div className='flex flex-col divide-y divide-slate-100'>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-20 text-slate-500'>
            <BellOff size={48} className='mb-4 text-slate-300' />
            <p className='text-lg font-medium'>Không có thông báo nào</p>
            <p className='text-sm'>Khi có thông báo mới, chúng sẽ xuất hiện ở đây.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className='mt-6 flex items-center justify-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trang trước
          </Button>
          <span className='text-sm font-medium text-slate-600'>
            {page} / {totalPages}
          </span>
          <Button
            variant='outline'
            size='sm'
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Trang sau
          </Button>
        </div>
      )}
    </div>
  )
}
