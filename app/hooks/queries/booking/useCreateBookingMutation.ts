import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { bookingApi } from '@/services/booking.api'
import type { CreateBookingRequest } from '@/types/api/booking'

type CreateBookingMutationResult = {
  bookingId: number
  message: string
}

export function useCreateBookingMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateBookingRequest): Promise<CreateBookingMutationResult> => {
      const response = await bookingApi.createBooking(payload)

      return {
        bookingId: response.data.bookingId,
        message: response.message || 'Đã gửi yêu cầu đặt lịch thành công.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    }
  })
}
