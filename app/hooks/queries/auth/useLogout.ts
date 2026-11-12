import { useQueryClient } from '@tanstack/react-query'

import { authApi } from '@/services/auth.api'
import { useAuthStore } from '@/stores/auth-store'

export function useLogout() {
  const queryClient = useQueryClient()
  const clearAccessToken = useAuthStore((state) => state.logout)

  return async () => {
    try {
      await authApi.logout()
    } finally {
      clearAccessToken()
      queryClient.clear()
    }
  }
}
