import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type DeleteCurrentMentorSubjectResult = {
  mentorSubjectId: number
  message: string
}

export function useDeleteCurrentMentorSubjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (mentorSubjectId: number): Promise<DeleteCurrentMentorSubjectResult> => {
      const response = await mentorApi.deleteCurrentMentorSubject(mentorSubjectId)

      return {
        mentorSubjectId,
        message: response.message || 'Đã xóa môn dạy.'
      }
    },
    onSuccess: ({ mentorSubjectId }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                subjects: currentData.subjects.filter((subject) => subject.id !== mentorSubjectId)
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
