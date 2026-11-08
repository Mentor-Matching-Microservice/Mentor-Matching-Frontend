import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { CurrentMentorOnboardingStatusApiResponse } from '@/types/api/mentor'

type SubmitCurrentMentorApplicationResult = {
  onboardingStatus: CurrentMentorOnboardingStatusApiResponse
  message: string
}

export function useSubmitCurrentMentorApplicationMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (): Promise<SubmitCurrentMentorApplicationResult> => {
      const response = await mentorApi.submitCurrentMentorApplication()

      return {
        onboardingStatus: response.data,
        message: response.message || 'Đã gửi hồ sơ mentor để xét duyệt.'
      }
    },
    onSuccess: ({ onboardingStatus }) => {
      queryClient.setQueryData(QUERY_KEYS.mentor.currentOnboardingStatus, onboardingStatus)

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    }
  })
}
