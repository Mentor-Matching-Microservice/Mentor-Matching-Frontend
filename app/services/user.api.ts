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
import { isAxiosForbiddenError, isAxiosNotFoundError } from '@/utils/http-error'

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

function normalizeCurrentUserProfile(
  raw: Partial<CurrentUserApiResponse> | null | undefined
): CurrentUserApiResponse {
  return {
    id: raw?.id ?? raw?.userId ?? '',
    userId: raw?.userId ?? raw?.id ?? '',
    fullName: raw?.fullName ?? '',
    email: raw?.email,
    phone: raw?.phone ?? '',
    role: raw?.role,
    roles: raw?.roles,
    userType: raw?.userType ?? null,
    status: raw?.status
  }
}

function normalizeLearnerProfile(
  raw: Partial<LearnerProfileApiResponse> | null | undefined
): LearnerProfileApiResponse {
  return {
    id: raw?.id ?? null,
    userId: raw?.userId ?? '',
    gender: raw?.gender ?? null,
    birthYear: raw?.birthYear ?? null,
    schoolName: raw?.schoolName ?? null,
    gradeId: raw?.gradeId ?? null,
    learningGoal: raw?.learningGoal ?? null,
    createdAt: raw?.createdAt ?? null,
    updatedAt: raw?.updatedAt ?? null
  }
}

const defaultUserApi = {
  publicCheck: async (): Promise<ApiResponse<string>> =>
    (await http.get<ApiResponse<string>>(USER_ENDPOINTS.publicCheck)).data,

  getCurrentUser: async (): Promise<ApiResponse<CurrentUserApiResponse>> => {
    const response = (await http.get<ApiResponse<CurrentUserApiResponse>>(USER_ENDPOINTS.me)).data
    return {
      ...response,
      data: normalizeCurrentUserProfile(response.data)
    }
  },

  updateCurrentUser: async (
    payload: UpdateCurrentUserRequest
  ): Promise<ApiResponse<CurrentUserApiResponse>> => {
    const response = (
      await http.put<ApiResponse<CurrentUserApiResponse>>(USER_ENDPOINTS.me, {
        fullName: payload.fullName.trim(),
        phone: payload.phone.trim(),
        userType: payload.userType
      })
    ).data

    return {
      ...response,
      data: normalizeCurrentUserProfile(response.data)
    }
  },

  getCurrentLearnerProfile: async (): Promise<ApiResponse<LearnerProfileApiResponse>> => {
    try {
      const response = (
        await http.get<ApiResponse<LearnerProfileApiResponse>>(USER_ENDPOINTS.learnerProfile)
      ).data

      return {
        ...response,
        data: normalizeLearnerProfile(response.data)
      }
    } catch (error) {
      if (isAxiosNotFoundError(error) || isAxiosForbiddenError(error)) {
        return {
          status: 200,
          code: 'SUCCESS',
          success: true,
          message: 'Get learner profile fallback',
          data: normalizeLearnerProfile(null)
        }
      }

      throw error
    }
  },

  upsertCurrentLearnerProfile: async (
    payload: UpdateCurrentLearnerProfileRequest
  ): Promise<ApiResponse<LearnerProfileApiResponse>> => {
    const response = (
      await http.put<ApiResponse<LearnerProfileApiResponse>>(USER_ENDPOINTS.learnerProfile, {
        gender: payload.gender ?? null,
        birthYear: payload.birthYear ?? null,
        schoolName: payload.schoolName ?? null,
        gradeId: payload.gradeId ?? null,
        learningGoal: payload.learningGoal ?? null
      })
    ).data

    return {
      ...response,
      data: normalizeLearnerProfile(response.data)
    }
  },

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
