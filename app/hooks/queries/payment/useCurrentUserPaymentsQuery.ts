import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
import type { GetMyPaymentsQueryParams, PaymentListPageApiResponse } from '@/types/api/payment'

const defaultParams: GetMyPaymentsQueryParams = {
  page: 1,
  size: 100
}

async function fetchCurrentUserPayments(
  params: GetMyPaymentsQueryParams
): Promise<PaymentListPageApiResponse> {
  return (await paymentApi.getMyPayments(params)).data
}

export function getCurrentUserPaymentsQueryOptions(params?: GetMyPaymentsQueryParams) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }

  return queryOptions({
    queryKey: QUERY_KEYS.payment.my({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      sortBy: resolvedParams.sortBy ?? null,
      sortDir: resolvedParams.sortDir ?? null
    }),
    queryFn: () => fetchCurrentUserPayments(resolvedParams)
  })
}

export function useCurrentUserPaymentsQuery(params?: GetMyPaymentsQueryParams) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    ...getCurrentUserPaymentsQueryOptions(params),
    enabled: hasHydrated && Boolean(accessToken),
    refetchOnWindowFocus: true
  })
}
