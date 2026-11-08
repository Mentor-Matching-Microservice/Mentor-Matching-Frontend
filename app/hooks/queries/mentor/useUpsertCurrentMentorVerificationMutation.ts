import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  CurrentMentorVerificationApiResponse,
  UpsertCurrentMentorVerificationRequest
} from '@/types/api/mentor'

type UpsertCurrentMentorVerificationResult = {
  verification: CurrentMentorVerificationApiResponse
  message: string
}

export function useUpsertCurrentMentorVerificationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpsertCurrentMentorVerificationRequest
    ): Promise<UpsertCurrentMentorVerificationResult> => {
      const response = await mentorApi.upsertCurrentMentorVerification(payload)

      return {
        verification: response.data,
        message: response.message || 'Đã gửi yêu cầu xác thực.'
      }
    },
    onSuccess: ({ verification }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentVerification, verification)

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentVerification,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentVerification,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
