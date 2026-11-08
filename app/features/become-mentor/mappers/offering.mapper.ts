import type { BecomeMentorOffering } from '@/features/become-mentor/become-mentor.types'
import type { BecomeMentorOfferingFormValues } from '@/features/become-mentor/schemas'
import type {
  MentorProficiencyLevelApiResponse,
  MentorSubjectDetailApiResponse,
  UpsertCurrentMentorSubjectRequest
} from '@/types/api/mentor'

const defaultProficiencyLevel = 'INTERMEDIATE' satisfies MentorProficiencyLevelApiResponse

export function mapMentorSubjectToBecomeMentorOffering(
  subject: MentorSubjectDetailApiResponse
): BecomeMentorOffering {
  return {
    gradeId: String(subject.gradeId),
    gradeLevel: formatGradeLabel(subject.gradeName),
    id: String(subject.id),
    mentorSubjectId: subject.id,
    pricePerHour: String(subject.pricePerHour),
    subject: subject.subjectName,
    subjectGradeId: String(subject.subjectGradeId),
    subjectId: String(subject.subjectId),
    teachingNote: subject.teachingNote ?? ''
  }
}

export function mapOfferingFormValuesToRequest(
  values: BecomeMentorOfferingFormValues,
  mentorSubjectId: number | null
): UpsertCurrentMentorSubjectRequest {
  return {
    active: true,
    id: mentorSubjectId,
    pricePerHour: Number(values.pricePerHour.replace(/\D/g, '')),
    proficiencyLevel: defaultProficiencyLevel,
    subjectGradeId: Number(values.subjectGradeId),
    teachingNote: values.teachingNote.trim() || null
  }
}

export function formatGradeLabel(value: string) {
  return value.replace(/^Lop\s+/i, 'Lớp ')
}
