import { useMutation } from '@tanstack/react-query'

import { mediaApi } from '@/services/media.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  MediaAssetApiResponse,
  MediaPurposeApi,
  MediaResourceTypeApi
} from '@/types/api/media'

type UploadMediaMutationVariables = {
  file: File
  purpose: MediaPurposeApi
  resourceType?: MediaResourceTypeApi
  metadata?: Record<string, unknown>
}

type CloudinaryUploadResponse = {
  asset_id?: string
  public_id?: string
  secure_url?: string
  bytes?: number
  width?: number
  height?: number
  version?: number | string
  etag?: string
}

/* Tạo mutation upload media qua intent, upload lên provider và gọi api xác nhận backend. */
export function useUploadMediaMutation() {
  return useMutation({
    mutationFn: async ({
      file,
      metadata,
      purpose,
      resourceType = resolveMediaResourceType(file)
    }: UploadMediaMutationVariables): Promise<ApiResponse<MediaAssetApiResponse>> => {
      const uploadIntentResponse = await mediaApi.createUploadIntent({
        fileSizeBytes: file.size,
        mimeType: file.type || null,
        originalFilename: file.name || null,
        purpose,
        resourceType
      })
      const uploadIntent = uploadIntentResponse.data

      const providerUpload = await uploadToProvider(uploadIntent.uploadUrl, {
        file,
        formFields: uploadIntent.formFields
      })

      return mediaApi.confirmUpload(uploadIntent.mediaAssetId, {
        deliveryUrl: providerUpload.secure_url ?? '',
        etag: providerUpload.etag ?? null,
        fileSizeBytes: providerUpload.bytes ?? file.size,
        height: providerUpload.height ?? null,
        metadataJson: metadata ? JSON.stringify(metadata) : null,
        objectKey: providerUpload.public_id ?? uploadIntent.objectKey,
        providerAssetId:
          providerUpload.asset_id ?? providerUpload.public_id ?? uploadIntent.objectKey,
        version: providerUpload.version === undefined ? null : String(providerUpload.version),
        width: providerUpload.width ?? null
      })
    }
  })
}

/* Gửi file lên provider lưu trữ hoặc trả mock response khi dùng URL giả lập. */
async function uploadToProvider(
  uploadUrl: string,
  {
    file,
    formFields
  }: {
    file: File
    formFields: Record<string, string>
  }
) {
  if (isMockUploadUrl(uploadUrl)) {
    return buildMockUploadResponse(file, formFields)
  }

  const formData = new FormData()

  Object.entries(formFields).forEach(([key, value]) => {
    formData.append(key, value)
  })
  formData.append('file', file)

  const response = await fetch(uploadUrl, {
    body: formData,
    method: 'POST'
  })

  if (!response.ok) {
    throw new Error('Không thể tải tệp lên nhà cung cấp lưu trữ.')
  }

  return (await response.json()) as CloudinaryUploadResponse
}

/* Tạo phản hồi upload giả lập cho môi trường mock. */
function buildMockUploadResponse(
  file: File,
  formFields: Record<string, string>
): CloudinaryUploadResponse {
  const publicId = formFields.public_id ?? `mock/${Date.now()}`

  return {
    asset_id: `mock-asset-${Date.now()}`,
    bytes: file.size,
    public_id: publicId,
    secure_url: `https://example.com/${publicId}.jpg`,
    version: Date.now()
  }
}

/* Kiểm tra upload URL có phải endpoint mock hay không. */
function isMockUploadUrl(uploadUrl: string) {
  return uploadUrl.includes('/mock/')
}

/* Suy ra loại tài nguyên media từ MIME type của file. */
function resolveMediaResourceType(file: File): MediaResourceTypeApi {
  if (file.type.startsWith('image/')) return 'IMAGE'
  if (file.type.startsWith('video/')) return 'VIDEO'

  return 'RAW'
}
