import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import { useCurrentMentorProfileQuery } from '@/hooks/queries/mentor/useCurrentMentorProfileQuery'
import { useDeleteCurrentMentorSubjectMutation } from '@/hooks/queries/mentor/useDeleteCurrentMentorSubjectMutation'
import { useUpsertCurrentMentorSubjectMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorSubjectMutation'

import type { BecomeMentorFormState, BecomeMentorOffering } from '../become-mentor.types'
import {
  mapMentorSubjectToBecomeMentorOffering,
  mapOfferingFormValuesToRequest
} from '../mappers/offering.mapper'
import type { BecomeMentorOfferingFormValues } from '../schemas/offering.schema'

type UseBecomeMentorOfferingsStepParams = {
  offerings: BecomeMentorOffering[]
  setFormState: Dispatch<SetStateAction<BecomeMentorFormState>>
}

/* Quản lý danh sách môn dạy trong luồng đăng ký mentor. */
export function useBecomeMentorOfferingsStep({
  offerings,
  setFormState
}: UseBecomeMentorOfferingsStepParams) {
  const [editingOfferingId, setEditingOfferingId] = useState<string | null>(null)
  const currentProfileQuery = useCurrentMentorProfileQuery()
  const upsertCurrentMentorSubjectMutation = useUpsertCurrentMentorSubjectMutation()
  const deleteCurrentMentorSubjectMutation = useDeleteCurrentMentorSubjectMutation()
  const editingOffering = offerings.find((offering) => offering.id === editingOfferingId) ?? null

  useEffect(() => {
    if (!currentProfileQuery.data) return

    setFormState((current) => ({
      ...current,
      offerings: currentProfileQuery.data.subjects.map(mapMentorSubjectToBecomeMentorOffering)
    }))
  }, [currentProfileQuery.data, setFormState])

  /* Thoát chế độ chỉnh sửa offering hiện tại. */
  const resetOfferingDraft = () => {
    setEditingOfferingId(null)
  }

  /* Lưu môn học lên server và cập nhật danh sách trong form. */
  const saveOffering = async (values: BecomeMentorOfferingFormValues) => {
    const response = await upsertCurrentMentorSubjectMutation.mutateAsync(
      mapOfferingFormValuesToRequest(values, editingOffering?.mentorSubjectId ?? null)
    )
    const savedOffering = mapMentorSubjectToBecomeMentorOffering(response.subject)

    setFormState((current) => ({
      ...current,
      offerings: editingOffering
        ? current.offerings.map((item) => (item.id === editingOffering.id ? savedOffering : item))
        : [...current.offerings, savedOffering]
    }))
    setEditingOfferingId(null)
  }

  /* Chọn một offering để nạp vào form chỉnh sửa. */
  const editOffering = (offering: BecomeMentorOffering) => {
    setEditingOfferingId(offering.id)
  }

  /* Xóa offering trên server nếu đã lưu, rồi xóa khỏi form. */
  const removeOffering = async (offeringId: string) => {
    const offering = offerings.find((item) => item.id === offeringId)

    if (offering?.mentorSubjectId) {
      await deleteCurrentMentorSubjectMutation.mutateAsync(offering.mentorSubjectId)
    }

    setFormState((current) => ({
      ...current,
      offerings: current.offerings.filter((item) => item.id !== offeringId)
    }))

    if (editingOfferingId === offeringId) {
      resetOfferingDraft()
    }
  }

  return {
    editingOffering,
    isDeleting: deleteCurrentMentorSubjectMutation.isPending,
    isEditing: Boolean(editingOfferingId),
    isError: currentProfileQuery.isError,
    isLoading: currentProfileQuery.isLoading,
    isSaving: upsertCurrentMentorSubjectMutation.isPending,
    onEditOffering: editOffering,
    onRemoveOffering: removeOffering,
    onResetDraft: resetOfferingDraft,
    /* Thử tải lại hồ sơ mentor để đồng bộ offerings. */
    onRetry: () => {
      void currentProfileQuery.refetch()
    },
    onSaveOffering: saveOffering
  }
}
