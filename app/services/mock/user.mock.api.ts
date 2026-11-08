import { ROLES } from '@/constants/roles'
import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  AdminUserDetailApiResponse,
  AdminUserListItemApiResponse,
  AdminUserListPageApiResponse,
  CurrentUserApiResponse,
  GetAdminUsersQueryParams,
  LearnerProfileApiResponse,
  UpdateCurrentLearnerProfileRequest,
  UpdateCurrentUserRequest,
  UpdateUserStatusRequest,
  UserTypeApiResponse
} from '@/types/api/user'
import type { CurrentUser } from '@/types/models/user'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

type MockUserProfileState = {
  phone: string
  userType: UserTypeApiResponse | null
}

const mockUserProfileStateByEmail: Record<string, MockUserProfileState> = {
  'learner@test.com': {
    phone: '0900000001',
    userType: 'STUDENT'
  },
  'mentor@test.com': {
    phone: '0900000002',
    userType: 'WORKING_ADULT'
  },
  'admin@test.com': {
    phone: '0900000003',
    userType: 'WORKING_ADULT'
  }
}

const mockLearnerProfileStateByEmail: Record<string, LearnerProfileApiResponse> = {
  'learner@test.com': {
    id: 1,
    userId: 1,
    gender: 'MALE',
    birthYear: 2009,
    schoolName: 'THCS Nguyen Du',
    gradeId: 8,
    learningGoal: 'Cung co nen tang Toan va Tieng Anh de cai thien ket qua hoc tap.',
    createdAt: '2026-06-01T09:00:00',
    updatedAt: '2026-06-09T09:00:00'
  }
}

let adminUserRecords: AdminUserListItemApiResponse[] = [
  {
    id: 1,
    fullName: 'Học viên Test',
    email: 'learner@test.com',
    phone: '0900000001',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 2,
    fullName: 'Mentor Test',
    email: 'mentor@test.com',
    phone: '0900000002',
    role: 'MENTOR',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 3,
    fullName: 'Admin Test',
    email: 'admin@test.com',
    phone: '0900000003',
    role: 'ADMIN',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-01T09:00:00'
  },
  {
    id: 4,
    fullName: 'Tran Quoc Huy',
    email: 'huy.tran@test.com',
    phone: '0900000004',
    role: 'MENTOR',
    userType: 'WORKING_ADULT',
    status: 'ACTIVE',
    createdAt: '2026-05-10T09:00:00'
  },
  {
    id: 5,
    fullName: 'Ngoc Linh',
    email: 'linh.ngoc@test.com',
    phone: '0900000005',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'INACTIVE',
    createdAt: '2026-05-15T09:00:00'
  },
  {
    id: 6,
    fullName: 'Pham Van Spam',
    email: 'spam.account@test.com',
    phone: '0900000006',
    role: 'LEARNER',
    userType: 'STUDENT',
    status: 'BANNED',
    createdAt: '2026-05-20T09:00:00'
  }
]

function paginateAdminUsers(
  items: AdminUserListItemApiResponse[],
  page = 1,
  size = 10
): AdminUserListPageApiResponse {
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / size))
  const startIndex = (page - 1) * size

  return {
    page,
    pageSize: size,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + size)
  }
}

function toAdminUserDetail(item: AdminUserListItemApiResponse): AdminUserDetailApiResponse {
  return {
    ...item,
    totalBookings: item.role === 'LEARNER' ? 3 : 0,
    totalSpent: item.role === 'LEARNER' ? 750000 : 0
  }
}

function getCurrentMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)

  if (!email || !mockUsers[email]) {
    throw new Error('Phiên đăng nhập mock không hợp lệ')
  }

  return {
    email,
    user: mockUsers[email] as CurrentUser
  }
}

function getCurrentUserResponse(email: string, user: CurrentUser): CurrentUserApiResponse {
  const profileState = mockUserProfileStateByEmail[email] ?? {
    phone: '',
    userType: null
  }

  return {
    id: Number(user.id),
    email: user.email,
    fullName: user.fullName,
    phone: profileState.phone,
    role: (user.roles[0] ?? ROLES.LEARNER) as CurrentUserApiResponse['role'],
    userType: profileState.userType,
    status: 'ACTIVE'
  }
}

function getEmptyLearnerProfile(userId: number): LearnerProfileApiResponse {
  return {
    id: null,
    userId,
    gender: null,
    birthYear: null,
    schoolName: null,
    gradeId: null,
    learningGoal: null,
    createdAt: null,
    updatedAt: null
  }
}

export const mockUserApi = {
  async publicCheck(): Promise<ApiResponse<string>> {
    await delay()

    return buildSuccessResponse('User public endpoint is reachable')
  },

  async getCurrentUser(): Promise<ApiResponse<CurrentUserApiResponse>> {
    await delay()

    const { email, user } = getCurrentMockSession()

    return buildSuccessResponse(
      getCurrentUserResponse(email, user),
      'Get current user successfully'
    )
  },

  async updateCurrentUser(
    payload: UpdateCurrentUserRequest
  ): Promise<ApiResponse<CurrentUserApiResponse>> {
    await delay()

    const { email, user } = getCurrentMockSession()

    mockUsers[email] = {
      ...user,
      fullName: payload.fullName
    }

    mockUserProfileStateByEmail[email] = {
      phone: payload.phone,
      userType: payload.userType
    }

    return buildSuccessResponse(
      getCurrentUserResponse(email, mockUsers[email] as CurrentUser),
      'Update user profile successfully'
    )
  },

  async getCurrentLearnerProfile(): Promise<ApiResponse<LearnerProfileApiResponse>> {
    await delay()

    const { email, user } = getCurrentMockSession()

    return buildSuccessResponse(
      mockLearnerProfileStateByEmail[email] ?? getEmptyLearnerProfile(Number(user.id))
    )
  },

  async upsertCurrentLearnerProfile(
    payload: UpdateCurrentLearnerProfileRequest
  ): Promise<ApiResponse<LearnerProfileApiResponse>> {
    await delay()

    const { email, user } = getCurrentMockSession()
    const currentProfile =
      mockLearnerProfileStateByEmail[email] ?? getEmptyLearnerProfile(Number(user.id))
    const now = new Date().toISOString()

    const nextProfile: LearnerProfileApiResponse = {
      ...currentProfile,
      gender: payload.gender ?? null,
      birthYear: payload.birthYear ?? null,
      schoolName: payload.schoolName ?? null,
      gradeId: payload.gradeId ?? null,
      learningGoal: payload.learningGoal ?? null,
      id: currentProfile.id ?? Number(user.id),
      createdAt: currentProfile.createdAt ?? now,
      updatedAt: now
    }

    mockLearnerProfileStateByEmail[email] = nextProfile

    return buildSuccessResponse(nextProfile, 'Save learner profile successfully')
  },

  async authCheck(): Promise<ApiResponse<string>> {
    await delay()
    getCurrentMockSession()

    return buildSuccessResponse('Authenticated user endpoint is reachable')
  },

  async adminCheck(): Promise<ApiResponse<string>> {
    await delay()

    const { user } = getCurrentMockSession()

    if (!user.roles.includes(ROLES.ADMIN)) {
      throw new Error('Mock user is not allowed to access admin endpoint')
    }

    return buildSuccessResponse('Admin endpoint is reachable')
  },

  async getAdminUsers(
    params?: GetAdminUsersQueryParams
  ): Promise<ApiResponse<AdminUserListPageApiResponse>> {
    await delay()
    getCurrentMockSession()

    const normalizedSearch = params?.search?.trim().toLowerCase() ?? ''
    const filtered = adminUserRecords.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        item.fullName.toLowerCase().includes(normalizedSearch) ||
        item.email.toLowerCase().includes(normalizedSearch)
      const matchesRole = !params?.role || item.role === params.role
      const matchesStatus = !params?.status || item.status === params.status

      return matchesSearch && matchesRole && matchesStatus
    })

    return buildSuccessResponse(
      paginateAdminUsers(filtered, params?.page ?? 1, params?.size ?? 10),
      'Get admin users successfully'
    )
  },

  async getAdminUserDetail(userId: number): Promise<ApiResponse<AdminUserDetailApiResponse>> {
    await delay()
    getCurrentMockSession()

    const item = adminUserRecords.find((record) => record.id === userId)
    if (!item) {
      throw new Error('Mock user not found')
    }

    return buildSuccessResponse(toAdminUserDetail(item), 'Get admin user detail successfully')
  },

  async updateUserStatus(
    userId: number,
    payload: UpdateUserStatusRequest
  ): Promise<ApiResponse<AdminUserDetailApiResponse>> {
    await delay()
    getCurrentMockSession()

    adminUserRecords = adminUserRecords.map((item) =>
      item.id === userId
        ? { ...item, status: payload.action === 'BAN' ? 'BANNED' : 'ACTIVE' }
        : item
    )

    const updated = adminUserRecords.find((record) => record.id === userId)
    if (!updated) {
      throw new Error('Mock user not found')
    }

    return buildSuccessResponse(toAdminUserDetail(updated), 'Update user status successfully')
  }
}
