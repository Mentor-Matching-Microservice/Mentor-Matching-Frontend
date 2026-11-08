import { ROLES } from '@/constants/roles'
import type { AuthApiResponse } from '@/types/api/auth'
import type { ApiResponse } from '@/types/api/common'
import type { LoginRequest, RegisterRequest } from '@/types/form/auth'
import type { CurrentUser } from '@/types/models/user'

export const MOCK_TOKEN_PREFIX = 'mock:'
const MOCK_PASSWORD = '123456'

export const mockUsers: Record<string, CurrentUser> = {
  'learner@test.com': {
    id: '1',
    email: 'learner@test.com',
    fullName: 'Học viên Test',
    phone: '0900000001',
    userType: 'STUDENT',
    status: 'ACTIVE',
    roles: [ROLES.LEARNER]
  },
  'mentor@test.com': {
    id: '2',
    email: 'mentor@test.com',
    fullName: 'Mentor Test',
    phone: '0900000002',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    roles: [ROLES.MENTOR]
  },
  'admin@test.com': {
    id: '3',
    email: 'admin@test.com',
    fullName: 'Admin Test',
    phone: '0900000003',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    roles: [ROLES.ADMIN]
  }
}

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export function getMockEmailFromToken(token: string | null): string | null {
  if (!token?.startsWith(MOCK_TOKEN_PREFIX)) return null
  return token.slice(MOCK_TOKEN_PREFIX.length)
}

export function isMockAccessToken(token: string | null): boolean {
  return Boolean(getMockEmailFromToken(token))
}

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function buildCreatedResponse<T>(data: T, message = 'Created'): ApiResponse<T> {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function buildAuthResponse(email: string, user: CurrentUser): AuthApiResponse {
  return {
    accessToken: `${MOCK_TOKEN_PREFIX}${email}`,
    accessTokenExpiresIn: 3600,
    refreshTokenExpiresIn: 604800,
    user: {
      id: Number(user.id),
      email: user.email,
      fullName: user.fullName,
      role: (user.roles[0] ?? ROLES.LEARNER) as AuthApiResponse['user']['role']
    }
  }
}

export const mockAuthApi = {
  async login(payload: LoginRequest): Promise<ApiResponse<AuthApiResponse>> {
    await delay()

    const email = payload.email.trim().toLowerCase()
    const user = mockUsers[email]

    if (!user || payload.password !== MOCK_PASSWORD) {
      throw new Error('Email hoặc mật khẩu không đúng. Dùng mật khẩu 123456 cho tài khoản test.')
    }

    return buildSuccessResponse(buildAuthResponse(email, user), 'Login successfully')
  },

  async register(payload: RegisterRequest): Promise<ApiResponse<AuthApiResponse>> {
    await delay()

    const email = payload.email.trim().toLowerCase()

    if (mockUsers[email]) {
      throw new Error('Email đã tồn tại trong mock data.')
    }

    if (payload.password !== payload.confirmPassword) {
      throw new Error('Mật khẩu xác nhận không khớp.')
    }

    const nextUserId = String(Object.keys(mockUsers).length + 1)

    mockUsers[email] = {
      id: nextUserId,
      email,
      fullName: payload.fullName,
      phone: '',
      userType: 'STUDENT',
      status: 'ACTIVE',
      roles: [ROLES.LEARNER]
    }

    return buildCreatedResponse(buildAuthResponse(email, mockUsers[email]), 'Register successfully')
  },

  async refreshToken(): Promise<ApiResponse<AuthApiResponse>> {
    await delay()

    const mockAccessToken = localStorage.getItem('auth-storage')

    if (!mockAccessToken) {
      throw new Error('Không có phiên mock để refresh token.')
    }

    const parsedState = JSON.parse(mockAccessToken) as {
      state?: {
        accessToken?: string | null
      }
    }
    const email = getMockEmailFromToken(parsedState.state?.accessToken ?? null)

    if (!email || !mockUsers[email]) {
      throw new Error('Phiên mock không hợp lệ để refresh token.')
    }

    return buildSuccessResponse(
      buildAuthResponse(email, mockUsers[email]),
      'Refresh token successfully'
    )
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay()

    return buildSuccessResponse(null, 'Logout successfully')
  }
}
