import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { SaveCurrentMentorAvailabilityRequest } from '@/types/api/mentor'

type UpsertCurrentMentorAvailabilityVariables = {
  availabilityId?: number | null
  payload: SaveCurrentMentorAvailabilityRequest
}

type UpsertCurrentMentorAvailabilityResult = {
  availabilityId: number | null
  message: string
}

export function useUpsertCurrentMentorAvailabilityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      availabilityId,
      payload
    }: UpsertCurrentMentorAvailabilityVariables): Promise<UpsertCurrentMentorAvailabilityResult> => {
      if (availabilityId) {
        const response = await mentorApi.updateCurrentMentorAvailability(availabilityId, payload)

        return {
          availabilityId,
          message: response.message || 'Đã cập nhật khung giờ.'
        }
      }

      const response = await mentorApi.createCurrentMentorAvailability(payload)

      return {
        availabilityId: response.data.availabilityId,
        message: response.message || 'Đã thêm khung giờ.'
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentSchedule,
        exact: true
      })
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.mentor.currentOnboardingStatus,
        exact: true
      })
    }
  })
}
