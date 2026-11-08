import { CheckCircle2, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'

import { path } from '@/config/path'
import { NotificationStatus, NotificationType, type Notification } from '@/types/models/notification'
import { cn } from '@/utils/cn'

interface NotificationItemProps {
  notification: Notification
  onMarkAsRead?: (id: string) => void
  onDelete?: (id: string) => void
  onClick?: () => void
}

export function NotificationItem({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) {
  const navigate = useNavigate()
  const isUnread = notification.status === NotificationStatus.UNREAD

  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(notification.createdDate))

  const handleItemClick = () => {
    if (isUnread && onMarkAsRead) {
      onMarkAsRead(notification.id)
    }

    let targetUrl = ''
    switch (notification.type) {
      case NotificationType.REVIEW_CREATED:
        targetUrl = path.mentorProfile(notification.userId)
        break
      case NotificationType.BOOKING_CREATED:
        targetUrl = path.mentorPanel.schedule
        break
      case NotificationType.BOOKING_CONFIRMED:
      case NotificationType.BOOKING_REJECTED:
      case NotificationType.BOOKING_COMPLETED:
        targetUrl = path.user.bookings
        break
      default:
        break
    }

    if (targetUrl) {
      navigate(targetUrl)
      onClick?.()
    }
  }

  return (
    <div
      onClick={handleItemClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleItemClick()
        }
      }}
      className={cn(
        'relative flex gap-3 cursor-pointer rounded-lg border border-transparent p-4 transition-colors',
        isUnread ? 'bg-primary/5 hover:bg-primary/10' : 'bg-white hover:bg-slate-50'
      )}
    >
      <div className='mt-1 flex-shrink-0'>
        {isUnread ? (
          <div className='bg-primary h-2.5 w-2.5 rounded-full' />
        ) : (
          <div className='h-2.5 w-2.5 rounded-full bg-slate-300' />
        )}
      </div>

      <div className='flex-1 space-y-1'>
        <p className={cn('text-sm font-medium', isUnread ? 'text-primary' : 'text-slate-800')}>
          {notification.title}
        </p>
        <p className='text-sm text-slate-500 line-clamp-2'>{notification.content}</p>
        <p className='text-xs text-slate-400'>{formattedDate}</p>
      </div>

      <div className='flex flex-col gap-2'>
        {isUnread && onMarkAsRead && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            className='text-slate-400 transition-colors hover:text-green-600'
            title='Đánh dấu đã đọc'
          >
            <CheckCircle2 size={16} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(notification.id)
            }}
            className='text-slate-400 transition-colors hover:text-red-600'
            title='Xóa thông báo'
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
