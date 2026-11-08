import { useMutation } from '@tanstack/react-query'

import { mediaApi } from '@/services/media.api'
import type { ApiResponse } from '@/types/api/common'
import type { ConfirmMediaUploadMutationVariables, MediaAssetApiResponse } from '@/types/api/media'

export function useConfirmMediaUploadMutation() {
  return useMutation({
    mutationFn: async ({
      mediaAssetId,
      payload
    }: ConfirmMediaUploadMutationVariables): Promise<ApiResponse<MediaAssetApiResponse>> =>
      mediaApi.confirmUpload(mediaAssetId, payload)
  })
}
