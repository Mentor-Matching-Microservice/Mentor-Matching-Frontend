export interface Review {
  name: string
  rating: number
  text: string
  tags?: string[]
}

export interface Experience {
  title: string
  company: string
  period: string
}

export interface Education {
  degree: string
  school: string
}

export type MentorApprovalStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
export type MentorVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
export type MeetingType = 'ONLINE' | 'OFFLINE' | 'HYBRID'
export type MentorOfferingProficiency = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export interface WeeklyAvailabilityWindow {
  dayLabel: string
  startTime: string
  endTime: string
  meetingTypes: MeetingType[]
}

export interface SpecificDateAvailabilityWindow {
  dateLabel: string
  startTime: string
  endTime: string
  meetingTypes: MeetingType[]
  note?: string
}

export interface MentorOffering {
  id: string
  subject: string
  grade: string
  proficiency: MentorOfferingProficiency
  pricePerHour: number
  active: boolean
  teachingNote: string
}

export interface Mentor {
  id: string
  name: string
  headline: string
  approvalStatus: MentorApprovalStatus
  verificationStatus: MentorVerificationStatus
  rating: number
  reviewsCount: number
  responseTime: string
  activeStudentsCount: number
  startingPrice: number
  expertise: string
  highlights: string[]
  introduction: string
  subjects: string[]
  grades: string[]
  meetingTypes: MeetingType[]
  availabilitySummary: string
  teachingStyle: string
  achievements: string[]
  offerings: MentorOffering[]
  recurringAvailability: WeeklyAvailabilityWindow[]
  specificDateAvailability: SpecificDateAvailabilityWindow[]
  experience: Experience[]
  education: Education[]
  reviews: Review[]
}
