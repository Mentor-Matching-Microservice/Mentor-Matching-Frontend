import { useQuery } from '@tanstack/react-query'

import { bookingApi } from '@/services/booking.api'
import type { GetBookingsQueryParams } from '@/types/api/booking'

export const adminBookingKeys = {
  all: ['admin-bookings'] as const,
  lists: () => [...adminBookingKeys.all, 'list'] as const,
  list: (params: GetBookingsQueryParams) => [...adminBookingKeys.lists(), params] as const
}

export function useAdminBookingsQuery(params: GetBookingsQueryParams) {
  return useQuery({
    queryKey: adminBookingKeys.list(params),
    queryFn: async () => {
      const response = await bookingApi.getBookings(params)
      return response.data
    }
  })
}
