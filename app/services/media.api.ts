import { env } from '@/config/env'
import http from '@/libs/http'
import { mockMediaApi } from '@/services/mock/media.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  ConfirmMediaUploadRequest,
  CreateMediaUploadIntentRequest,
  MediaAccessTypeApiResponse,
  MediaAssetApiResponse,
  MediaProviderApiResponse,
  MediaPurposeApi,
  MediaResourceTypeApi,
  MediaStatusApiResponse,
  MediaUploadIntentApiResponse
} from '@/types/api/media'

const MEDIA_ENDPOINTS = {
  uploadIntents: 'media/upload-intents',
  confirmUpload: (mediaAssetId: number | string) => `media/${mediaAssetId}/confirm`,
  signedUrl: (mediaAssetId: number | string) => `media/${mediaAssetId}/signed-url`,
  deleteMedia: (mediaAssetId: number | string) => `media/${mediaAssetId}`
} as const

function toNumericId(rawId: unknown): number {
  const parsed = Number(rawId)
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }

  const str = String(rawId ?? '')
  let hash = 0
  for (let index = 0; index < str.length; index += 1) {
    hash = (hash * 31 + str.charCodeAt(index)) % 2147483647
  }

  return Math.max(1, Math.abs(hash))
}

function unwrapPayload(responseBody: unknown): Record<string, unknown> {
  if (!responseBody || typeof responseBody !== 'object') {
    return {}
  }

  const record = responseBody as Record<string, unknown>
  if (record.data && typeof record.data === 'object' && !Array.isArray(record.data)) {
    return record.data as Record<string, unknown>
  }

  return record
}

function buildUploadFormFields(raw: Record<string, unknown>): Record<string, string> {
  const fieldsSource = (raw.fields || raw.formFields) as Record<string, unknown> | undefined
  if (fieldsSource && typeof fieldsSource === 'object' && !Array.isArray(fieldsSource)) {
    const normalized: Record<string, string> = {}
    Object.entries(fieldsSource).forEach(([key, value]) => {
      if (value !== undefined && value !== null && String(value) !== '') {
        normalized[key] = String(value)
      }
    })
    return normalized
  }

  const candidates: Record<string, unknown> = {
    api_key: raw.apiKey ?? raw.api_key,
    timestamp: raw.timestamp,
    signature: raw.signature,
    public_id: raw.publicId ?? raw.public_id ?? raw.objectKey,
    folder: raw.folder,
    type: raw.deliveryType ?? raw.type
  }

  const formFields: Record<string, string> = {}
  Object.entries(candidates).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value) !== '') {
      formFields[key] = String(value)
    }
  })

  return formFields
}

const defaultMediaApi = {
  createUploadIntent: async (
    payload: CreateMediaUploadIntentRequest
  ): Promise<ApiResponse<MediaUploadIntentApiResponse>> => {
    const requestBody = {
      purpose: payload.purpose,
      resourceType: payload.resourceType,
      originalFilename: payload.originalFilename?.trim() || 'upload.jpg',
      mimeType: payload.mimeType?.trim() || 'image/jpeg',
      fileSizeBytes: payload.fileSizeBytes && payload.fileSizeBytes > 0 ? payload.fileSizeBytes : 1
    }

    const response = await http.post<unknown>(MEDIA_ENDPOINTS.uploadIntents, requestBody)
    const raw = unwrapPayload(response.data)
    const mediaAssetId = (raw.mediaAssetId ?? raw.assetId ?? raw.id ?? Date.now()) as
      | number
      | string
    const objectKey = String(raw.objectKey ?? raw.publicId ?? mediaAssetId)
    const uploadUrl = String(raw.uploadUrl ?? '')

    return {
      status: 201,
      code: 'CREATED',
      success: true,
      message: 'Create media upload intent successfully',
      data: {
        mediaAssetId,
        provider: String(raw.provider ?? 'CLOUDINARY'),
        uploadUrl,
        objectKey,
        formFields: buildUploadFormFields(raw)
      }
    }
  },

  confirmUpload: async (
    mediaAssetId: number | string,
    payload: ConfirmMediaUploadRequest
  ): Promise<ApiResponse<MediaAssetApiResponse>> => {
    const assetId = payload.assetId || payload.providerAssetId || payload.objectKey
    const response = await http.post<unknown>(MEDIA_ENDPOINTS.confirmUpload(mediaAssetId), {
      ...payload,
      assetId
    })
    const raw = unwrapPayload(response.data)
    const resolvedAssetId = String(raw.id ?? mediaAssetId)
    const accessType = ((raw.accessType as string) ?? 'PUBLIC') as MediaAccessTypeApiResponse
    let deliveryUrl =
      ((raw.deliveryUrl ?? raw.secureUrl) as string | null | undefined) ||
      payload.deliveryUrl ||
      null

    if (!deliveryUrl && resolvedAssetId) {
      try {
        const signedRes = await defaultMediaApi.getSignedUrl(resolvedAssetId)
        deliveryUrl = signedRes.data.url || null
      } catch {
        // Keep fallback deliveryUrl if signed-url is unavailable
      }
    }

    return {
      status: 200,
      code: 'SUCCESS',
      success: true,
      message: 'Confirm media upload successfully',
      data: {
        id: toNumericId(raw.id ?? mediaAssetId),
        assetId: resolvedAssetId,
        provider: ((raw.provider as string) ?? 'CLOUDINARY') as MediaProviderApiResponse,
        objectKey: String(raw.objectKey ?? raw.publicId ?? payload.objectKey),
        deliveryUrl,
        resourceType: ((raw.resourceType as string) ?? 'IMAGE') as MediaResourceTypeApi,
        mimeType: (raw.mimeType as string | null) ?? null,
        fileSizeBytes: Number(raw.fileSizeBytes ?? raw.size ?? payload.fileSizeBytes ?? 0) || null,
        width: (raw.width as number | null) ?? payload.width ?? null,
        height: (raw.height as number | null) ?? payload.height ?? null,
        accessType,
        purpose: ((raw.purpose as string) ?? 'AVATAR') as MediaPurposeApi,
        status: ((raw.status as string) ?? 'READY') as MediaStatusApiResponse
      }
    }
  },

  getSignedUrl: async (mediaAssetId: number | string): Promise<ApiResponse<{ url: string }>> => {
    const response = await http.get<unknown>(MEDIA_ENDPOINTS.signedUrl(mediaAssetId))
    const raw = unwrapPayload(response.data)

    return {
      status: 200,
      code: 'SUCCESS',
      success: true,
      message: 'Get signed URL successfully',
      data: {
        url: String(raw.url ?? '')
      }
    }
  },

  deleteMedia: async (mediaAssetId: number | string): Promise<ApiResponse<null>> => {
    await http.delete(MEDIA_ENDPOINTS.deleteMedia(mediaAssetId))

    return {
      status: 200,
      code: 'SUCCESS',
      success: true,
      message: 'Delete media successfully',
      data: null
    }
  }
}

export const mediaApi = env.useMock ? mockMediaApi : defaultMediaApi
