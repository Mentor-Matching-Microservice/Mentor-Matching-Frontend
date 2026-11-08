import type { ComponentProps, ReactNode } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { Controller } from 'react-hook-form'

import { ScreenErrorState } from '@/components/ScreenErrorState'
import { AppSelect } from '@/components/ui/app-select'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { NumericInput } from '@/components/ui/numeric-input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { useBecomeMentorOfferingsForm } from '@/features/become-mentor/hooks'
import type { BecomeMentorOfferingFormValues } from '@/features/become-mentor/schemas'
import { useCatalogOptionsQuery } from '@/hooks/queries/catalog/useCatalogOptionsQuery'
import { formatPrice } from '@/utils/format'

import type { BecomeMentorOffering } from '../become-mentor.types'
import { formatGradeLabel } from '../mappers/offering.mapper'

import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'

type BecomeMentorOfferingsSectionProps = {
  editingOffering: BecomeMentorOffering | null
  formId: string
  isDeleting: boolean
  isEditing: boolean
  isError: boolean
  isLoading: boolean
  isSaving: boolean
  offerings: BecomeMentorOffering[]
  onEditOffering: (offering: BecomeMentorOffering) => void
  onRemoveOffering: (offeringId: string) => Promise<void>
  onResetDraft: () => void
  onRetry: () => void
  onSaveOffering: (values: BecomeMentorOfferingFormValues) => Promise<void>
  onSubmitStep: () => void
}

export function BecomeMentorOfferingsSection({
  editingOffering,
  formId,
  isDeleting,
  isEditing,
  isError,
  isLoading,
  isSaving,
  offerings,
  onEditOffering,
  onRemoveOffering,
  onResetDraft,
  onRetry,
  onSaveOffering,
  onSubmitStep
}: BecomeMentorOfferingsSectionProps) {
  const offeringsForm = useBecomeMentorOfferingsForm({
    editingOffering,
    onResetDraft,
    onSaveOffering
  })
  const {
    data: catalogOptions,
    isError: isCatalogError,
    isLoading: isCatalogLoading
  } = useCatalogOptionsQuery()
  const selectedSubjectId = offeringsForm.watch('subjectId')
  const selectedGradeId = offeringsForm.watch('gradeId')
  const selectedSubjectGradeId =
    catalogOptions?.subjectGrades.find(
      (item) =>
        String(item.subjectId) === selectedSubjectId && String(item.gradeId) === selectedGradeId
    )?.id ?? null
  const subjectOptions = (catalogOptions?.subjects ?? []).map((subject) => ({
    label: subject.name,
    value: String(subject.id)
  }))
  const gradeOptions = (catalogOptions?.grades ?? []).map((grade) => ({
    label: formatGradeLabel(grade.name),
    value: String(grade.id)
  }))
  const subjectPlaceholder = isCatalogLoading
    ? 'Đang tải môn học...'
    : isCatalogError
      ? 'Không tải được môn học'
      : 'Chọn môn'
  const gradePlaceholder = isCatalogLoading
    ? 'Đang tải cấp lớp...'
    : isCatalogError
      ? 'Không tải được cấp lớp'
      : 'Chọn cấp lớp'

  if (isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải danh sách môn dạy...' size='lg' />
      </div>
    )
  }

  if (isError) {
    return (
      <ScreenErrorState
        description='Không thể tải danh sách môn dạy hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={onRetry}
        title='Không tải được môn dạy'
      />
    )
  }

  const syncSubjectGradeId = (subjectId: string, gradeId: string) => {
    const nextSubjectGradeId =
      catalogOptions?.subjectGrades.find(
        (item) => String(item.subjectId) === subjectId && String(item.gradeId) === gradeId
      )?.id ?? ''

    offeringsForm.setValue('subjectGradeId', String(nextSubjectGradeId), {
      shouldDirty: true,
      shouldValidate: true
    })
  }

  return (
    <BecomeMentorSectionCard
      description='Mỗi môn học nên có cấp lớp, mô tả ngắn và học phí riêng để học viên dễ so sánh và chọn đúng nhu cầu.'
      eyebrow='Bước 2'
      id='offerings'
      title='Môn dạy và học phí'
    >
      <form
        className='space-y-6'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          onSubmitStep()
        }}
      >
        <section className='rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='border-b border-slate-100 pb-4'>
            <h3 className='text-xl font-semibold text-slate-900'>Danh sách môn học & học phí</h3>
          </div>

          <div className='mt-5 space-y-3'>
            {offerings.length > 0 ? (
              offerings.map((offering) => (
                <div
                  className='flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 px-4 py-4 shadow-[0_8px_24px_-20px_rgba(15,23,42,0.35)]'
                  key={offering.id}
                >
                  <div className='min-w-0'>
                    <p className='text-xl font-semibold text-slate-900'>
                      {offering.subject} - {offering.gradeLevel}
                    </p>
                    <p className='mt-1 text-lg font-medium text-slate-600'>
                      {formatOfferingPrice(offering.pricePerHour)}
                    </p>
                  </div>

                  <div className='flex shrink-0 items-center gap-2'>
                    <IconButton
                      aria-label={`Sửa ${offering.subject}`}
                      onClick={() => onEditOffering(offering)}
                      variant='outline'
                    >
                      <Pencil size={16} />
                    </IconButton>
                    <IconButton
                      aria-label={`Xóa ${offering.subject}`}
                      disabled={isDeleting}
                      onClick={() => {
                        void onRemoveOffering(offering.id)
                      }}
                      variant='destructive'
                    >
                      <Trash2 size={16} />
                    </IconButton>
                  </div>
                </div>
              ))
            ) : (
              <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-5 py-6 text-sm leading-6 text-slate-500'>
                Chưa có môn học nào. Hãy thêm môn đầu tiên để bắt đầu xây dựng hồ sơ mentor.
              </div>
            )}
          </div>
        </section>

        <section className='rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm'>
          <div className='border-b border-slate-100 pb-4'>
            <h3 className='text-xl font-semibold text-slate-900'>
              {isEditing ? 'Chỉnh sửa môn học' : 'Thêm môn học mới'}
            </h3>
          </div>

          <div className='mt-5 space-y-5'>
            <Field>
              <Label>Chọn môn học</Label>
              <Controller
                control={offeringsForm.control}
                name='subjectId'
                render={({ field }) => (
                  <AppSelect
                    ariaLabel='Chọn môn học'
                    className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-sm [&_span]:text-slate-900'
                    disabled={isCatalogLoading || isCatalogError || subjectOptions.length === 0}
                    onValueChange={(value) => {
                      field.onChange(value)
                      syncSubjectGradeId(value, selectedGradeId)
                    }}
                    options={subjectOptions}
                    placeholder={subjectPlaceholder}
                    value={field.value}
                  />
                )}
              />
              <FieldError message={offeringsForm.errors.subjectId?.message} />
            </Field>

            <Field>
              <Label>Cấp lớp</Label>
              <Controller
                control={offeringsForm.control}
                name='gradeId'
                render={({ field }) => (
                  <AppSelect
                    ariaLabel='Chọn cấp lớp'
                    className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-sm [&_span]:text-slate-900'
                    disabled={isCatalogLoading || isCatalogError || gradeOptions.length === 0}
                    onValueChange={(value) => {
                      field.onChange(value)
                      syncSubjectGradeId(selectedSubjectId, value)
                    }}
                    options={gradeOptions}
                    placeholder={gradePlaceholder}
                    value={field.value}
                  />
                )}
              />
              <FieldError
                message={
                  offeringsForm.errors.gradeId?.message ||
                  (!selectedSubjectGradeId && selectedSubjectId && selectedGradeId
                    ? 'Tổ hợp môn học và cấp lớp này chưa được hỗ trợ.'
                    : offeringsForm.errors.subjectGradeId?.message)
                }
              />
            </Field>

            <Field>
              <Label htmlFor='mentor-teaching-note'>Mô tả ngắn về môn học</Label>
              <Textarea
                {...offeringsForm.register('teachingNote')}
                className='min-h-28'
                id='mentor-teaching-note'
                placeholder='Mô tả ngắn gọn nội dung và phương pháp giảng dạy...'
              />
              <FieldError message={offeringsForm.errors.teachingNote?.message} />
            </Field>

            <Field>
              <Label htmlFor='mentor-price'>Học phí mỗi giờ</Label>
              <div className='focus-within:border-primary focus-within:ring-primary/10 grid grid-cols-[minmax(0,1fr)_5.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:ring-4'>
                <Controller
                  control={offeringsForm.control}
                  name='pricePerHour'
                  render={({ field }) => (
                    <NumericInput
                      className='h-11 w-full border-0 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400'
                      id='mentor-price'
                      onBlur={field.onBlur}
                      onValueChange={field.onChange}
                      placeholder='Ví dụ: 300000'
                      ref={field.ref}
                      value={field.value}
                    />
                  )}
                />
                <div className='flex items-center justify-center border-l border-slate-200 bg-slate-50 text-sm font-medium text-slate-600'>
                  đ/giờ
                </div>
              </div>
              <FieldError message={offeringsForm.errors.pricePerHour?.message} />
            </Field>

            <div className='flex flex-col gap-3 sm:flex-row'>
              {isEditing ? (
                <Button
                  className='rounded-2xl'
                  onClick={offeringsForm.cancelEditing}
                  type='button'
                  variant='outline'
                >
                  Hủy chỉnh sửa
                </Button>
              ) : null}
              <Button
                className='w-full rounded-2xl sm:flex-1'
                disabled={!offeringsForm.canSaveOffering || isSaving}
                isLoading={isSaving}
                onClick={offeringsForm.saveOffering}
                size='lg'
                type='button'
              >
                <Plus size={18} />
                {isEditing ? 'Cập nhật môn học' : 'Thêm môn học mới'}
              </Button>
            </div>
          </div>
        </section>
      </form>
    </BecomeMentorSectionCard>
  )
}

function Field({ children }: { children: ReactNode }) {
  return <div className='space-y-2'>{children}</div>
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className='text-sm font-medium text-red-500'>{message}</p>
}

function IconButton({ children, type = 'button', ...props }: ComponentProps<typeof Button>) {
  return (
    <Button className='h-10 w-10 rounded-xl p-0' size='icon' type={type} {...props}>
      {children}
    </Button>
  )
}

function formatOfferingPrice(value: string) {
  const digits = value.replace(/\D/g, '')

  if (!digits) {
    return 'Chưa đặt học phí'
  }

  return `${formatPrice(Number(digits))}/giờ`
}
