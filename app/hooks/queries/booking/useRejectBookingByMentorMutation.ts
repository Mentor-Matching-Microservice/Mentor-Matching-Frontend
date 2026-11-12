import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
import type { RejectBookingRequest } from '@/types/api/booking'

type RejectBookingVariables = {
  bookingId: number
  payload: RejectBookingRequest
}

export function useRejectBookingByMentorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ bookingId, payload }: RejectBookingVariables) =>
      bookingApi.rejectBookingByMentor(bookingId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking.mentorMeBase })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking.me, exact: false })
    }
  })
}
