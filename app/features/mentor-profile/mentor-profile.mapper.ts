import type { BookingMeetingTypeApiResponse } from '@/types/api/booking'
import type {
  MentorAchievementDetailApiResponse,
  MentorAchievementTypeApiResponse,
  MentorApprovalStatusApiResponse,
  MentorDetailApiResponse,
  MentorMeetingType,
  MentorProficiencyLevelApiResponse,
  MentorTraitsDetailApiResponse,
  MentorVerificationStatusApiResponse
} from '@/types/api/mentor'
import type { MentorProfileApiBundle } from '@/hooks/queries/mentor/useMentorProfileQuery'

export type MentorProfileExperienceItem = {
  title: string
  company: string | null
  period: string
}

export type MentorProfileEducationItem = {
  degree: string
  school: string
}

export type MentorProfileOffering = {
  id: string
  mentorSubjectId: number
  subject: string
  grade: string
  proficiency: MentorProficiencyLevelApiResponse
  pricePerHour: number
  active: boolean
  teachingNote: string
}

export type MentorProfileReview = {
  name: string
  rating: number
  text: string
  tags?: string[]
}

export type MentorProfileViewModel = {
  id: string
  mentorId: number
  name: string
  avatarUrl: string | null
  headline: string
  approvalStatus: MentorApprovalStatusApiResponse | null
  verificationStatus: MentorVerificationStatusApiResponse | null
  rating: number | null
  reviewsCount: number | null
  responseTime: string | null
  activeStudentsCount: number | null
  startingPrice: number | null
  expertise: string
  highlights: string[]
  introduction: string
  subjects: string[]
  grades: string[]
  meetingTypes: MentorMeetingType[]
  availabilitySummary: string
  teachingStyle: string
  achievements: string[]
  offerings: MentorProfileOffering[]
  experience: MentorProfileExperienceItem[]
  education: MentorProfileEducationItem[]
  reviews: MentorProfileReview[]
  reviewsUnavailableReason: string
  bookableMeetingType: BookingMeetingTypeApiResponse | null
}

export function mapMentorProfileToViewModel(
  bundle: MentorProfileApiBundle
): MentorProfileViewModel {
  const { achievements, detail, subjects, traits } = bundle
  const meetingTypes = unique(
    [detail.meetingType].filter((value): value is MentorMeetingType => Boolean(value))
  )
  const offerings: MentorProfileOffering[] = subjects.map((item) => ({
    id: String(item.id),
    mentorSubjectId: item.id,
    subject: item.subjectName,
    grade: item.gradeName,
    proficiency: item.proficiencyLevel,
    pricePerHour: item.pricePerHour,
    active: item.active,
    teachingNote:
      item.teachingNote?.trim() ||
      'Mentor sẽ cập nhật thêm mục tiêu và cách triển khai cho offering này.'
  }))
  const startingPrice =
    offerings.length > 0
      ? offerings.reduce(
          (lowestPrice, offering) => Math.min(lowestPrice, offering.pricePerHour),
          offerings[0].pricePerHour
        )
      : null

  return {
    id: String(detail.id),
    mentorId: detail.id,
    name: detail.fullName,
    avatarUrl: detail.avatarUrl || null,
    headline:
      detail.headline?.trim() ||
      [detail.currentPosition, detail.workplace].filter(Boolean).join(' · ') ||
      'Mentor công khai đang sẵn sàng cho học viên mới.',
    approvalStatus: null,
    verificationStatus: null,
    rating: null,
    reviewsCount: null,
    responseTime: null,
    activeStudentsCount: null,
    startingPrice,
    expertise:
      detail.introduction?.trim() ||
      detail.teachingStyle?.trim() ||
      detail.headline?.trim() ||
      'Thông tin giới thiệu chi tiết đang được mentor cập nhật thêm.',
    highlights: buildHighlights(detail, traits),
    introduction:
      detail.introduction?.trim() ||
      'Mentor chưa bổ sung phần giới thiệu chi tiết cho hồ sơ công khai này.',
    subjects: unique(subjects.map((item) => item.subjectName)),
    grades: unique(subjects.map((item) => item.gradeName)),
    meetingTypes,
    availabilitySummary: buildAvailabilitySummary(detail, meetingTypes),
    teachingStyle:
      detail.teachingStyle?.trim() ||
      'Phong cách giảng dạy đang được mentor cập nhật thêm trong hồ sơ công khai.',
    achievements: buildAchievementHighlights(achievements),
    offerings,
    experience: buildExperience(detail, achievements),
    education: buildEducation(detail),
    reviews: [],
    reviewsUnavailableReason:
      'Backend public hiện chưa cung cấp dữ liệu đánh giá cho hồ sơ mentor này.',
    bookableMeetingType: toBookableMeetingType(detail.meetingType)
  }
}

export function formatMeetingTypeLabel(meetingType: MentorMeetingType) {
  if (meetingType === 'ONLINE') return 'Online'
  if (meetingType === 'OFFLINE') return 'Offline'

  return 'Hybrid'
}

export function formatTimeLabel(value: string) {
  return value.slice(0, 5)
}

function buildHighlights(
  detail: MentorDetailApiResponse,
  traits: MentorTraitsDetailApiResponse | null
) {
  return unique([
    ...(traits?.highlights.map((item) => item.name) ?? []),
    ...(traits?.personalities.map((item) => item.name) ?? []),
    detail.major,
    detail.currentPosition,
    detail.workplace,
    detail.education
  ]).slice(0, 6)
}

function buildAchievementHighlights(achievements: MentorAchievementDetailApiResponse[]) {
  const normalized = achievements
    .map((item) => formatAchievementSummary(item))
    .filter((item): item is string => Boolean(item))

  return normalized.length
    ? normalized
    : ['Mentor chưa công khai thêm chứng chỉ hoặc thành tích trên hồ sơ này.']
}

function buildExperience(
  detail: MentorDetailApiResponse,
  achievements: MentorAchievementDetailApiResponse[]
) {
  const items: MentorProfileExperienceItem[] = []

  if (detail.currentPosition || detail.workplace || detail.experienceYears !== null) {
    items.push({
      title: detail.currentPosition?.trim() || 'Kinh nghiệm chuyên môn',
      company: detail.workplace?.trim() || null,
      period:
        detail.experienceYears !== null
          ? `${detail.experienceYears} năm kinh nghiệm`
          : 'Mentor chưa công khai thời lượng kinh nghiệm'
    })
  }

  achievements
    .filter((item) => item.achievementType === 'WORK_EXPERIENCE')
    .forEach((item) => {
      items.push({
        title: item.title,
        company: item.issuer?.trim() || null,
        period: formatAchievementDate(item.achievedAt) || 'Mốc thời gian đang cập nhật'
      })
    })

  return dedupeExperience(items)
}

function buildEducation(detail: MentorDetailApiResponse) {
  const degree = detail.education?.trim() || null
  const school = detail.major?.trim() || null

  if (!degree && !school) return []

  return [
    {
      degree: degree || school || 'Thông tin học vấn đang cập nhật',
      school:
        degree && school
          ? school
          : 'Mentor chưa công khai thêm trường học hoặc chuyên ngành chi tiết.'
    }
  ]
}

function buildAvailabilitySummary(
  detail: MentorDetailApiResponse,
  meetingTypes: MentorMeetingType[]
) {
  const locationLabel = [detail.currentLocation.districtName, detail.currentLocation.cityName]
    .filter(Boolean)
    .join(', ')
  const meetingLabel = meetingTypes.map(formatMeetingTypeLabel).join(' / ')

  return (
    [locationLabel, meetingLabel].filter(Boolean).join(' · ') ||
    'Lịch dạy công khai đang được cập nhật thêm.'
  )
}

function formatAchievementSummary(item: MentorAchievementDetailApiResponse) {
  const dateLabel = formatAchievementDate(item.achievedAt)
  const issuer = item.issuer?.trim()
  const typeLabel = formatAchievementType(item.achievementType)

  return [item.title, issuer || typeLabel, dateLabel].filter(Boolean).join(' · ')
}

function formatAchievementDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('vi-VN', { month: '2-digit', year: 'numeric' }).format(date)
}

function formatAchievementType(value: MentorAchievementTypeApiResponse) {
  if (value === 'AWARD') return 'Giải thưởng'
  if (value === 'CERTIFICATE') return 'Chứng chỉ'
  if (value === 'EXAM_SCORE') return 'Thành tích học tập'
  if (value === 'COMPETITION') return 'Cuộc thi'
  if (value === 'PROJECT') return 'Dự án'

  return 'Kinh nghiệm thực tế'
}

function dedupeExperience(items: MentorProfileExperienceItem[]) {
  return items.filter((item, index, allItems) => {
    return (
      allItems.findIndex(
        (candidate) =>
          candidate.title === item.title &&
          candidate.company === item.company &&
          candidate.period === item.period
      ) === index
    )
  })
}

function toBookableMeetingType(
  meetingType: MentorMeetingType | null
): BookingMeetingTypeApiResponse | null {
  if (meetingType === 'ONLINE' || meetingType === 'OFFLINE') return meetingType

  return null
}

function unique<T>(values: Array<T | null | undefined>) {
  return values.filter((value, index, items): value is T => {
    return value !== null && value !== undefined && items.indexOf(value) === index
  })
}
