import { env } from '@/config/env'
import http from '@/libs/http'
import { mockMentorApi } from '@/services/mock/mentor.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type { MentorCalendarApiResponse } from '@/types/api/mentor-calendar'
import type {
  AdminMentorDetailApiResponse,
  AdminMentorListPageApiResponse,
  AdminMentorVerificationDetailApiResponse,
  AdminMentorVerificationListPageApiResponse,
  CurrentMentorApiResponse,
  CurrentMentorOnboardingStatusApiResponse,
  CurrentMentorTraitsApiResponse,
  CurrentMentorVerificationApiResponse,
  GetAdminMentorVerificationsQueryParams,
  GetAdminMentorsQueryParams,
  MentorsQueryParams,
  MentorAchievementDetailApiResponse,
  MentorAvailabilityDetailApiResponse,
  MentorDetailApiResponse,
  MentorListPageApiResponse,
  MentorOptionDetailApiResponse,
  MentorSubjectDetailApiResponse,
  MentorTraitsDetailApiResponse,
  ReviewMentorApprovalRequest,
  ReviewMentorVerificationRequest,
  SaveCurrentMentorAchievementRequest,
  SaveCurrentMentorAvailabilityRequest,
  CreateCurrentMentorAvailabilityApiResponse,
  UpdateCurrentMentorAvatarRequest,
  UpdateCurrentMentorRequest,
  UpdateCurrentMentorTraitsRequest,
  UpsertCurrentMentorSubjectRequest,
  UpsertCurrentMentorVerificationRequest
} from '@/types/api/mentor'

const MENTOR_ENDPOINTS = {
  me: 'mentors/me',
  myAvatar: 'mentors/me/avatar',
  myOnboardingStatus: 'mentors/me/onboarding-status',
  mySubmission: 'mentors/me/submission',
  mentors: 'mentors',
  mentorDetail: (mentorId: number) => `mentors/${mentorId}`,
  mySubjects: 'mentors/me/subjects',
  mySubjectDetail: (mentorSubjectId: number) => `mentors/me/subjects/${mentorSubjectId}`,
  mentorSubjects: (mentorId: number) => `mentors/${mentorId}/subjects`,
  myTraits: 'mentors/me/traits',
  personalityOptions: 'mentors/personality-options',
  highlightOptions: 'mentors/highlight-options',
  mentorTraits: (mentorId: number) => `mentors/${mentorId}/traits`,
  myAchievements: 'mentors/me/achievements',
  myAchievementDetail: (achievementId: number) => `mentors/me/achievements/${achievementId}`,
  mentorAchievements: (mentorId: number) => `mentors/${mentorId}/achievements`,
  myVerification: 'mentors/me/verification',
  myAvailabilities: 'scheduling/me/availabilities',
  myAvailabilityDetail: (availabilityId: number) =>
    `scheduling/me/availabilities/${availabilityId}`,
  mentorAvailabilities: (mentorId: number) => `mentors/${mentorId}/availabilities`,
  mentorCalendarBooking: (mentorId: number) => `mentors/${mentorId}/calendar-booking`,
  adminMentors: 'admin/mentors',
  adminMentorDetail: (mentorId: number) => `admin/mentors/${mentorId}`,
  adminMentorApproval: (mentorId: number) => `admin/mentors/${mentorId}/approval`,
  adminMentorVerifications: 'admin/mentor-verifications',
  adminMentorVerificationDetail: (verificationId: number) =>
    `admin/mentor-verifications/${verificationId}`
} as const

const defaultMentorApi = {
  createCurrentMentor: async (
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> =>
    (await http.post<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.me, payload)).data,

  getCurrentMentor: async (): Promise<ApiResponse<CurrentMentorApiResponse>> =>
    (await http.get<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.me)).data,

  getCurrentMentorOnboardingStatus: async (): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > =>
    (
      await http.get<ApiResponse<CurrentMentorOnboardingStatusApiResponse>>(
        MENTOR_ENDPOINTS.myOnboardingStatus
      )
    ).data,

  submitCurrentMentorApplication: async (): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > =>
    (
      await http.post<ApiResponse<CurrentMentorOnboardingStatusApiResponse>>(
        MENTOR_ENDPOINTS.mySubmission
      )
    ).data,

  updateCurrentMentor: async (
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> =>
    (await http.put<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.me, payload)).data,

  updateCurrentMentorAvatar: async (
    payload: UpdateCurrentMentorAvatarRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> =>
    (await http.patch<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.myAvatar, payload))
      .data,

  getMentors: async (
    params?: MentorsQueryParams
  ): Promise<ApiResponse<MentorListPageApiResponse>> =>
    (await http.get<ApiResponse<MentorListPageApiResponse>>(MENTOR_ENDPOINTS.mentors, { params }))
      .data,

  getMentorDetail: async (mentorId: number): Promise<ApiResponse<MentorDetailApiResponse>> =>
    (await http.get<ApiResponse<MentorDetailApiResponse>>(MENTOR_ENDPOINTS.mentorDetail(mentorId)))
      .data,

  getCurrentMentorSubjects: async (): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> =>
    (await http.get<ApiResponse<MentorSubjectDetailApiResponse[]>>(MENTOR_ENDPOINTS.mySubjects))
      .data,

  upsertCurrentMentorSubject: async (
    payload: UpsertCurrentMentorSubjectRequest
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse>> =>
    (
      await http.put<ApiResponse<MentorSubjectDetailApiResponse>>(
        MENTOR_ENDPOINTS.mySubjects,
        payload
      )
    ).data,

  deleteCurrentMentorSubject: async (mentorSubjectId: number): Promise<ApiResponse<null>> =>
    (await http.delete<ApiResponse<null>>(MENTOR_ENDPOINTS.mySubjectDetail(mentorSubjectId))).data,

  getMentorSubjects: async (
    mentorId: number
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> =>
    (
      await http.get<ApiResponse<MentorSubjectDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.mentorSubjects(mentorId)
      )
    ).data,

  getCurrentMentorTraits: async (): Promise<ApiResponse<CurrentMentorTraitsApiResponse>> =>
    (await http.get<ApiResponse<CurrentMentorTraitsApiResponse>>(MENTOR_ENDPOINTS.myTraits)).data,

  updateCurrentMentorTraits: async (
    payload: UpdateCurrentMentorTraitsRequest
  ): Promise<ApiResponse<CurrentMentorTraitsApiResponse>> =>
    (
      await http.put<ApiResponse<CurrentMentorTraitsApiResponse>>(
        MENTOR_ENDPOINTS.myTraits,
        payload
      )
    ).data,

  getPersonalityOptions: async (): Promise<ApiResponse<MentorOptionDetailApiResponse[]>> =>
    (
      await http.get<ApiResponse<MentorOptionDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.personalityOptions
      )
    ).data,

  getHighlightOptions: async (): Promise<ApiResponse<MentorOptionDetailApiResponse[]>> =>
    (
      await http.get<ApiResponse<MentorOptionDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.highlightOptions
      )
    ).data,

  getMentorTraits: async (mentorId: number): Promise<ApiResponse<MentorTraitsDetailApiResponse>> =>
    (
      await http.get<ApiResponse<MentorTraitsDetailApiResponse>>(
        MENTOR_ENDPOINTS.mentorTraits(mentorId)
      )
    ).data,

  getCurrentMentorAchievements: async (): Promise<
    ApiResponse<MentorAchievementDetailApiResponse[]>
  > =>
    (
      await http.get<ApiResponse<MentorAchievementDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.myAchievements
      )
    ).data,

  createCurrentMentorAchievement: async (
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> =>
    (
      await http.post<ApiResponse<MentorAchievementDetailApiResponse>>(
        MENTOR_ENDPOINTS.myAchievements,
        payload
      )
    ).data,

  updateCurrentMentorAchievement: async (
    achievementId: number,
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> =>
    (
      await http.put<ApiResponse<MentorAchievementDetailApiResponse>>(
        MENTOR_ENDPOINTS.myAchievementDetail(achievementId),
        payload
      )
    ).data,

  deleteCurrentMentorAchievement: async (achievementId: number): Promise<ApiResponse<null>> =>
    (await http.delete<ApiResponse<null>>(MENTOR_ENDPOINTS.myAchievementDetail(achievementId)))
      .data,

  getMentorAchievements: async (
    mentorId: number
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse[]>> =>
    (
      await http.get<ApiResponse<MentorAchievementDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.mentorAchievements(mentorId)
      )
    ).data,

  getCurrentMentorVerification: async (): Promise<
    ApiResponse<CurrentMentorVerificationApiResponse>
  > =>
    (
      await http.get<ApiResponse<CurrentMentorVerificationApiResponse>>(
        MENTOR_ENDPOINTS.myVerification
      )
    ).data,

  upsertCurrentMentorVerification: async (
    payload: UpsertCurrentMentorVerificationRequest
  ): Promise<ApiResponse<CurrentMentorVerificationApiResponse>> =>
    (
      await http.put<ApiResponse<CurrentMentorVerificationApiResponse>>(
        MENTOR_ENDPOINTS.myVerification,
        payload
      )
    ).data,

  getMentorAvailabilities: async (
    mentorId: number
  ): Promise<ApiResponse<MentorAvailabilityDetailApiResponse[]>> =>
    (
      await http.get<ApiResponse<MentorAvailabilityDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.mentorAvailabilities(mentorId)
      )
    ).data,

  getCurrentMentorAvailabilities: async (): Promise<
    ApiResponse<MentorAvailabilityDetailApiResponse[]>
  > =>
    (
      await http.get<ApiResponse<MentorAvailabilityDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.myAvailabilities
      )
    ).data,

  createCurrentMentorAvailability: async (
    payload: SaveCurrentMentorAvailabilityRequest
  ): Promise<ApiResponse<CreateCurrentMentorAvailabilityApiResponse>> =>
    (
      await http.post<ApiResponse<CreateCurrentMentorAvailabilityApiResponse>>(
        MENTOR_ENDPOINTS.myAvailabilities,
        payload
      )
    ).data,

  updateCurrentMentorAvailability: async (
    availabilityId: number,
    payload: SaveCurrentMentorAvailabilityRequest
  ): Promise<ApiResponse<null>> =>
    (
      await http.put<ApiResponse<null>>(
        MENTOR_ENDPOINTS.myAvailabilityDetail(availabilityId),
        payload
      )
    ).data,

  deleteCurrentMentorAvailability: async (availabilityId: number): Promise<ApiResponse<null>> =>
    (await http.delete<ApiResponse<null>>(MENTOR_ENDPOINTS.myAvailabilityDetail(availabilityId)))
      .data,

  getMentorCalendarBooking: async (
    mentorId: number,
    from: string,
    to: string
  ): Promise<ApiResponse<MentorCalendarApiResponse>> =>
    (
      await http.get<ApiResponse<MentorCalendarApiResponse>>(
        MENTOR_ENDPOINTS.mentorCalendarBooking(mentorId),
        {
          params: { from, to }
        }
      )
    ).data,

  getAdminMentors: async (
    params?: GetAdminMentorsQueryParams
  ): Promise<ApiResponse<AdminMentorListPageApiResponse>> =>
    (
      await http.get<ApiResponse<AdminMentorListPageApiResponse>>(MENTOR_ENDPOINTS.adminMentors, {
        params
      })
    ).data,

  getAdminMentorDetail: async (
    mentorId: number
  ): Promise<ApiResponse<AdminMentorDetailApiResponse>> =>
    (
      await http.get<ApiResponse<AdminMentorDetailApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorDetail(mentorId)
      )
    ).data,

  reviewMentorApproval: async (
    mentorId: number,
    payload: ReviewMentorApprovalRequest
  ): Promise<ApiResponse<AdminMentorDetailApiResponse>> =>
    (
      await http.patch<ApiResponse<AdminMentorDetailApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorApproval(mentorId),
        payload
      )
    ).data,

  getAdminMentorVerifications: async (
    params?: GetAdminMentorVerificationsQueryParams
  ): Promise<ApiResponse<AdminMentorVerificationListPageApiResponse>> =>
    (
      await http.get<ApiResponse<AdminMentorVerificationListPageApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorVerifications,
        { params }
      )
    ).data,

  getAdminMentorVerificationDetail: async (
    verificationId: number
  ): Promise<ApiResponse<AdminMentorVerificationDetailApiResponse>> =>
    (
      await http.get<ApiResponse<AdminMentorVerificationDetailApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorVerificationDetail(verificationId)
      )
    ).data,

  reviewMentorVerification: async (
    verificationId: number,
    payload: ReviewMentorVerificationRequest
  ): Promise<ApiResponse<AdminMentorVerificationDetailApiResponse>> =>
    (
      await http.patch<ApiResponse<AdminMentorVerificationDetailApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorVerificationDetail(verificationId),
        payload
      )
    ).data
}

export const mentorApi = env.useMock ? mockMentorApi : defaultMentorApi
