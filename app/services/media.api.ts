import { env } from '@/config/env'
import http from '@/libs/http'
import { mockMediaApi } from '@/services/mock/media.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  ConfirmMediaUploadRequest,
  CreateMediaUploadIntentRequest,
  MediaAssetApiResponse,
  MediaUploadIntentApiResponse
} from '@/types/api/media'

const MEDIA_ENDPOINTS = {
  uploadIntents: 'media/upload-intents',
  confirmUpload: (mediaAssetId: number) => `media/${mediaAssetId}/confirm`
} as const

const defaultMediaApi = {
  createUploadIntent: async (
    payload: CreateMediaUploadIntentRequest
  ): Promise<ApiResponse<MediaUploadIntentApiResponse>> =>
    (
      await http.post<ApiResponse<MediaUploadIntentApiResponse>>(
        MEDIA_ENDPOINTS.uploadIntents,
        payload
      )
    ).data,

  confirmUpload: async (
    mediaAssetId: number,
    payload: ConfirmMediaUploadRequest
  ): Promise<ApiResponse<MediaAssetApiResponse>> =>
    (
      await http.post<ApiResponse<MediaAssetApiResponse>>(
        MEDIA_ENDPOINTS.confirmUpload(mediaAssetId),
        payload
      )
    ).data
}

export const mediaApi = env.useMock ? mockMediaApi : defaultMediaApi
