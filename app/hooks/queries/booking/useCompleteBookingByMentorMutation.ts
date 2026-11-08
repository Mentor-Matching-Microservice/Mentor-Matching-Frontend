import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'

export function useCompleteBookingByMentorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: number) => bookingApi.completeBookingByMentor(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.booking.mentorMeBase })
    }
  })
}
