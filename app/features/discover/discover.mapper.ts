import type { MentorCardData, MentorCardMeetingType } from '@/components/MentorCard'
import type { MentorListItemApiResponse } from '@/types/api/mentor'

export function mapDiscoverMentorToCard(mentor: MentorListItemApiResponse): MentorCardData {
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
    approvalStatus: null,
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
