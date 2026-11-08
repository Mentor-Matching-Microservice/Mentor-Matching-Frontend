import axios from 'axios'
import type { ChangeEvent } from 'react'
import { useEffect, useEffectEvent, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import { useMediaUploadField } from '@/hooks/media/useMediaUploadField'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorVerificationQuery } from '@/hooks/queries/mentor/useCurrentMentorVerificationQuery'
import { useUpsertCurrentMentorVerificationMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorVerificationMutation'
import type { ErrorResponse } from '@/types/api/common'
import type { CurrentMentorVerificationApiResponse } from '@/types/api/mentor'

import type { BecomeMentorDocumentKey, BecomeMentorFormState } from '../become-mentor.types'
import {
  becomeMentorVerificationSchema,
  type BecomeMentorVerificationFormValues
} from '../schemas/verification.schema'

type UseBecomeMentorVerificationFormParams = {
  documents: BecomeMentorFormState['documents']
  idCardNumber: string
  onHydrate?: (
    values: BecomeMentorVerificationFormValues,
    verification: CurrentMentorVerificationApiResponse
  ) => void
  onSubmit: (
    values: BecomeMentorVerificationFormValues,
    verification: CurrentMentorVerificationApiResponse
  ) => Promise<void> | void
  verificationFullName: string
}

/* Quản lý form xác minh danh tính, tải dữ liệu đã có, upload ảnh và gửi request xác minh. */
export function useBecomeMentorVerificationForm({
  documents,
  idCardNumber,
  onHydrate,
  onSubmit,
  verificationFullName
}: UseBecomeMentorVerificationFormParams) {
  const [uploadingDocumentKey, setUploadingDocumentKey] = useState<BecomeMentorDocumentKey | null>(
    null
  )
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchCurrentVerification = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const currentMentorVerificationQuery = useCurrentMentorVerificationQuery(
    shouldFetchCurrentVerification
  )
  const upsertCurrentMentorVerificationMutation = useUpsertCurrentMentorVerificationMutation()
  const idFrontField = useMediaUploadField({
    initialValue: documents.idFront,
    purpose: 'VERIFICATION'
  })
  const idBackField = useMediaUploadField({
    initialValue: documents.idBack,
    purpose: 'VERIFICATION'
  })
  const selfieWithIdField = useMediaUploadField({
    initialValue: documents.selfieWithId,
    purpose: 'VERIFICATION'
  })
  const form = useForm<BecomeMentorVerificationFormValues>({
    resolver: zodResolver(becomeMentorVerificationSchema),
    defaultValues: {
      documents,
      idCardNumber,
      verificationFullName
    }
  })
  const hydrateState = useEffectEvent(
    (
      values: BecomeMentorVerificationFormValues,
      verification: CurrentMentorVerificationApiResponse
    ) => {
      onHydrate?.(values, verification)
    }
  )
  const hydrateDocumentFields = useEffectEvent((values: BecomeMentorVerificationFormValues) => {
    idFrontField.syncValue(values.documents.idFront)
    idBackField.syncValue(values.documents.idBack)
    selfieWithIdField.syncValue(values.documents.selfieWithId)
  })
  const watchedVerificationFullName = useWatch({
    control: form.control,
    name: 'verificationFullName'
  })
  const watchedIdCardNumber = useWatch({ control: form.control, name: 'idCardNumber' })
  const verificationStatus = currentMentorVerificationQuery.data?.verificationStatus ?? 'UNVERIFIED'
  const rejectionReason = currentMentorVerificationQuery.data?.rejectionReason ?? null
  const requiresProfile = onboardingStatusQuery.data
    ? !onboardingStatusQuery.data.mentorProfileCreated
    : false
  const isLocked = verificationStatus === 'PENDING' || verificationStatus === 'VERIFIED'
  const isLoading =
    onboardingStatusQuery.isLoading ||
    (shouldFetchCurrentVerification && currentMentorVerificationQuery.isLoading)
  const isError =
    onboardingStatusQuery.isError ||
    (shouldFetchCurrentVerification && currentMentorVerificationQuery.isError)
  const isSubmitting =
    upsertCurrentMentorVerificationMutation.isPending ||
    idFrontField.isUploading ||
    idBackField.isUploading ||
    selfieWithIdField.isUploading
  const canSubmit =
    !requiresProfile &&
    !isLocked &&
    !uploadingDocumentKey &&
    Boolean(
      watchedVerificationFullName.trim() &&
      watchedIdCardNumber.trim() &&
      idFrontField.value.mediaId &&
      idBackField.value.mediaId
    )

  useEffect(() => {
    if (!currentMentorVerificationQuery.data) return

    const nextValues = mapCurrentMentorVerificationToFormValues(currentMentorVerificationQuery.data)

    form.reset(nextValues)
    hydrateDocumentFields(nextValues)
    hydrateState(nextValues, currentMentorVerificationQuery.data)
  }, [currentMentorVerificationQuery.data, form])

  useEffect(() => {
    form.setValue('documents.idFront', idFrontField.value, { shouldValidate: false })
  }, [form, idFrontField.value])

  useEffect(() => {
    form.setValue('documents.idBack', idBackField.value, { shouldValidate: false })
  }, [form, idBackField.value])

  useEffect(() => {
    form.setValue('documents.selfieWithId', selfieWithIdField.value, { shouldValidate: false })
  }, [form, selfieWithIdField.value])

  /* Chọn một ảnh giấy tờ, preview ngay và upload lấy mediaId để submit về sau. */
  const handleDocumentFileChange =
    (key: BecomeMentorDocumentKey) => async (event: ChangeEvent<HTMLInputElement>) => {
      if (isLocked) return

      setSubmitErrorMessage(null)
      form.clearErrors(`documents.${key}.mediaId`)
      setUploadingDocumentKey(key)

      try {
        await getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).handleFileChange(
          event
        )
      } catch (error) {
        form.setError(`documents.${key}.mediaId`, {
          message:
            getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).errorMessage ||
            getVerificationErrorMessage(error),
          type: 'manual'
        })
      } finally {
        setUploadingDocumentKey(null)
        event.target.value = ''
      }
    }

  /* Xóa một ảnh giấy tờ khỏi form cục bộ. */
  const clearDocument = (key: BecomeMentorDocumentKey) => {
    if (isLocked) return

    setSubmitErrorMessage(null)
    getFieldByKey(key, idFrontField, idBackField, selfieWithIdField).clear()
  }

  /* Submit hồ sơ xác minh với mediaId của từng ảnh đã upload. */
  const handleSubmit = form.handleSubmit(async (values) => {
    if (requiresProfile || isLocked) return

    setSubmitErrorMessage(null)

    try {
      const response = await upsertCurrentMentorVerificationMutation.mutateAsync({
        fullName: values.verificationFullName.trim(),
        idCardNumber: values.idCardNumber.trim() || null,
        idCardFrontMediaId: idFrontField.value.mediaId as number,
        idCardBackMediaId: idBackField.value.mediaId as number,
        selfieWithIdMediaId: selfieWithIdField.value.mediaId
      })
      const nextValues = mapCurrentMentorVerificationToFormValues(response.verification)

      form.reset(nextValues)
      await onSubmit(nextValues, response.verification)
    } catch (error) {
      setSubmitErrorMessage(getVerificationErrorMessage(error))
    }
  })

  return {
    canSubmit,
    clearDocument,
    control: form.control,
    errors: form.formState.errors,
    handleDocumentFileChange,
    isError,
    isLoading,
    isLocked,
    isSubmitting,
    onRetry: () => {
      setSubmitErrorMessage(null)
      void onboardingStatusQuery.refetch()
      if (shouldFetchCurrentVerification) {
        void currentMentorVerificationQuery.refetch()
      }
    },
    onSubmit: handleSubmit,
    register: form.register,
    rejectionReason,
    requiresProfile,
    selectedDocuments: {
      idBack: idBackField.value,
      idFront: idFrontField.value,
      selfieWithId: selfieWithIdField.value
    },
    status: verificationStatus,
    submitErrorMessage,
    uploadingDocumentKey
  }
}

function mapCurrentMentorVerificationToFormValues(
  verification: CurrentMentorVerificationApiResponse
): BecomeMentorVerificationFormValues {
  return {
    verificationFullName: verification.fullName ?? '',
    idCardNumber: verification.idCardNumber ?? '',
    documents: {
      idFront: {
        fileName: '',
        mediaId: verification.idCardFrontMediaId,
        previewUrl: verification.idCardFrontUrl ?? ''
      },
      idBack: {
        fileName: '',
        mediaId: verification.idCardBackMediaId,
        previewUrl: verification.idCardBackUrl ?? ''
      },
      selfieWithId: {
        fileName: '',
        mediaId: verification.selfieWithIdMediaId,
        previewUrl: verification.selfieWithIdUrl ?? ''
      }
    }
  }
}

function getVerificationErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'

    return error.response.data?.message || 'Không thể xử lý ảnh hoặc lưu xác minh lúc này.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Không thể xử lý ảnh hoặc lưu xác minh lúc này.'
}

function getFieldByKey(
  key: BecomeMentorDocumentKey,
  idFrontField: ReturnType<typeof useMediaUploadField>,
  idBackField: ReturnType<typeof useMediaUploadField>,
  selfieWithIdField: ReturnType<typeof useMediaUploadField>
) {
  if (key === 'idFront') return idFrontField
  if (key === 'idBack') return idBackField

  return selfieWithIdField
}
