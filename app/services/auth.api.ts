import { env } from '@/config/env'
import http from '@/libs/http'
import { mockAuthApi } from '@/services/mock/auth.mock.api'
import type { AuthApiResponse, RegisterApiResponse } from '@/types/api/auth'
import type { ApiResponse } from '@/types/api/common'
import type { LoginRequest, RegisterRequest } from '@/types/form/auth'

const AUTH_ENDPOINTS = {
  login: 'auth/login',
  register: 'auth/register',
  refreshToken: 'auth/refresh-token',
  logout: 'auth/logout',
  forgotPassword: 'auth/forgot-password',
  resetPassword: 'auth/reset-password'
} as const

const defaultAuthApi = {
  login: async (payload: LoginRequest): Promise<ApiResponse<AuthApiResponse>> =>
    (await http.post<ApiResponse<AuthApiResponse>>(AUTH_ENDPOINTS.login, payload)).data,

  register: async (payload: RegisterRequest): Promise<ApiResponse<RegisterApiResponse>> =>
    (await http.post<ApiResponse<RegisterApiResponse>>(AUTH_ENDPOINTS.register, payload)).data,

  refreshToken: async (): Promise<ApiResponse<AuthApiResponse>> =>
    (await http.post<ApiResponse<AuthApiResponse>>(AUTH_ENDPOINTS.refreshToken, {})).data,

  logout: async (): Promise<ApiResponse<null>> =>
    (await http.post<ApiResponse<null>>(AUTH_ENDPOINTS.logout, {})).data,

  forgotPassword: async (payload: { email: string }): Promise<ApiResponse<null>> =>
    (await http.post<ApiResponse<null>>(AUTH_ENDPOINTS.forgotPassword, payload)).data,

  resetPassword: async (payload: {
    token: string
    password: string
    confirmPassword: string
  }): Promise<ApiResponse<null>> =>
    (await http.post<ApiResponse<null>>(AUTH_ENDPOINTS.resetPassword, payload)).data
}

export const authApi = env.useMock ? mockAuthApi : defaultAuthApi
