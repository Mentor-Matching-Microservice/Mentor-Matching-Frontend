import type { PaginatedResponse } from './common'
import type { Notification } from '../models/notification'

export type GetNotificationsApiResponse = PaginatedResponse<Notification>

export interface GetUnreadCountApiResponse {
  count: number
}
