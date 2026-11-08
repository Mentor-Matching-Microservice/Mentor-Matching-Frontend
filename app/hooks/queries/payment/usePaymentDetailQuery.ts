import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
import type { PaymentDetailApiResponse } from '@/types/api/payment'

const MINIMUM_PAYMENT_DETAIL_DELAY_MS = 1000

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPaymentDetail(paymentId: number): Promise<PaymentDetailApiResponse> {
  const [response] = await Promise.all([
    paymentApi.getPaymentDetail(paymentId),
    delay(MINIMUM_PAYMENT_DETAIL_DELAY_MS)
  ])

  return response.data
}

export function getPaymentDetailQueryOptions(paymentId: number) {
  return queryOptions({
    queryKey: QUERY_KEYS.payment.detail(paymentId),
    queryFn: () => fetchPaymentDetail(paymentId)
  })
}

export function usePaymentDetailQuery(paymentId: number | null) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    queryKey: QUERY_KEYS.payment.detail(paymentId ?? 0),
    queryFn: () => fetchPaymentDetail(paymentId ?? 0),
    enabled:
      hasHydrated && Boolean(accessToken) && Number.isInteger(paymentId) && Number(paymentId) > 0
  })
}
