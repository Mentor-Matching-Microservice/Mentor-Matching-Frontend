import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  MentorSubjectDetailApiResponse,
  UpsertCurrentMentorSubjectRequest
} from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type UpsertCurrentMentorSubjectResult = {
  subject: MentorSubjectDetailApiResponse
  message: string
}

export function useUpsertCurrentMentorSubjectMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpsertCurrentMentorSubjectRequest
    ): Promise<UpsertCurrentMentorSubjectResult> => {
      const response = await mentorApi.upsertCurrentMentorSubject(payload)

      return {
        subject: response.data,
        message: response.message || 'Đã lưu môn dạy.'
      }
    },
    onSuccess: ({ subject }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                subjects: upsertSubject(currentData.subjects, subject)
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

function upsertSubject(
  subjects: MentorSubjectDetailApiResponse[],
  nextSubject: MentorSubjectDetailApiResponse
) {
  const subjectExists = subjects.some((subject) => subject.id === nextSubject.id)

  return subjectExists
    ? subjects.map((subject) => (subject.id === nextSubject.id ? nextSubject : subject))
    : [...subjects, nextSubject]
}
