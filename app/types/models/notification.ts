export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ'
}

export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BOOKING_CREATED = 'BOOKING_CREATED',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_REJECTED = 'BOOKING_REJECTED',
  BOOKING_COMPLETED = 'BOOKING_COMPLETED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  REVIEW_CREATED = 'REVIEW_CREATED'
}

export interface Notification {
  id: string
  userId: string
  title: string
  content: string
  type: NotificationType
  status: NotificationStatus
  referenceId?: string
  createdDate: string
  lastModifiedDate: string
}
