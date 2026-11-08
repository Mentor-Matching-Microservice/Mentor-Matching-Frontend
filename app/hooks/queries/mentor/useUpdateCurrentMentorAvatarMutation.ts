import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { CurrentMentorApiResponse, UpdateCurrentMentorAvatarRequest } from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type UpdateCurrentMentorAvatarResult = {
  currentMentor: CurrentMentorApiResponse
  message: string
}

export function useUpdateCurrentMentorAvatarMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateCurrentMentorAvatarRequest
    ): Promise<UpdateCurrentMentorAvatarResult> => {
      const response = await mentorApi.updateCurrentMentorAvatar(payload)

      return {
        currentMentor: response.data,
        message: response.message || 'Ảnh đại diện mentor đã được cập nhật.'
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
    }
  })
}
