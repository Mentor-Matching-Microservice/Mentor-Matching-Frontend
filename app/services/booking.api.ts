import { env } from '@/config/env'
import http from '@/libs/http'
import { mockBookingApi } from '@/services/mock/booking.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  BookingListPageApiResponse,
  CreateBookingApiResponse,
  CreateBookingRequest,
  ForceCancelBookingRequest,
  GetBookingsQueryParams,
  GetMentorBookingsQueryParams,
  GetMyBookingsQueryParams
} from '@/types/api/booking'

const BOOKING_ENDPOINTS = {
  bookings: 'bookings',
  myBookings: 'bookings/me',
  myMentorBookings: 'bookings/mentor/me',
  completeBooking: (bookingId: number) => `bookings/${bookingId}/complete`,
  forceCancelBooking: (bookingId: number) => `bookings/${bookingId}/force-cancel`
} as const

const defaultBookingApi = {
  createBooking: async (
    payload: CreateBookingRequest
  ): Promise<ApiResponse<CreateBookingApiResponse>> =>
    (await http.post<ApiResponse<CreateBookingApiResponse>>(BOOKING_ENDPOINTS.bookings, payload))
      .data,

  getBookings: async (
    params?: GetBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> =>
    (
      await http.get<ApiResponse<BookingListPageApiResponse>>(BOOKING_ENDPOINTS.bookings, {
        params
      })
    ).data,

  getMyBookings: async (
    params?: GetMyBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> =>
    (
      await http.get<ApiResponse<BookingListPageApiResponse>>(BOOKING_ENDPOINTS.myBookings, {
        params
      })
    ).data,

  getMentorBookings: async (
    params?: GetMentorBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> =>
    (
      await http.get<ApiResponse<BookingListPageApiResponse>>(BOOKING_ENDPOINTS.myMentorBookings, {
        params
      })
    ).data,

  completeBookingByMentor: async (bookingId: number): Promise<ApiResponse<null>> =>
    (await http.patch<ApiResponse<null>>(BOOKING_ENDPOINTS.completeBooking(bookingId))).data,

  forceCancelBooking: async (
    bookingId: number,
    payload: ForceCancelBookingRequest
  ): Promise<ApiResponse<null>> =>
    (
      await http.patch<ApiResponse<null>>(BOOKING_ENDPOINTS.forceCancelBooking(bookingId), payload)
    ).data
}

export const bookingApi = env.useMock ? mockBookingApi : defaultBookingApi
