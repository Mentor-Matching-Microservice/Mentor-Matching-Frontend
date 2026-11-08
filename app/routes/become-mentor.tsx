import { useCallback, useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router'

import { StatusBadge } from '@/components/StatusBadge/StatusBadge'
import { buttonVariants } from '@/components/ui/button'
import { initialBecomeMentorFormState } from '@/features/become-mentor/become-mentor.constants'
import {
  BecomeMentorAvailabilitySection,
  BecomeMentorHero,
  BecomeMentorOfferingsSection,
  BecomeMentorProfileStep,
  BecomeMentorProgressRail,
  BecomeMentorStickyBar,
  BecomeMentorVerificationSection
} from '@/features/become-mentor/components'
import {
  useBecomeMentorAvailabilityStep,
  useBecomeMentorOfferingsStep,
  useBecomeMentorProfileStep,
  type BecomeMentorProfileStepState
} from '@/features/become-mentor/hooks'
import { mapMentorAvailabilityToBecomeMentorAvailabilityWindow } from '@/features/become-mentor/mappers/availability.mapper'
import { mapMentorSubjectToBecomeMentorOffering } from '@/features/become-mentor/mappers/offering.mapper'
import { mapCurrentMentorToBecomeMentorProfileFormValues } from '@/features/become-mentor/mappers/profile.mapper'
import type { BecomeMentorVerificationFormValues } from '@/features/become-mentor/schemas'
import { useCurrentMentorOnboardingStatusQuery } from '@/hooks/queries/mentor/useCurrentMentorOnboardingStatusQuery'
import { useCurrentMentorProfileQuery } from '@/hooks/queries/mentor/useCurrentMentorProfileQuery'
import { useCurrentMentorScheduleQuery } from '@/hooks/queries/mentor/useCurrentMentorScheduleQuery'
import { useSubmitCurrentMentorApplicationMutation } from '@/hooks/queries/mentor/useSubmitCurrentMentorApplicationMutation'
import type {
  BecomeMentorFormState,
  BecomeMentorReadinessItem,
  BecomeMentorStep
} from '@/features/become-mentor/become-mentor.types'
import type {
  CurrentMentorApiResponse,
  CurrentMentorOnboardingStatusApiResponse,
  CurrentMentorVerificationApiResponse,
  MentorApprovalStatusApiResponse,
  MentorAvailabilityDetailApiResponse,
  MentorSubjectDetailApiResponse
} from '@/types/api/mentor'

const becomeMentorStepFormIds = {
  profile: 'become-mentor-profile-form',
  offerings: 'become-mentor-offerings-form',
  availability: 'become-mentor-availability-form',
  verification: 'become-mentor-verification-form'
} satisfies Record<BecomeMentorStep['id'], string>

function getReadinessItems(
  formState: BecomeMentorFormState,
  onboardingStatus?: CurrentMentorOnboardingStatusApiResponse
): BecomeMentorReadinessItem[] {
  return [
    {
      id: 'profile',
      label: 'Hồ sơ cá nhân và chuyên môn',
      helper: '',
      done:
        onboardingStatus?.profileDetailsCompleted ??
        Boolean(
          formState.avatarUrl &&
          formState.fullName &&
          formState.hometownCityId &&
          formState.currentCityId &&
          formState.currentDistrictId &&
          formState.headline &&
          formState.introduction &&
          formState.teachingStyle &&
          formState.experienceYears &&
          formState.currentPosition &&
          formState.workplace &&
          formState.education &&
          formState.major &&
          formState.meetingType
        )
    },
    {
      id: 'offerings',
      label: 'Môn dạy và học phí',
      helper: '',
      done: (onboardingStatus?.subjectCount ?? formState.offerings.length) > 0
    },
    {
      id: 'availability',
      label: 'Lịch rảnh',
      helper: '',
      done: formState.availabilities.length > 0
    },
    {
      id: 'verification',
      label: 'Xác minh',
      helper: '',
      done:
        onboardingStatus?.verificationSubmitted ??
        Boolean(
          formState.verificationFullName &&
          formState.idCardNumber &&
          formState.documents.idFront.mediaId &&
          formState.documents.idBack.mediaId
        )
    }
  ]
}

function getSteps(
  readinessItems: BecomeMentorReadinessItem[],
  currentStepIndex: number
): BecomeMentorStep[] {
  return readinessItems.map((item, index) => ({
    id: item.id,
    href: `#${item.id}`,
    label: item.label,
    description: item.helper,
    status:
      index < currentStepIndex || item.done
        ? 'done'
        : index === currentStepIndex
          ? 'current'
          : 'upcoming'
  }))
}

export default function BecomeMentorPage() {
  const [formStateOverride, setFormStateOverride] = useState<BecomeMentorFormState | null>(null)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [submitApplicationError, setSubmitApplicationError] = useState<string | null>(null)
  const onboardingStatusQuery = useCurrentMentorOnboardingStatusQuery()
  const shouldFetchBootstrapData = Boolean(onboardingStatusQuery.data?.mentorProfileCreated)
  const bootstrapProfileQuery = useCurrentMentorProfileQuery(shouldFetchBootstrapData)
  const bootstrapScheduleQuery = useCurrentMentorScheduleQuery(shouldFetchBootstrapData, {
    suppressNotFound: true
  })
  const submitApplicationMutation = useSubmitCurrentMentorApplicationMutation()
  const bootstrappedFormState = useMemo(() => {
    if (!shouldFetchBootstrapData || !bootstrapProfileQuery.data || !bootstrapScheduleQuery.data) {
      return initialBecomeMentorFormState
    }

    return mapCurrentMentorBootstrapToFormState({
      availabilities: bootstrapScheduleQuery.data.availabilities,
      currentMentor: bootstrapProfileQuery.data.currentMentor,
      subjects: bootstrapProfileQuery.data.subjects,
      verification: bootstrapProfileQuery.data.verification
    })
  }, [bootstrapProfileQuery.data, bootstrapScheduleQuery.data, shouldFetchBootstrapData])
  const formState = formStateOverride ?? bootstrappedFormState
  const setFormState = useCallback(
    (
      value: BecomeMentorFormState | ((current: BecomeMentorFormState) => BecomeMentorFormState)
    ) => {
      setFormStateOverride((current) => {
        const baseState = current ?? bootstrappedFormState

        return typeof value === 'function' ? value(baseState) : value
      })
    },
    [bootstrappedFormState]
  )

  const readinessItems = getReadinessItems(formState, onboardingStatusQuery.data)
  const steps = getSteps(readinessItems, currentStepIndex)
  const completedCount = readinessItems.filter((item) => item.done).length
  const currentStep = steps[currentStepIndex]
  const approvalStatus =
    submitApplicationMutation.data?.onboardingStatus.approvalStatus ??
    onboardingStatusQuery.data?.approvalStatus ??
    'DRAFT'
  const approvalNote = bootstrapProfileQuery.data?.currentMentor.approvalNote ?? null
  const shouldShowReviewSummary =
    approvalStatus === 'PENDING' || approvalStatus === 'APPROVED' || approvalStatus === 'SUSPENDED'
  const canSubmitApplicationDirectly =
    Boolean(onboardingStatusQuery.data?.verificationSubmitted) &&
    onboardingStatusQuery.data?.verificationStatus !== 'REJECTED'
  const profileState: BecomeMentorProfileStepState = {
    currentCityId: formState.currentCityId,
    currentDistrictId: formState.currentDistrictId,
    currentPosition: formState.currentPosition,
    education: formState.education,
    experienceYears: formState.experienceYears,
    fullName: formState.fullName,
    gender: formState.gender,
    headline: formState.headline,
    hometownCityId: formState.hometownCityId,
    introduction: formState.introduction,
    major: formState.major,
    meetingType: formState.meetingType,
    teachingStyle: formState.teachingStyle,
    workplace: formState.workplace
  }
  const profileStep = useBecomeMentorProfileStep({
    formId: becomeMentorStepFormIds.profile,
    onSubmit: (values, savedCurrentMentor) => {
      setFormState((current) => ({
        ...current,
        avatarMediaId: savedCurrentMentor.avatarMediaId,
        avatarUrl: savedCurrentMentor.avatarUrl ?? current.avatarUrl,
        currentCityId: savedCurrentMentor.currentLocation.cityId
          ? String(savedCurrentMentor.currentLocation.cityId)
          : values.currentCityId,
        currentDistrictId: savedCurrentMentor.currentLocation.districtId
          ? String(savedCurrentMentor.currentLocation.districtId)
          : values.currentDistrictId,
        currentLocation:
          savedCurrentMentor.currentLocation.districtName ||
          savedCurrentMentor.currentLocation.cityName ||
          values.currentDistrictId,
        currentPosition: values.currentPosition ?? '',
        education: values.education,
        experienceYears: values.experienceYears,
        fullName: savedCurrentMentor.fullName || values.fullName,
        gender: savedCurrentMentor.gender ?? values.gender ?? '',
        headline: values.headline,
        hometown: savedCurrentMentor.hometown.cityName || values.hometownCityId,
        hometownCityId: savedCurrentMentor.hometown.cityId
          ? String(savedCurrentMentor.hometown.cityId)
          : values.hometownCityId,
        introduction: values.introduction,
        major: values.major,
        meetingType: values.meetingType,
        teachingStyle: values.teachingStyle,
        workplace: values.workplace ?? ''
      }))
      goToStep(currentStepIndex + 1)
    },
    profileState
  })

  const offeringsStep = useBecomeMentorOfferingsStep({
    offerings: formState.offerings,
    setFormState
  })

  const availabilityStep = useBecomeMentorAvailabilityStep({
    availabilities: formState.availabilities,
    onSubmitStep: () => goToStep(currentStepIndex + 1),
    setFormState
  })

  const goToStep = (index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)))
  }

  const submitApplication = async () => {
    setSubmitApplicationError(null)

    try {
      await submitApplicationMutation.mutateAsync()
      setFormStateOverride(null)
    } catch (error) {
      setSubmitApplicationError(getSubmitApplicationErrorMessage(error))
    }
  }

  const submitVerification = async (
    values: BecomeMentorVerificationFormValues,
    verification: CurrentMentorVerificationApiResponse
  ) => {
    setFormState((current) => mapVerificationValuesToFormState(current, values, verification))
    await submitApplication()
  }

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case 'profile':
        return <BecomeMentorProfileStep {...profileStep} />
      case 'offerings':
        return (
          <BecomeMentorOfferingsSection
            editingOffering={offeringsStep.editingOffering}
            formId={becomeMentorStepFormIds.offerings}
            isDeleting={offeringsStep.isDeleting}
            isEditing={offeringsStep.isEditing}
            isError={offeringsStep.isError}
            isLoading={offeringsStep.isLoading}
            isSaving={offeringsStep.isSaving}
            onEditOffering={offeringsStep.onEditOffering}
            onRemoveOffering={offeringsStep.onRemoveOffering}
            onResetDraft={offeringsStep.onResetDraft}
            onRetry={offeringsStep.onRetry}
            onSaveOffering={offeringsStep.onSaveOffering}
            onSubmitStep={() => goToStep(currentStepIndex + 1)}
            offerings={formState.offerings}
          />
        )
      case 'availability':
        return (
          <BecomeMentorAvailabilitySection
            availabilities={formState.availabilities}
            availabilityDraft={availabilityStep.availabilityDraft}
            formId={becomeMentorStepFormIds.availability}
            isDeleting={availabilityStep.isDeleting}
            isEditing={availabilityStep.isEditing}
            isError={availabilityStep.isError}
            isLoading={availabilityStep.isLoading}
            isSaving={availabilityStep.isSaving}
            onDraftChange={availabilityStep.onDraftChange}
            onEditAvailability={availabilityStep.onEditAvailability}
            onRemoveAvailability={availabilityStep.onRemoveAvailability}
            onResetDraft={availabilityStep.onResetDraft}
            onRetry={availabilityStep.onRetry}
            onSaveAvailability={availabilityStep.onSaveAvailability}
            onSubmitStep={availabilityStep.onSubmitStep}
            stepError={availabilityStep.stepError}
          />
        )
      case 'verification':
        return (
          <BecomeMentorVerificationSection
            documents={formState.documents}
            formId={becomeMentorStepFormIds.verification}
            idCardNumber={formState.idCardNumber}
            onHydrate={(values, verification) => {
              setFormState((current) =>
                mapVerificationValuesToFormState(current, values, verification)
              )
            }}
            onSubmit={submitVerification}
            verificationFullName={formState.verificationFullName}
          />
        )
      default:
        return null
    }
  }

  const isBootstrapLoading =
    onboardingStatusQuery.isLoading ||
    (shouldFetchBootstrapData &&
      (bootstrapProfileQuery.isLoading ||
        bootstrapScheduleQuery.isLoading ||
        !bootstrapProfileQuery.data ||
        !bootstrapScheduleQuery.data))

  if (isBootstrapLoading) {
    return <BecomeMentorPageSkeleton />
  }

  if (shouldShowReviewSummary) {
    return (
      <BecomeMentorReviewSummary
        approvalNote={approvalNote}
        approvalStatus={approvalStatus}
        completedCount={completedCount}
        totalCount={readinessItems.length}
      />
    )
  }

  return (
    <div className='relative py-8 md:py-10'>
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f8ff_40%,#f8fafc_100%)]' />
      <div className='page-container space-y-8'>
        <BecomeMentorHero completedCount={completedCount} totalCount={readinessItems.length} />

        {approvalStatus === 'REJECTED' ? (
          <BecomeMentorRejectedNotice approvalNote={approvalNote} />
        ) : null}

        {submitApplicationError ? (
          <div className='rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700'>
            {submitApplicationError}
          </div>
        ) : null}

        <div className='grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start'>
          <div className='xl:sticky xl:top-24'>
            <BecomeMentorProgressRail onSelectStep={goToStep} steps={steps} />
          </div>

          <div className='space-y-6'>
            <section className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-7'>
              <div className='flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between'>
                <div className='space-y-1'>
                  <p className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase'>
                    Bước {currentStepIndex + 1}
                  </p>
                  <h2 className='text-2xl font-semibold text-slate-900'>{currentStep.label}</h2>
                </div>
                {currentStep.description ? (
                  <div className='rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600'>
                    {currentStep.description}
                  </div>
                ) : null}
              </div>
            </section>

            {renderCurrentStep()}
          </div>
        </div>

        <BecomeMentorStickyBar
          completedCount={completedCount}
          currentStepIndex={currentStepIndex}
          currentStepFormId={becomeMentorStepFormIds[currentStep.id]}
          currentStepLabel={currentStep.label}
          isFirstStep={currentStepIndex === 0}
          isLastStep={currentStepIndex === steps.length - 1}
          isReadyForFinalSubmit={canSubmitApplicationDirectly}
          isSubmitting={
            (currentStep.id === 'profile' && profileStep.isSubmitting) ||
            submitApplicationMutation.isPending
          }
          onBack={() => goToStep(currentStepIndex - 1)}
          onFinalSubmit={() => {
            void submitApplication()
          }}
          totalCount={readinessItems.length}
        />
      </div>
    </div>
  )
}

function BecomeMentorReviewSummary({
  approvalNote,
  approvalStatus,
  completedCount,
  totalCount
}: {
  approvalNote: string | null
  approvalStatus: Exclude<MentorApprovalStatusApiResponse, 'DRAFT' | 'REJECTED'>
  completedCount: number
  totalCount: number
}) {
  const config = getReviewSummaryConfig(approvalStatus)
  const Icon = config.icon

  if (approvalStatus === 'PENDING') {
    return (
      <div className='relative flex min-h-[calc(100vh-8rem)] items-center py-10'>
        <div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,#eef6ff_0%,#f8fafc_42%,#ffffff_100%)]' />
        <div className='page-container'>
          <section className='mx-auto flex max-w-xl flex-col items-center rounded-[32px] border border-slate-200 bg-white px-6 py-10 text-center shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] md:px-10 md:py-12'>
            <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-600 ring-8 ring-amber-50/60'>
              <Clock size={42} strokeWidth={1.8} />
            </div>
            <StatusBadge className='mb-4' kind='approval' status='PENDING' />
            <h1 className='text-2xl font-semibold text-slate-950 md:text-3xl'>
              Hồ sơ đang chờ duyệt
            </h1>
            <p
              className='mt-3 max-w-md text-sm leading-6 font-medium opacity-100 md:text-base'
              style={{ color: '#334155' }}
            >
              Đội ngũ của chúng tôi đang rà soát hồ sơ của bạn. Quá trình này thường mất 24h - 48h
              làm việc và bạn sẽ được thông báo ngay khi có kết quả.
            </p>
            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                className={buttonVariants({ className: 'h-10 rounded-2xl px-5', size: 'lg' })}
                to='/'
              >
                Về trang chủ
              </Link>
              <Link
                className={buttonVariants({
                  className: 'h-10 rounded-2xl px-5',
                  size: 'lg',
                  variant: 'outline'
                })}
                to='/mentor'
              >
                Mở khu mentor
              </Link>
            </div>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className='relative py-8 md:py-10'>
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f8ff_40%,#f8fafc_100%)]' />
      <div className='page-container space-y-6'>
        <section className={`rounded-[32px] border bg-white p-6 shadow-sm md:p-8 ${config.border}`}>
          <div className='flex flex-col gap-5 md:flex-row md:items-start md:justify-between'>
            <div className='flex gap-4'>
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconClass}`}
              >
                <Icon size={22} />
              </div>
              <div className='space-y-2'>
                <StatusBadge kind='approval' status={approvalStatus} />
                <h1 className='text-2xl font-semibold text-slate-950 md:text-3xl'>
                  {config.title}
                </h1>
                <p className='max-w-2xl text-sm leading-6 text-slate-600 md:text-base'>
                  {config.description}
                </p>
              </div>
            </div>
            <div className='rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700'>
              {completedCount}/{totalCount} bước hoàn tất
            </div>
          </div>

          {approvalNote?.trim() ? (
            <div className='mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700'>
              Ghi chú: {approvalNote.trim()}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  )
}

function BecomeMentorRejectedNotice({ approvalNote }: { approvalNote: string | null }) {
  return (
    <div className='rounded-[24px] border border-red-200 bg-red-50 px-5 py-4 text-sm leading-6 text-red-800'>
      <div className='flex items-start gap-3'>
        <AlertTriangle className='mt-0.5 shrink-0' size={18} />
        <div>
          <p className='font-semibold'>Hồ sơ cần chỉnh sửa trước khi gửi lại.</p>
          {approvalNote?.trim() ? <p className='mt-1'>Ghi chú: {approvalNote.trim()}</p> : null}
        </div>
      </div>
    </div>
  )
}

function getReviewSummaryConfig(
  status: Exclude<MentorApprovalStatusApiResponse, 'DRAFT' | 'REJECTED'>
) {
  if (status === 'APPROVED') {
    return {
      border: 'border-emerald-200',
      description: 'Hồ sơ mentor của bạn đã được duyệt và có thể sử dụng trong khu mentor.',
      icon: CheckCircle2,
      iconClass: 'bg-emerald-50 text-emerald-700',
      title: 'Hồ sơ đã được duyệt'
    }
  }

  if (status === 'SUSPENDED') {
    return {
      border: 'border-red-200',
      description: 'Hồ sơ mentor đang tạm dừng hiển thị. Hãy theo dõi ghi chú từ đội ngũ quản trị.',
      icon: ShieldAlert,
      iconClass: 'bg-red-50 text-red-700',
      title: 'Hồ sơ đang tạm dừng'
    }
  }

  return {
    border: 'border-amber-200',
    description:
      'Đội ngũ quản trị đang xem xét thông tin hồ sơ, môn dạy, lịch rảnh và xác minh của bạn.',
    icon: Clock,
    iconClass: 'bg-amber-50 text-amber-700',
    title: 'Hồ sơ đang chờ duyệt'
  }
}

function getSubmitApplicationErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message
  }

  return 'Không thể gửi duyệt hồ sơ lúc này.'
}

function BecomeMentorPageSkeleton() {
  return (
    <div className='relative py-8 md:py-10'>
      <div className='absolute inset-0 -z-10 bg-[linear-gradient(180deg,#f8fafc_0%,#f3f8ff_40%,#f8fafc_100%)]' />
      <div className='page-container space-y-8'>
        <div className='h-48 animate-pulse rounded-[32px] bg-slate-100' />
        <div className='grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)] xl:items-start'>
          <div className='h-[360px] animate-pulse rounded-[28px] bg-slate-100' />
          <div className='space-y-6'>
            <div className='h-28 animate-pulse rounded-[28px] bg-slate-100' />
            <div className='h-[520px] animate-pulse rounded-[28px] bg-slate-100' />
          </div>
        </div>
        <div className='h-24 animate-pulse rounded-[28px] bg-slate-100' />
      </div>
    </div>
  )
}

function mapCurrentMentorBootstrapToFormState({
  availabilities,
  currentMentor,
  subjects,
  verification
}: {
  availabilities: MentorAvailabilityDetailApiResponse[]
  currentMentor: CurrentMentorApiResponse
  subjects: MentorSubjectDetailApiResponse[]
  verification: CurrentMentorVerificationApiResponse | null
}): BecomeMentorFormState {
  const profileValues = mapCurrentMentorToBecomeMentorProfileFormValues(currentMentor)

  return {
    ...initialBecomeMentorFormState,
    ...profileValues,
    avatarMediaId: currentMentor.avatarMediaId,
    avatarUrl: currentMentor.avatarUrl ?? '',
    currentLocation:
      currentMentor.currentLocation.districtName || currentMentor.currentLocation.cityName || '',
    hometown: currentMentor.hometown.cityName || '',
    offerings: subjects.map(mapMentorSubjectToBecomeMentorOffering),
    availabilities: availabilities.map(mapMentorAvailabilityToBecomeMentorAvailabilityWindow),
    documents: verification
      ? {
          idBack: {
            fileName: '',
            mediaId: verification.idCardBackMediaId,
            previewUrl: verification.idCardBackUrl ?? ''
          },
          idFront: {
            fileName: '',
            mediaId: verification.idCardFrontMediaId,
            previewUrl: verification.idCardFrontUrl ?? ''
          },
          selfieWithId: {
            fileName: '',
            mediaId: verification.selfieWithIdMediaId,
            previewUrl: verification.selfieWithIdUrl ?? ''
          }
        }
      : initialBecomeMentorFormState.documents,
    idCardNumber: verification?.idCardNumber ?? '',
    verificationFullName: verification?.fullName ?? ''
  }
}

function mapVerificationValuesToFormState(
  current: BecomeMentorFormState,
  values: BecomeMentorVerificationFormValues,
  verification: CurrentMentorVerificationApiResponse
): BecomeMentorFormState {
  return {
    ...current,
    documents: {
      idBack: {
        fileName: values.documents.idBack.fileName,
        mediaId: verification.idCardBackMediaId,
        previewUrl: verification.idCardBackUrl ?? values.documents.idBack.previewUrl
      },
      idFront: {
        fileName: values.documents.idFront.fileName,
        mediaId: verification.idCardFrontMediaId,
        previewUrl: verification.idCardFrontUrl ?? values.documents.idFront.previewUrl
      },
      selfieWithId: {
        fileName: values.documents.selfieWithId.fileName,
        mediaId: verification.selfieWithIdMediaId,
        previewUrl: verification.selfieWithIdUrl ?? values.documents.selfieWithId.previewUrl
      }
    },
    idCardNumber: values.idCardNumber,
    verificationFullName: values.verificationFullName
  }
}
