import { useQuery } from '@tanstack/react-query'

import { userApi } from '@/services/user.api'
import type { GetAdminUsersQueryParams } from '@/types/api/user'

export const adminUserKeys = {
  all: ['admin-users'] as const,
  lists: () => [...adminUserKeys.all, 'list'] as const,
  list: (params: GetAdminUsersQueryParams) => [...adminUserKeys.lists(), params] as const
}

export function useAdminUsersQuery(params: GetAdminUsersQueryParams) {
  return useQuery({
    queryKey: adminUserKeys.list(params),
    queryFn: async () => {
      const response = await userApi.getAdminUsers(params)
      return response.data
    }
  })
}
