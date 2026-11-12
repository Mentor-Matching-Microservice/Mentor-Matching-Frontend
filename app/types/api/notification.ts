import type { PageResponse } from './common'
import type { Notification } from '../models/notification'

export type GetNotificationsApiResponse = PageResponse<Notification>

export interface GetUnreadCountApiResponse {
  count: number
}
