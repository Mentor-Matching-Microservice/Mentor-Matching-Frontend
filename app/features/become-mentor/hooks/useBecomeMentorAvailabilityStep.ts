import type { Dispatch, SetStateAction } from 'react'
import { useEffect, useState } from 'react'

import type { MentorAvailabilityDraftValue } from '@/components/MentorAvailabilityForm/MentorAvailabilityForm'
import { useDeleteCurrentMentorAvailabilityMutation } from '@/hooks/queries/mentor/useDeleteCurrentMentorAvailabilityMutation'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorScheduleQuery } from '@/hooks/queries/mentor/useCurrentMentorScheduleQuery'
import { useUpsertCurrentMentorAvailabilityMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorAvailabilityMutation'

import type { BecomeMentorAvailabilityWindow, BecomeMentorFormState } from '../become-mentor.types'
import {
  mapAvailabilityDraftToRequests,
  mapMentorAvailabilityToBecomeMentorAvailabilityWindow
} from '../mappers/availability.mapper'
import { becomeMentorAvailabilitySchema } from '../schemas/availability.schema'

const initialAvailabilityDraft: MentorAvailabilityDraftValue = {
  mode: 'RECURRING',
  selectedDays: ['2', '4'],
  specificDate: '',
  startTime: '18:00',
  endTime: '20:00'
}

type UseBecomeMentorAvailabilityStepParams = {
  availabilities: BecomeMentorAvailabilityWindow[]
  setFormState: Dispatch<SetStateAction<BecomeMentorFormState>>
  onSubmitStep: () => void
}

/* Quản lý bước khai báo lịch rảnh của mentor. */
export function useBecomeMentorAvailabilityStep({
  availabilities,
  onSubmitStep,
  setFormState
}: UseBecomeMentorAvailabilityStepParams) {
  const [availabilityDraft, setAvailabilityDraft] =
    useState<MentorAvailabilityDraftValue>(initialAvailabilityDraft)
  const [editingAvailabilityId, setEditingAvailabilityId] = useState<string | null>(null)
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchCurrentSchedule = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const currentScheduleQuery = useCurrentMentorScheduleQuery(shouldFetchCurrentSchedule, {
    suppressNotFound: true
  })
  const upsertCurrentMentorAvailabilityMutation = useUpsertCurrentMentorAvailabilityMutation()
  const deleteCurrentMentorAvailabilityMutation = useDeleteCurrentMentorAvailabilityMutation()
  const stepValidation = becomeMentorAvailabilitySchema.safeParse({ availabilities })
  const stepError = stepValidation.success
    ? undefined
    : stepValidation.error.flatten().fieldErrors.availabilities?.[0]
  const editingAvailability =
    availabilities.find((item) => item.id === editingAvailabilityId) ?? null

  useEffect(() => {
    if (!currentScheduleQuery.data) return

    setFormState((current) => ({
      ...current,
      availabilities: currentScheduleQuery.data.availabilities.map(
        mapMentorAvailabilityToBecomeMentorAvailabilityWindow
      )
    }))
  }, [currentScheduleQuery.data, setFormState])

  /* Đặt lại form tạo/chỉnh sửa lịch về trạng thái ban đầu. */
  const resetAvailabilityDraft = () => {
    setAvailabilityDraft(initialAvailabilityDraft)
    setEditingAvailabilityId(null)
  }

  /* Tải lại lịch từ server và đồng bộ vào form chính. */
  const syncAvailabilitiesFromServer = async () => {
    const nextResult = await currentScheduleQuery.refetch()

    if (!nextResult.data) return

    setFormState((current) => ({
      ...current,
      availabilities: nextResult.data.availabilities.map(
        mapMentorAvailabilityToBecomeMentorAvailabilityWindow
      )
    }))
  }

  /* Lưu khung giờ hiện tại lên server sau khi kiểm tra dữ liệu bắt buộc. */
  const saveAvailability = async () => {
    const draft = {
      endTime: availabilityDraft.endTime,
      id: editingAvailabilityId ?? `availability-${Date.now()}`,
      mentorAvailabilityId: editingAvailability?.mentorAvailabilityId ?? null,
      mode: availabilityDraft.mode,
      selectedDays:
        availabilityDraft.mode === 'RECURRING' ? availabilityDraft.selectedDays.slice() : [],
      specificDate:
        availabilityDraft.mode === 'SPECIFIC_DATE' ? availabilityDraft.specificDate : '',
      startTime: availabilityDraft.startTime
    } satisfies BecomeMentorAvailabilityWindow

    if (!draft.startTime || !draft.endTime) return
    if (draft.mode === 'RECURRING' && draft.selectedDays.length === 0) return
    if (draft.mode === 'SPECIFIC_DATE' && !draft.specificDate) return

    const saveRequests = mapAvailabilityDraftToRequests(
      availabilityDraft,
      editingAvailability?.mentorAvailabilityId ?? null
    )

    for (const request of saveRequests) {
      await upsertCurrentMentorAvailabilityMutation.mutateAsync(request)
    }

    await syncAvailabilitiesFromServer()
    resetAvailabilityDraft()
  }

  /* Đưa một khung giờ đã có vào form để chỉnh sửa. */
  const editAvailability = (availability: BecomeMentorAvailabilityWindow) => {
    setEditingAvailabilityId(availability.id)
    setAvailabilityDraft({
      mode: availability.mode,
      selectedDays: availability.selectedDays,
      specificDate: availability.specificDate,
      startTime: availability.startTime,
      endTime: availability.endTime
    })
  }

  /* Xóa khung giờ trên server hoặc trong form nếu chưa được lưu. */
  const removeAvailability = async (availabilityId: string) => {
    const availability = availabilities.find((item) => item.id === availabilityId)

    if (availability?.mentorAvailabilityId) {
      await deleteCurrentMentorAvailabilityMutation.mutateAsync(availability.mentorAvailabilityId)
      await syncAvailabilitiesFromServer()
    } else {
      setFormState((current) => ({
        ...current,
        availabilities: current.availabilities.filter((item) => item.id !== availabilityId)
      }))
    }

    if (editingAvailabilityId === availabilityId) {
      resetAvailabilityDraft()
    }
  }

  /* Cho qua bước tiếp theo khi danh sách lịch hợp lệ. */
  const submitAvailabilityStep = () => {
    if (stepValidation.success) {
      onSubmitStep()
    }
  }

  return {
    availabilityDraft,
    isEditing: Boolean(editingAvailabilityId),
    isError:
      onboardingStatusQuery.isError || (shouldFetchCurrentSchedule && currentScheduleQuery.isError),
    isDeleting: deleteCurrentMentorAvailabilityMutation.isPending,
    isLoading:
      onboardingStatusQuery.isLoading ||
      (shouldFetchCurrentSchedule && currentScheduleQuery.isLoading),
    isSaving: upsertCurrentMentorAvailabilityMutation.isPending,
    onDraftChange: setAvailabilityDraft,
    onEditAvailability: editAvailability,
    onRemoveAvailability: removeAvailability,
    onResetDraft: resetAvailabilityDraft,
    /* Thử tải lại trạng thái onboarding và lịch hiện tại. */
    onRetry: () => {
      void onboardingStatusQuery.refetch()
      if (shouldFetchCurrentSchedule) {
        void currentScheduleQuery.refetch()
      }
    },
    onSaveAvailability: saveAvailability,
    onSubmitStep: submitAvailabilityStep,
    stepError
  }
}
