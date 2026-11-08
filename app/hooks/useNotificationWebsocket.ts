import { Client } from '@stomp/stompjs'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { env } from '@/config/env'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuthStore } from '@/stores/auth-store'

export function useNotificationWebsocket() {
  const queryClient = useQueryClient()
  const accessToken = useAuthStore((state) => state.accessToken)

  useEffect(() => {
    if (!accessToken) return

    // Chuyển http:// thành ws:// hoặc https:// thành wss://
    const wsUrl = env.apiOrigin.replace(/^http/, 'ws') + '/ws/notifications'

    const client = new Client({
      brokerURL: wsUrl,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => {
        console.log('STOMP DEBUG:', str)
      },
      onConnect: (frame) => {
        console.log('STOMP CONNECTED!', frame)
        // Đăng ký nhận thông báo từ kênh cá nhân
        client.subscribe('/user/queue/notifications', (message) => {
          console.log('STOMP MESSAGE RECEIVED:', message.body)
          // Khi có thông báo mới, invalidate toàn bộ cache liên quan đến notification
          // để React Query tự động fetch lại API ngay lập tức
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notification.base })
        })
      },
      onStompError: (frame) => {
        console.error('STOMP ERROR:', frame.headers['message'])
      },
      onWebSocketError: (evt) => {
        console.error('WS ERROR:', evt)
      }
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [accessToken, queryClient])
}
