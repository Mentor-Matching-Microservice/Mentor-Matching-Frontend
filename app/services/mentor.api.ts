import { env } from '@/config/env'
import { parseJwtClaims } from '@/hooks/queries/auth/useCurrentUserQuery'
import http from '@/libs/http'
import { authApi } from '@/services/auth.api'
import { catalogApi } from '@/services/catalog.api'
import { locationApi } from '@/services/location.api'
import { isMockAccessToken } from '@/services/mock/auth.mock.api'
import { mockMentorApi } from '@/services/mock/mentor.mock.api'
import { useAuthStore } from '@/stores/auth-store'
import type { CatalogOptionsApiResponse } from '@/types/api/catalog'
import type { ApiResponse } from '@/types/api/common'
import type { MentorCalendarApiResponse } from '@/types/api/mentor-calendar'
import type {
  AdminMentorDetailApiResponse,
  AdminMentorListPageApiResponse,
  AdminMentorVerificationDetailApiResponse,
  AdminMentorVerificationListItemApiResponse,
  AdminMentorVerificationListPageApiResponse,
  CreateCurrentMentorAvailabilityApiResponse,
  CurrentMentorApiResponse,
  CurrentMentorOnboardingStatusApiResponse,
  CurrentMentorTraitsApiResponse,
  CurrentMentorVerificationApiResponse,
  CurrentMentorVerificationStatusApiResponse,
  GetAdminMentorVerificationsQueryParams,
  GetAdminMentorsQueryParams,
  MentorAchievementDetailApiResponse,
  MentorApprovalStatusApiResponse,
  MentorAvailabilityDetailApiResponse,
  MentorDetailApiResponse,
  MentorListPageApiResponse,
  MentorLocationApiResponse,
  MentorOptionDetailApiResponse,
  MentorSubjectDetailApiResponse,
  MentorTraitsDetailApiResponse,
  MentorVerificationReviewApiResponse,
  MentorVerificationStatusApiResponse,
  MentorsQueryParams,
  ReviewMentorApprovalRequest,
  ReviewMentorVerificationRequest,
  SaveCurrentMentorAchievementRequest,
  SaveCurrentMentorAvailabilityRequest,
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
  myVerificationStatus: 'mentors/me/verification/status',
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

async function resolveLocations(
  hometownCityId: number | null | undefined,
  currentDistrictId: number | null | undefined,
  existingHometown?: MentorLocationApiResponse | null,
  existingCurrentLocation?: MentorLocationApiResponse | null
): Promise<{
  hometown: MentorLocationApiResponse
  currentLocation: MentorLocationApiResponse
}> {
  let hometown: MentorLocationApiResponse = existingHometown ?? {
    cityId: hometownCityId ?? null,
    cityName: null,
    districtId: null,
    districtName: null
  }

  let currentLocation: MentorLocationApiResponse = existingCurrentLocation ?? {
    cityId: null,
    cityName: null,
    districtId: currentDistrictId ?? null,
    districtName: null
  }

  if (hometown.cityId && !hometown.cityName) {
    try {
      const cityRes = await locationApi.getCity(hometown.cityId)
      hometown = {
        ...hometown,
        cityName: cityRes.data.name
      }
    } catch {
      // Keep fallback ID if location lookup fails
    }
  }

  if (currentLocation.districtId && (!currentLocation.districtName || !currentLocation.cityId)) {
    try {
      const districtRes = await locationApi.getDistrict(currentLocation.districtId)
      const resolvedCityId = districtRes.data.cityId
      let resolvedCityName = currentLocation.cityName

      if (resolvedCityId && !resolvedCityName) {
        if (resolvedCityId === hometown.cityId && hometown.cityName) {
          resolvedCityName = hometown.cityName
        } else {
          try {
            const cityRes = await locationApi.getCity(resolvedCityId)
            resolvedCityName = cityRes.data.name
          } catch {
            // Keep null cityName if lookup fails
          }
        }
      }

      currentLocation = {
        cityId: resolvedCityId,
        cityName: resolvedCityName ?? null,
        districtId: districtRes.data.id,
        districtName: districtRes.data.name
      }
    } catch {
      // Keep fallback ID if district lookup fails
    }
  }

  return { hometown, currentLocation }
}

async function normalizeCurrentMentorResponse(
  raw: CurrentMentorApiResponse
): Promise<CurrentMentorApiResponse> {
  const hometownCityId = raw.hometownCityId ?? raw.hometown?.cityId ?? null
  const currentDistrictId = raw.currentDistrictId ?? raw.currentLocation?.districtId ?? null
  const { hometown, currentLocation } = await resolveLocations(
    hometownCityId,
    currentDistrictId,
    raw.hometown,
    raw.currentLocation
  )

  const defaultApprovalStatus: MentorApprovalStatusApiResponse =
    raw.accountStatus === 'ACTIVE'
      ? 'APPROVED'
      : raw.accountStatus === 'BANNED' || raw.accountStatus === 'INACTIVE'
        ? 'SUSPENDED'
        : 'DRAFT'

  const defaultVerificationStatus: MentorVerificationStatusApiResponse =
    raw.accountStatus === 'ACTIVE' ? 'VERIFIED' : 'PENDING'

  return {
    ...raw,
    avatarUrl: raw.avatarUrl ?? '',
    avatarMediaId: raw.avatarMediaId ?? null,
    hometownCityId,
    currentDistrictId,
    hometown,
    currentLocation,
    approvalStatus: raw.approvalStatus ?? defaultApprovalStatus,
    approvalNote: raw.approvalNote ?? null,
    verificationStatus: raw.verificationStatus ?? defaultVerificationStatus,
    verificationRejectionReason: raw.verificationRejectionReason ?? null
  }
}

async function normalizeMentorDetailResponse(
  raw: MentorDetailApiResponse
): Promise<MentorDetailApiResponse> {
  const hometownCityId = raw.hometownCityId ?? raw.hometown?.cityId ?? null
  const currentDistrictId = raw.currentDistrictId ?? raw.currentLocation?.districtId ?? null
  const { hometown, currentLocation } = await resolveLocations(
    hometownCityId,
    currentDistrictId,
    raw.hometown,
    raw.currentLocation
  )

  return {
    ...raw,
    avatarUrl: raw.avatarUrl ?? '',
    hometownCityId,
    currentDistrictId,
    hometown,
    currentLocation
  }
}

function enrichSubjectsWithCatalog(
  subjects: MentorSubjectDetailApiResponse[],
  catalogOptions: CatalogOptionsApiResponse | null
): MentorSubjectDetailApiResponse[] {
  return subjects.map((subject) => {
    if (subject.subjectName && subject.gradeName && subject.subjectId && subject.gradeId) {
      return subject
    }

    const subjectGrade = catalogOptions?.subjectGrades.find(
      (item) => item.id === subject.subjectGradeId
    )
    const resolvedSubjectId = subject.subjectId || subjectGrade?.subjectId || 0
    const resolvedGradeId = subject.gradeId || subjectGrade?.gradeId || 0
    const catalogSubject = catalogOptions?.subjects.find((item) => item.id === resolvedSubjectId)
    const catalogGrade = catalogOptions?.grades.find((item) => item.id === resolvedGradeId)

    return {
      ...subject,
      subjectId: resolvedSubjectId,
      subjectName: subject.subjectName || catalogSubject?.name || `Môn #${subject.subjectGradeId}`,
      gradeId: resolvedGradeId,
      gradeName: subject.gradeName || catalogGrade?.name || 'Tất cả cấp lớp'
    }
  })
}

async function normalizeMentorSubjects(
  subjects: MentorSubjectDetailApiResponse[]
): Promise<MentorSubjectDetailApiResponse[]> {
  if (
    subjects.length === 0 ||
    subjects.every(
      (item) => Boolean(item.subjectName && item.gradeName && item.subjectId && item.gradeId)
    )
  ) {
    return subjects
  }

  try {
    const catalogResponse = await catalogApi.getCatalogOptions()
    return enrichSubjectsWithCatalog(subjects, catalogResponse.data)
  } catch {
    return enrichSubjectsWithCatalog(subjects, null)
  }
}

const defaultMentorApi = {
  createCurrentMentor: async (
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> =>
    defaultMentorApi.updateCurrentMentor(payload),

  getCurrentMentor: async (): Promise<ApiResponse<CurrentMentorApiResponse>> => {
    const response = (await http.get<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.me))
      .data

    return {
      ...response,
      data: await normalizeCurrentMentorResponse(response.data)
    }
  },

  getCurrentMentorOnboardingStatus: async (): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > => {
    const verificationStatusRes = await defaultMentorApi.getCurrentMentorVerificationStatus()
    const verificationStatus = verificationStatusRes.data.verificationStatus
    const verificationSubmitted = Boolean(
      verificationStatus && verificationStatus !== 'UNVERIFIED'
    )

    if (verificationStatus !== 'VERIFIED') {
      return {
        status: 200,
        code: 'SUCCESS',
        success: true,
        message: 'Get current mentor onboarding status successfully',
        data: {
          mentorProfileCreated: false,
          profileDetailsCompleted: false,
          verificationSubmitted,
          verificationStatus: verificationStatus ?? 'UNVERIFIED',
          subjectCount: 0,
          personalityCount: 0,
          highlightCount: 0,
          achievementCount: 0,
          approvalStatus: 'DRAFT',
          onboardingCompleted: false
        }
      }
    }

    let currentAccessToken = useAuthStore.getState().accessToken
    let claims = parseJwtClaims(currentAccessToken)

    if (
      currentAccessToken &&
      !isMockAccessToken(currentAccessToken) &&
      !claims.roles.includes('MENTOR')
    ) {
      try {
        const refreshed = await authApi.refreshToken()
        if (refreshed.data?.accessToken) {
          useAuthStore.getState().setAccessToken(refreshed.data.accessToken)
          currentAccessToken = refreshed.data.accessToken
          claims = parseJwtClaims(currentAccessToken)
        }
      } catch {
        // Ignore refresh error and fall back below
      }
    }

    if (
      currentAccessToken &&
      !isMockAccessToken(currentAccessToken) &&
      !claims.roles.includes('MENTOR')
    ) {
      return {
        status: 200,
        code: 'SUCCESS',
        success: true,
        message: 'Get current mentor onboarding status successfully',
        data: {
          mentorProfileCreated: false,
          profileDetailsCompleted: false,
          verificationSubmitted: true,
          verificationStatus: 'VERIFIED',
          subjectCount: 0,
          personalityCount: 0,
          highlightCount: 0,
          achievementCount: 0,
          approvalStatus: 'DRAFT',
          onboardingCompleted: false
        }
      }
    }

    try {
      const [mentorRes, subjectsRes] = await Promise.all([
        defaultMentorApi.getCurrentMentor(),
        defaultMentorApi.getCurrentMentorSubjects()
      ])
      const mentor = mentorRes.data
      const subjects = subjectsRes.data
      const activeSubjectCount = subjects.filter((item) => item.active).length
      const profileDetailsCompleted = Boolean(
        mentor.fullName?.trim() &&
        mentor.avatarUrl?.trim() &&
        mentor.headline?.trim() &&
        mentor.introduction?.trim() &&
        mentor.meetingType
      )
      const isPublicReady =
        mentor.accountStatus === 'ACTIVE' && profileDetailsCompleted && activeSubjectCount > 0

      return {
        status: 200,
        code: 'SUCCESS',
        success: true,
        message: 'Get current mentor onboarding status successfully',
        data: {
          mentorProfileCreated: true,
          profileDetailsCompleted,
          verificationSubmitted: true,
          verificationStatus: 'VERIFIED',
          subjectCount: subjects.length,
          personalityCount: 0,
          highlightCount: 0,
          achievementCount: 0,
          approvalStatus: isPublicReady ? 'APPROVED' : 'DRAFT',
          onboardingCompleted: isPublicReady
        }
      }
    } catch {
      return {
        status: 200,
        code: 'SUCCESS',
        success: true,
        message: 'Get current mentor onboarding status successfully',
        data: {
          mentorProfileCreated: true,
          profileDetailsCompleted: false,
          verificationSubmitted: true,
          verificationStatus: 'VERIFIED',
          subjectCount: 0,
          personalityCount: 0,
          highlightCount: 0,
          achievementCount: 0,
          approvalStatus: 'DRAFT',
          onboardingCompleted: false
        }
      }
    }
  },

  submitCurrentMentorApplication: async (): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > => defaultMentorApi.getCurrentMentorOnboardingStatus(),

  updateCurrentMentor: async (
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> => {
    const requestBody = {
      gender: payload.gender ?? null,
      hometownCityId: payload.hometownCityId ?? null,
      currentDistrictId: payload.currentDistrictId ?? null,
      headline: payload.headline ?? null,
      introduction: payload.introduction ?? null,
      teachingStyle: payload.teachingStyle ?? null,
      experienceYears: payload.experienceYears ?? null,
      currentPosition: payload.currentPosition ?? null,
      workplace: payload.workplace ?? null,
      education: payload.education ?? null,
      major: payload.major ?? null,
      meetingType: payload.meetingType ?? null
    }
    const response = (
      await http.put<ApiResponse<CurrentMentorApiResponse>>(MENTOR_ENDPOINTS.me, requestBody)
    ).data
    const normalized = await normalizeCurrentMentorResponse(response.data)

    return {
      ...response,
      data: {
        ...normalized,
        fullName: normalized.fullName || payload.fullName?.trim() || ''
      }
    }
  },

  updateCurrentMentorAvatar: async (
    _payload: UpdateCurrentMentorAvatarRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> => defaultMentorApi.getCurrentMentor(),

  getMentors: async (
    params?: MentorsQueryParams
  ): Promise<ApiResponse<MentorListPageApiResponse>> =>
    (await http.get<ApiResponse<MentorListPageApiResponse>>(MENTOR_ENDPOINTS.mentors, { params }))
      .data,

  getMentorDetail: async (mentorId: number): Promise<ApiResponse<MentorDetailApiResponse>> => {
    const response = (
      await http.get<ApiResponse<MentorDetailApiResponse>>(MENTOR_ENDPOINTS.mentorDetail(mentorId))
    ).data

    return {
      ...response,
      data: await normalizeMentorDetailResponse(response.data)
    }
  },

  getCurrentMentorSubjects: async (): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> => {
    const response = (
      await http.get<ApiResponse<MentorSubjectDetailApiResponse[]>>(MENTOR_ENDPOINTS.mySubjects)
    ).data

    return {
      ...response,
      data: await normalizeMentorSubjects(response.data)
    }
  },

  upsertCurrentMentorSubject: async (
    payload: UpsertCurrentMentorSubjectRequest
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse>> => {
    const response = (
      await http.put<ApiResponse<MentorSubjectDetailApiResponse>>(
        MENTOR_ENDPOINTS.mySubjects,
        payload
      )
    ).data
    const [normalized] = await normalizeMentorSubjects([response.data])

    return {
      ...response,
      data: normalized
    }
  },

  deleteCurrentMentorSubject: async (mentorSubjectId: number): Promise<ApiResponse<null>> =>
    (await http.delete<ApiResponse<null>>(MENTOR_ENDPOINTS.mySubjectDetail(mentorSubjectId))).data,

  getMentorSubjects: async (
    mentorId: number
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> => {
    const response = (
      await http.get<ApiResponse<MentorSubjectDetailApiResponse[]>>(
        MENTOR_ENDPOINTS.mentorSubjects(mentorId)
      )
    ).data

    return {
      ...response,
      data: await normalizeMentorSubjects(response.data)
    }
  },

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

  upsertCurrentMentorAchievement: async (
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> =>
    (
      await http.put<ApiResponse<MentorAchievementDetailApiResponse>>(
        MENTOR_ENDPOINTS.myAchievements,
        {
          id: payload.id ?? null,
          title: payload.title,
          description: payload.description ?? null,
          achievementType: payload.achievementType,
          issuer: payload.issuer ?? null,
          achievedAt: payload.achievedAt ?? null,
          proofUrl: payload.proofUrl ?? null
        }
      )
    ).data,

  createCurrentMentorAchievement: async (
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> =>
    defaultMentorApi.upsertCurrentMentorAchievement({
      ...payload,
      id: null
    }),

  updateCurrentMentorAchievement: async (
    achievementId: number,
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> =>
    defaultMentorApi.upsertCurrentMentorAchievement({
      ...payload,
      id: achievementId
    }),

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

  getCurrentMentorVerificationStatus: async (): Promise<
    ApiResponse<CurrentMentorVerificationStatusApiResponse>
  > =>
    (
      await http.get<ApiResponse<CurrentMentorVerificationStatusApiResponse>>(
        MENTOR_ENDPOINTS.myVerificationStatus
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
        {
          fullName: payload.fullName,
          idCardNumber: payload.idCardNumber ?? null,
          idCardFrontUrl: payload.idCardFrontUrl,
          idCardBackUrl: payload.idCardBackUrl,
          selfieWithIdUrl: payload.selfieWithIdUrl ?? null
        }
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
  ): Promise<ApiResponse<AdminMentorListPageApiResponse>> => {
    try {
      return (
        await http.get<ApiResponse<AdminMentorListPageApiResponse>>(MENTOR_ENDPOINTS.adminMentors, {
          params
        })
      ).data
    } catch {
      if (params?.approvalStatus === 'PENDING' || params?.approvalStatus === 'SUSPENDED') {
        return {
          status: 200,
          code: 'SUCCESS',
          success: true,
          message: 'Get admin mentors successfully',
          data: {
            data: [],
            page: 0,
            pageSize: params?.size ?? 10,
            totalItems: 0,
            totalPages: 0
          }
        }
      }

      const publicMentorsRes = await defaultMentorApi.getMentors({
        search: params?.search,
        page: params?.page !== undefined ? Math.max(0, params.page - 1) : 0,
        size: params?.size
      })

      return {
        ...publicMentorsRes,
        data: {
          ...publicMentorsRes.data,
          data: publicMentorsRes.data.data.map((mentor) => ({
            ...mentor,
            approvalStatus: 'APPROVED' as const,
            verificationStatus: 'VERIFIED' as const
          }))
        }
      }
    }
  },

  getAdminMentorDetail: async (
    mentorId: number
  ): Promise<ApiResponse<AdminMentorDetailApiResponse>> => {
    let rawData: any
    try {
      const res = await http.get<ApiResponse<any>>(MENTOR_ENDPOINTS.adminMentorDetail(mentorId))
      rawData = res.data.data
    } catch {
      const detailRes = await defaultMentorApi.getMentorDetail(mentorId)
      rawData = detailRes.data
    }

    const locations = await resolveLocations(
      rawData?.hometownCityId ?? rawData?.hometown?.cityId,
      rawData?.currentDistrictId ?? rawData?.currentLocation?.districtId,
      rawData?.hometown,
      rawData?.currentLocation
    )

    return {
      status: 200,
      code: 'SUCCESS',
      success: true,
      message: 'Get admin mentor detail successfully',
      data: {
        ...rawData,
        email: rawData?.email || '',
        phone: rawData?.phone || '',
        approvalStatus: rawData?.approvalStatus || 'PENDING',
        approvalNote: rawData?.approvalNote || rawData?.rejectionReason || null,
        hometown: locations.hometown,
        currentLocation: locations.currentLocation
      }
    }
  },

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
  ): Promise<ApiResponse<AdminMentorVerificationListPageApiResponse>> => {
    const queryParams = params
      ? {
          status: params.status,
          page: params.page !== undefined ? Math.max(0, params.page - 1) : 0,
          size: params.size
        }
      : undefined

    const response = (
      await http.get<ApiResponse<AdminMentorVerificationListPageApiResponse>>(
        MENTOR_ENDPOINTS.adminMentorVerifications,
        { params: queryParams }
      )
    ).data

    return {
      ...response,
      data: {
        ...response.data,
        data: (response.data.data ?? []).map(
          (item): AdminMentorVerificationListItemApiResponse => ({
            ...item,
            fullName: item.fullName || item.accountFullName || '',
            accountFullName: item.accountFullName || item.fullName || ''
          })
        )
      }
    }
  },

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
  ): Promise<
    ApiResponse<MentorVerificationReviewApiResponse | AdminMentorVerificationDetailApiResponse>
  > =>
    (
      await http.patch<
        ApiResponse<MentorVerificationReviewApiResponse | AdminMentorVerificationDetailApiResponse>
      >(MENTOR_ENDPOINTS.adminMentorVerificationDetail(verificationId), {
        action: payload.action,
        rejectionReason: payload.action === 'REJECT' ? (payload.rejectionReason ?? null) : null
      })
    ).data
}

export const mentorApi = env.useMock ? mockMentorApi : defaultMentorApi
