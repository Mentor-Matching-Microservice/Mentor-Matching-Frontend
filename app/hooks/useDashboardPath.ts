import { getDashboardPath } from '@/utils/get-dashboard-path'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useAuthStore } from '@/stores/auth-store'

export function useDashboardPath(): string | null {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { data: user, isLoading } = useCurrentUserQuery()

  if (!accessToken) return null
  if (isLoading || !user) return null

  return getDashboardPath(user.roles)
}
