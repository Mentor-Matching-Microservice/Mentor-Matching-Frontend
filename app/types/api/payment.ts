import type { PageQueryParams, PageResponse } from '@/types/api/common'
import type { PaymentStatus } from '@/types/models/booking'

export type PaymentId = number | string

export type PaymentMethodApiResponse = 'CASH' | 'BANK_TRANSFER' | 'E_WALLET' | 'CARD' | 'GATEWAY'

export type PaymentProviderApiResponse = 'MOMO' | 'VNPAY' | 'STRIPE' | 'PAYPAL' | 'MANUAL_BANK'

export type CreatePaymentRequest = {
  bookingId: number | string
}

export type PaymentApiResponse = {
  id: PaymentId
  bookingId: number | string
  payerUserId: number | string
  mentorId?: number | string
  amount: number
  currency?: string
  paymentMethod: PaymentMethodApiResponse
  paymentProvider: PaymentProviderApiResponse
  status: PaymentStatus
  checkoutUrl: string | null
  expiresAt: string | null
}

export type PaymentListItemApiResponse = {
  id: PaymentId
  bookingId: number | string
  amount: number
  status: PaymentStatus
  paidAt: string | null
  createdAt: string | null
}

export type GetMyPaymentsQueryParams = PageQueryParams<
  string,
  {
    status?: PaymentStatus
  }
>

export type GetMentorPaymentsQueryParams = PageQueryParams<
  string,
  {
    status?: PaymentStatus
  }
>

export type PaymentListPageApiResponse = PageResponse<PaymentListItemApiResponse>

export type PaymentDetailApiResponse = {
  id: PaymentId
  bookingId: number | string
  amount: number
  status: PaymentStatus
  bookingStatus: import('@/types/models/booking').BookingStatus
  providerReferenceId: string | null
  providerTransactionId: string | null
  paidAt: string | null
  expiresAt: string | null
  failureReason: string | null
  createdAt: string | null
  updatedAt: string | null
}
