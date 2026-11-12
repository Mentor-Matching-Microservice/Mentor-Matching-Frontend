import http from '@/libs/http'

import type { ApiResponse, PageQueryParams, PageResponse } from '@/types/api/common'
import type {
  CreateReviewRequest,
  MentorRatingSummaryResponse,
  MentorReviewResponse,
  ReviewDetailResponse,
  ReviewTagOptionResponse,
  UpdateReviewRequest
} from '@/types/api/review'

type RawSpringReviewPage = {
  data?: MentorReviewResponse[]
  content?: MentorReviewResponse[]
  page?: number
  number?: number
  pageSize?: number
  size?: number
  totalPages?: number
  totalItems?: number
  totalElements?: number
}

const REVIEW_API_URL = 'reviews'

function normalizeMentorReviewPage(
  rawPage: RawSpringReviewPage | null | undefined,
  fallbackPage = 1,
  fallbackSize = 10
): PageResponse<MentorReviewResponse> {
  const items = rawPage?.data ?? rawPage?.content ?? []
  const page =
    typeof rawPage?.page === 'number'
      ? rawPage.page
      : typeof rawPage?.number === 'number'
        ? rawPage.number + 1
        : fallbackPage
  const pageSize = rawPage?.pageSize ?? rawPage?.size ?? fallbackSize
  const totalItems = rawPage?.totalItems ?? rawPage?.totalElements ?? items.length
  const totalPages =
    rawPage?.totalPages ?? Math.max(1, Math.ceil(totalItems / Math.max(1, pageSize)))

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    data: items
  }
}

export const reviewApi = {
  getMyReviews: async () => {
    const response = await http.get<ApiResponse<ReviewDetailResponse[]>>(`${REVIEW_API_URL}/me`)
    return response.data
  },

  createReview: async (payload: CreateReviewRequest) => {
    const response = await http.post<
      ApiResponse<ReviewDetailResponse & { reviewId?: number }>
    >(REVIEW_API_URL, payload)
    const rawData = response.data.data
    const resolvedId = Number(rawData?.reviewId ?? rawData?.id ?? 0)

    return {
      ...response.data,
      data: {
        ...rawData,
        id: resolvedId,
        reviewId: resolvedId
      }
    }
  },

  getReviewDetail: async (id: number) => {
    const response = await http.get<ApiResponse<MentorReviewResponse>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  },

  getMentorReviews: async (mentorId: number, params?: PageQueryParams) => {
    const requestedPage = params?.page ?? 1
    const requestedSize = params?.size ?? 10
    const response = await http.get<ApiResponse<RawSpringReviewPage>>(
      `${REVIEW_API_URL}/mentor/${mentorId}`,
      {
        params: {
          ...params,
          page: Math.max(requestedPage - 1, 0),
          size: requestedSize
        }
      }
    )

    return {
      ...response.data,
      data: normalizeMentorReviewPage(response.data.data, requestedPage, requestedSize)
    }
  },

  getMentorRatingSummary: async (mentorId: number) => {
    const response = await http.get<ApiResponse<MentorRatingSummaryResponse>>(
      `${REVIEW_API_URL}/mentor/${mentorId}/summary`
    )
    const raw = response.data.data

    return {
      ...response.data,
      data: {
        ...raw,
        averageRating: Number(raw?.averageRating ?? 0),
        totalReviews: Number(raw?.totalReviews ?? 0),
        ratingDistribution: raw?.ratingDistribution ?? {}
      }
    }
  },

  getTagOptions: async () => {
    const response = await http.get<ApiResponse<ReviewTagOptionResponse[]>>(
      `${REVIEW_API_URL}/tag-options`
    )
    return response.data
  },

  updateReview: async (id: number, payload: UpdateReviewRequest) => {
    const response = await http.put<ApiResponse<ReviewDetailResponse | void>>(
      `${REVIEW_API_URL}/${id}`,
      payload
    )
    return response.data
  },

  deleteReview: async (id: number) => {
    const response = await http.delete<ApiResponse<void>>(`${REVIEW_API_URL}/${id}`)
    return response.data
  }
}
