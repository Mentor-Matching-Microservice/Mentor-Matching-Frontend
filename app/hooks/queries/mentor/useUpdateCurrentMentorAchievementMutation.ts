import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  MentorAchievementDetailApiResponse,
  SaveCurrentMentorAchievementRequest
} from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type UpdateCurrentMentorAchievementVariables = {
  achievementId: number
  payload: SaveCurrentMentorAchievementRequest
}

type UpdateCurrentMentorAchievementResult = {
  achievement: MentorAchievementDetailApiResponse
  message: string
}

export function useUpdateCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      achievementId,
      payload
    }: UpdateCurrentMentorAchievementVariables): Promise<UpdateCurrentMentorAchievementResult> => {
      const response = await mentorApi.updateCurrentMentorAchievement(achievementId, payload)

      return {
        achievement: response.data,
        message: response.message || 'Đã cập nhật thành tựu.'
      }
    },
    onSuccess: ({ achievement }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                achievements: currentData.achievements.map((item) =>
                  item.id === achievement.id ? achievement : item
                )
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
