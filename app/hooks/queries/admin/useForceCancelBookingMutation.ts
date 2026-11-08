import { useMutation, useQueryClient } from '@tanstack/react-query'

import { bookingApi } from '@/services/booking.api'
import type { ForceCancelBookingRequest } from '@/types/api/booking'
import { adminBookingKeys } from './useAdminBookingsQuery'

export function useForceCancelBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ForceCancelBookingRequest }) => {
      await bookingApi.forceCancelBooking(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminBookingKeys.lists() })
    }
  })
}
