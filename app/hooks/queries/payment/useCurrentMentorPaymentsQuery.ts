import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import { useAuthStore } from '@/stores/auth-store'
import type { GetMentorPaymentsQueryParams, PaymentListPageApiResponse } from '@/types/api/payment'

const defaultParams: GetMentorPaymentsQueryParams = {
  page: 1,
  size: 100
}

async function fetchCurrentMentorPayments(
  params: GetMentorPaymentsQueryParams
): Promise<PaymentListPageApiResponse> {
  return (await paymentApi.getMentorPayments(params)).data
}

export function getCurrentMentorPaymentsQueryOptions(params?: GetMentorPaymentsQueryParams) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }

  return queryOptions({
    queryKey: QUERY_KEYS.payment.mentorMe({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      sortBy: resolvedParams.sortBy ?? null,
      sortDir: resolvedParams.sortDir ?? null
    }),
    queryFn: () => fetchCurrentMentorPayments(resolvedParams)
  })
}

export function useCurrentMentorPaymentsQuery(params?: GetMentorPaymentsQueryParams) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    ...getCurrentMentorPaymentsQueryOptions(params),
    enabled: hasHydrated && Boolean(accessToken),
    refetchOnWindowFocus: true
  })
}
