import type { BookingStatus } from '@/types/models/booking'

export type BookingStatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted'

export type BookingStatusConfig = {
  label: string
  tone: BookingStatusTone
  description: string
}

export const BOOKING_STATUS_CONFIG = {
  PENDING: {
    label: 'Chờ thanh toán',
    tone: 'warning',
    description: 'Booking đã được tạo và đang chờ học viên hoàn tất thanh toán.'
  },
  CONFIRMED: {
    label: 'Đã thanh toán',
    tone: 'success',
    description: 'Booking đã được thanh toán và giữ chỗ cho buổi học.'
  },
  COMPLETED: {
    label: 'Đã hoàn thành',
    tone: 'success',
    description: 'Buổi học đã diễn ra xong.'
  },
  CANCELLED: {
    label: 'Đã hủy',
    tone: 'muted',
    description: 'Booking đã bị hủy.'
  },
  REJECTED: {
    label: 'Bị từ chối',
    tone: 'danger',
    description: 'Booking bị từ chối. Flow này sẽ được hoàn thiện sau.'
  },
  NO_SHOW: {
    label: 'Không tham gia',
    tone: 'danger',
    description: 'Buổi học được ghi nhận là không tham gia.'
  }
} satisfies Record<BookingStatus, BookingStatusConfig>

export const LEARNER_BOOKING_STATUS_FILTERS = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW'
] as const satisfies readonly BookingStatus[]
