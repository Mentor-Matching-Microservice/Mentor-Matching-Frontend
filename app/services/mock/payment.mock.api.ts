import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
import { mockBookingApi } from '@/services/mock/booking.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  CreatePaymentRequest,
  GetMentorPaymentsQueryParams,
  GetMyPaymentsQueryParams,
  PaymentApiResponse,
  PaymentDetailApiResponse,
  PaymentListItemApiResponse,
  PaymentListPageApiResponse
} from '@/types/api/payment'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildCreatedResponse<T>(data: T, message = 'Created'): ApiResponse<T> {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function requireMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)

  if (!email || !mockUsers[email]) {
    throw new Error('Phiên đăng nhập mock không hợp lệ')
  }

  return {
    email,
    user: mockUsers[email]
  }
}

function paginate(
  items: PaymentListItemApiResponse[],
  page = 1,
  size = 10
): PaymentListPageApiResponse {
  const pageSize = size
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (page - 1) * pageSize

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + pageSize)
  }
}

export const mockPaymentApi = {
  async createPayment(payload: CreatePaymentRequest): Promise<ApiResponse<PaymentApiResponse>> {
    await delay()

    const { user } = requireMockSession()
    const paymentId = Date.now()

    return buildCreatedResponse(
      {
        id: paymentId,
        bookingId: payload.bookingId,
        payerUserId: Number(user.id),
        amount: 300000,
        paymentMethod: 'GATEWAY',
        paymentProvider: 'STRIPE',
        status: 'PENDING',
        checkoutUrl: `https://checkout.stripe.example/pay/${paymentId}`,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      },
      'Create payment successfully'
    )
  },

  async getMyPayments(
    params?: GetMyPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> {
    await delay()

    const bookingsResponse = await mockBookingApi.getMyBookings({ page: 1, size: 100 })
    const payments = bookingsResponse.data.data.map<PaymentListItemApiResponse>((booking) => {
      const status = booking.status === 'PENDING' ? 'PENDING' : 'PAID'

      return {
        id: booking.id,
        bookingId: booking.id,
        amount: booking.totalAmount,
        status,
        paidAt: status === 'PAID' ? booking.updatedAt : null,
        createdAt: booking.createdAt
      }
    })
    const filtered = params?.status
      ? payments.filter((payment) => payment.status === params.status)
      : payments

    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get my payments successfully'
    )
  },

  async getMentorPayments(
    params?: GetMentorPaymentsQueryParams
  ): Promise<ApiResponse<PaymentListPageApiResponse>> {
    await delay()

    const { email } = requireMockSession()
    const mentorId = email === 'mentor@test.com' ? 101 : 102
    const bookingsResponse = await mockBookingApi.getMentorBookings({ page: 1, size: 100 })
    const payments = bookingsResponse.data.data
      .filter((booking) => booking.mentorId === mentorId)
      .map<PaymentListItemApiResponse>((booking) => {
        const status = booking.status === 'PENDING' ? 'PENDING' : 'PAID'

        return {
          id: booking.id,
          bookingId: booking.id,
          amount: booking.totalAmount,
          status,
          paidAt: status === 'PAID' ? booking.updatedAt : null,
          createdAt: booking.createdAt
        }
      })
    const filtered = params?.status
      ? payments.filter((payment) => payment.status === params.status)
      : payments

    return buildSuccessResponse(
      paginate(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get mentor payments successfully'
    )
  },

  async getPaymentDetail(paymentId: number): Promise<ApiResponse<PaymentDetailApiResponse>> {
    await delay()

    const { user } = requireMockSession()
    const bookingsResponse = await mockBookingApi.getMyBookings({ page: 1, size: 100 })
    const matchedBooking =
      bookingsResponse.data.data.find((booking) => booking.id === paymentId) ??
      bookingsResponse.data.data.find((booking) => booking.status === 'PENDING') ??
      bookingsResponse.data.data[0]

    const bookingId = matchedBooking?.id ?? paymentId
    const amount = matchedBooking?.totalAmount ?? 300000
    const status = matchedBooking?.status === 'PENDING' ? 'PAID' : 'PAID'

    return buildSuccessResponse(
      {
        id: paymentId,
        bookingId,
        amount,
        status,
        bookingStatus: matchedBooking?.status ?? 'CONFIRMED',
        providerReferenceId: `cs_test_mock_${paymentId}`,
        providerTransactionId: `pi_mock_${paymentId}`,
        paidAt: new Date().toISOString(),
        expiresAt: null,
        failureReason: null,
        createdAt: matchedBooking?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      `Get payment detail successfully for user ${user.id}`
    )
  }
}
