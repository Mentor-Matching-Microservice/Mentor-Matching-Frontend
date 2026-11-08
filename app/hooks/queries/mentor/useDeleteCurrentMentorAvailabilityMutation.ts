import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'

type DeleteCurrentMentorAvailabilityResult = {
  availabilityId: number
  message: string
}

export function useDeleteCurrentMentorAvailabilityMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (availabilityId: number): Promise<DeleteCurrentMentorAvailabilityResult> => {
      const response = await mentorApi.deleteCurrentMentorAvailability(availabilityId)

      return {
        availabilityId,
        message: response.message || 'Đã xóa khung giờ.'
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
