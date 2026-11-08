import type { MentorCardData, MentorCardMeetingType } from '@/components/MentorCard'
import type { SubjectCardData } from '@/components/SubjectCard'
import { path } from '@/config/path'
import type { CatalogOptionsApiResponse, CatalogSubjectApiResponse } from '@/types/api/catalog'
import type { MentorListItemApiResponse } from '@/types/api/mentor'

const SUBJECT_ICON_RULES: Array<{ icon: string; keywords: string[] }> = [
  { icon: 'Sigma', keywords: ['toán', 'math'] },
  { icon: 'BookOpen', keywords: ['anh', 'english', 'ielts'] },
  { icon: 'Atom', keywords: ['lý', 'physics'] },
  { icon: 'FlaskConical', keywords: ['hóa', 'chemistry'] },
  { icon: 'PenLine', keywords: ['văn', 'literature'] },
  { icon: 'Code2', keywords: ['lập trình', 'code', 'programming', 'tin học'] },
  { icon: 'Dna', keywords: ['sinh', 'biology'] },
  { icon: 'Globe2', keywords: ['địa', 'geography'] },
  { icon: 'Landmark', keywords: ['sử', 'history'] }
]

export function mapCatalogSubjectToHomeCard(
  subject: CatalogSubjectApiResponse,
  catalogOptions: CatalogOptionsApiResponse
): SubjectCardData {
  const category = catalogOptions.categories.find((item) => item.id === subject.categoryId)
  const params = new URLSearchParams({
    search: subject.name,
    subjectId: String(subject.id)
  })

  return {
    id: String(subject.id),
    name: subject.name,
    icon: resolveSubjectIcon(subject.name, category?.name),
    description:
      subject.description?.trim() ||
      (category?.name
        ? `Thuộc nhóm ${category.name.toLowerCase()} trong danh mục môn học hiện có.`
        : 'Danh mục môn học đang được cập nhật thêm thông tin mô tả.'),
    badgeLabel: category?.name ?? 'Danh mục môn học',
    href: `${path.discover}?${params.toString()}`
  }
}

export function mapFeaturedMentorToCard(mentor: MentorListItemApiResponse): MentorCardData {
  const meetingTypes = unique(
    [mentor.meetingType].filter((value): value is MentorCardMeetingType => Boolean(value))
  )
  const highlights = unique([mentor.currentPosition, mentor.workplace, mentor.education]).slice(
    0,
    3
  )

  return {
    id: String(mentor.id),
    name: mentor.fullName,
    avatarUrl: mentor.avatarUrl,
    experienceYears: mentor.experienceYears,
    headline:
      mentor.headline?.trim() ||
      [mentor.currentPosition, mentor.workplace].filter(Boolean).join(' · ') ||
      'Mentor công khai đang sẵn sàng cho học viên mới.',
    approvalStatus: 'APPROVED',
    verificationStatus: null,
    rating: null,
    reviewsCount: null,
    responseTime: null,
    activeStudentsCount: null,
    startingPrice: mentor.minPrice,
    expertise:
      mentor.headline?.trim() ||
      [mentor.currentPosition, mentor.workplace, mentor.education].filter(Boolean).join(' · ') ||
      'Thông tin giới thiệu chi tiết đang được cập nhật trong hồ sơ mentor.',
    highlights,
    subjects: [],
    grades: [],
    meetingTypes,
    availabilitySummary:
      meetingTypes.map(formatMeetingType).join(' / ') || 'Xem lịch chi tiết trong hồ sơ mentor.',
    offerings: [],
    specificDateAvailability: []
  }
}

function resolveSubjectIcon(subjectName: string, categoryName?: string) {
  const haystack = `${subjectName} ${categoryName ?? ''}`.toLowerCase()

  return (
    SUBJECT_ICON_RULES.find((rule) => rule.keywords.some((keyword) => haystack.includes(keyword)))
      ?.icon ?? 'BookOpen'
  )
}

function formatMeetingType(meetingType: MentorCardMeetingType) {
  if (meetingType === 'ONLINE') return 'Online'
  if (meetingType === 'OFFLINE') return 'Offline'

  return 'Hybrid'
}

function unique<T>(values: Array<T | null | undefined>) {
  return values.filter((value, index, items): value is T => {
    return value !== null && value !== undefined && items.indexOf(value) === index
  })
}
