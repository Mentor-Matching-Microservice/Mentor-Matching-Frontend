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
  PaymentListPageApiResponse
} from '@/types/api/payment'

const PAYMENT_ENDPOINTS = {
  payments: 'payments',
  myPayments: 'payments/me',
  mentorPayments: 'payments/mentor/me'
} as const

const defaultPaymentApi = {
  createPayment: async (payload: CreatePaymentRequest): Promise<ApiResponse<PaymentApiResponse>> =>
    (await http.post<ApiResponse<PaymentApiResponse>>(PAYMENT_ENDPOINTS.payments, payload)).data,

  getMyPayments: async (
    params?: GetMyPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> =>
    (
      await http.get<ApiResponse<PaymentListPageApiResponse>>(PAYMENT_ENDPOINTS.myPayments, {
        params
      })
    ).data,

  getMentorPayments: async (
    params?: GetMentorPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> =>
    (
      await http.get<ApiResponse<PaymentListPageApiResponse>>(PAYMENT_ENDPOINTS.mentorPayments, {
        params
      })
    ).data,

  getPaymentDetail: async (paymentId: number): Promise<ApiResponse<PaymentDetailApiResponse>> =>
    (
      await http.get<ApiResponse<PaymentDetailApiResponse>>(
        `${PAYMENT_ENDPOINTS.payments}/${paymentId}`
      )
    ).data
}

export const paymentApi = env.useMock ? mockPaymentApi : defaultPaymentApi
