import { useMutation, useQueryClient } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mapCurrentUserApiResponse } from '@/hooks/queries/auth/useCurrentUserQuery'
import { userApi } from '@/services/user.api'
import type {
  LearnerProfileApiResponse,
  UpdateCurrentLearnerProfileRequest,
  UpdateCurrentUserRequest
} from '@/types/api/user'
import type { CurrentUser } from '@/types/models/user'

type UpdateCurrentUserProfilePayload = {
  user: UpdateCurrentUserRequest
  learnerProfile: UpdateCurrentLearnerProfileRequest
}

type UpdateCurrentUserProfileResult = {
  currentUser: CurrentUser
  learnerProfile: LearnerProfileApiResponse
  message: string
}

export function useUpdateCurrentUserProfileMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      learnerProfile,
      user
    }: UpdateCurrentUserProfilePayload): Promise<UpdateCurrentUserProfileResult> => {
      const currentUserResponse = await userApi.updateCurrentUser(user)
      const learnerProfileResponse = await userApi.upsertCurrentLearnerProfile(learnerProfile)

      return {
        currentUser: mapCurrentUserApiResponse(currentUserResponse.data),
        learnerProfile: learnerProfileResponse.data,
        message:
          learnerProfileResponse.message || currentUserResponse.message || 'Lưu hồ sơ thành công.'
      }
    },
    onSuccess: ({ currentUser, learnerProfile }) => {
      queryClient.setQueryData(QUERY_KEYS.auth.me, currentUser)
      queryClient.setQueryData(QUERY_KEYS.user.learnerProfile, learnerProfile)

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me, exact: true })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.learnerProfile, exact: true })
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.me, exact: true })
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user.learnerProfile, exact: true })
    }
  })
}
