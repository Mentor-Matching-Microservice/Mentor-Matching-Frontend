import type { Gender, PageQueryParams, PageResponse } from '@/types/api/common'

export type MentorMeetingType = 'ONLINE' | 'OFFLINE' | 'HYBRID'

export type MentorApprovalStatusApiResponse =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'

export type MentorVerificationStatusApiResponse = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'

export type MentorProficiencyLevelApiResponse = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type MentorListSortBy =
  | 'id'
  | 'fullName'
  | 'gender'
  | 'experienceYears'
  | 'meetingType'
  | 'createdAt'
  | 'minPrice'

export type AdminMentorListSortBy = MentorListSortBy | 'approvalStatus'

export type MentorAchievementTypeApiResponse =
  | 'AWARD'
  | 'CERTIFICATE'
  | 'EXAM_SCORE'
  | 'COMPETITION'
  | 'PROJECT'
  | 'WORK_EXPERIENCE'

export type MentorAvailabilityTypeApiResponse = 'RECURRING' | 'SPECIFIC_DATE'

export type ReviewMentorApprovalActionApiRequest = 'APPROVE' | 'REJECT' | 'SUSPEND' | 'REACTIVATE'

export type ReviewMentorVerificationActionApiRequest = 'VERIFY' | 'REJECT'

export type MentorLocationApiResponse = {
  cityId: number | null
  cityName: string | null
  districtId: number | null
  districtName: string | null
}

export type CurrentMentorApiResponse = {
  id: number
  userId: number
  fullName: string
  avatarUrl: string
  avatarMediaId: number | null
  gender: Gender | null
  hometown: MentorLocationApiResponse
  currentLocation: MentorLocationApiResponse
  headline: string | null
  introduction: string | null
  teachingStyle: string | null
  experienceYears: number | null
  currentPosition: string | null
  workplace: string | null
  education: string | null
  major: string | null
  meetingType: MentorMeetingType | null
  approvalStatus: MentorApprovalStatusApiResponse
  approvalNote: string | null
  verificationStatus: MentorVerificationStatusApiResponse
  verificationRejectionReason: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UpdateCurrentMentorRequest = {
  gender?: Gender | null
  hometownCityId?: number | null
  currentDistrictId?: number | null
  headline?: string | null
  introduction?: string | null
  teachingStyle?: string | null
  experienceYears?: number | null
  currentPosition?: string | null
  workplace?: string | null
  education?: string | null
  major?: string | null
  meetingType?: MentorMeetingType | null
}

export type UpdateCurrentMentorAvatarRequest = {
  avatarMediaId: number
}

export type CurrentMentorOnboardingStatusApiResponse = {
  mentorProfileCreated: boolean
  profileDetailsCompleted: boolean
  verificationSubmitted: boolean
  verificationStatus: MentorVerificationStatusApiResponse | null
  subjectCount: number
  personalityCount: number
  highlightCount: number
  achievementCount: number
  approvalStatus: MentorApprovalStatusApiResponse | null
  onboardingCompleted: boolean
}

export type MentorListItemApiResponse = {
  id: number
  userId: number
  fullName: string
  avatarUrl: string
  gender: Gender | null
  headline: string | null
  experienceYears: number | null
  currentPosition: string | null
  workplace: string | null
  education: string | null
  major: string | null
  meetingType: MentorMeetingType | null
  minPrice: number | null
  createdAt: string | null
}

export type MentorDetailApiResponse = {
  id: number
  userId: number
  fullName: string
  avatarUrl: string
  gender: Gender | null
  hometown: MentorLocationApiResponse
  currentLocation: MentorLocationApiResponse
  headline: string | null
  introduction: string | null
  teachingStyle: string | null
  experienceYears: number | null
  currentPosition: string | null
  workplace: string | null
  education: string | null
  major: string | null
  meetingType: MentorMeetingType | null
  createdAt: string | null
  updatedAt: string | null
}

export type MentorsQueryParams = PageQueryParams<
  MentorListSortBy,
  {
    search?: string
    gender?: Gender
    meetingType?: MentorMeetingType
    cityId?: number
    districtId?: number
    subjectId?: number
    gradeId?: number
  }
>

export type MentorSubjectDetailApiResponse = {
  id: number
  subjectGradeId: number
  subjectId: number
  subjectName: string
  gradeId: number
  gradeName: string
  proficiencyLevel: MentorProficiencyLevelApiResponse
  teachingNote: string | null
  pricePerHour: number
  active: boolean
}

export type UpsertCurrentMentorSubjectRequest = {
  id?: number | null
  subjectGradeId: number
  proficiencyLevel: MentorProficiencyLevelApiResponse
  teachingNote?: string | null
  pricePerHour: number
  active: boolean
}

export type CurrentMentorTraitsApiResponse = {
  personalityOptionIds: number[]
  highlightOptionIds: number[]
}

export type UpdateCurrentMentorTraitsRequest = {
  personalityOptionIds: number[]
  highlightOptionIds: number[]
}

export type MentorOptionDetailApiResponse = {
  id: number
  name: string
  description: string | null
}

export type MentorTraitsDetailApiResponse = {
  personalities: MentorOptionDetailApiResponse[]
  highlights: MentorOptionDetailApiResponse[]
}

export type MentorAchievementDetailApiResponse = {
  id: number
  title: string
  description: string | null
  achievementType: MentorAchievementTypeApiResponse
  issuer: string | null
  achievedAt: string | null
  proofUrl: string | null
  verified: boolean | null
}

export type SaveCurrentMentorAchievementRequest = {
  title: string
  description?: string | null
  achievementType: MentorAchievementTypeApiResponse
  issuer?: string | null
  achievedAt?: string | null
  proofUrl?: string | null
}

export type CurrentMentorVerificationApiResponse = {
  id: number | null
  mentorId: number | null
  fullName: string | null
  idCardNumber: string | null
  idCardFrontUrl: string | null
  idCardFrontMediaId: number | null
  idCardBackUrl: string | null
  idCardBackMediaId: number | null
  selfieWithIdUrl: string | null
  selfieWithIdMediaId: number | null
  verificationStatus: MentorVerificationStatusApiResponse
  verifiedBy: number | null
  verifiedAt: string | null
  rejectionReason: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type UpsertCurrentMentorVerificationRequest = {
  fullName: string
  idCardNumber?: string | null
  idCardFrontMediaId: number
  idCardBackMediaId: number
  selfieWithIdMediaId?: number | null
}

export type MentorAvailabilityDetailApiResponse = {
  id: number
  availabilityType: MentorAvailabilityTypeApiResponse
  dayOfWeek: number | null
  availableDate: string | null
  startTime: string
  endTime: string
}

export type SaveCurrentMentorAvailabilityRequest = {
  availabilityType: MentorAvailabilityTypeApiResponse
  dayOfWeek?: number | null
  availableDate?: string | null
  startTime: string
  endTime: string
}

export type CreateCurrentMentorAvailabilityApiResponse = {
  availabilityId: number
}

export type AdminMentorListItemApiResponse = {
  id: number
  userId: number
  fullName: string
  avatarUrl: string
  gender: Gender | null
  headline: string | null
  experienceYears: number | null
  currentPosition: string | null
  workplace: string | null
  education: string | null
  major: string | null
  meetingType: MentorMeetingType | null
  approvalStatus: MentorApprovalStatusApiResponse
  verificationStatus: MentorVerificationStatusApiResponse
  minPrice: number | null
  createdAt: string | null
}

export type AdminMentorDetailApiResponse = {
  id: number
  userId: number
  fullName: string
  email: string
  phone: string
  avatarUrl: string
  gender: Gender | null
  hometown: MentorLocationApiResponse
  currentLocation: MentorLocationApiResponse
  headline: string | null
  introduction: string | null
  teachingStyle: string | null
  experienceYears: number | null
  currentPosition: string | null
  workplace: string | null
  education: string | null
  major: string | null
  meetingType: MentorMeetingType | null
  approvalStatus: MentorApprovalStatusApiResponse
  approvalNote: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type ReviewMentorApprovalRequest = {
  action: ReviewMentorApprovalActionApiRequest
  approvalNote?: string | null
}

export type GetAdminMentorsQueryParams = PageQueryParams<
  AdminMentorListSortBy,
  {
    search?: string
    gender?: Gender
    meetingType?: MentorMeetingType
    cityId?: number
    districtId?: number
    subjectId?: number
    gradeId?: number
    approvalStatus?: MentorApprovalStatusApiResponse
  }
>

export type AdminMentorVerificationListItemApiResponse = {
  id: number
  mentorId: number
  userId: number
  accountFullName: string
  accountEmail: string
  verificationStatus: MentorVerificationStatusApiResponse
  createdAt: string | null
  updatedAt: string | null
}

export type AdminMentorVerificationDetailApiResponse = {
  id: number
  mentorId: number
  userId: number
  accountFullName: string
  accountEmail: string
  accountPhone: string
  approvalStatus: MentorApprovalStatusApiResponse
  approvalNote: string | null
  fullName: string
  idCardNumber: string | null
  idCardFrontUrl: string
  idCardBackUrl: string
  selfieWithIdUrl: string | null
  verificationStatus: MentorVerificationStatusApiResponse
  verifiedBy: number | null
  verifiedAt: string | null
  rejectionReason: string | null
  createdAt: string | null
  updatedAt: string | null
}

export type ReviewMentorVerificationRequest = {
  action: ReviewMentorVerificationActionApiRequest
  rejectionReason?: string | null
}

export type GetAdminMentorVerificationsQueryParams = PageQueryParams<
  string,
  {
    status?: MentorVerificationStatusApiResponse
  }
>

export type MentorListPageApiResponse = PageResponse<MentorListItemApiResponse>

export type AdminMentorListPageApiResponse = PageResponse<AdminMentorListItemApiResponse>

export type AdminMentorVerificationListPageApiResponse =
  PageResponse<AdminMentorVerificationListItemApiResponse>
