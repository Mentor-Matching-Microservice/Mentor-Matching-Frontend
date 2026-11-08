import type { BecomeMentorProfileFormValues } from '@/features/become-mentor/schemas'
import type { Gender } from '@/types/api/common'
import type {
  CurrentMentorApiResponse,
  MentorMeetingType,
  UpdateCurrentMentorRequest
} from '@/types/api/mentor'

export const emptyBecomeMentorProfileFormValues: BecomeMentorProfileFormValues = {
  currentCityId: '',
  currentDistrictId: '',
  currentPosition: '',
  education: '',
  experienceYears: '',
  fullName: '',
  gender: '',
  headline: '',
  hometownCityId: '',
  introduction: '',
  major: '',
  meetingType: '',
  teachingStyle: '',
  workplace: ''
}

export function mapCurrentMentorToBecomeMentorProfileFormValues(
  currentMentor: CurrentMentorApiResponse
): BecomeMentorProfileFormValues {
  return {
    currentCityId: currentMentor.currentLocation.cityId
      ? String(currentMentor.currentLocation.cityId)
      : '',
    currentDistrictId: currentMentor.currentLocation.districtId
      ? String(currentMentor.currentLocation.districtId)
      : '',
    currentPosition: currentMentor.currentPosition ?? '',
    education: currentMentor.education ?? '',
    experienceYears:
      currentMentor.experienceYears === null ? '' : String(currentMentor.experienceYears),
    fullName: currentMentor.fullName ?? '',
    gender: currentMentor.gender ?? '',
    headline: currentMentor.headline ?? '',
    hometownCityId: currentMentor.hometown.cityId ? String(currentMentor.hometown.cityId) : '',
    introduction: currentMentor.introduction ?? '',
    major: currentMentor.major ?? '',
    meetingType: currentMentor.meetingType ?? '',
    teachingStyle: currentMentor.teachingStyle ?? '',
    workplace: currentMentor.workplace ?? ''
  }
}

export function mapBecomeMentorProfileFormValuesToRequest(
  values: BecomeMentorProfileFormValues
): UpdateCurrentMentorRequest {
  return {
    currentDistrictId: toNullableNumber(values.currentDistrictId),
    currentPosition: toNullableString(values.currentPosition),
    education: toNullableString(values.education),
    experienceYears: toNullableNumber(values.experienceYears),
    gender: values.gender ? (values.gender as Gender) : null,
    headline: toNullableString(values.headline),
    hometownCityId: toNullableNumber(values.hometownCityId),
    introduction: toNullableString(values.introduction),
    major: toNullableString(values.major),
    meetingType: values.meetingType ? (values.meetingType as MentorMeetingType) : null,
    teachingStyle: toNullableString(values.teachingStyle),
    workplace: toNullableString(values.workplace)
  }
}

function toNullableNumber(value: string | undefined) {
  if (!value) return null

  const numericValue = Number(value)

  return Number.isNaN(numericValue) ? null : numericValue
}

function toNullableString(value: string | undefined) {
  const normalizedValue = value?.trim()

  return normalizedValue ? normalizedValue : null
}
