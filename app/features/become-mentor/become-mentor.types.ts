export type BecomeMentorStepId = 'profile' | 'offerings' | 'availability' | 'verification'

export type BecomeMentorStepStatus = 'done' | 'current' | 'upcoming'

export type BecomeMentorAvailabilityMode = 'RECURRING' | 'SPECIFIC_DATE'

export type BecomeMentorDocumentKey = 'idFront' | 'idBack' | 'selfieWithId'

export type BecomeMentorDocumentValue = {
  fileName: string
  mediaId: number | null
  previewUrl: string
}

export type BecomeMentorOffering = {
  id: string
  gradeLevel: string
  gradeId: string
  mentorSubjectId: number | null
  pricePerHour: string
  subject: string
  subjectGradeId: string
  subjectId: string
  teachingNote: string
}

export type BecomeMentorAvailabilityWindow = {
  id: string
  mentorAvailabilityId: number | null
  mode: BecomeMentorAvailabilityMode
  selectedDays: string[]
  specificDate: string
  startTime: string
  endTime: string
}

export type BecomeMentorFormState = {
  avatarUrl: string
  avatarMediaId: number | null
  fullName: string
  gender: string
  hometownCityId: string
  hometown: string
  currentCityId: string
  currentDistrictId: string
  currentLocation: string
  headline: string
  introduction: string
  teachingStyle: string
  experienceYears: string
  currentPosition: string
  workplace: string
  education: string
  major: string
  meetingType: string
  offerings: BecomeMentorOffering[]
  availabilities: BecomeMentorAvailabilityWindow[]
  verificationFullName: string
  idCardNumber: string
  documents: Record<BecomeMentorDocumentKey, BecomeMentorDocumentValue>
}

export type BecomeMentorStep = {
  id: BecomeMentorStepId
  href: string
  label: string
  description: string
  status: BecomeMentorStepStatus
}

export type BecomeMentorReadinessItem = {
  id: BecomeMentorStepId
  label: string
  helper: string
  done: boolean
}
