import type { MeetingType } from '@/types/models/mentor'

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'NO_SHOW'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED'

export interface BookingSnapshot {
  learnerName: string
  mentorName: string
  subjectName: string
  gradeName: string
  pricePerHour: number
}

export interface Booking {
  id: string
  snapshot: BookingSnapshot
  bookingDate: string
  startTime: string
  endTime: string
  meetingType: MeetingType
  bookingStatus: BookingStatus
  paymentStatus?: PaymentStatus
  totalAmount: number
  note?: string
  meetingLink?: string
  meetingAddress?: string
}
