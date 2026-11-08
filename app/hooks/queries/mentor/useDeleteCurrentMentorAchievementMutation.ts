import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type DeleteCurrentMentorAchievementResult = {
  achievementId: number
  message: string
}

export function useDeleteCurrentMentorAchievementMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (achievementId: number): Promise<DeleteCurrentMentorAchievementResult> => {
      const response = await mentorApi.deleteCurrentMentorAchievement(achievementId)

      return {
        achievementId,
        message: response.message || 'Đã xóa thành tựu.'
      }
    },
    onSuccess: ({ achievementId }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                achievements: currentData.achievements.filter((item) => item.id !== achievementId)
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
