export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'BANNED'
export type CurrentUserRole = 'LEARNER' | 'MENTOR' | 'ADMIN' | 'MANAGER'
export type UserType = 'STUDENT' | 'PARENT' | 'UNIVERSITY_STUDENT' | 'WORKING_ADULT'

export type CurrentUser = {
  id: string
  email: string
  fullName: string
  phone: string
  userType: UserType | null
  status: UserStatus
  roles: CurrentUserRole[]
}
