import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  MentorAchievementDetailApiResponse,
  SaveCurrentMentorAchievementRequest
} from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type CreateCurrentMentorAchievementResult = {
  achievement: MentorAchievementDetailApiResponse
  message: string
}

export function useCreateCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: SaveCurrentMentorAchievementRequest
    ): Promise<CreateCurrentMentorAchievementResult> => {
      const response = await mentorApi.createCurrentMentorAchievement(payload)

      return {
        achievement: response.data,
        message: response.message || 'Đã tạo thành tựu mới.'
      }
    },
    onSuccess: ({ achievement }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                achievements: [...currentData.achievements, achievement]
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
