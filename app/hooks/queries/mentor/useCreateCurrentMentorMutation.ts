import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { CurrentMentorApiResponse, UpdateCurrentMentorRequest } from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type CreateCurrentMentorResult = {
  currentMentor: CurrentMentorApiResponse
  message: string
}

export function useCreateCurrentMentorMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UpdateCurrentMentorRequest): Promise<CreateCurrentMentorResult> => {
      const response = await mentorApi.createCurrentMentor(payload)

      return {
        currentMentor: response.data,
        message: response.message || 'Hồ sơ mentor đã được tạo thành công.'
      }
    },
    onSuccess: ({ currentMentor }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                currentMentor
              }
            : currentData
      )

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
