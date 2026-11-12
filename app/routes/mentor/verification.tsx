import axios from 'axios'
import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { Camera, Clock3, IdCard, LockKeyhole, ShieldAlert, ShieldCheck } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useUploadMediaMutation } from '@/hooks/queries/media/useUploadMediaMutation'
import { useCurrentMentorVerificationQuery } from '@/hooks/queries/mentor/useCurrentMentorVerificationQuery'
import { useUpsertCurrentMentorVerificationMutation } from '@/hooks/queries/mentor/useUpsertCurrentMentorVerificationMutation'
import type { ErrorResponse } from '@/types/api/common'
import type {
  CurrentMentorVerificationApiResponse,
  MentorVerificationStatusApiResponse,
  UpsertCurrentMentorVerificationRequest
} from '@/types/api/mentor'

type VerificationDraft = {
  fullName: string
  idCardNumber: string
  idCardFrontUrl: string
  idCardFrontMediaId: number | null
  idCardBackUrl: string
  idCardBackMediaId: number | null
  selfieWithIdUrl: string
  selfieWithIdMediaId: number | null
}

function mapVerificationToDraft(
  verification: CurrentMentorVerificationApiResponse | null | undefined
): VerificationDraft {
  return {
    fullName: verification?.fullName ?? '',
    idCardNumber: verification?.idCardNumber ?? '',
    idCardFrontUrl: verification?.idCardFrontUrl ?? '',
    idCardFrontMediaId: verification?.idCardFrontMediaId ?? null,
    idCardBackUrl: verification?.idCardBackUrl ?? '',
    idCardBackMediaId: verification?.idCardBackMediaId ?? null,
    selfieWithIdUrl: verification?.selfieWithIdUrl ?? '',
    selfieWithIdMediaId: verification?.selfieWithIdMediaId ?? null
  }
}

function areVerificationDraftsEqual(left: VerificationDraft, right: VerificationDraft) {
  return (
    left.fullName === right.fullName &&
    left.idCardNumber === right.idCardNumber &&
    left.idCardFrontUrl === right.idCardFrontUrl &&
    left.idCardFrontMediaId === right.idCardFrontMediaId &&
    left.idCardBackUrl === right.idCardBackUrl &&
    left.idCardBackMediaId === right.idCardBackMediaId &&
    left.selfieWithIdUrl === right.selfieWithIdUrl &&
    left.selfieWithIdMediaId === right.selfieWithIdMediaId
  )
}

function getVerificationErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'
    return error.response.data?.message || 'Không thể gửi hồ sơ xác thực lúc này.'
  }

  return 'Không thể gửi hồ sơ xác thực lúc này.'
}

function VerificationSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='h-12 animate-pulse rounded-2xl bg-slate-100' />
      <div className='h-[520px] animate-pulse rounded-[28px] bg-slate-100' />
    </div>
  )
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
          icon: ShieldCheck,
          className: 'border-emerald-200 bg-emerald-50',
          iconClassName: 'text-emerald-800',
          labelClassName: 'text-emerald-800!',
          bodyClassName: 'text-emerald-700!',
          label: 'Đã xác thực'
        }
      : status === 'REJECTED'
        ? {
            icon: ShieldAlert,
            className: 'border-red-200 bg-red-50',
            iconClassName: 'text-red-800',
            labelClassName: 'text-red-800!',
            bodyClassName: 'text-red-700!',
            label: 'Cần bổ sung hồ sơ'
          }
        : status === 'PENDING'
          ? {
              icon: Clock3,
              className: 'border-amber-200 bg-amber-50',
              iconClassName: 'text-amber-800',
              labelClassName: 'text-amber-800!',
              bodyClassName: 'text-amber-700!',
              label: 'Đang chờ phê duyệt'
            }
          : {
              icon: LockKeyhole,
              className: 'border-slate-200 bg-slate-50',
              iconClassName: 'text-slate-700',
              labelClassName: 'text-slate-900!',
              bodyClassName: 'text-slate-700!',
              label: 'Chưa gửi xác thực'
            }

  return (
    <div className={`rounded-2xl border px-4 py-3 ${config.className}`}>
      <div className='flex items-start gap-3'>
        <config.icon className={`mt-0.5 shrink-0 ${config.iconClassName}`} size={18} />
        <div className='space-y-1'>
          <p className={`text-base font-semibold ${config.labelClassName}`}>{config.label}</p>
          {status === 'REJECTED' && rejectionReason ? (
            <p className={`text-sm leading-relaxed ${config.bodyClassName}`}>{rejectionReason}</p>
          ) : (
            <p className={`text-sm leading-relaxed ${config.bodyClassName}`}>
              {status === 'VERIFIED'
                ? 'Thông tin danh tính của bạn đã được xác minh thành công.'
                : status === 'PENDING'
                  ? 'Hồ sơ đang được đội ngũ kiểm tra. Bạn chưa thể chỉnh sửa ở trạng thái này.'
                  : 'Bổ sung thông tin thật chính xác để quá trình duyệt diễn ra thuận lợi hơn.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function VerificationUploadCard({
  title,
  hint,
  value,
  inputId,
  disabled = false,
  isUploading = false,
  onFileChange
}: {
  title: string
  hint: string[]
  value: string
  inputId: string
  disabled?: boolean
  isUploading?: boolean
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <div className='space-y-3'>
      <Label htmlFor={inputId}>{title}</Label>
      <label
        className={`flex min-h-[184px] flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50/60 px-4 py-6 text-center transition ${
          disabled
            ? 'cursor-not-allowed opacity-70'
            : 'cursor-pointer hover:border-blue-300 hover:bg-blue-50/40'
        }`}
        htmlFor={disabled ? undefined : inputId}
      >
        {value ? (
          <img alt={title} className='h-24 w-24 rounded-2xl object-cover shadow-sm' src={value} />
        ) : (
          <Camera className='text-slate-400' size={40} />
        )}
        <p className='mt-4 text-lg font-medium text-slate-700'>
          {isUploading ? 'Đang tải ảnh lên...' : value ? 'Đã chọn ảnh' : 'Tải ảnh lên'}
        </p>
        <p className='mt-1 text-sm text-slate-500'>
          {disabled
            ? 'Hồ sơ đang khóa chỉnh sửa'
            : value
              ? 'Bấm để thay ảnh khác'
              : 'Ảnh rõ nét, không lóa sáng'}
        </p>
      </label>
      <input
        accept='image/png,image/jpeg,image/webp'
        className='hidden'
        disabled={disabled}
        id={inputId}
        onChange={onFileChange}
        type='file'
      />

      <div className='flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-3'>
        <div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm'>
          <IdCard size={24} />
        </div>
        <div className='space-y-1 text-sm leading-relaxed text-slate-600'>
          <p className='font-medium text-slate-700'>Guidelines:</p>
          {hint.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export function meta() {
  return [{ title: 'Xác thực danh tính | Mentor' }]
}

export default function MentorVerificationPage() {
  const { data: verification, isLoading, isError, refetch } = useCurrentMentorVerificationQuery()
  const upsertVerificationMutation = useUpsertCurrentMentorVerificationMutation()
  const uploadMediaMutation = useUploadMediaMutation()

  const [draftValues, setDraftValues] = useState<VerificationDraft | null>(null)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)

  const sourceValues = mapVerificationToDraft(verification)
  const formValues = draftValues ?? sourceValues
  const hasUnsavedChanges = !areVerificationDraftsEqual(formValues, sourceValues)
  const isLocked =
    verification?.verificationStatus === 'PENDING' ||
    verification?.verificationStatus === 'VERIFIED'
  const isSubmitting = upsertVerificationMutation.isPending || uploadMediaMutation.isPending

  const canSubmit = useMemo(
    () =>
      !isLocked &&
      !uploadingField &&
      Boolean(
        formValues.fullName.trim() &&
          formValues.idCardFrontUrl.trim() &&
          formValues.idCardBackUrl.trim()
      ),
    [formValues, isLocked, uploadingField]
  )

  const handleRetry = () => {
    setDraftValues(null)
    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)
    void refetch()
  }

  const handleFieldChange =
    (field: keyof VerificationDraft) => (event: ChangeEvent<HTMLInputElement>) => {
      if (isLocked) return
      setSaveSuccessMessage(null)
      setSubmitErrorMessage(null)
      setDraftValues((currentValues) => ({
        ...(currentValues ?? sourceValues),
        [field]: event.target.value
      }))
    }

  const handleFileChange =
    (
      field: 'idCardFrontUrl' | 'idCardBackUrl' | 'selfieWithIdUrl',
      mediaIdField: 'idCardFrontMediaId' | 'idCardBackMediaId' | 'selfieWithIdMediaId'
    ) =>
    async (event: ChangeEvent<HTMLInputElement>) => {
      if (isLocked) return
      const file = event.target.files?.[0]
      event.target.value = ''
      if (!file) return

      setSaveSuccessMessage(null)
      setSubmitErrorMessage(null)
      setUploadingField(field)

      const localPreviewUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
        reader.onerror = () => resolve('')
        reader.readAsDataURL(file)
      })

      setDraftValues((currentValues) => ({
        ...(currentValues ?? sourceValues),
        [field]: localPreviewUrl,
        [mediaIdField]: null
      }))

      try {
        const uploadResponse = await uploadMediaMutation.mutateAsync({
          file,
          purpose: 'VERIFICATION',
          resourceType: 'IMAGE'
        })

        setDraftValues((currentValues) => ({
          ...(currentValues ?? sourceValues),
          [field]: uploadResponse.data.deliveryUrl ?? localPreviewUrl,
          [mediaIdField]: uploadResponse.data.id
        }))
      } catch (error) {
        setSubmitErrorMessage(getVerificationErrorMessage(error))
      } finally {
        setUploadingField(null)
      }
    }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (isLocked) return

    if (!formValues.idCardFrontUrl.trim() || !formValues.idCardBackUrl.trim()) {
      setSubmitErrorMessage('Vui lòng tải ảnh giấy tờ lên trước khi gửi xác thực.')
      return
    }

    const payload: UpsertCurrentMentorVerificationRequest = {
      fullName: formValues.fullName.trim(),
      idCardNumber: formValues.idCardNumber.trim() || null,
      idCardFrontUrl: formValues.idCardFrontUrl.trim(),
      idCardBackUrl: formValues.idCardBackUrl.trim(),
      selfieWithIdUrl: formValues.selfieWithIdUrl.trim() || null,
      idCardFrontMediaId: formValues.idCardFrontMediaId,
      idCardBackMediaId: formValues.idCardBackMediaId,
      selfieWithIdMediaId: formValues.selfieWithIdMediaId
    }

    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)

    upsertVerificationMutation.mutate(payload, {
      onSuccess: ({ verification: nextVerification, message }) => {
        setDraftValues(mapVerificationToDraft(nextVerification))
        setSaveSuccessMessage(message || 'Đã gửi yêu cầu xác thực thành công.')
      },
      onError: (error) => {
        setSubmitErrorMessage(getVerificationErrorMessage(error))
      }
    })
  }

  if (isLoading && !verification) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
        title='Xác thực danh tính'
      >
        <VerificationSkeleton />
      </DashboardPage>
    )
  }

  if (isError || !verification) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
        title='Xác thực danh tính'
      >
        <ScreenErrorState
          description='Không thể tải hồ sơ xác thực danh tính hiện tại. Vui lòng thử lại.'
          onRetry={handleRetry}
          retryLabel='Tải lại hồ sơ xác thực'
          title='Không tải được xác thực danh tính'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      className='space-y-8 md:space-y-10'
      description='Để bảo vệ cộng đồng học viên, chúng tôi cần xác minh danh tính của bạn. Thông tin này được bảo mật tuyệt đối.'
      title='Xác thực danh tính'
    >
      <form className='space-y-6' onSubmit={handleSubmit}>
        <VerificationStatusBanner
          rejectionReason={verification.rejectionReason}
          status={verification.verificationStatus}
        />

        <Card className='rounded-[28px] border-slate-200 shadow-none'>
          <CardContent className='space-y-6 p-6'>
            <div className='space-y-4'>
              <p className='text-ink text-[1.45rem] font-bold tracking-tight'>Thông tin cá nhân</p>

              <div className='grid gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='verification-full-name'>Họ và tên thật</Label>
                  <Input
                    className='h-12 rounded-xl'
                    disabled={isLocked || isSubmitting}
                    id='verification-full-name'
                    onChange={handleFieldChange('fullName')}
                    placeholder='Họ và tên thật'
                    value={formValues.fullName}
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='verification-id-card'>Số CMND/CCCD/Hộ chiếu</Label>
                  <Input
                    className='h-12 rounded-xl'
                    disabled={isLocked || isSubmitting}
                    id='verification-id-card'
                    onChange={handleFieldChange('idCardNumber')}
                    placeholder='Số CMND/CCCD/Hộ chiếu'
                    value={formValues.idCardNumber}
                  />
                </div>
              </div>
            </div>

            <div className='rounded-[24px] border border-slate-200 p-4 md:p-5'>
              <div className='grid gap-5 xl:grid-cols-3'>
                <VerificationUploadCard
                  disabled={isLocked || isSubmitting}
                  hint={['Ảnh rõ nét, không lóa sáng', 'Ảnh cước mặt trước CCCD/hộ chiếu']}
                  inputId='verification-front'
                  isUploading={uploadingField === 'idCardFrontUrl'}
                  onFileChange={handleFileChange('idCardFrontUrl', 'idCardFrontMediaId')}
                  title='Mặt trước CCCD'
                  value={formValues.idCardFrontUrl}
                />
                <VerificationUploadCard
                  disabled={isLocked || isSubmitting}
                  hint={['Ảnh rõ nét, không lóa sáng', 'Ảnh sau: Mặt sau/CCCD/hộ chiếu']}
                  inputId='verification-back'
                  isUploading={uploadingField === 'idCardBackUrl'}
                  onFileChange={handleFileChange('idCardBackUrl', 'idCardBackMediaId')}
                  title='Mặt sau CCCD'
                  value={formValues.idCardBackUrl}
                />
                <VerificationUploadCard
                  disabled={isLocked || isSubmitting}
                  hint={['Ảnh rõ nét, không lóa sáng', 'Ảnh selfie cùng CCCD']}
                  inputId='verification-selfie'
                  isUploading={uploadingField === 'selfieWithIdUrl'}
                  onFileChange={handleFileChange('selfieWithIdUrl', 'selfieWithIdMediaId')}
                  title='Ảnh Selfie cùng CCCD'
                  value={formValues.selfieWithIdUrl}
                />
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-700'>
              <ShieldCheck className='mt-0.5 shrink-0 text-slate-500' size={18} />
              <p className='text-sm leading-relaxed'>
                Chúng tôi tuân thủ quy định bảo mật dữ liệu và sẽ không chia sẻ thông tin này cho
                bất kỳ ai.
              </p>
            </div>

            {submitErrorMessage ? (
              <div
                aria-live='polite'
                className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                role='alert'
              >
                {submitErrorMessage}
              </div>
            ) : null}

            {saveSuccessMessage ? (
              <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                {saveSuccessMessage}
              </div>
            ) : null}
          </CardContent>
        </Card>

        <div className='flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end'>
          <Button
            className='rounded-xl px-5'
            disabled={isSubmitting || !hasUnsavedChanges}
            type='button'
            variant='outline'
            onClick={() => {
              setDraftValues(null)
              setSaveSuccessMessage(null)
              setSubmitErrorMessage(null)
            }}
          >
            Hủy
          </Button>
          <Button
            className='rounded-xl px-6'
            disabled={!canSubmit}
            isLoading={isSubmitting}
            type='submit'
          >
            Gửi yêu cầu xác thực
          </Button>
        </div>
      </form>
    </DashboardPage>
  )
}
