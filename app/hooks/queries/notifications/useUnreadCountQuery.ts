import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { notificationApi } from '@/services/notification.api'
import { useAuthStore } from '@/stores/auth-store'

export function useUnreadCountQuery() {
  const accessToken = useAuthStore((state) => state.accessToken)

  return useQuery({
    queryKey: QUERY_KEYS.notification.unreadCount,
    queryFn: async () => (await notificationApi.getUnreadCount()).data,
    enabled: Boolean(accessToken)
  })
}
