import { useMutation, useQueryClient } from '@tanstack/react-query'

import { userApi } from '@/services/user.api'
import type { UpdateUserStatusRequest } from '@/types/api/user'
import { adminUserKeys } from './useAdminUsersQuery'

export function useUpdateUserStatusMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateUserStatusRequest }) => {
      await userApi.updateUserStatus(id, data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminUserKeys.lists() })
    }
  })
}
