import { useMutation } from '@tanstack/react-query'

import { mediaApi } from '@/services/media.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  CreateMediaUploadIntentRequest,
  MediaUploadIntentApiResponse
} from '@/types/api/media'

export function useCreateMediaUploadIntentMutation() {
  return useMutation({
    mutationFn: async (
      payload: CreateMediaUploadIntentRequest
    ): Promise<ApiResponse<MediaUploadIntentApiResponse>> => mediaApi.createUploadIntent(payload)
  })
}
