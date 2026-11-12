export type ReviewTagOptionResponse = {
  id: number
  code?: string
  name: string
}

export type CreateReviewRequest = {
  bookingId: number
  rating: number
  comment?: string
  tagOptionIds?: number[]
}

export type UpdateReviewRequest = {
  rating: number
  comment?: string
  tagOptionIds?: number[]
}

export type MentorRatingSummaryResponse = {
  mentorId?: number
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<string, number>
}

export type MentorReviewResponse = {
  id: number
  bookingId: number
  studentUserId: number | string
  studentName: string
  mentorId?: number
  rating: number
  comment: string | null
  tags?: ReviewTagOptionResponse[]
  createdAt: string
  updatedAt?: string
}

export type ReviewDetailResponse = {
  id: number
  bookingId: number
  studentUserId: number | string
  studentName: string
  mentorId: number
  mentorName?: string
  rating: number
  comment: string | null
  tags?: ReviewTagOptionResponse[]
  createdAt: string
  updatedAt: string
}
