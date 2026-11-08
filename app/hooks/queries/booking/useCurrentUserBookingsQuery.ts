import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
import { useAuthStore } from '@/stores/auth-store'
import type { BookingListPageApiResponse, GetMyBookingsQueryParams } from '@/types/api/booking'

const defaultParams: GetMyBookingsQueryParams = {
  page: 1,
  size: 100
}

async function fetchCurrentUserBookings(
  params: GetMyBookingsQueryParams
): Promise<BookingListPageApiResponse> {
  return (await bookingApi.getMyBookings(params)).data
}

export function getCurrentUserBookingsQueryOptions(params?: GetMyBookingsQueryParams) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }

  return queryOptions({
    queryKey: QUERY_KEYS.booking.my({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      meetingType: resolvedParams.meetingType ?? null
    }),
    queryFn: () => fetchCurrentUserBookings(resolvedParams)
  })
}

export function useCurrentUserBookingsQuery(params?: GetMyBookingsQueryParams) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)

  return useQuery({
    ...getCurrentUserBookingsQueryOptions(params),
    enabled: hasHydrated && Boolean(accessToken),
    refetchOnWindowFocus: true
  })
}
