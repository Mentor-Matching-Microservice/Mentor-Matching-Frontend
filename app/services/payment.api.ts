import { env } from '@/config/env'
import http from '@/libs/http'
import { mockPaymentApi } from '@/services/mock/payment.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  CreatePaymentRequest,
  GetMentorPaymentsQueryParams,
  GetMyPaymentsQueryParams,
  PaymentApiResponse,
  PaymentDetailApiResponse,
  PaymentId,
  PaymentListItemApiResponse,
  PaymentListPageApiResponse
} from '@/types/api/payment'
import type { BookingStatus, PaymentStatus } from '@/types/models/booking'

type RawPaymentDto = Partial<
  PaymentApiResponse &
    PaymentDetailApiResponse & {
      payerId?: string | number
      currency?: string
    }
>

type RawSpringPaymentPage = {
  data?: RawPaymentDto[]
  content?: RawPaymentDto[]
  page?: number
  number?: number
  pageSize?: number
  size?: number
  totalPages?: number
  totalItems?: number
  totalElements?: number
}

const PAYMENT_ENDPOINTS = {
  payments: 'payments',
  myPayments: 'payments/me',
  mentorPayments: 'payments/mentor/me'
} as const

function buildIdempotencyKey(bookingId: number | string) {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `pay-${bookingId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function unwrapPayload<T>(payload: ApiResponse<T> | T): {
  data: T
  status: number
  code: string
  message: string
} {
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    ('status' in payload || 'success' in payload)
  ) {
    const wrapped = payload as ApiResponse<T>
    return {
      data: wrapped.data,
      status: wrapped.status ?? 200,
      code: wrapped.code ?? 'SUCCESS',
      message: wrapped.message ?? 'Success'
    }
  }

  return {
    data: payload as T,
    status: 200,
    code: 'SUCCESS',
    message: 'Success'
  }
}

function normalizePaymentItem(raw: RawPaymentDto): PaymentListItemApiResponse {
  const status = (raw.status ?? 'PENDING') as PaymentStatus

  return {
    id: raw.id ?? 0,
    bookingId: raw.bookingId ?? 0,
    amount: Number(raw.amount ?? 0),
    status,
    paidAt: raw.paidAt ?? (status === 'PAID' ? (raw.createdAt ?? null) : null),
    createdAt: raw.createdAt ?? null
  }
}

function normalizePaymentPage(
  rawPage: RawSpringPaymentPage | RawPaymentDto[] | null | undefined,
  fallbackPage = 1,
  fallbackSize = 20,
  statusFilter?: PaymentStatus
): PaymentListPageApiResponse {
  const rawItems = Array.isArray(rawPage)
    ? rawPage
    : (rawPage?.data ?? rawPage?.content ?? [])
  const normalizedItems = rawItems.map(normalizePaymentItem)
  const filteredItems = statusFilter
    ? normalizedItems.filter((item) => item.status === statusFilter)
    : normalizedItems

  if (Array.isArray(rawPage)) {
    return {
      page: fallbackPage,
      pageSize: fallbackSize,
      totalPages: Math.max(1, Math.ceil(filteredItems.length / Math.max(1, fallbackSize))),
      totalItems: filteredItems.length,
      data: filteredItems
    }
  }

  const page =
    typeof rawPage?.page === 'number'
      ? rawPage.page
      : typeof rawPage?.number === 'number'
        ? rawPage.number + 1
        : fallbackPage
  const pageSize = rawPage?.pageSize ?? rawPage?.size ?? fallbackSize
  const totalItems = statusFilter
    ? filteredItems.length
    : (rawPage?.totalItems ?? rawPage?.totalElements ?? filteredItems.length)
  const totalPages = statusFilter
    ? Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)))
    : (rawPage?.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize))))

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    data: filteredItems
  }
}

const defaultPaymentApi = {
  createPayment: async (payload: CreatePaymentRequest): Promise<ApiResponse<PaymentApiResponse>> => {
    const rawResponse = (
      await http.post<ApiResponse<RawPaymentDto> | RawPaymentDto>(
        PAYMENT_ENDPOINTS.payments,
        payload,
        {
          headers: {
            'Idempotency-Key': buildIdempotencyKey(payload.bookingId)
          }
        }
      )
    ).data
    const unwrapped = unwrapPayload(rawResponse)
    const raw = unwrapped.data ?? {}

    return {
      status: unwrapped.status || 201,
      code: unwrapped.code,
      success: true,
      message: unwrapped.message || 'Create payment successfully',
      data: {
        id: raw.id ?? 0,
        bookingId: raw.bookingId ?? payload.bookingId,
        payerUserId: raw.payerUserId ?? raw.payerId ?? 0,
        mentorId: raw.mentorId,
        amount: Number(raw.amount ?? 0),
        currency: raw.currency,
        paymentMethod: raw.paymentMethod ?? 'GATEWAY',
        paymentProvider: raw.paymentProvider ?? 'STRIPE',
        status: (raw.status ?? 'PENDING') as PaymentStatus,
        checkoutUrl: raw.checkoutUrl ?? null,
        expiresAt: raw.expiresAt ?? null
      }
    }
  },

  getMyPayments: async (
    params?: GetMyPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 20
    const rawResponse = (
      await http.get<ApiResponse<RawSpringPaymentPage> | RawSpringPaymentPage>(
        PAYMENT_ENDPOINTS.myPayments,
        {
          params: {
            page: Math.max(requestedPage - 1, 0),
            size: requestedSize
          }
        }
      )
    ).data
    const unwrapped = unwrapPayload(rawResponse)

    return {
      status: unwrapped.status,
      code: unwrapped.code,
      success: true,
      message: unwrapped.message,
      data: normalizePaymentPage(unwrapped.data, requestedPage, requestedSize, params?.status)
    }
  },

  getMentorPayments: async (
    params?: GetMentorPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 20
    const rawResponse = (
      await http.get<ApiResponse<RawSpringPaymentPage> | RawSpringPaymentPage>(
        PAYMENT_ENDPOINTS.mentorPayments,
        {
          params: {
            page: Math.max(requestedPage - 1, 0),
            size: requestedSize
          }
        }
      )
    ).data
    const unwrapped = unwrapPayload(rawResponse)

    return {
      status: unwrapped.status,
      code: unwrapped.code,
      success: true,
      message: unwrapped.message,
      data: normalizePaymentPage(unwrapped.data, requestedPage, requestedSize, params?.status)
    }
  },

  getPaymentDetail: async (
    paymentId: PaymentId
  ): Promise<ApiResponse<PaymentDetailApiResponse>> => {
    const rawResponse = (
      await http.get<ApiResponse<RawPaymentDto> | RawPaymentDto>(
        `${PAYMENT_ENDPOINTS.payments}/${paymentId}`
      )
    ).data
    const unwrapped = unwrapPayload(rawResponse)
    const raw = unwrapped.data ?? {}
    const status = (raw.status ?? 'PENDING') as PaymentStatus
    const inferredBookingStatus: BookingStatus =
      raw.bookingStatus ??
      (status === 'PAID' ? 'CONFIRMED' : status === 'CANCELLED' ? 'CANCELLED' : 'PENDING')

    return {
      status: unwrapped.status,
      code: unwrapped.code,
      success: true,
      message: unwrapped.message,
      data: {
        id: raw.id ?? paymentId,
        bookingId: raw.bookingId ?? 0,
        amount: Number(raw.amount ?? 0),
        status,
        bookingStatus: inferredBookingStatus,
        providerReferenceId: raw.providerReferenceId ?? null,
        providerTransactionId: raw.providerTransactionId ?? null,
        paidAt: raw.paidAt ?? (status === 'PAID' ? (raw.createdAt ?? null) : null),
        expiresAt: raw.expiresAt ?? null,
        failureReason: raw.failureReason ?? null,
        createdAt: raw.createdAt ?? null,
        updatedAt: raw.updatedAt ?? raw.createdAt ?? null
      }
    }
  }
}

export const paymentApi = env.useMock ? mockPaymentApi : defaultPaymentApi
