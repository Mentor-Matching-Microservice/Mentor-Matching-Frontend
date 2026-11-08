import type { Gender, PageQueryParams, PageResponse } from '@/types/api/common'
import type { UserStatus } from '@/types/models/user'

export type UserRoleApiResponse = 'LEARNER' | 'MENTOR' | 'ADMIN' | 'MANAGER'

export type UserTypeApiResponse = 'STUDENT' | 'PARENT' | 'UNIVERSITY_STUDENT' | 'WORKING_ADULT'

export type CurrentUserApiResponse = {
  id: number
  fullName: string
  email: string
  phone: string
  role: UserRoleApiResponse
  userType: UserTypeApiResponse | null
  status: UserStatus
}

export type UpdateCurrentUserRequest = {
  fullName: string
  phone: string
  userType: UserTypeApiResponse
}

export type LearnerProfileApiResponse = {
  id: number | null
  userId: number
  gender: Gender | null
  birthYear: number | null
  schoolName: string | null
  gradeId: number | null
  learningGoal: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UpdateCurrentLearnerProfileRequest = {
  gender?: Gender | null
  birthYear?: number | null
  schoolName?: string | null
  gradeId?: number | null
  learningGoal?: string | null
}

export type AdminUserListItemApiResponse = {
  id: number
  fullName: string
  email: string
  phone: string | null
  role: UserRoleApiResponse
  userType: UserTypeApiResponse | null
  status: UserStatus
  createdAt: string | null
}

export type AdminUserDetailApiResponse = AdminUserListItemApiResponse & {
  totalBookings: number
  totalSpent: number
}

export type AdminUserListPageApiResponse = PageResponse<AdminUserListItemApiResponse>

export type GetAdminUsersQueryParams = PageQueryParams<
  string,
  {
    search?: string
    role?: UserRoleApiResponse
    status?: UserStatus
  }
>

export type UpdateUserStatusActionApiRequest = 'BAN' | 'ACTIVATE'

export type UpdateUserStatusRequest = {
  action: UpdateUserStatusActionApiRequest
}
