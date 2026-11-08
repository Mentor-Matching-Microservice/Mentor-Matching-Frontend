import http from '@/libs/http'

import type { ApiResponse, PageQueryParams, PageResponse } from '@/types/api/common'
import type {
  CreateReviewRequest,
  MentorRatingSummaryResponse,
  MentorReviewResponse,
  ReviewDetailResponse,
  UpdateReviewRequest
} from '@/types/api/review'

const REVIEW_API_URL = 'reviews'

export const reviewApi = {
  getMyReviews: async () => {
    const response = await http.get<ApiResponse<ReviewDetailResponse[]>>(`${REVIEW_API_URL}/me`)
    return response.data
  },

  createReview: async (payload: CreateReviewRequest) => {
    const response = await http.post<ApiResponse<{ reviewId: number }>>(REVIEW_API_URL, payload)
    return response.data
  },

  getReviewDetail: async (id: number) => {
    const response = await http.get<ApiResponse<MentorReviewResponse>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  },

  getMentorReviews: async (mentorId: number, params?: PageQueryParams) => {
    const response = await http.get<ApiResponse<PageResponse<MentorReviewResponse>>>(
      `${REVIEW_API_URL}/mentor/${mentorId}`,
      { params }
    )
    return response.data
  },

  getMentorRatingSummary: async (mentorId: number) => {
    const response = await http.get<ApiResponse<MentorRatingSummaryResponse>>(
      `${REVIEW_API_URL}/mentor/${mentorId}/summary`
    )
    return response.data
  },

  updateReview: async (id: number, payload: UpdateReviewRequest) => {
    const response = await http.put<ApiResponse<void>>(`${REVIEW_API_URL}/${id}`, payload)
    return response.data
  },

  deleteReview: async (id: number) => {
    const response = await http.delete<ApiResponse<void>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  }
}
