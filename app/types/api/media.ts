export type MediaProviderApiResponse = 'CLOUDINARY' | 'S3' | 'FIREBASE'

export type MediaResourceTypeApi = 'IMAGE' | 'VIDEO' | 'RAW'

export type MediaPurposeApi = 'AVATAR' | 'VERIFICATION' | 'ACHIEVEMENT' | 'REVIEW_ATTACHMENT'

export type MediaAccessTypeApiResponse = 'PUBLIC' | 'PRIVATE'

export type MediaStatusApiResponse = 'PENDING' | 'READY' | 'DELETED'

export type CreateMediaUploadIntentRequest = {
  purpose: MediaPurposeApi
  resourceType: MediaResourceTypeApi
  originalFilename?: string | null
  mimeType?: string | null
  fileSizeBytes?: number | null
}

export type MediaUploadIntentApiResponse = {
  mediaAssetId: number
  provider: string
  uploadUrl: string
  objectKey: string
  formFields: Record<string, string>
}

export type ConfirmMediaUploadRequest = {
  objectKey: string
  providerAssetId: string
  deliveryUrl: string
  fileSizeBytes?: number | null
  width?: number | null
  height?: number | null
  version?: string | null
  etag?: string | null
  metadataJson?: string | null
}

export type MediaAssetApiResponse = {
  id: number
  provider: MediaProviderApiResponse
  objectKey: string
  deliveryUrl: string | null
  resourceType: MediaResourceTypeApi
  mimeType: string | null
  fileSizeBytes: number | null
  width: number | null
  height: number | null
  accessType: MediaAccessTypeApiResponse
  purpose: MediaPurposeApi
  status: MediaStatusApiResponse
}

export type ConfirmMediaUploadMutationVariables = {
  mediaAssetId: number
  payload: ConfirmMediaUploadRequest
}
