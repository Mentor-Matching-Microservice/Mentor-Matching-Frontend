import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { paymentApi } from '@/services/payment.api'
import type { CreatePaymentRequest, PaymentApiResponse } from '@/types/api/payment'

type CreatePaymentMutationResult = {
  payment: PaymentApiResponse
  message: string
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreatePaymentRequest): Promise<CreatePaymentMutationResult> => {
      const response = await paymentApi.createPayment(payload)

      return {
        payment: response.data,
        message: response.message || 'Đã tạo yêu cầu thanh toán thành công.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.booking.me,
        exact: false
      })
    }
  })
}
