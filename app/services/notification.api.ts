import { env } from '@/config/env'
import http from '@/libs/http'
import type { ApiResponse, PaginationParams } from '@/types/api/common'
import type { GetNotificationsApiResponse } from '@/types/api/notification'

import { NotificationStatus, type Notification } from '@/types/models/notification'

const NOTIFICATION_ENDPOINTS = {
  base: 'notifications',
  unreadCount: 'notifications/unread-count',
  markAllAsRead: 'notifications/mark-all-read'
} as const

const defaultNotificationApi = {
  getNotifications: async (
    params?: PaginationParams
  ): Promise<ApiResponse<GetNotificationsApiResponse>> => {
    const response = await http.get<ApiResponse<any>>(NOTIFICATION_ENDPOINTS.base, { params })
    const apiResponse = response.data
    const pageResponse = apiResponse.data
    
    // Map backend Response DTO to frontend Notification Model
    const mappedPageResponse = {
      ...pageResponse,
      data: (pageResponse.data || []).map((item: any) => ({
        id: item.id.toString(),
        userId: item.userId.toString(),
        title: item.title,
        content: item.message,
        type: item.type,
        status: item.isRead ? NotificationStatus.READ : NotificationStatus.UNREAD,
        createdDate: item.createdAt,
        lastModifiedDate: item.createdAt
      }))
    }
    
    return {
      ...apiResponse,
      data: mappedPageResponse
    }
  },

  getUnreadCount: async (): Promise<ApiResponse<number>> =>
    (await http.get<ApiResponse<number>>(NOTIFICATION_ENDPOINTS.unreadCount)).data,

  markAsRead: async (id: string): Promise<ApiResponse<void>> =>
    (await http.patch<ApiResponse<void>>(`${NOTIFICATION_ENDPOINTS.base}/${id}/read`)).data,

  markAllAsRead: async (): Promise<ApiResponse<void>> =>
    (await http.post<ApiResponse<void>>(NOTIFICATION_ENDPOINTS.markAllAsRead)).data,

  deleteNotification: async (id: string): Promise<ApiResponse<void>> =>
    (await http.delete<ApiResponse<void>>(`${NOTIFICATION_ENDPOINTS.base}/${id}`)).data
}

// Remove mock for now to test real backend
export const notificationApi = defaultNotificationApi
