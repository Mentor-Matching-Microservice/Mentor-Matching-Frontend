import type { PageQueryParams, PageResponse } from '@/types/api/common'
import type { BookingStatus } from '@/types/models/booking'

export type BookingMeetingTypeApiResponse = 'ONLINE' | 'OFFLINE'

export type CreateBookingRequest = {
  mentorId: number
  mentorSubjectId: number
  bookingDate: string
  startTime: string
  endTime: string
  meetingType: BookingMeetingTypeApiResponse
  note?: string | null
}

export type CreateBookingApiResponse = {
  bookingId: number
}

export type BookingApiResponse = {
  id: number
  studentUserId: number
  studentName: string
  mentorId: number
  mentorName: string
  mentorSubjectId: number
  subjectName: string
  gradeName: string
  bookingDate: string
  startTime: string
  endTime: string
  pricePerHour: number
  totalAmount: number
  meetingType: BookingMeetingTypeApiResponse
  meetingLink: string | null
  meetingAddress: string | null
  status: BookingStatus
  note: string | null
  cancelledBy: number | null
  cancelReason: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type ForceCancelBookingRequest = {
  cancelReason: string
}

export type GetBookingsQueryParams = PageQueryParams<
  string,
  {
    status?: BookingStatus
    meetingType?: BookingMeetingTypeApiResponse
    mentorName?: string
    studentName?: string
    bookingDateFrom?: string
    bookingDateTo?: string
  }
>

export type GetMyBookingsQueryParams = PageQueryParams<
  string,
  {
    status?: BookingStatus
    meetingType?: BookingMeetingTypeApiResponse
  }
>

export type GetMentorBookingsQueryParams = PageQueryParams<
  string,
  {
    status?: BookingStatus
    meetingType?: BookingMeetingTypeApiResponse
    bookingDateFrom?: string
    bookingDateTo?: string
  }
>

export type BookingListPageApiResponse = PageResponse<BookingApiResponse>
