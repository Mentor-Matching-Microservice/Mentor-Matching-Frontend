import { env } from '@/config/env'
import http from '@/libs/http'
import { mockUserApi } from '@/services/mock/user.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  AdminUserDetailApiResponse,
  AdminUserListPageApiResponse,
  CurrentUserApiResponse,
  GetAdminUsersQueryParams,
  LearnerProfileApiResponse,
  UpdateCurrentLearnerProfileRequest,
  UpdateCurrentUserRequest,
  UpdateUserStatusRequest
} from '@/types/api/user'

const USER_ENDPOINTS = {
  publicCheck: 'users/public-check',
  me: 'users/me',
  learnerProfile: 'users/me/learner-profile',
  authCheck: 'users/auth-check',
  adminCheck: 'users/admin-check',
  adminUsers: 'admin/users',
  adminUserDetail: (userId: number) => `admin/users/${userId}`,
  adminUserStatus: (userId: number) => `admin/users/${userId}/status`
} as const

const defaultUserApi = {
  publicCheck: async (): Promise<ApiResponse<string>> =>
    (await http.get<ApiResponse<string>>(USER_ENDPOINTS.publicCheck)).data,

  getCurrentUser: async (): Promise<ApiResponse<CurrentUserApiResponse>> =>
    (await http.get<ApiResponse<CurrentUserApiResponse>>(USER_ENDPOINTS.me)).data,

  updateCurrentUser: async (
    payload: UpdateCurrentUserRequest
  ): Promise<ApiResponse<CurrentUserApiResponse>> =>
    (await http.put<ApiResponse<CurrentUserApiResponse>>(USER_ENDPOINTS.me, payload)).data,

  getCurrentLearnerProfile: async (): Promise<ApiResponse<LearnerProfileApiResponse>> =>
    (await http.get<ApiResponse<LearnerProfileApiResponse>>(USER_ENDPOINTS.learnerProfile)).data,

  upsertCurrentLearnerProfile: async (
    payload: UpdateCurrentLearnerProfileRequest
  ): Promise<ApiResponse<LearnerProfileApiResponse>> =>
    (await http.put<ApiResponse<LearnerProfileApiResponse>>(USER_ENDPOINTS.learnerProfile, payload))
      .data,

  authCheck: async (): Promise<ApiResponse<string>> =>
    (await http.get<ApiResponse<string>>(USER_ENDPOINTS.authCheck)).data,

  adminCheck: async (): Promise<ApiResponse<string>> =>
    (await http.get<ApiResponse<string>>(USER_ENDPOINTS.adminCheck)).data,

  getAdminUsers: async (
    params?: GetAdminUsersQueryParams
  ): Promise<ApiResponse<AdminUserListPageApiResponse>> =>
    (
      await http.get<ApiResponse<AdminUserListPageApiResponse>>(USER_ENDPOINTS.adminUsers, {
        params
      })
    ).data,

  getAdminUserDetail: async (userId: number): Promise<ApiResponse<AdminUserDetailApiResponse>> =>
    (
      await http.get<ApiResponse<AdminUserDetailApiResponse>>(USER_ENDPOINTS.adminUserDetail(userId))
    ).data,

  updateUserStatus: async (
    userId: number,
    payload: UpdateUserStatusRequest
  ): Promise<ApiResponse<AdminUserDetailApiResponse>> =>
    (
      await http.patch<ApiResponse<AdminUserDetailApiResponse>>(
        USER_ENDPOINTS.adminUserStatus(userId),
        payload
      )
    ).data
}

export const userApi = env.useMock ? mockUserApi : defaultUserApi
