import type { UserRoleApiResponse, UserTypeApiResponse } from '@/types/api/user'

export type AuthUserApiResponse = {
  id: number
  fullName: string
  email: string
  role: UserRoleApiResponse
}

export type AuthApiResponse = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
  user: AuthUserApiResponse
}

export type RegisterApiRequest = {
  fullName: string
  email: string
  phone: string
  userType: UserTypeApiResponse
  password: string
  confirmPassword: string
}
