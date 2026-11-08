import type { MentorAvailabilityDraftValue } from '@/components/MentorAvailabilityForm/MentorAvailabilityForm'
import type { BecomeMentorAvailabilityWindow } from '@/features/become-mentor/become-mentor.types'
import type {
  MentorAvailabilityDetailApiResponse,
  SaveCurrentMentorAvailabilityRequest
} from '@/types/api/mentor'

export function mapMentorAvailabilityToBecomeMentorAvailabilityWindow(
  availability: MentorAvailabilityDetailApiResponse
): BecomeMentorAvailabilityWindow {
  return {
    endTime: availability.endTime.slice(0, 5),
    id: String(availability.id),
    mentorAvailabilityId: availability.id,
    mode: availability.availabilityType,
    selectedDays:
      availability.availabilityType === 'RECURRING' && availability.dayOfWeek
        ? [String(availability.dayOfWeek)]
        : [],
    specificDate:
      availability.availabilityType === 'SPECIFIC_DATE' ? (availability.availableDate ?? '') : '',
    startTime: availability.startTime.slice(0, 5)
  }
}

export function mapAvailabilityDraftToRequests(
  draft: MentorAvailabilityDraftValue,
  mentorAvailabilityId: number | null
) {
  const basePayload = {
    endTime: `${draft.endTime}:00`,
    startTime: `${draft.startTime}:00`
  }

  if (draft.mode === 'RECURRING') {
    return draft.selectedDays.map((dayValue, index) => ({
      availabilityId: index === 0 ? mentorAvailabilityId : null,
      payload: {
        ...basePayload,
        availabilityType: 'RECURRING',
        availableDate: null,
        dayOfWeek: Number(dayValue)
      } satisfies SaveCurrentMentorAvailabilityRequest
    }))
  }

  return [
    {
      availabilityId: mentorAvailabilityId,
      payload: {
        ...basePayload,
        availabilityType: 'SPECIFIC_DATE',
        availableDate: draft.specificDate,
        dayOfWeek: null
      } satisfies SaveCurrentMentorAvailabilityRequest
    }
  ]
}
