import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type {
  CurrentMentorTraitsApiResponse,
  UpdateCurrentMentorTraitsRequest
} from '@/types/api/mentor'

import type { CurrentMentorProfileApiBundle } from './useCurrentMentorProfileQuery'

type UpdateCurrentMentorTraitsResult = {
  traits: CurrentMentorTraitsApiResponse
  message: string
}

export function useUpdateCurrentMentorTraitsMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      payload: UpdateCurrentMentorTraitsRequest
    ): Promise<UpdateCurrentMentorTraitsResult> => {
      const response = await mentorApi.updateCurrentMentorTraits(payload)

      return {
        traits: response.data,
        message: response.message || 'Nổi bật và đặc điểm đã được cập nhật thành công.'
      }
    },
    onSuccess: ({ traits }) => {
      queryClient.setQueryData<CurrentMentorProfileApiBundle | undefined>(
        QUERY_KEYS.mentor.currentProfile,
        (currentData) =>
          currentData
            ? {
                ...currentData,
                traits
              }
            : currentData
      )

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    },
    onError: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentProfile,
        exact: true
      })
    }
  })
}
