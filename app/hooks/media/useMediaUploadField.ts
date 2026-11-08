import axios from 'axios'
import type { ChangeEvent } from 'react'
import { useState } from 'react'

import { useUploadMediaMutation } from '@/hooks/queries/media/useUploadMediaMutation'
import type { ErrorResponse } from '@/types/api/common'
import type { MediaPurposeApi, MediaResourceTypeApi } from '@/types/api/media'

export type MediaUploadFieldValue = {
  fileName: string
  mediaId: number | null
  previewUrl: string
}

type UseMediaUploadFieldParams = {
  initialValue?: MediaUploadFieldValue
  purpose: MediaPurposeApi
  resourceType?: MediaResourceTypeApi
}

const emptyMediaUploadFieldValue: MediaUploadFieldValue = {
  fileName: '',
  mediaId: null,
  previewUrl: ''
}

/* Quản lý một field upload ảnh: preview, upload, mediaId, clear và lỗi. */
export function useMediaUploadField({
  initialValue = emptyMediaUploadFieldValue,
  purpose,
  resourceType = 'IMAGE'
}: UseMediaUploadFieldParams) {
  const [value, setValue] = useState<MediaUploadFieldValue>(initialValue)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const uploadMediaMutation = useUploadMediaMutation()

  const syncValue = (nextValue: MediaUploadFieldValue) => {
    setValue(nextValue)
    setErrorMessage(null)
  }

  const clear = () => {
    setValue(emptyMediaUploadFieldValue)
    setErrorMessage(null)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setErrorMessage(null)

    const localPreviewUrl = await readFileAsDataUrl(file)

    setValue({
      fileName: file.name,
      mediaId: null,
      previewUrl: localPreviewUrl
    })

    try {
      const uploadResponse = await uploadMediaMutation.mutateAsync({
        file,
        purpose,
        resourceType
      })

      setValue({
        fileName: file.name,
        mediaId: uploadResponse.data.id,
        previewUrl: uploadResponse.data.deliveryUrl ?? localPreviewUrl
      })
    } catch (error) {
      const nextErrorMessage = getMediaUploadErrorMessage(error)

      setErrorMessage(nextErrorMessage)
      throw error
    } finally {
      event.target.value = ''
    }
  }

  return {
    clear,
    errorMessage,
    handleFileChange,
    isUploading: uploadMediaMutation.isPending,
    setErrorMessage,
    syncValue,
    value
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      resolve(typeof reader.result === 'string' ? reader.result : '')
    }
    reader.onerror = () => {
      reject(new Error('Không thể đọc tệp đã chọn.'))
    }
    reader.readAsDataURL(file)
  })
}

function getMediaUploadErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'

    return error.response.data?.message || 'Không thể tải ảnh lên lúc này.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Không thể tải ảnh lên lúc này.'
}
