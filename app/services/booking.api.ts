import { env } from '@/config/env'
import http from '@/libs/http'
import { mockBookingApi } from '@/services/mock/booking.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  BookingApiResponse,
  BookingListPageApiResponse,
  CreateBookingApiResponse,
  CreateBookingRequest,
  ForceCancelBookingRequest,
  GetBookingsQueryParams,
  GetMentorBookingsQueryParams,
  GetMyBookingsQueryParams,
  RejectBookingRequest
} from '@/types/api/booking'

type RawBookingDto = Partial<BookingApiResponse> & {
  id?: number
  bookingId?: number
}

type RawSpringPageOrList<T> =
  | T[]
  | {
      data?: T[]
      content?: T[]
      page?: number
      number?: number
      pageSize?: number
      size?: number
      totalPages?: number
      totalItems?: number
      totalElements?: number
    }

const BOOKING_ENDPOINTS = {
  bookings: 'bookings',
  bookingDetail: (bookingId: number) => `bookings/${bookingId}`,
  myBookings: 'bookings/me',
  myMentorBookings: 'bookings/mentor/me',
  rejectBooking: (bookingId: number) => `bookings/${bookingId}/reject`,
  completeBooking: (bookingId: number) => `bookings/${bookingId}/complete`,
  forceCancelBooking: (bookingId: number) => `bookings/${bookingId}/force-cancel`
} as const

function normalizeBookingItem(raw: RawBookingDto): BookingApiResponse {
  const resolvedId = Number(raw.id ?? raw.bookingId ?? 0)

  return {
    id: resolvedId,
    bookingId: Number(raw.bookingId ?? resolvedId),
    studentUserId: raw.studentUserId ?? '',
    studentName: raw.studentName ?? '',
    mentorId: Number(raw.mentorId ?? 0),
    mentorName: raw.mentorName ?? '',
    mentorSubjectId: Number(raw.mentorSubjectId ?? 0),
    subjectName: raw.subjectName ?? '',
    gradeName: raw.gradeName ?? '',
    bookingDate: raw.bookingDate ?? '',
    startTime: raw.startTime ?? '',
    endTime: raw.endTime ?? '',
    pricePerHour: Number(raw.pricePerHour ?? 0),
    totalAmount: Number(raw.totalAmount ?? 0),
    meetingType: raw.meetingType ?? 'ONLINE',
    meetingLink: raw.meetingLink ?? null,
    meetingAddress: raw.meetingAddress ?? null,
    status: raw.status ?? 'PENDING',
    holdExpiresAt: raw.holdExpiresAt ?? null,
    note: raw.note ?? null,
    cancelledBy: raw.cancelledBy ?? null,
    cancelReason: raw.cancelReason ?? null,
    createdAt: raw.createdAt ?? null,
    updatedAt: raw.updatedAt ?? raw.createdAt ?? null
  }
}

function isWithinDateRange(value: string, from?: string, to?: string) {
  if (from && value < from) return false
  if (to && value > to) return false
  return true
}

function paginateBookings(
  items: BookingApiResponse[],
  page = 1,
  size = 10
): BookingListPageApiResponse {
  const safePage = Math.max(1, page)
  const safeSize = Math.max(1, size)
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / safeSize))
  const startIndex = (safePage - 1) * safeSize

  return {
    page: safePage,
    pageSize: safeSize,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + safeSize)
  }
}

function normalizeBookingPage(
  rawPayload: RawSpringPageOrList<RawBookingDto> | null | undefined,
  fallbackPage = 1,
  fallbackSize = 10,
  clientFilter?: (item: BookingApiResponse) => boolean
): BookingListPageApiResponse {
  if (Array.isArray(rawPayload)) {
    const normalizedItems = rawPayload.map(normalizeBookingItem)
    const filteredItems = clientFilter ? normalizedItems.filter(clientFilter) : normalizedItems
    return paginateBookings(filteredItems, fallbackPage, fallbackSize)
  }

  const rawItems = rawPayload?.data ?? rawPayload?.content ?? []
  const normalizedItems = rawItems.map(normalizeBookingItem)
  const page =
    typeof rawPayload?.page === 'number'
      ? rawPayload.page
      : typeof rawPayload?.number === 'number'
        ? rawPayload.number + 1
        : fallbackPage
  const pageSize = rawPayload?.pageSize ?? rawPayload?.size ?? fallbackSize
  const totalItems =
    rawPayload?.totalItems ?? rawPayload?.totalElements ?? normalizedItems.length
  const totalPages =
    rawPayload?.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)))

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    data: clientFilter ? normalizedItems.filter(clientFilter) : normalizedItems
  }
}

const defaultBookingApi = {
  createBooking: async (
    payload: CreateBookingRequest
  ): Promise<ApiResponse<CreateBookingApiResponse>> => {
    const response = (
      await http.post<ApiResponse<CreateBookingApiResponse & RawBookingDto>>(
        BOOKING_ENDPOINTS.bookings,
        payload
      )
    ).data
    const rawData = response.data
    const bookingId = Number(rawData?.bookingId ?? rawData?.id ?? 0)

    return {
      ...response,
      data: {
        ...rawData,
        bookingId,
        id: bookingId
      }
    }
  },

  getBookingDetail: async (bookingId: number): Promise<ApiResponse<BookingApiResponse>> => {
    const response = (
      await http.get<ApiResponse<RawBookingDto>>(BOOKING_ENDPOINTS.bookingDetail(bookingId))
    ).data

    return {
      ...response,
      data: normalizeBookingItem(response.data ?? { bookingId })
    }
  },

  getBookings: async (
    params?: GetBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 10
    const response = (
      await http.get<ApiResponse<RawSpringPageOrList<RawBookingDto>>>(BOOKING_ENDPOINTS.bookings, {
        params: {
          ...params,
          page: Math.max(requestedPage - 1, 0),
          size: requestedSize
        }
      })
    ).data

    return {
      ...response,
      data: normalizeBookingPage(response.data, requestedPage, requestedSize)
    }
  },

  getMyBookings: async (
    params?: GetMyBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 100
    const response = (
      await http.get<ApiResponse<RawSpringPageOrList<RawBookingDto>>>(BOOKING_ENDPOINTS.myBookings)
    ).data

    return {
      ...response,
      data: normalizeBookingPage(response.data, requestedPage, requestedSize, (booking) => {
        if (params?.status && booking.status !== params.status) return false
        if (params?.meetingType && booking.meetingType !== params.meetingType) return false
        return true
      })
    }
  },

  getMentorBookings: async (
    params?: GetMentorBookingsQueryParams
  ): Promise<ApiResponse<BookingListPageApiResponse>> => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 100
    const response = (
      await http.get<ApiResponse<RawSpringPageOrList<RawBookingDto>>>(
        BOOKING_ENDPOINTS.myMentorBookings
      )
    ).data

    return {
      ...response,
      data: normalizeBookingPage(response.data, requestedPage, requestedSize, (booking) => {
        if (params?.status && booking.status !== params.status) return false
        if (params?.meetingType && booking.meetingType !== params.meetingType) return false
        return isWithinDateRange(
          booking.bookingDate,
          params?.bookingDateFrom,
          params?.bookingDateTo
        )
      })
    }
  },

  rejectBookingByMentor: async (
    bookingId: number,
    payload: RejectBookingRequest
  ): Promise<ApiResponse<null>> =>
    (
      await http.patch<ApiResponse<null>>(BOOKING_ENDPOINTS.rejectBooking(bookingId), payload)
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
