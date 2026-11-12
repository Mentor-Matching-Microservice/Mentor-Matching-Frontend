import type { ApiResponse } from '@/types/api/common'
import type {
  ConfirmMediaUploadRequest,
  CreateMediaUploadIntentRequest,
  MediaAssetApiResponse,
  MediaUploadIntentApiResponse
} from '@/types/api/media'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

function buildCreatedResponse<T>(data: T, message = 'Created'): ApiResponse<T> {
  return {
    status: 201,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

export const mockMediaApi = {
  async createUploadIntent(
    payload: CreateMediaUploadIntentRequest
  ): Promise<ApiResponse<MediaUploadIntentApiResponse>> {
    await delay()

    const mediaAssetId = Date.now()
    const objectKey = `mock/users/current/${payload.purpose.toLowerCase()}/${mediaAssetId}`

    return buildCreatedResponse(
      {
        mediaAssetId,
        provider: 'CLOUDINARY',
        uploadUrl: 'https://api.cloudinary.com/v1_1/mock/image/upload',
        objectKey,
        formFields: {
          api_key: 'mock-api-key',
          public_id: objectKey,
          timestamp: String(Math.floor(Date.now() / 1000)),
          signature: 'mock-signature'
        }
      },
      'Create media upload intent successfully'
    )
  },

  async confirmUpload(
    mediaAssetId: number | string,
    payload: ConfirmMediaUploadRequest
  ): Promise<ApiResponse<MediaAssetApiResponse>> {
    await delay()
    const numericId = Number.isFinite(Number(mediaAssetId)) ? Number(mediaAssetId) : Date.now()

    return buildSuccessResponse(
      {
        id: numericId,
        assetId: String(mediaAssetId),
        provider: 'CLOUDINARY',
        objectKey: payload.objectKey,
        deliveryUrl: payload.deliveryUrl,
        resourceType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileSizeBytes: payload.fileSizeBytes ?? null,
        width: payload.width ?? null,
        height: payload.height ?? null,
        accessType: 'PUBLIC',
        purpose: 'AVATAR',
        status: 'READY'
      },
      'Confirm media upload successfully'
    )
  },

  async getSignedUrl(mediaAssetId: number | string): Promise<ApiResponse<{ url: string }>> {
    await delay()

    return buildSuccessResponse(
      {
        url: `https://example.com/mock/signed/${mediaAssetId}.jpg`
      },
      'Get signed URL successfully'
    )
  },

  async deleteMedia(): Promise<ApiResponse<null>> {
    await delay()

    return buildSuccessResponse(null, 'Delete media successfully')
  }
}
