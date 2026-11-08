import type { ReactNode } from 'react'
import {
  CheckCircle2,
  Clock3,
  LockKeyhole,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UploadCloud
} from 'lucide-react'
import { Controller } from 'react-hook-form'

import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NumericInput } from '@/components/ui/numeric-input'
import { Spinner } from '@/components/ui/spinner'
import { useBecomeMentorVerificationForm } from '@/features/become-mentor/hooks'
import type { BecomeMentorVerificationFormValues } from '@/features/become-mentor/schemas'
import type {
  CurrentMentorVerificationApiResponse,
  MentorVerificationStatusApiResponse
} from '@/types/api/mentor'

import { verificationDocumentMeta } from '../become-mentor.constants'
import type { BecomeMentorFormState } from '../become-mentor.types'

import { BecomeMentorSectionCard } from './BecomeMentorSectionCard'

type BecomeMentorVerificationSectionProps = {
  documents: BecomeMentorFormState['documents']
  formId: string
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

export function BecomeMentorVerificationSection({
  documents,
  formId,
  idCardNumber,
  onHydrate,
  onSubmit,
  verificationFullName
}: BecomeMentorVerificationSectionProps) {
  const verificationForm = useBecomeMentorVerificationForm({
    documents,
    idCardNumber,
    onHydrate,
    onSubmit,
    verificationFullName
  })

  if (verificationForm.isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải thông tin xác minh...' size='lg' />
      </div>
    )
  }

  if (verificationForm.isError) {
    return (
      <ScreenErrorState
        description='Không thể tải thông tin xác minh hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={verificationForm.onRetry}
        title='Không tải được xác minh'
      />
    )
  }

  return (
    <BecomeMentorSectionCard
      description='Chọn ảnh giấy tờ trực tiếp từ máy để hoàn thiện bước xác minh trước khi gửi duyệt.'
      eyebrow='Bước 5'
      id='verification'
      title='Xác minh danh tính'
    >
      {verificationForm.requiresProfile ? (
        <div className='rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800'>
          Cần hoàn thiện và lưu hồ sơ mentor trước khi gửi thông tin xác minh danh tính.
        </div>
      ) : (
        <VerificationStatusBanner
          rejectionReason={verificationForm.rejectionReason}
          status={verificationForm.status}
        />
      )}

      <form className='mt-5 space-y-5' id={formId} onSubmit={verificationForm.onSubmit}>
        <div className='rounded-[24px] border border-blue-200 bg-blue-50/70 p-4'>
          <div className='flex items-center gap-3'>
            <div className='text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm'>
              <Shield size={18} />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900'>
                Chỉ mentor đã được xác minh và phê duyệt mới hiển thị trên trang kết nối
              </p>
            </div>
          </div>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <Field>
            <Label htmlFor='mentor-verification-name'>Họ tên trên giấy tờ</Label>
            <Input
              {...verificationForm.register('verificationFullName')}
              disabled={verificationForm.isLocked || verificationForm.requiresProfile}
              id='mentor-verification-name'
              placeholder='Nhập giống với CCCD / ID'
            />
            <FieldError message={verificationForm.errors.verificationFullName?.message} />
          </Field>

          <Field>
            <Label htmlFor='mentor-id-card-number'>Số giấy tờ</Label>
            <Controller
              control={verificationForm.control}
              name='idCardNumber'
              render={({ field }) => (
                <NumericInput
                  disabled={verificationForm.isLocked || verificationForm.requiresProfile}
                  id='mentor-id-card-number'
                  onBlur={field.onBlur}
                  onValueChange={field.onChange}
                  placeholder='012345678901'
                  ref={field.ref}
                  value={field.value}
                />
              )}
            />
            <FieldError message={verificationForm.errors.idCardNumber?.message} />
          </Field>
        </div>

        <div className='grid gap-4 md:grid-cols-3'>
          {verificationDocumentMeta.map((document) => {
            const documentValue = verificationForm.selectedDocuments[document.key]
            const done = Boolean(documentValue.mediaId)
            const isUploading = verificationForm.uploadingDocumentKey === document.key

            return (
              <div
                className='rounded-[24px] border border-slate-200 bg-slate-50/70 p-4'
                key={document.key}
              >
                <div className='flex items-start justify-between gap-3'>
                  <div className='text-primary flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm'>
                    {done ? <CheckCircle2 size={18} /> : <UploadCloud size={18} />}
                  </div>
                  <Badge variant={done ? 'success' : 'muted'}>
                    {isUploading ? 'Đang tải lên' : done ? 'Đã sẵn sàng' : 'Chưa có'}
                  </Badge>
                </div>

                <div className='mt-4 space-y-2'>
                  <p className='text-sm font-semibold text-slate-900'>{document.label}</p>
                  <p className='text-sm leading-6 text-slate-500'>{document.description}</p>
                  {documentValue.previewUrl ? (
                    <img
                      alt={document.label}
                      className='mt-2 h-28 w-full rounded-2xl object-cover'
                      src={documentValue.previewUrl}
                    />
                  ) : null}
                  <p className='min-h-6 text-sm leading-6 text-slate-500'>
                    {documentValue.fileName
                      ? `Đã chọn: ${documentValue.fileName}`
                      : done
                        ? 'Đã có ảnh xác minh đã lưu.'
                        : 'Chưa có tệp nào được chọn.'}
                  </p>
                  <FieldError
                    message={verificationForm.errors.documents?.[document.key]?.mediaId?.message}
                  />
                </div>

                <Input
                  accept='image/png,image/jpeg,image/jpg'
                  className='sr-only'
                  disabled={
                    verificationForm.isLocked ||
                    verificationForm.requiresProfile ||
                    verificationForm.isSubmitting
                  }
                  id={`mentor-document-${document.key}`}
                  onChange={verificationForm.handleDocumentFileChange(document.key)}
                  type='file'
                />
                <div className='mt-5 flex flex-col gap-2'>
                  <label
                    className={buttonVariants({
                      className: 'w-full cursor-pointer rounded-2xl',
                      variant: done ? 'secondary' : 'outline'
                    })}
                    htmlFor={`mentor-document-${document.key}`}
                  >
                    {isUploading
                      ? 'Đang tải ảnh...'
                      : done
                        ? 'Đổi ảnh giấy tờ'
                        : 'Chọn ảnh giấy tờ'}
                  </label>
                  {done ? (
                    <button
                      className='text-sm font-medium text-slate-500 transition hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-60'
                      disabled={
                        verificationForm.isLocked ||
                        verificationForm.requiresProfile ||
                        verificationForm.isSubmitting
                      }
                      onClick={() => verificationForm.clearDocument(document.key)}
                      type='button'
                    >
                      Xóa tệp đã chọn
                    </button>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {verificationForm.submitErrorMessage ? (
          <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'>
            {verificationForm.submitErrorMessage}
          </div>
        ) : null}

        {verificationForm.isLocked ? (
          <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600'>
            {verificationForm.status === 'PENDING'
              ? 'Hồ sơ xác minh đang chờ duyệt nên tạm thời chưa thể chỉnh sửa.'
              : 'Hồ sơ xác minh đã được duyệt nên không cần cập nhật thêm.'}
          </div>
        ) : null}
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

function VerificationStatusBanner({
  status,
  rejectionReason
}: {
  status: MentorVerificationStatusApiResponse
  rejectionReason: string | null
}) {
  const config =
    status === 'VERIFIED'
      ? {
          body: 'Thông tin danh tính của bạn đã được xác minh thành công.',
          className: 'border-emerald-200 bg-emerald-50',
          icon: ShieldCheck,
          label: 'Đã xác thực'
        }
      : status === 'REJECTED'
        ? {
            body: rejectionReason || 'Hồ sơ trước đó bị từ chối. Bạn có thể cập nhật và gửi lại.',
            className: 'border-red-200 bg-red-50',
            icon: ShieldAlert,
            label: 'Cần bổ sung hồ sơ'
          }
        : status === 'PENDING'
          ? {
              body: 'Hồ sơ đang được đội ngũ kiểm tra. Bạn chưa thể chỉnh sửa ở trạng thái này.',
              className: 'border-amber-200 bg-amber-50',
              icon: Clock3,
              label: 'Đang chờ phê duyệt'
            }
          : {
              body: 'Bổ sung thông tin thật chính xác để quá trình duyệt diễn ra thuận lợi hơn.',
              className: 'border-slate-200 bg-slate-50',
              icon: LockKeyhole,
              label: 'Chưa gửi xác thực'
            }

  return (
    <div className={`rounded-[24px] border px-4 py-4 ${config.className}`}>
      <div className='flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/80'>
          <config.icon size={18} />
        </div>
        <div className='space-y-1'>
          <p className='text-sm font-semibold text-slate-900'>{config.label}</p>
          <p className='text-sm leading-6 text-slate-600'>{config.body}</p>
        </div>
      </div>
    </div>
  )
}
