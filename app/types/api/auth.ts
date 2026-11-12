import type { UserRoleApiResponse } from '@/types/api/user'

export type AuthUserApiResponse = {
  id: number | string
  fullName: string
  email: string
  role: UserRoleApiResponse
}

export type AuthApiResponse = {
  accessToken: string
  accessTokenExpiresIn: number
  refreshTokenExpiresIn: number
  user?: AuthUserApiResponse
}

export type RegisterApiResponse = {
  accountId: string
  status: string
}

export type RegisterApiRequest = {
  email: string
  password: string
  confirmPassword: string
}
