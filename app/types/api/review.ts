export type CreateReviewRequest = {
  bookingId: number
  rating: number
  comment?: string
}

export type UpdateReviewRequest = {
  rating: number
  comment?: string
}

export type MentorRatingSummaryResponse = {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<string, number>
}

export type MentorReviewResponse = {
  id: number
  bookingId: number
  studentUserId: number
  studentName: string
  rating: number
  comment: string | null
  createdAt: string
}

export type ReviewDetailResponse = {
  id: number
  bookingId: number
  studentUserId: number
  studentName: string
  mentorId: number
  mentorName: string
  rating: number
  comment: string | null
  createdAt: string
  updatedAt: string
}
