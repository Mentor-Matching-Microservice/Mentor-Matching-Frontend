import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
import { useAuthStore } from '@/stores/auth-store'
import type { BookingApiResponse, GetMentorBookingsQueryParams } from '@/types/api/booking'

const defaultParams: GetMentorBookingsQueryParams = {
  page: 1,
  size: 100
}

async function fetchCurrentMentorBookings(
  params: GetMentorBookingsQueryParams
): Promise<BookingApiResponse[]> {
  return (await bookingApi.getMentorBookings(params)).data.data
}

export function getCurrentMentorBookingsQueryOptions(params?: GetMentorBookingsQueryParams) {
  const resolvedParams = {
    ...defaultParams,
    ...params
  }

  return queryOptions({
    queryKey: QUERY_KEYS.booking.mentorMe({
      page: resolvedParams.page ?? 1,
      size: resolvedParams.size ?? 100,
      status: resolvedParams.status ?? null,
      meetingType: resolvedParams.meetingType ?? null,
      bookingDateFrom: resolvedParams.bookingDateFrom ?? null,
      bookingDateTo: resolvedParams.bookingDateTo ?? null
    }),
    queryFn: () => fetchCurrentMentorBookings(resolvedParams)
  })
}

export function useCurrentMentorBookingsQuery(
  params?: GetMentorBookingsQueryParams,
  enabled = true
) {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    ...getCurrentMentorBookingsQueryOptions(params),
    enabled: Boolean(accessToken && enabled)
  })
}
