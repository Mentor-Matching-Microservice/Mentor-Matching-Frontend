import { useAuthStore } from '@/stores/auth-store'
import { getMockEmailFromToken, mockUsers } from '@/services/mock/auth.mock.api'
import type { ApiResponse, PageResponse } from '@/types/api/common'
import type { MentorCalendarApiResponse } from '@/types/api/mentor-calendar'
import type {
  AdminMentorDetailApiResponse,
  AdminMentorListItemApiResponse,
  AdminMentorVerificationDetailApiResponse,
  AdminMentorVerificationListItemApiResponse,
  CurrentMentorApiResponse,
  CurrentMentorOnboardingStatusApiResponse,
  CurrentMentorTraitsApiResponse,
  CurrentMentorVerificationApiResponse,
  GetAdminMentorVerificationsQueryParams,
  GetAdminMentorsQueryParams,
  MentorsQueryParams,
  MentorAchievementDetailApiResponse,
  MentorApprovalStatusApiResponse,
  MentorAvailabilityDetailApiResponse,
  MentorDetailApiResponse,
  MentorMeetingType,
  MentorOptionDetailApiResponse,
  MentorSubjectDetailApiResponse,
  MentorTraitsDetailApiResponse,
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

function buildCreatedResponse<T>(data: T, message = 'Created'): ApiResponse<T> {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function paginate<T>(items: T[], page = 1, size = 10): PageResponse<T> {
  const pageSize = size
  const currentPage = page
  const totalItems = items.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const startIndex = (currentPage - 1) * pageSize

  return {
    page: currentPage,
    pageSize,
    totalPages,
    totalItems,
    data: items.slice(startIndex, startIndex + pageSize)
  }
}

function requireMockSession() {
  const email = getMockEmailFromToken(useAuthStore.getState().accessToken)

  if (!email || !mockUsers[email]) {
    throw new Error('Phiên đăng nhập mock không hợp lệ')
  }

  return {
    email,
    user: mockUsers[email]
  }
}

const personalityOptions: MentorOptionDetailApiResponse[] = [
  { id: 1, name: 'Kiên nhẫn', description: 'Giải thích chậm rãi, theo từng bước.' },
  { id: 2, name: 'Truyền cảm hứng', description: 'Tạo động lực và giữ nhịp học tích cực.' },
  { id: 3, name: 'Kỷ luật', description: 'Bám sát kế hoạch và theo dõi tiến độ đều.' }
]

const highlightOptions: MentorOptionDetailApiResponse[] = [
  { id: 11, name: 'Ôn thi chuyển cấp', description: 'Phù hợp học viên có mục tiêu thi cử.' },
  { id: 12, name: 'Học online', description: 'Linh hoạt với lịch học từ xa.' },
  { id: 13, name: 'Mất gốc', description: 'Có thể đi từ nền tảng cơ bản.' }
]

const mentorDirectory: MentorDetailApiResponse[] = [
  {
    id: 101,
    userId: 2,
    fullName: 'Mentor Test',
    avatarUrl: 'https://example.com/mock-mentor-1.jpg',
    gender: 'MALE',
    hometown: { cityId: 1, cityName: 'Ho Chi Minh', districtId: null, districtName: null },
    currentLocation: {
      cityId: 1,
      cityName: 'Ho Chi Minh',
      districtId: 103,
      districtName: 'Thu Duc'
    },
    headline: 'Mentor Toan THCS va on thi chuyen cap',
    introduction: 'Dong hanh cung hoc vien xay nen tang va giai bai co he thong.',
    teachingStyle: 'Chia muc tieu tung tuan, giao bai ngan va review loi sai ro rang.',
    experienceYears: 5,
    currentPosition: 'Mentor toan ca nhan',
    workplace: 'Freelance',
    education: 'Cu nhan Su pham Toan',
    major: 'Su pham Toan',
    meetingType: 'HYBRID',
    createdAt: '2026-05-01T09:00:00',
    updatedAt: '2026-06-09T09:00:00'
  },
  {
    id: 102,
    userId: 4,
    fullName: 'Tran Quoc Huy',
    avatarUrl: 'https://example.com/mock-mentor-2.jpg',
    gender: 'MALE',
    hometown: { cityId: 2, cityName: 'Ha Noi', districtId: null, districtName: null },
    currentLocation: { cityId: 2, cityName: 'Ha Noi', districtId: 202, districtName: 'Cau Giay' },
    headline: 'Mentor Tieng Anh giao tiep va IELTS nen tang',
    introduction: 'Tap trung speaking, phat am va lo trinh hoc co muc tieu ro.',
    teachingStyle: 'Ket hop luyen phan xa va bai tap sau moi buoi.',
    experienceYears: 4,
    currentPosition: 'IELTS Mentor',
    workplace: 'English Pathway',
    education: 'Cu nhan Ngon ngu Anh',
    major: 'Ngon ngu Anh',
    meetingType: 'ONLINE',
    createdAt: '2026-04-15T09:00:00',
    updatedAt: '2026-06-08T09:00:00'
  }
]

const mentorListItems: AdminMentorListItemApiResponse[] = mentorDirectory.map((mentor, index) => ({
  id: mentor.id,
  userId: mentor.userId,
  fullName: mentor.fullName,
  avatarUrl: mentor.avatarUrl,
  gender: mentor.gender,
  headline: mentor.headline,
  experienceYears: mentor.experienceYears,
  currentPosition: mentor.currentPosition,
  workplace: mentor.workplace,
  education: mentor.education,
  major: mentor.major,
  meetingType: mentor.meetingType,
  approvalStatus: index === 0 ? 'APPROVED' : 'PENDING',
  verificationStatus: index === 0 ? 'VERIFIED' : 'PENDING',
  minPrice: index === 0 ? 280000 : 320000,
  createdAt: mentor.createdAt
}))

const mentorSubjectsByMentorId: Record<number, MentorSubjectDetailApiResponse[]> = {
  101: [
    {
      id: 1001,
      subjectGradeId: 5001,
      subjectId: 1,
      subjectName: 'Toan',
      gradeId: 8,
      gradeName: 'Lop 8',
      proficiencyLevel: 'INTERMEDIATE',
      teachingNote: 'Cung co nen tang va sua bai theo dang.',
      pricePerHour: 240000,
      active: true
    },
    {
      id: 1002,
      subjectGradeId: 5002,
      subjectId: 1,
      subjectName: 'Toan',
      gradeId: 9,
      gradeName: 'Lop 9',
      proficiencyLevel: 'ADVANCED',
      teachingNote: 'On thi chuyen cap va luyen de.',
      pricePerHour: 280000,
      active: true
    }
  ],
  102: [
    {
      id: 1003,
      subjectGradeId: 5003,
      subjectId: 9,
      subjectName: 'Tieng Anh',
      gradeId: 12,
      gradeName: 'Lop 12',
      proficiencyLevel: 'ADVANCED',
      teachingNote: 'Tap trung ngu phap va doc hieu.',
      pricePerHour: 300000,
      active: true
    }
  ]
}

const mentorTraitsByMentorId: Record<number, MentorTraitsDetailApiResponse> = {
  101: {
    personalities: [personalityOptions[0], personalityOptions[2]],
    highlights: [highlightOptions[0], highlightOptions[2]]
  },
  102: {
    personalities: [personalityOptions[1]],
    highlights: [highlightOptions[1]]
  }
}

const mentorAchievementsByMentorId: Record<number, MentorAchievementDetailApiResponse[]> = {
  101: [
    {
      id: 7001,
      title: 'Chung chi nghiep vu su pham',
      description: 'Hoan thanh khoa boi duong nghiep vu su pham.',
      achievementType: 'CERTIFICATE',
      issuer: 'Truong Dai hoc Su pham',
      achievedAt: '2023-08-15',
      proofUrl: 'https://example.com/certificate-1.jpg',
      verified: true
    }
  ],
  102: [
    {
      id: 7002,
      title: 'IELTS 8.0',
      description: 'Chung chi IELTS con hieu luc.',
      achievementType: 'EXAM_SCORE',
      issuer: 'IELTS',
      achievedAt: '2024-03-10',
      proofUrl: 'https://example.com/ielts-1.jpg',
      verified: true
    }
  ]
}

const mentorAvailabilitiesByMentorId: Record<number, MentorAvailabilityDetailApiResponse[]> = {
  101: [
    {
      id: 8001,
      availabilityType: 'RECURRING',
      dayOfWeek: 2,
      availableDate: null,
      startTime: '19:00:00',
      endTime: '21:00:00'
    },
    {
      id: 8002,
      availabilityType: 'SPECIFIC_DATE',
      dayOfWeek: null,
      availableDate: '2026-06-12',
      startTime: '08:00:00',
      endTime: '10:00:00'
    }
  ],
  102: [
    {
      id: 8003,
      availabilityType: 'RECURRING',
      dayOfWeek: 4,
      availableDate: null,
      startTime: '19:00:00',
      endTime: '21:00:00'
    }
  ]
}

const adminMentorVerifications: AdminMentorVerificationDetailApiResponse[] = [
  {
    id: 9001,
    mentorId: 101,
    userId: 2,
    accountFullName: 'Mentor Test',
    accountEmail: 'mentor@test.com',
    accountPhone: '0900000002',
    approvalStatus: 'APPROVED',
    approvalNote: 'Ho so day du',
    fullName: 'Mentor Test',
    idCardNumber: '079123456789',
    idCardFrontUrl: 'https://example.com/id-front.jpg',
    idCardBackUrl: 'https://example.com/id-back.jpg',
    selfieWithIdUrl: 'https://example.com/selfie.jpg',
    verificationStatus: 'VERIFIED',
    verifiedBy: 3,
    verifiedAt: '2026-06-01T09:00:00',
    rejectionReason: null,
    createdAt: '2026-05-28T09:00:00',
    updatedAt: '2026-06-01T09:00:00'
  }
]

let currentMentorState: CurrentMentorApiResponse = {
  id: 101,
  userId: 2,
  fullName: 'Mentor Test',
  avatarUrl: 'https://example.com/mock-mentor-1.jpg',
  avatarMediaId: 9901,
  gender: 'MALE',
  hometown: { cityId: 1, cityName: 'Ho Chi Minh', districtId: null, districtName: null },
  currentLocation: { cityId: 1, cityName: 'Ho Chi Minh', districtId: 103, districtName: 'Thu Duc' },
  headline: 'Mentor Toan THCS va on thi chuyen cap',
  introduction: 'Dong hanh cung hoc vien xay nen tang va giai bai co he thong.',
  teachingStyle: 'Chia muc tieu tung tuan, giao bai ngan va review loi sai ro rang.',
  experienceYears: 5,
  currentPosition: 'Mentor toan ca nhan',
  workplace: 'Freelance',
  education: 'Cu nhan Su pham Toan',
  major: 'Su pham Toan',
  meetingType: 'HYBRID',
  approvalStatus: 'APPROVED',
  approvalNote: 'Ho so hop le',
  verificationStatus: 'VERIFIED',
  verificationRejectionReason: null,
  createdAt: '2026-05-01T09:00:00',
  updatedAt: '2026-06-09T09:00:00'
}

let currentMentorTraitsState: CurrentMentorTraitsApiResponse = {
  personalityOptionIds: [1, 3],
  highlightOptionIds: [11, 13]
}

let currentMentorVerificationState: CurrentMentorVerificationApiResponse = {
  id: 9001,
  mentorId: 101,
  fullName: 'Mentor Test',
  idCardNumber: '079123456789',
  idCardFrontUrl: 'https://example.com/id-front.jpg',
  idCardFrontMediaId: 9902,
  idCardBackUrl: 'https://example.com/id-back.jpg',
  idCardBackMediaId: 9903,
  selfieWithIdUrl: 'https://example.com/selfie.jpg',
  selfieWithIdMediaId: 9904,
  verificationStatus: 'VERIFIED',
  verifiedBy: 3,
  verifiedAt: '2026-06-01T09:00:00',
  rejectionReason: null,
  createdAt: '2026-05-28T09:00:00',
  updatedAt: '2026-06-01T09:00:00'
}

function getMentorTraitsDetailFromState(): MentorTraitsDetailApiResponse {
  const personalities = personalityOptions.filter((option) =>
    currentMentorTraitsState.personalityOptionIds.includes(option.id)
  )
  const highlights = highlightOptions.filter((option) =>
    currentMentorTraitsState.highlightOptionIds.includes(option.id)
  )

  return {
    personalities,
    highlights
  }
}

function filterMentorItemsBySearch<T extends { fullName: string; headline: string | null }>(
  items: T[],
  search?: string
) {
  const normalizedQuery = search?.trim().toLowerCase()

  if (!normalizedQuery) return items

  return items.filter((item) => {
    return (
      item.fullName.toLowerCase().includes(normalizedQuery) ||
      (item.headline ?? '').toLowerCase().includes(normalizedQuery)
    )
  })
}

function normalizeDate(value: string) {
  return new Date(`${value}T00:00:00`)
}

function toIsoDate(value: Date) {
  const year = value.getFullYear()
  const month = `${value.getMonth() + 1}`.padStart(2, '0')
  const day = `${value.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

function buildMentorCalendar(
  mentorId: number,
  from: string,
  to: string
): MentorCalendarApiResponse {
  const fromDate = normalizeDate(from)
  const toDate = normalizeDate(to)
  const availabilities = mentorAvailabilitiesByMentorId[mentorId] ?? []
  const dates: MentorCalendarApiResponse['dates'] = []

  for (
    let cursor = new Date(fromDate);
    cursor.getTime() <= toDate.getTime();
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const currentDate = new Date(cursor)
    const isoDate = toIsoDate(currentDate)
    const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay()

    const availableWindows = availabilities
      .filter((item) => {
        if (item.availabilityType === 'SPECIFIC_DATE') return item.availableDate === isoDate
        return item.availabilityType === 'RECURRING' && item.dayOfWeek === dayOfWeek
      })
      .sort((left, right) => left.startTime.localeCompare(right.startTime))
      .map((item) => ({
        startTime: item.startTime,
        endTime: item.endTime
      }))

    dates.push({
      date: isoDate,
      availableWindows
    })
  }

  return {
    mentorId,
    from,
    to,
    dates
  }
}

function normalizeAvailabilityPayload(
  payload: SaveCurrentMentorAvailabilityRequest
): MentorAvailabilityDetailApiResponse {
  return {
    id: 0,
    availabilityType: payload.availabilityType,
    dayOfWeek: payload.availabilityType === 'RECURRING' ? (payload.dayOfWeek ?? null) : null,
    availableDate:
      payload.availabilityType === 'SPECIFIC_DATE' ? (payload.availableDate ?? null) : null,
    startTime: payload.startTime,
    endTime: payload.endTime
  }
}

function filterByMeetingType<T extends { meetingType: MentorMeetingType | null }>(
  items: T[],
  meetingType?: MentorMeetingType
) {
  if (!meetingType) return items
  return items.filter((item) => item.meetingType === meetingType)
}

function getCurrentMentorOnboardingStatus(): CurrentMentorOnboardingStatusApiResponse {
  const subjects = mentorSubjectsByMentorId[currentMentorState.id] ?? []
  const achievements = mentorAchievementsByMentorId[currentMentorState.id] ?? []

  return {
    mentorProfileCreated: Boolean(currentMentorState.id),
    profileDetailsCompleted: Boolean(
      currentMentorState.avatarUrl &&
      currentMentorState.headline &&
      currentMentorState.introduction &&
      currentMentorState.teachingStyle
    ),
    verificationSubmitted: currentMentorVerificationState.verificationStatus !== 'UNVERIFIED',
    verificationStatus: currentMentorVerificationState.verificationStatus,
    subjectCount: subjects.length,
    personalityCount: currentMentorTraitsState.personalityOptionIds.length,
    highlightCount: currentMentorTraitsState.highlightOptionIds.length,
    achievementCount: achievements.length,
    approvalStatus: currentMentorState.approvalStatus,
    onboardingCompleted:
      currentMentorState.approvalStatus === 'APPROVED' &&
      currentMentorVerificationState.verificationStatus === 'VERIFIED'
  }
}

export const mockMentorApi = {
  async createCurrentMentor(
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> {
    await delay()
    requireMockSession()

    currentMentorState = {
      ...currentMentorState,
      ...payload,
      approvalStatus: 'DRAFT',
      updatedAt: new Date().toISOString()
    }

    return buildCreatedResponse(currentMentorState, 'Create mentor profile successfully')
  },

  async getCurrentMentor(): Promise<ApiResponse<CurrentMentorApiResponse>> {
    await delay()
    requireMockSession()

    return buildSuccessResponse(currentMentorState, 'Get current mentor profile successfully')
  },

  async getCurrentMentorOnboardingStatus(): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > {
    await delay()
    requireMockSession()

    return buildSuccessResponse(
      getCurrentMentorOnboardingStatus(),
      'Get current mentor onboarding status successfully'
    )
  },

  async submitCurrentMentorApplication(): Promise<
    ApiResponse<CurrentMentorOnboardingStatusApiResponse>
  > {
    await delay()
    requireMockSession()

    currentMentorState = {
      ...currentMentorState,
      approvalStatus: 'PENDING',
      updatedAt: new Date().toISOString()
    }

    return buildSuccessResponse(
      getCurrentMentorOnboardingStatus(),
      'Submit current mentor application successfully'
    )
  },

  async updateCurrentMentor(
    payload: UpdateCurrentMentorRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> {
    await delay()
    requireMockSession()

    currentMentorState = {
      ...currentMentorState,
      ...payload,
      hometown: {
        ...currentMentorState.hometown,
        cityId: payload.hometownCityId ?? currentMentorState.hometown.cityId
      },
      currentLocation: {
        ...currentMentorState.currentLocation,
        districtId: payload.currentDistrictId ?? currentMentorState.currentLocation.districtId
      },
      updatedAt: new Date().toISOString()
    }

    return buildSuccessResponse(currentMentorState, 'Update mentor profile successfully')
  },

  async updateCurrentMentorAvatar(
    payload: UpdateCurrentMentorAvatarRequest
  ): Promise<ApiResponse<CurrentMentorApiResponse>> {
    await delay()
    requireMockSession()

    currentMentorState = {
      ...currentMentorState,
      avatarMediaId: payload.avatarMediaId,
      avatarUrl: `https://example.com/media/${payload.avatarMediaId}.jpg`,
      updatedAt: new Date().toISOString()
    }

    return buildSuccessResponse(currentMentorState, 'Update mentor avatar successfully')
  },

  async getMentors(
    params?: MentorsQueryParams
  ): Promise<ApiResponse<PageResponse<AdminMentorListItemApiResponse>>> {
    await delay()

    const filteredItems = filterByMeetingType(
      filterMentorItemsBySearch(mentorListItems, params?.search),
      params?.meetingType
    )

    return buildSuccessResponse(
      paginate(filteredItems, params?.page ?? 1, params?.size ?? 10),
      'Get mentors successfully'
    )
  },

  async getMentorDetail(mentorId: number): Promise<ApiResponse<MentorDetailApiResponse>> {
    await delay()

    const mentor = mentorDirectory.find((item) => item.id === mentorId) ?? mentorDirectory[0]

    return buildSuccessResponse(mentor, 'Get mentor detail successfully')
  },

  async getCurrentMentorSubjects(): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> {
    await delay()
    requireMockSession()

    return buildSuccessResponse(
      mentorSubjectsByMentorId[currentMentorState.id] ?? [],
      'Get current mentor subjects successfully'
    )
  },

  async upsertCurrentMentorSubject(
    payload: UpsertCurrentMentorSubjectRequest
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse>> {
    await delay()
    requireMockSession()

    const currentSubjects = mentorSubjectsByMentorId[currentMentorState.id] ?? []
    const nextSubject: MentorSubjectDetailApiResponse = {
      id: payload.id ?? Date.now(),
      subjectGradeId: payload.subjectGradeId,
      subjectId: currentSubjects[0]?.subjectId ?? 1,
      subjectName: currentSubjects[0]?.subjectName ?? 'Toan',
      gradeId: currentSubjects[0]?.gradeId ?? 8,
      gradeName: currentSubjects[0]?.gradeName ?? 'Lop 8',
      proficiencyLevel: payload.proficiencyLevel,
      teachingNote: payload.teachingNote ?? null,
      pricePerHour: payload.pricePerHour,
      active: payload.active
    }
    const subjectIndex = currentSubjects.findIndex((item) => item.id === nextSubject.id)

    if (subjectIndex >= 0) {
      currentSubjects[subjectIndex] = nextSubject
    } else {
      currentSubjects.push(nextSubject)
    }

    mentorSubjectsByMentorId[currentMentorState.id] = currentSubjects

    return buildSuccessResponse(nextSubject, 'Save current mentor subject successfully')
  },

  async deleteCurrentMentorSubject(mentorSubjectId: number): Promise<ApiResponse<null>> {
    await delay()
    requireMockSession()

    mentorSubjectsByMentorId[currentMentorState.id] = (
      mentorSubjectsByMentorId[currentMentorState.id] ?? []
    ).filter((subject) => subject.id !== mentorSubjectId)

    return buildSuccessResponse(null, 'Delete current mentor subject successfully')
  },

  async getMentorSubjects(
    mentorId: number
  ): Promise<ApiResponse<MentorSubjectDetailApiResponse[]>> {
    await delay()

    return buildSuccessResponse(
      mentorSubjectsByMentorId[mentorId] ?? [],
      'Get mentor subjects successfully'
    )
  },

  async getCurrentMentorTraits(): Promise<ApiResponse<CurrentMentorTraitsApiResponse>> {
    await delay()
    requireMockSession()

    return buildSuccessResponse(currentMentorTraitsState, 'Get current mentor traits successfully')
  },

  async updateCurrentMentorTraits(
    payload: UpdateCurrentMentorTraitsRequest
  ): Promise<ApiResponse<CurrentMentorTraitsApiResponse>> {
    await delay()
    requireMockSession()

    currentMentorTraitsState = payload

    return buildSuccessResponse(
      currentMentorTraitsState,
      'Update current mentor traits successfully'
    )
  },

  async getPersonalityOptions(): Promise<ApiResponse<MentorOptionDetailApiResponse[]>> {
    await delay()
    return buildSuccessResponse(personalityOptions, 'Get personality options successfully')
  },

  async getHighlightOptions(): Promise<ApiResponse<MentorOptionDetailApiResponse[]>> {
    await delay()
    return buildSuccessResponse(highlightOptions, 'Get highlight options successfully')
  },

  async getMentorTraits(mentorId: number): Promise<ApiResponse<MentorTraitsDetailApiResponse>> {
    await delay()

    const traits =
      mentorId === currentMentorState.id
        ? getMentorTraitsDetailFromState()
        : (mentorTraitsByMentorId[mentorId] ?? { personalities: [], highlights: [] })

    return buildSuccessResponse(traits, 'Get mentor traits successfully')
  },

  async getCurrentMentorAchievements(): Promise<ApiResponse<MentorAchievementDetailApiResponse[]>> {
    await delay()
    requireMockSession()

    return buildSuccessResponse(
      mentorAchievementsByMentorId[currentMentorState.id] ?? [],
      'Get current mentor achievements successfully'
    )
  },

  async createCurrentMentorAchievement(
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> {
    await delay()
    requireMockSession()

    const nextAchievement: MentorAchievementDetailApiResponse = {
      id: Date.now(),
      title: payload.title,
      description: payload.description ?? null,
      achievementType: payload.achievementType,
      issuer: payload.issuer ?? null,
      achievedAt: payload.achievedAt ?? null,
      proofUrl: payload.proofUrl ?? null,
      verified: false
    }

    mentorAchievementsByMentorId[currentMentorState.id] = [
      ...(mentorAchievementsByMentorId[currentMentorState.id] ?? []),
      nextAchievement
    ]

    return buildCreatedResponse(nextAchievement, 'Create current mentor achievement successfully')
  },

  async updateCurrentMentorAchievement(
    achievementId: number,
    payload: SaveCurrentMentorAchievementRequest
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse>> {
    await delay()
    requireMockSession()

    const currentAchievements = mentorAchievementsByMentorId[currentMentorState.id] ?? []
    const currentAchievement = currentAchievements.find((item) => item.id === achievementId)

    if (!currentAchievement) {
      throw new Error('Mock mentor achievement not found')
    }

    const nextAchievement: MentorAchievementDetailApiResponse = {
      ...currentAchievement,
      title: payload.title,
      description: payload.description ?? null,
      achievementType: payload.achievementType,
      issuer: payload.issuer ?? null,
      achievedAt: payload.achievedAt ?? null,
      proofUrl: payload.proofUrl ?? null
    }

    mentorAchievementsByMentorId[currentMentorState.id] = currentAchievements.map((item) =>
      item.id === achievementId ? nextAchievement : item
    )

    return buildSuccessResponse(nextAchievement, 'Update current mentor achievement successfully')
  },

  async deleteCurrentMentorAchievement(achievementId: number): Promise<ApiResponse<null>> {
    await delay()
    requireMockSession()

    mentorAchievementsByMentorId[currentMentorState.id] = (
      mentorAchievementsByMentorId[currentMentorState.id] ?? []
    ).filter((item) => item.id !== achievementId)

    return buildSuccessResponse(null, 'Delete current mentor achievement successfully')
  },

  async getMentorAchievements(
    mentorId: number
  ): Promise<ApiResponse<MentorAchievementDetailApiResponse[]>> {
    await delay()

    return buildSuccessResponse(
      mentorAchievementsByMentorId[mentorId] ?? [],
      'Get mentor achievements successfully'
    )
  },

  async getCurrentMentorVerification(): Promise<ApiResponse<CurrentMentorVerificationApiResponse>> {
    await delay()
    requireMockSession()

    return buildSuccessResponse(
      currentMentorVerificationState,
      'Get current mentor verification successfully'
    )
  },

  async upsertCurrentMentorVerification(
    payload: UpsertCurrentMentorVerificationRequest
  ): Promise<ApiResponse<CurrentMentorVerificationApiResponse>> {
    await delay()
    requireMockSession()

    currentMentorVerificationState = {
      ...currentMentorVerificationState,
      fullName: payload.fullName,
      idCardNumber: payload.idCardNumber ?? null,
      idCardFrontMediaId: payload.idCardFrontMediaId,
      idCardFrontUrl: `https://example.com/media/${payload.idCardFrontMediaId}.jpg`,
      idCardBackMediaId: payload.idCardBackMediaId,
      idCardBackUrl: `https://example.com/media/${payload.idCardBackMediaId}.jpg`,
      selfieWithIdMediaId: payload.selfieWithIdMediaId ?? null,
      selfieWithIdUrl: payload.selfieWithIdMediaId
        ? `https://example.com/media/${payload.selfieWithIdMediaId}.jpg`
        : null,
      verificationStatus: 'PENDING',
      updatedAt: new Date().toISOString()
    }

    return buildSuccessResponse(
      currentMentorVerificationState,
      'Save current mentor verification successfully'
    )
  },

  async getMentorAvailabilities(
    mentorId: number
  ): Promise<ApiResponse<MentorAvailabilityDetailApiResponse[]>> {
    await delay()

    return buildSuccessResponse(
      mentorAvailabilitiesByMentorId[mentorId] ?? [],
      'Get mentor availabilities successfully'
    )
  },

  async getCurrentMentorAvailabilities(): Promise<
    ApiResponse<MentorAvailabilityDetailApiResponse[]>
  > {
    await delay()
    requireMockSession()

    return buildSuccessResponse(
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? [],
      'Get current mentor availabilities successfully'
    )
  },

  async createCurrentMentorAvailability(
    payload: SaveCurrentMentorAvailabilityRequest
  ): Promise<ApiResponse<{ availabilityId: number }>> {
    await delay()
    requireMockSession()

    const currentAvailabilities = mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    const nextAvailabilityId =
      currentAvailabilities.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1

    mentorAvailabilitiesByMentorId[currentMentorState.id] = [
      ...currentAvailabilities,
      {
        ...normalizeAvailabilityPayload(payload),
        id: nextAvailabilityId
      }
    ]

    return buildCreatedResponse(
      { availabilityId: nextAvailabilityId },
      'Create current mentor availability successfully'
    )
  },

  async updateCurrentMentorAvailability(
    availabilityId: number,
    payload: SaveCurrentMentorAvailabilityRequest
  ): Promise<ApiResponse<null>> {
    await delay()
    requireMockSession()

    mentorAvailabilitiesByMentorId[currentMentorState.id] = (
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    ).map((item) =>
      item.id === availabilityId
        ? {
            ...normalizeAvailabilityPayload(payload),
            id: availabilityId
          }
        : item
    )

    return buildSuccessResponse(null, 'Update current mentor availability successfully')
  },

  async deleteCurrentMentorAvailability(availabilityId: number): Promise<ApiResponse<null>> {
    await delay()
    requireMockSession()

    mentorAvailabilitiesByMentorId[currentMentorState.id] = (
      mentorAvailabilitiesByMentorId[currentMentorState.id] ?? []
    ).filter((item) => item.id !== availabilityId)

    return buildSuccessResponse(null, 'Delete current mentor availability successfully')
  },

  async getMentorCalendarBooking(
    mentorId: number,
    from: string,
    to: string
  ): Promise<ApiResponse<MentorCalendarApiResponse>> {
    await delay()

    return buildSuccessResponse(
      buildMentorCalendar(mentorId, from, to),
      'Get mentor calendar successfully'
    )
  },

  async getAdminMentors(
    params?: GetAdminMentorsQueryParams
  ): Promise<ApiResponse<PageResponse<AdminMentorListItemApiResponse>>> {
    await delay()
    requireMockSession()

    const filteredItems = filterByMeetingType(
      filterMentorItemsBySearch(mentorListItems, params?.search).filter((item) =>
        params?.approvalStatus ? item.approvalStatus === params.approvalStatus : true
      ),
      params?.meetingType
    )

    return buildSuccessResponse(
      paginate(filteredItems, params?.page ?? 1, params?.size ?? 10),
      'Get admin mentors successfully'
    )
  },

  async getAdminMentorDetail(mentorId: number): Promise<ApiResponse<AdminMentorDetailApiResponse>> {
    await delay()
    requireMockSession()

    const detail = mentorDirectory.find((item) => item.id === mentorId) ?? mentorDirectory[0]
    const adminDetail: AdminMentorDetailApiResponse = {
      ...detail,
      email: mentorId === 101 ? 'mentor@test.com' : 'mentor2@test.com',
      phone: mentorId === 101 ? '0900000002' : '0900000004',
      approvalStatus: mentorId === 101 ? 'APPROVED' : 'PENDING',
      approvalNote: mentorId === 101 ? 'Ho so hop le' : null
    }

    return buildSuccessResponse(adminDetail, 'Get admin mentor detail successfully')
  },

  async reviewMentorApproval(
    mentorId: number,
    payload: ReviewMentorApprovalRequest
  ): Promise<ApiResponse<AdminMentorDetailApiResponse>> {
    await delay()
    requireMockSession()

    const currentDetailResponse = await this.getAdminMentorDetail(mentorId)
    const approvalStatusByAction: Record<ReviewMentorApprovalRequest['action'], MentorApprovalStatusApiResponse> = {
      APPROVE: 'APPROVED',
      REJECT: 'REJECTED',
      SUSPEND: 'SUSPENDED',
      REACTIVATE: 'APPROVED'
    }
    const approvalStatus = approvalStatusByAction[payload.action]
    const nextDetail: AdminMentorDetailApiResponse = {
      ...currentDetailResponse.data,
      approvalStatus,
      approvalNote: payload.approvalNote ?? null
    }

    return buildSuccessResponse(nextDetail, 'Review mentor approval successfully')
  },

  async getAdminMentorVerifications(
    params?: GetAdminMentorVerificationsQueryParams
  ): Promise<ApiResponse<PageResponse<AdminMentorVerificationListItemApiResponse>>> {
    await delay()
    requireMockSession()

    const items = adminMentorVerifications
      .filter((item) => (params?.status ? item.verificationStatus === params.status : true))
      .map<AdminMentorVerificationListItemApiResponse>((item) => ({
        id: item.id,
        mentorId: item.mentorId,
        userId: item.userId,
        accountFullName: item.accountFullName,
        accountEmail: item.accountEmail,
        verificationStatus: item.verificationStatus,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))

    return buildSuccessResponse(
      paginate(items, params?.page ?? 1, params?.size ?? 10),
      'Get mentor verifications successfully'
    )
  },

  async getAdminMentorVerificationDetail(
    verificationId: number
  ): Promise<ApiResponse<AdminMentorVerificationDetailApiResponse>> {
    await delay()
    requireMockSession()

    const verification =
      adminMentorVerifications.find((item) => item.id === verificationId) ??
      adminMentorVerifications[0]

    return buildSuccessResponse(verification, 'Get mentor verification detail successfully')
  },

  async reviewMentorVerification(
    verificationId: number,
    payload: ReviewMentorVerificationRequest
  ): Promise<ApiResponse<AdminMentorVerificationDetailApiResponse>> {
    await delay()
    requireMockSession()

    const currentVerificationResponse = await this.getAdminMentorVerificationDetail(verificationId)
    const nextVerification: AdminMentorVerificationDetailApiResponse = {
      ...currentVerificationResponse.data,
      verificationStatus: payload.action === 'VERIFY' ? 'VERIFIED' : 'REJECTED',
      rejectionReason: payload.action === 'REJECT' ? (payload.rejectionReason ?? null) : null,
      verifiedAt: payload.action === 'VERIFY' ? new Date().toISOString() : null
    }

    return buildSuccessResponse(nextVerification, 'Review mentor verification successfully')
  }
}
