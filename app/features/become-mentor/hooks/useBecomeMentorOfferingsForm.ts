import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'

import type { BecomeMentorOffering } from '../become-mentor.types'
import {
  becomeMentorOfferingSchema,
  type BecomeMentorOfferingFormValues
} from '../schemas/offering.schema'

type UseBecomeMentorOfferingsFormParams = {
  editingOffering: BecomeMentorOffering | null
  onResetDraft: () => void
  onSaveOffering: (values: BecomeMentorOfferingFormValues) => Promise<void>
}

const emptyOfferingFormValues: BecomeMentorOfferingFormValues = {
  gradeId: '',
  pricePerHour: '',
  subjectGradeId: '',
  subjectId: '',
  teachingNote: ''
}

/* Quản lý form thêm/chỉnh sửa môn dạy của mentor. */
export function useBecomeMentorOfferingsForm({
  editingOffering,
  onResetDraft,
  onSaveOffering
}: UseBecomeMentorOfferingsFormParams) {
  const form = useForm<BecomeMentorOfferingFormValues>({
    resolver: zodResolver(becomeMentorOfferingSchema),
    defaultValues: emptyOfferingFormValues
  })
  const draft = useWatch({ control: form.control }) ?? emptyOfferingFormValues

  const canSaveOffering = Boolean(
    (draft.subjectGradeId ?? '').trim() &&
    (draft.subjectId ?? '').trim() &&
    (draft.gradeId ?? '').trim() &&
    (draft.pricePerHour ?? '').trim() &&
    (draft.teachingNote ?? '').trim()
  )

  useEffect(() => {
    form.reset(editingOffering ? getOfferingFormDefaults(editingOffering) : emptyOfferingFormValues)
  }, [editingOffering, form])

  /* Gửi môn học đang nhập lên step cha và xóa nháp tạm. */
  const saveOffering = form.handleSubmit(async (values) => {
    await onSaveOffering(values)
    form.reset(emptyOfferingFormValues)
  })

  /* Hủy chế độ chỉnh sửa và đưa form về mặc định. */
  const cancelEditing = () => {
    onResetDraft()
    form.reset(emptyOfferingFormValues)
  }

  return {
    canSaveOffering,
    cancelEditing,
    control: form.control,
    errors: form.formState.errors,
    register: form.register,
    saveOffering,
    setValue: form.setValue,
    watch: form.watch
  }
}

/* Chuyển offering đang có thành giá trị mặc định cho form. */
function getOfferingFormDefaults(
  offering?: BecomeMentorOffering | null
): BecomeMentorOfferingFormValues {
  return {
    gradeId: offering?.gradeId ?? '',
    pricePerHour: offering?.pricePerHour ?? '',
    subjectGradeId: offering?.subjectGradeId ?? '',
    subjectId: offering?.subjectId ?? '',
    teachingNote: offering?.teachingNote ?? ''
  }
}
