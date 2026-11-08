import axios from 'axios'
import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import {
  Atom,
  Award,
  CalendarRange,
  BookOpenText,
  Building2,
  Check,
  FileImage,
  Eye,
  FlaskConical,
  GraduationCap,
  ImagePlus,
  Lightbulb,
  PenLine,
  Plus,
  Sigma,
  Sparkles,
  Star,
  Upload,
  X,
  Trash2
} from 'lucide-react'
import { Link } from 'react-router'

import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { StatusBadge } from '@/components/StatusBadge'
import { AppSelect } from '@/components/ui/app-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { path } from '@/config/path'
import { useCurrentMentorProfileQuery } from '@/hooks/queries/mentor/useCurrentMentorProfileQuery'
import { useCreateCurrentMentorAchievementMutation } from '@/hooks/queries/mentor/useCreateCurrentMentorAchievementMutation'
import { useDeleteCurrentMentorAchievementMutation } from '@/hooks/queries/mentor/useDeleteCurrentMentorAchievementMutation'
import { useUpdateCurrentMentorMutation } from '@/hooks/queries/mentor/useUpdateCurrentMentorMutation'
import { useUpdateCurrentMentorAchievementMutation } from '@/hooks/queries/mentor/useUpdateCurrentMentorAchievementMutation'
import { useUpdateCurrentMentorTraitsMutation } from '@/hooks/queries/mentor/useUpdateCurrentMentorTraitsMutation'
import { formatMeetingTypeLabel } from '@/features/mentor-profile/mentor-profile.mapper'
import type { ErrorResponse } from '@/types/api/common'
import type {
  CurrentMentorApiResponse,
  CurrentMentorTraitsApiResponse,
  CurrentMentorVerificationApiResponse,
  MentorAchievementDetailApiResponse,
  MentorAchievementTypeApiResponse,
  MentorOptionDetailApiResponse,
  MentorProficiencyLevelApiResponse
} from '@/types/api/mentor'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

type MentorProfileDraft = {
  headline: string
  introduction: string
  teachingStyle: string
}

type MentorTraitsDraft = {
  personalityOptionIds: number[]
  highlightOptionIds: number[]
}

type AchievementDraft = {
  localId: string
  id: number | null
  title: string
  description: string
  achievementType: MentorAchievementTypeApiResponse
  issuer: string
  achievedYear: string
  proofUrl: string
  verified: boolean
  isNew: boolean
}

type ProfileTabKey = 'general' | 'traits' | 'achievements' | 'offerings'

const emptyDraft: MentorProfileDraft = {
  headline: '',
  introduction: '',
  teachingStyle: ''
}

const profileTabs: Array<{ key: ProfileTabKey; label: string; icon: typeof BookOpenText }> = [
  { key: 'general', label: 'Thông tin chung', icon: BookOpenText },
  { key: 'traits', label: 'Nổi bật & Đặc điểm', icon: Sparkles },
  { key: 'achievements', label: 'Thành tựu', icon: Award },
  { key: 'offerings', label: 'Offerings & Pricing', icon: GraduationCap }
]

const proficiencyLabelMap: Record<MentorProficiencyLevelApiResponse, string> = {
  BASIC: 'Cơ bản',
  INTERMEDIATE: 'Trung bình',
  ADVANCED: 'Nâng cao',
  EXPERT: 'Chuyên sâu'
}

const achievementTypeOptions: Array<{
  label: string
  value: MentorAchievementTypeApiResponse
}> = [
  { label: 'Chứng chỉ', value: 'CERTIFICATE' },
  { label: 'Giải thưởng', value: 'AWARD' },
  { label: 'Thành tích học tập', value: 'EXAM_SCORE' },
  { label: 'Cuộc thi', value: 'COMPETITION' },
  { label: 'Dự án', value: 'PROJECT' },
  { label: 'Kinh nghiệm thực tế', value: 'WORK_EXPERIENCE' }
]

function mapMentorToFormValues(currentMentor: CurrentMentorApiResponse): MentorProfileDraft {
  return {
    headline: currentMentor.headline ?? '',
    introduction: currentMentor.introduction ?? '',
    teachingStyle: currentMentor.teachingStyle ?? ''
  }
}

function areFormValuesEqual(left: MentorProfileDraft, right: MentorProfileDraft) {
  return (
    left.headline === right.headline &&
    left.introduction === right.introduction &&
    left.teachingStyle === right.teachingStyle
  )
}

function getProfileSaveErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'
    return error.response.data?.message || 'Không thể lưu hồ sơ mentor lúc này.'
  }

  return 'Không thể lưu hồ sơ mentor lúc này.'
}

function uniqueStrings(items: Array<string | null | undefined>) {
  return items
    .map((item) => item?.trim())
    .filter((item): item is string => Boolean(item))
    .filter((item, index, values) => values.indexOf(item) === index)
}

function sortNumberList(items: number[]) {
  return [...items].sort((left, right) => left - right)
}

function areTraitValuesEqual(left: MentorTraitsDraft, right: MentorTraitsDraft) {
  const leftPersonalities = sortNumberList(left.personalityOptionIds)
  const rightPersonalities = sortNumberList(right.personalityOptionIds)
  const leftHighlights = sortNumberList(left.highlightOptionIds)
  const rightHighlights = sortNumberList(right.highlightOptionIds)

  return (
    leftPersonalities.length === rightPersonalities.length &&
    leftPersonalities.every((value, index) => value === rightPersonalities[index]) &&
    leftHighlights.length === rightHighlights.length &&
    leftHighlights.every((value, index) => value === rightHighlights[index])
  )
}

function mapTraitsToDraft(
  traits: CurrentMentorTraitsApiResponse | null | undefined
): MentorTraitsDraft {
  return {
    personalityOptionIds: traits?.personalityOptionIds ?? [],
    highlightOptionIds: traits?.highlightOptionIds ?? []
  }
}

function getAchievementYear(value: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (!Number.isNaN(date.getTime())) {
    return String(date.getFullYear())
  }

  return value.slice(0, 4)
}

function createEmptyAchievementDraft(): AchievementDraft {
  return {
    localId: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    id: null,
    title: '',
    description: '',
    achievementType: 'CERTIFICATE',
    issuer: '',
    achievedYear: String(new Date().getFullYear()),
    proofUrl: '',
    verified: false,
    isNew: true
  }
}

function mapAchievementToDraft(achievement: MentorAchievementDetailApiResponse): AchievementDraft {
  return {
    localId: `achievement-${achievement.id}`,
    id: achievement.id,
    title: achievement.title ?? '',
    description: achievement.description ?? '',
    achievementType: achievement.achievementType,
    issuer: achievement.issuer ?? '',
    achievedYear: getAchievementYear(achievement.achievedAt),
    proofUrl: achievement.proofUrl ?? '',
    verified: Boolean(achievement.verified),
    isNew: false
  }
}

function mapTraitLabels(
  traits: CurrentMentorTraitsApiResponse | null,
  personalityOptions: MentorOptionDetailApiResponse[],
  highlightOptions: MentorOptionDetailApiResponse[]
) {
  if (!traits) return []

  const optionsById = new Map<number, string>(
    [...personalityOptions, ...highlightOptions].map((option) => [option.id, option.name])
  )

  return uniqueStrings([
    ...traits.personalityOptionIds.map((id) => optionsById.get(id) ?? null),
    ...traits.highlightOptionIds.map((id) => optionsById.get(id) ?? null)
  ])
}

function buildAchievementPayload(draft: AchievementDraft) {
  return {
    title: draft.title.trim(),
    description: draft.description.trim() || null,
    achievementType: draft.achievementType,
    issuer: draft.issuer.trim() || null,
    achievedAt: draft.achievedYear ? `${draft.achievedYear}-01-01` : null,
    proofUrl: draft.proofUrl.trim() || null
  }
}

function formatVerificationDate(value: string | null) {
  if (!value) return null

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
}

function buildProfileExpertise(currentMentor: CurrentMentorApiResponse) {
  const value = uniqueStrings([
    currentMentor.currentPosition,
    currentMentor.workplace,
    currentMentor.major,
    currentMentor.education
  ]).join(' · ')

  return value || 'Bổ sung vị trí hiện tại, học vấn hoặc chuyên môn để hồ sơ rõ hơn.'
}

function buildProfileMeta(currentMentor: CurrentMentorApiResponse) {
  const location =
    currentMentor.currentLocation.districtName || currentMentor.currentLocation.cityName || null

  const value = uniqueStrings([
    currentMentor.meetingType ? formatMeetingTypeLabel(currentMentor.meetingType) : null,
    currentMentor.experienceYears !== null
      ? `${currentMentor.experienceYears} năm kinh nghiệm`
      : null,
    location
  ]).join(' · ')

  return value || 'Bổ sung hình thức học, kinh nghiệm và khu vực để hồ sơ rõ ràng hơn.'
}

function buildApprovalSummary(currentMentor: CurrentMentorApiResponse) {
  if (currentMentor.approvalNote?.trim()) {
    return `Ghi chú duyệt: ${currentMentor.approvalNote.trim()}`
  }

  if (currentMentor.approvalStatus === 'APPROVED') {
    return 'Hồ sơ đã được duyệt và sẵn sàng hiển thị công khai.'
  }

  if (currentMentor.approvalStatus === 'PENDING') {
    return 'Hồ sơ đang chờ duyệt. Giữ phần giới thiệu và offerings thật rõ ràng.'
  }

  if (currentMentor.approvalStatus === 'REJECTED') {
    return 'Hồ sơ từng bị từ chối duyệt. Hãy rà soát lại thông tin công khai.'
  }

  return 'Hồ sơ hiện đang tạm dừng hiển thị công khai.'
}

function buildVerificationSummary(
  currentMentor: CurrentMentorApiResponse,
  verification: CurrentMentorVerificationApiResponse | null
) {
  if (verification?.rejectionReason?.trim()) {
    return `Xác minh cần bổ sung: ${verification.rejectionReason.trim()}`
  }

  if (verification?.verifiedAt) {
    return `Giấy tờ đã được xác minh vào ${formatVerificationDate(verification.verifiedAt)}.`
  }

  if (currentMentor.verificationStatus === 'PENDING') {
    return 'Hồ sơ xác minh đang được đội ngũ kiểm tra.'
  }

  if (currentMentor.verificationStatus === 'UNVERIFIED') {
    return 'Bạn chưa gửi đủ thông tin xác minh cho hồ sơ hiện tại.'
  }

  return 'Trạng thái xác minh đang được đồng bộ từ backend.'
}

function ProfileFormSkeleton() {
  return (
    <div className='grid gap-6 xl:grid-cols-[1.55fr_0.75fr]'>
      <div className='space-y-6'>
        <div className='h-28 animate-pulse rounded-[26px] bg-slate-100' />
        <div className='h-16 animate-pulse rounded-[22px] bg-slate-100' />
        <div className='h-[420px] animate-pulse rounded-[26px] bg-slate-100' />
      </div>
      <div className='space-y-6'>
        <div className='h-80 animate-pulse rounded-[26px] bg-slate-100' />
        <div className='h-48 animate-pulse rounded-[26px] bg-slate-100' />
      </div>
    </div>
  )
}

function ProgressRing({ percent }: { percent: number }) {
  return (
    <div
      className='relative mx-auto grid h-36 w-36 place-items-center rounded-full'
      style={{
        background: `conic-gradient(#2563eb 0 ${percent}%, #dbeafe ${percent}% 100%)`
      }}
    >
      <div className='grid h-[104px] w-[104px] place-items-center rounded-full bg-white'>
        <div className='text-center'>
          <p className='text-ink text-3xl font-bold'>{percent}%</p>
          <p className='text-sm text-slate-500'>Tốt</p>
        </div>
      </div>
    </div>
  )
}

export function meta() {
  return [{ title: 'Hồ sơ mentor | Mentor' }]
}

export default function MentorProfilePage() {
  const {
    data: profileBundle,
    isLoading,
    isError,
    refetch: refetchProfile
  } = useCurrentMentorProfileQuery()
  const updateCurrentMentorMutation = useUpdateCurrentMentorMutation()
  const updateCurrentMentorTraitsMutation = useUpdateCurrentMentorTraitsMutation()
  const createAchievementMutation = useCreateCurrentMentorAchievementMutation()
  const updateAchievementMutation = useUpdateCurrentMentorAchievementMutation()
  const deleteAchievementMutation = useDeleteCurrentMentorAchievementMutation()

  const [activeTab, setActiveTab] = useState<ProfileTabKey>('general')
  const [draftFormValues, setDraftFormValues] = useState<MentorProfileDraft | null>(null)
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)
  const [draftTraitValues, setDraftTraitValues] = useState<MentorTraitsDraft | null>(null)
  const [traitsSuccessMessage, setTraitsSuccessMessage] = useState<string | null>(null)
  const [traitsErrorMessage, setTraitsErrorMessage] = useState<string | null>(null)
  const [draftAchievements, setDraftAchievements] = useState<AchievementDraft[] | null>(null)
  const [achievementsSuccessMessage, setAchievementsSuccessMessage] = useState<string | null>(null)
  const [achievementsErrorMessage, setAchievementsErrorMessage] = useState<string | null>(null)
  const [savingAchievementLocalId, setSavingAchievementLocalId] = useState<string | null>(null)
  const [deletingAchievementLocalId, setDeletingAchievementLocalId] = useState<string | null>(null)
  const [quickAddSubject, setQuickAddSubject] = useState('')
  const [quickAddGrade, setQuickAddGrade] = useState('')
  const [quickAddPrice, setQuickAddPrice] = useState('200.000')
  const [quickAddLevel, setQuickAddLevel] = useState('')

  const currentMentor = profileBundle?.currentMentor
  const sourceFormValues = currentMentor ? mapMentorToFormValues(currentMentor) : emptyDraft
  const formValues = draftFormValues ?? sourceFormValues
  const isSubmitting = updateCurrentMentorMutation.isPending
  const hasUnsavedChanges = !areFormValuesEqual(formValues, sourceFormValues)
  const sourceTraitValues = mapTraitsToDraft(profileBundle?.traits)
  const traitValues = draftTraitValues ?? sourceTraitValues
  const isSubmittingTraits = updateCurrentMentorTraitsMutation.isPending
  const hasUnsavedTraitChanges = !areTraitValuesEqual(traitValues, sourceTraitValues)
  const sourceAchievements = useMemo(
    () => (profileBundle?.achievements ?? []).map(mapAchievementToDraft),
    [profileBundle?.achievements]
  )
  const achievementDrafts = draftAchievements ?? sourceAchievements
  const hasAchievementItems = achievementDrafts.length > 0

  const offeringSummaries = useMemo(
    () =>
      (profileBundle?.subjects ?? []).map((subject) => ({
        ...subject,
        label: `${subject.subjectName} · ${subject.gradeName}`
      })),
    [profileBundle?.subjects]
  )

  const traitLabels = useMemo(
    () =>
      mapTraitLabels(
        profileBundle?.traits ?? null,
        profileBundle?.personalityOptions ?? [],
        profileBundle?.highlightOptions ?? []
      ),
    [profileBundle?.highlightOptions, profileBundle?.personalityOptions, profileBundle?.traits]
  )

  const completionItems = useMemo(
    () => [
      {
        label: 'Thông tin chung',
        done: Boolean(
          formValues.headline.trim() &&
          formValues.introduction.trim() &&
          formValues.teachingStyle.trim()
        )
      },
      {
        label: 'Nổi bật & Đặc điểm',
        done: traitLabels.length > 0
      },
      {
        label: 'Thành tựu',
        done: (profileBundle?.achievements ?? []).length > 0
      },
      {
        label: 'Danh mục & Học phí',
        done: offeringSummaries.some((offering) => offering.active)
      }
    ],
    [
      formValues.headline,
      formValues.introduction,
      formValues.teachingStyle,
      offeringSummaries,
      profileBundle?.achievements,
      traitLabels.length
    ]
  )

  const completionPercent = Math.round(
    (completionItems.filter((item) => item.done).length / completionItems.length) * 100
  )

  const previewPrice = offeringSummaries.find((offering) => offering.active)?.pricePerHour ?? null
  const canQuickAdd = Boolean(quickAddSubject && quickAddGrade && quickAddLevel && quickAddPrice)

  const handleFieldChange =
    (field: keyof MentorProfileDraft) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSaveSuccessMessage(null)
      setSubmitErrorMessage(null)
      setDraftFormValues((currentValues) => ({
        ...(currentValues ?? sourceFormValues),
        [field]: event.target.value
      }))
    }

  const handleRetry = () => {
    setDraftFormValues(null)
    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)
    setDraftTraitValues(null)
    setTraitsSuccessMessage(null)
    setTraitsErrorMessage(null)
    setDraftAchievements(null)
    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)
    setSavingAchievementLocalId(null)
    setDeletingAchievementLocalId(null)
    void refetchProfile()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentMentor) return

    setSaveSuccessMessage(null)
    setSubmitErrorMessage(null)

    updateCurrentMentorMutation.mutate(
      {
        gender: currentMentor.gender,
        hometownCityId: currentMentor.hometown.cityId,
        currentDistrictId: currentMentor.currentLocation.districtId,
        headline: formValues.headline.trim() || null,
        introduction: formValues.introduction.trim() || null,
        teachingStyle: formValues.teachingStyle.trim() || null,
        experienceYears: currentMentor.experienceYears,
        currentPosition: currentMentor.currentPosition,
        workplace: currentMentor.workplace,
        education: currentMentor.education,
        major: currentMentor.major,
        meetingType: currentMentor.meetingType
      },
      {
        onSuccess: ({ currentMentor: updatedCurrentMentor, message }) => {
          setDraftFormValues(mapMentorToFormValues(updatedCurrentMentor))
          setSaveSuccessMessage(message || 'Hồ sơ mentor đã được cập nhật thành công.')
        },
        onError: (error) => {
          setSubmitErrorMessage(getProfileSaveErrorMessage(error))
        }
      }
    )
  }

  const toggleTrait = (group: 'personalityOptionIds' | 'highlightOptionIds', optionId: number) => {
    setTraitsSuccessMessage(null)
    setTraitsErrorMessage(null)
    setDraftTraitValues((currentValues) => {
      const nextValues = currentValues ?? sourceTraitValues
      const currentGroup = nextValues[group]
      const exists = currentGroup.includes(optionId)

      return {
        ...nextValues,
        [group]: exists
          ? currentGroup.filter((value) => value !== optionId)
          : [...currentGroup, optionId]
      }
    })
  }

  const handleTraitsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setTraitsSuccessMessage(null)
    setTraitsErrorMessage(null)

    updateCurrentMentorTraitsMutation.mutate(traitValues, {
      onSuccess: ({ traits, message }) => {
        setDraftTraitValues(mapTraitsToDraft(traits))
        setTraitsSuccessMessage(message || 'Đã cập nhật nổi bật và đặc điểm thành công.')
      },
      onError: (error) => {
        setTraitsErrorMessage(getProfileSaveErrorMessage(error))
      }
    })
  }

  const updateAchievementDraft = (
    localId: string,
    patch:
      | Partial<AchievementDraft>
      | ((currentDraft: AchievementDraft) => Partial<AchievementDraft>)
  ) => {
    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)
    setDraftAchievements((currentDrafts) => {
      const nextDrafts = currentDrafts ?? sourceAchievements

      return nextDrafts.map((draft) => {
        if (draft.localId !== localId) return draft

        const nextPatch = typeof patch === 'function' ? patch(draft) : patch
        return {
          ...draft,
          ...nextPatch
        }
      })
    })
  }

  const handleAddAchievementDraft = () => {
    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)
    setDraftAchievements((currentDrafts) => [
      ...(currentDrafts ?? sourceAchievements),
      createEmptyAchievementDraft()
    ])
  }

  const handleResetAchievements = () => {
    setDraftAchievements(null)
    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)
    setSavingAchievementLocalId(null)
    setDeletingAchievementLocalId(null)
  }

  const handleAchievementFileChange =
    (localId: string) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : ''
        updateAchievementDraft(localId, { proofUrl: result })
      }
      reader.readAsDataURL(file)
      event.target.value = ''
    }

  const handleSaveAchievement = (draft: AchievementDraft) => {
    const payload = buildAchievementPayload(draft)

    if (!payload.title.trim()) {
      setAchievementsErrorMessage('Tên thành tựu là bắt buộc trước khi lưu.')
      return
    }

    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)
    setSavingAchievementLocalId(draft.localId)

    const onSuccess = (message: string) => {
      setAchievementsSuccessMessage(message)
      setDraftAchievements(null)
      setSavingAchievementLocalId(null)
    }

    const onError = (error: unknown) => {
      setAchievementsErrorMessage(getProfileSaveErrorMessage(error))
      setSavingAchievementLocalId(null)
    }

    if (draft.id) {
      updateAchievementMutation.mutate(
        { achievementId: draft.id, payload },
        {
          onSuccess: ({ message }) => onSuccess(message || 'Đã cập nhật thành tựu.'),
          onError
        }
      )
      return
    }

    createAchievementMutation.mutate(payload, {
      onSuccess: ({ message }) => onSuccess(message || 'Đã thêm thành tựu mới.'),
      onError
    })
  }

  const handleDeleteAchievement = (draft: AchievementDraft) => {
    setAchievementsSuccessMessage(null)
    setAchievementsErrorMessage(null)

    if (!draft.id) {
      setDraftAchievements((currentDrafts) =>
        (currentDrafts ?? sourceAchievements).filter((item) => item.localId !== draft.localId)
      )
      return
    }

    setDeletingAchievementLocalId(draft.localId)
    deleteAchievementMutation.mutate(draft.id, {
      onSuccess: ({ message }) => {
        setAchievementsSuccessMessage(message || 'Đã xóa thành tựu.')
        setDraftAchievements(null)
        setDeletingAchievementLocalId(null)
      },
      onError: (error) => {
        setAchievementsErrorMessage(getProfileSaveErrorMessage(error))
        setDeletingAchievementLocalId(null)
      }
    })
  }

  if (isLoading && !profileBundle) {
    return (
      <DashboardPage className='space-y-8 md:space-y-10' title='Hồ sơ cá nhân'>
        <ProfileFormSkeleton />
      </DashboardPage>
    )
  }

  if (isError || !profileBundle || !currentMentor) {
    return (
      <DashboardPage className='space-y-8 md:space-y-10' title='Hồ sơ cá nhân'>
        <ScreenErrorState
          description='Không thể tải hồ sơ mentor hiện tại hoặc các dữ liệu liên quan. Vui lòng thử lại để tiếp tục.'
          onRetry={handleRetry}
          retryLabel='Tải lại hồ sơ'
          title='Không tải được hồ sơ mentor'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage className='space-y-6 md:space-y-7' title='Hồ sơ cá nhân'>
      <div className='grid gap-6 xl:grid-cols-[1.55fr_0.75fr]'>
        <div className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='flex flex-col gap-5 p-6 md:flex-row md:items-start md:justify-between'>
              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-3'>
                  <StatusBadge kind='approval' status={currentMentor.approvalStatus} />
                  <StatusBadge kind='verification' status={currentMentor.verificationStatus} />
                </div>
                <div className='space-y-2'>
                  <p className='text-ink text-[2rem] font-bold tracking-tight'>
                    {currentMentor.fullName}
                  </p>
                  <p className='text-slate-600'>
                    {currentMentor.headline?.trim() ||
                      'Bổ sung headline để học viên hiểu nhanh thế mạnh của bạn.'}
                  </p>
                  <p className='text-sm text-slate-500'>{buildProfileExpertise(currentMentor)}</p>
                  <p className='text-sm text-slate-500'>{buildProfileMeta(currentMentor)}</p>
                </div>
              </div>

              <Link to={path.mentorProfile(String(currentMentor.id))}>
                <Button className='h-11 rounded-xl px-5' variant='outline'>
                  <Eye size={16} />
                  Xem hồ sơ công khai
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='rounded-[24px] border-slate-200 shadow-none'>
            <CardContent className='p-2'>
              <div className='flex flex-wrap gap-2'>
                {profileTabs.map((tab) => {
                  const selected = activeTab === tab.key

                  return (
                    <button
                      className={cn(
                        'flex items-center gap-2 rounded-[18px] px-4 py-3 text-sm font-medium transition md:px-5',
                        selected
                          ? 'bg-blue-50 text-blue-700 shadow-[inset_0_-2px_0_#2563eb]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      type='button'
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {activeTab === 'general' ? (
            <form className='space-y-6' onSubmit={handleSubmit}>
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Thông tin hiển thị công khai
                    </p>
                    <p className='text-sm text-slate-500'>
                      Cập nhật các thông tin giúp học viên hiểu rõ hơn về bạn.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='mentor-headline'>Tiêu đề hồ sơ</Label>
                    <Input
                      disabled={isSubmitting}
                      id='mentor-headline'
                      onChange={handleFieldChange('headline')}
                      placeholder='Ví dụ: Mentor Toán với 5 năm kinh nghiệm'
                      value={formValues.headline}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='mentor-introduction'>Giới thiệu bản thân</Label>
                    <Textarea
                      className='min-h-40'
                      disabled={isSubmitting}
                      id='mentor-introduction'
                      onChange={handleFieldChange('introduction')}
                      placeholder='Giới thiệu ngắn gọn về thế mạnh, đối tượng học viên phù hợp và cách bạn đồng hành.'
                      value={formValues.introduction}
                    />
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='mentor-teaching-style'>Phong cách giảng dạy</Label>
                    <Textarea
                      className='min-h-36'
                      disabled={isSubmitting}
                      id='mentor-teaching-style'
                      onChange={handleFieldChange('teachingStyle')}
                      placeholder='Mô tả cách bạn tổ chức buổi học, giao bài và phản hồi cho học viên.'
                      value={formValues.teachingStyle}
                    />
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
                </CardContent>
              </Card>

              <Card className='rounded-[24px] border-slate-200 shadow-none'>
                <CardContent className='flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end'>
                  <Button
                    className='rounded-xl px-5'
                    disabled={isSubmitting || !hasUnsavedChanges}
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setDraftFormValues(null)
                      setSaveSuccessMessage(null)
                      setSubmitErrorMessage(null)
                    }}
                  >
                    Hủy thay đổi
                  </Button>
                  <Button className='rounded-xl px-5' isLoading={isSubmitting} type='submit'>
                    Lưu thông tin
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : null}

          {activeTab === 'traits' ? (
            <form className='space-y-6' onSubmit={handleTraitsSubmit}>
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-8 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Đặc điểm & Thế mạnh nổi bật
                    </p>
                    <p className='text-sm text-slate-500'>
                      Chọn các thẻ phản ánh đúng phong cách và thế mạnh của bạn để học viên dễ dàng
                      tìm kiếm.
                    </p>
                  </div>

                  <TraitOptionSection
                    description='Các nhãn này giúp học viên lọc mentor theo cách đồng hành phù hợp.'
                    emptyMessage='Backend chưa trả về option phong cách giảng dạy.'
                    onToggle={(optionId) => toggleTrait('personalityOptionIds', optionId)}
                    options={profileBundle.personalityOptions}
                    selectedIds={traitValues.personalityOptionIds}
                    title='Phong cách giảng dạy'
                  />

                  <TraitOptionSection
                    description='Các nhãn nổi bật này hỗ trợ học viên lọc mentor theo mục tiêu và nhu cầu cụ thể.'
                    emptyMessage='Backend chưa trả về option thế mạnh nổi bật.'
                    onToggle={(optionId) => toggleTrait('highlightOptionIds', optionId)}
                    options={profileBundle.highlightOptions}
                    selectedIds={traitValues.highlightOptionIds}
                    title='Thế mạnh chuyên môn'
                  />

                  <div className='grid gap-4 md:grid-cols-2'>
                    <InfoMiniCard
                      description={buildProfileExpertise(currentMentor)}
                      icon={GraduationCap}
                      title='Bối cảnh chuyên môn'
                    />
                    <InfoMiniCard
                      description={
                        traitLabels.length
                          ? `Các thẻ đã chọn hiện tại: ${traitLabels.join(', ')}.`
                          : 'Chưa có thẻ nào được chọn để hiển thị trên hồ sơ và bộ lọc học viên.'
                      }
                      icon={Lightbulb}
                      title='Hiển thị với học viên'
                    />
                  </div>

                  {traitsErrorMessage ? (
                    <div
                      aria-live='polite'
                      className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                      role='alert'
                    >
                      {traitsErrorMessage}
                    </div>
                  ) : null}
                </CardContent>
              </Card>

              <Card className='rounded-[24px] border-slate-200 shadow-none'>
                <CardContent className='flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end'>
                  <Button
                    className='rounded-xl px-5'
                    disabled={isSubmittingTraits || !hasUnsavedTraitChanges}
                    type='button'
                    variant='outline'
                    onClick={() => {
                      setDraftTraitValues(null)
                      setTraitsSuccessMessage(null)
                      setTraitsErrorMessage(null)
                    }}
                  >
                    Hủy thay đổi
                  </Button>
                  <Button className='rounded-xl px-5' isLoading={isSubmittingTraits} type='submit'>
                    Lưu thông tin
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : null}

          {activeTab === 'achievements' ? (
            <form className='space-y-6' onSubmit={(event) => event.preventDefault()}>
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Thành tựu & Bằng cấp
                    </p>
                    <p className='text-sm text-slate-500'>
                      Thêm các bằng cấp, chứng chỉ và giải thưởng để minh chứng rõ năng lực của bạn.
                    </p>
                  </div>

                  {hasAchievementItems ? (
                    <div className='space-y-4'>
                      {achievementDrafts.map((achievement) => {
                        const isSaving = savingAchievementLocalId === achievement.localId
                        const isDeleting = deletingAchievementLocalId === achievement.localId

                        return (
                          <Card
                            className='rounded-[24px] border-slate-200 shadow-none'
                            key={achievement.localId}
                          >
                            <CardContent className='space-y-5 p-4 md:p-5'>
                              <div className='grid gap-4 md:grid-cols-[1.25fr_0.72fr_0.6fr]'>
                                <div className='space-y-2'>
                                  <Label>Loại thành tựu</Label>
                                  <AppSelect
                                    ariaLabel='Loại thành tựu'
                                    className='[&_button]:h-12 [&_button]:rounded-xl [&_button]:text-slate-900!'
                                    onValueChange={(value) =>
                                      updateAchievementDraft(achievement.localId, {
                                        achievementType: value as MentorAchievementTypeApiResponse
                                      })
                                    }
                                    options={achievementTypeOptions}
                                    placeholder='Chọn loại thành tựu'
                                    value={achievement.achievementType}
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label>Trạng thái xác minh</Label>
                                  <div className='flex h-12 items-center rounded-xl bg-emerald-50 px-4 text-sm font-medium text-emerald-700'>
                                    {achievement.verified ? (
                                      <>
                                        <Check size={16} className='mr-2' />
                                        Đã xác thực
                                      </>
                                    ) : (
                                      'Chờ xác thực'
                                    )}
                                  </div>
                                </div>

                                <div className='space-y-2'>
                                  <Label>Năm đạt được</Label>
                                  <AppSelect
                                    ariaLabel='Năm đạt được'
                                    className='[&_button]:h-12 [&_button]:rounded-xl [&_button]:text-slate-900!'
                                    onValueChange={(value) =>
                                      updateAchievementDraft(achievement.localId, {
                                        achievedYear: value
                                      })
                                    }
                                    options={Array.from({ length: 16 }, (_, index) => {
                                      const year = String(new Date().getFullYear() - index)
                                      return { label: year, value: year }
                                    })}
                                    placeholder='Chọn năm'
                                    value={achievement.achievedYear}
                                  />
                                </div>
                              </div>

                              <div className='grid gap-4 md:grid-cols-2'>
                                <div className='space-y-2'>
                                  <Label>Tên thành tựu</Label>
                                  <Input
                                    className='h-12 rounded-xl'
                                    onChange={(event) =>
                                      updateAchievementDraft(achievement.localId, {
                                        title: event.target.value
                                      })
                                    }
                                    placeholder='Ví dụ: Chứng chỉ IELTS 8.0'
                                    value={achievement.title}
                                  />
                                </div>

                                <div className='space-y-2'>
                                  <Label>Tổ chức cấp</Label>
                                  <div className='relative'>
                                    <Building2
                                      className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-slate-400'
                                      size={16}
                                    />
                                    <Input
                                      className='h-12 rounded-xl pl-11'
                                      onChange={(event) =>
                                        updateAchievementDraft(achievement.localId, {
                                          issuer: event.target.value
                                        })
                                      }
                                      placeholder='Ví dụ: British Council'
                                      value={achievement.issuer}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className='space-y-2'>
                                <Label>Mô tả chi tiết</Label>
                                <Textarea
                                  className='min-h-28 rounded-2xl'
                                  onChange={(event) =>
                                    updateAchievementDraft(achievement.localId, {
                                      description: event.target.value
                                    })
                                  }
                                  placeholder='Mô tả ngắn kết quả, điểm số hoặc ý nghĩa của thành tựu này.'
                                  value={achievement.description}
                                />
                              </div>

                              <AchievementProofPanel
                                fileInputId={`achievement-proof-${achievement.localId}`}
                                onClear={() =>
                                  updateAchievementDraft(achievement.localId, { proofUrl: '' })
                                }
                                onFileChange={handleAchievementFileChange(achievement.localId)}
                                proofUrl={achievement.proofUrl}
                              />

                              <div className='flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                                <div className='flex items-center gap-2 text-sm text-slate-500'>
                                  <CalendarRange size={15} />
                                  <span>
                                    {achievement.achievedYear
                                      ? `Đang gắn mốc năm ${achievement.achievedYear}`
                                      : `Chưa chọn năm đạt được`}
                                  </span>
                                </div>

                                <div className='flex flex-wrap justify-end gap-3'>
                                  <Button
                                    className='rounded-xl px-4 text-red-600 hover:text-red-700'
                                    disabled={isDeleting || isSaving}
                                    onClick={() => handleDeleteAchievement(achievement)}
                                    type='button'
                                    variant='outline'
                                  >
                                    <Trash2 size={15} />
                                    {achievement.id ? 'Xóa thành tựu' : 'Bỏ thẻ mới'}
                                  </Button>
                                  <Button
                                    className='rounded-xl px-5'
                                    isLoading={isSaving}
                                    onClick={() => handleSaveAchievement(achievement)}
                                    type='button'
                                  >
                                    {achievement.isNew ? 'Lưu thành tựu mới' : 'Cập nhật thành tựu'}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                      <CardContent className='p-4 text-sm text-slate-600'>
                        Bạn chưa có thành tựu công khai nào. Hãy thêm chứng chỉ, giải thưởng hoặc
                        bằng cấp đầu tiên để hồ sơ thuyết phục hơn.
                      </CardContent>
                    </Card>
                  )}

                  {achievementsErrorMessage ? (
                    <div
                      aria-live='polite'
                      className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                      role='alert'
                    >
                      {achievementsErrorMessage}
                    </div>
                  ) : null}

                  <Button
                    className='h-12 w-full rounded-xl text-base'
                    onClick={handleAddAchievementDraft}
                    type='button'
                  >
                    <Plus size={18} />
                    Thêm thành tựu mới
                  </Button>
                </CardContent>
              </Card>

              <Card className='rounded-[24px] border-slate-200 shadow-none'>
                <CardContent className='flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end'>
                  <Button
                    className='rounded-xl px-5'
                    disabled={
                      createAchievementMutation.isPending ||
                      updateAchievementMutation.isPending ||
                      deleteAchievementMutation.isPending
                    }
                    type='button'
                    variant='outline'
                    onClick={handleResetAchievements}
                  >
                    Hủy thay đổi
                  </Button>
                  <Button className='rounded-xl px-5' disabled type='button'>
                    Lưu thông tin
                  </Button>
                </CardContent>
              </Card>
            </form>
          ) : null}

          {activeTab === 'offerings' ? (
            <Card className='rounded-[26px] border-slate-200 shadow-none'>
              <CardContent className='space-y-5 p-6'>
                <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Danh mục môn dạy & Học phí
                    </p>
                    <p className='text-sm text-slate-500'>
                      Thiết lập các môn học, cấp lớp và mức phí bạn muốn cung cấp cho học viên.
                    </p>
                  </div>
                  <Button
                    className='h-12 rounded-xl px-5 text-base shadow-[0_12px_24px_rgba(37,99,235,0.18)]'
                    disabled
                  >
                    <Plus size={18} />
                    Thêm môn dạy mới
                  </Button>
                </div>

                {offeringSummaries.length ? (
                  <div className='space-y-3'>
                    {offeringSummaries.map((offering, index) => {
                      const iconMap = [Sigma, GraduationCap, Atom, FlaskConical] as const
                      const Icon = iconMap[index % iconMap.length]

                      return (
                        <Card
                          className='rounded-2xl border-slate-200 shadow-none'
                          key={offering.id}
                        >
                          <CardContent className='flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between'>
                            <div className='flex min-w-0 flex-1 items-start gap-4'>
                              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700'>
                                <Icon size={22} />
                              </div>

                              <div className='min-w-0 space-y-2'>
                                <div className='flex flex-wrap items-center gap-2'>
                                  <p className='text-ink text-[1.4rem] font-bold tracking-tight'>
                                    {offering.label.replace(' · ', ' - ')}
                                  </p>
                                  <Badge variant='info'>
                                    {proficiencyLabelMap[offering.proficiencyLevel]}
                                  </Badge>
                                </div>
                                <div className='flex flex-wrap items-center gap-2 text-sm text-slate-600'>
                                  <p className='text-primary text-[1.05rem] font-semibold'>
                                    {formatPrice(offering.pricePerHour)}/giờ
                                  </p>
                                  <span>•</span>
                                  <span>
                                    {offering.teachingNote?.trim() ||
                                      'Thiết lập lộ trình và hình thức học sẽ hiển thị ở đây.'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className='flex items-center gap-3 self-end md:min-w-[188px] md:justify-end md:self-center'>
                              <div className='flex items-center gap-2 text-sm text-slate-700'>
                                <span>Hiển thị</span>
                                <button
                                  aria-label='Hiển thị offering'
                                  className={cn(
                                    'relative flex h-7 w-12 items-center rounded-full border transition',
                                    offering.active
                                      ? 'border-blue-600 bg-blue-600'
                                      : 'border-slate-300 bg-slate-200'
                                  )}
                                  disabled
                                  type='button'
                                >
                                  <span
                                    className={cn(
                                      'absolute flex h-5 w-5 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm transition',
                                      offering.active ? 'right-1' : 'left-1 text-slate-400'
                                    )}
                                  >
                                    {offering.active ? <Check size={12} /> : null}
                                  </span>
                                </button>
                              </div>
                              <button
                                aria-label='Chỉnh sửa offering'
                                className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800'
                                disabled
                                type='button'
                              >
                                <PenLine size={18} />
                              </button>
                              <button
                                aria-label='Xóa offering'
                                className='rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800'
                                disabled
                                type='button'
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                    <CardContent className='p-4 text-sm text-slate-600'>
                      Bạn chưa có offering nào được trả về từ `getCurrentMentorSubjects()`.
                    </CardContent>
                  </Card>
                )}

                <div className='rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 p-4 md:p-5'>
                  <div className='space-y-4'>
                    <div className='flex items-center gap-3 text-sm font-medium text-slate-700'>
                      <span className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-700 shadow-sm'>
                        <Plus size={16} />
                      </span>
                      <span>Thêm mục mới nhanh</span>
                    </div>

                    <div className='grid gap-3 md:grid-cols-4'>
                      <div className='space-y-2'>
                        <Label>Môn học</Label>
                        <AppSelect
                          ariaLabel='Chọn môn học'
                          className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                          onValueChange={setQuickAddSubject}
                          options={[
                            { label: 'Toán', value: 'toan' },
                            { label: 'Vật lý', value: 'vat-ly' },
                            { label: 'Hóa học', value: 'hoa-hoc' }
                          ]}
                          placeholder='Chọn môn học'
                          value={quickAddSubject}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Cấp lớp</Label>
                        <AppSelect
                          ariaLabel='Chọn cấp lớp'
                          className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                          onValueChange={setQuickAddGrade}
                          options={[
                            { label: 'Lớp 8', value: 'lop-8' },
                            { label: 'Lớp 9', value: 'lop-9' },
                            { label: 'Lớp 10', value: 'lop-10' }
                          ]}
                          placeholder='Chọn lớp'
                          value={quickAddGrade}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Học phí (đ/giờ)</Label>
                        <Input
                          className='h-11 rounded-xl'
                          onChange={(event) => setQuickAddPrice(event.target.value)}
                          value={quickAddPrice}
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label>Cấp độ</Label>
                        <AppSelect
                          ariaLabel='Chọn cấp độ'
                          className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                          onValueChange={setQuickAddLevel}
                          options={[
                            { label: 'Cơ bản', value: 'basic' },
                            { label: 'Nâng cao', value: 'advanced' },
                            { label: 'Chuyên sâu', value: 'expert' }
                          ]}
                          placeholder='Cơ bản'
                          value={quickAddLevel}
                        />
                      </div>
                    </div>

                    <div className='flex flex-col gap-3 border-t border-slate-200/80 pt-4 sm:flex-row sm:items-center sm:justify-end'>
                      <Button className='rounded-xl px-4' disabled type='button' variant='outline'>
                        Hủy bỏ
                      </Button>
                      <Button className='rounded-xl px-5' disabled={!canQuickAdd} type='button'>
                        Tạo mới
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-3 border-t border-slate-100 pt-4'>
                  <div className='flex gap-3'>
                    <Button className='rounded-xl px-5' disabled type='button' variant='outline'>
                      Hủy thay đổi
                    </Button>
                    <Button className='rounded-xl px-5' disabled type='button'>
                      Lưu thông tin
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
        </div>

        <aside className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='space-y-5 p-6'>
              <p className='text-ink text-lg font-semibold'>Mức độ hoàn thiện hồ sơ</p>
              <ProgressRing percent={completionPercent} />
              <div className='space-y-3'>
                {completionItems.map((item) => (
                  <div className='flex items-center justify-between gap-3' key={item.label}>
                    <div className='flex items-center gap-2'>
                      <span
                        className={cn(
                          'h-4 w-4 rounded-full border',
                          item.done
                            ? 'border-emerald-500 bg-emerald-500'
                            : 'border-slate-300 bg-white'
                        )}
                      />
                      <p className='text-sm text-slate-700'>{item.label}</p>
                    </div>
                    <span
                      className={cn(
                        'text-sm font-medium',
                        item.done ? 'text-emerald-700' : 'text-slate-400'
                      )}
                    >
                      {item.done ? 'Đã có' : 'Thiếu'}
                    </span>
                  </div>
                ))}
              </div>
              {saveSuccessMessage || traitsSuccessMessage || achievementsSuccessMessage ? (
                <div className='rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700'>
                  {saveSuccessMessage ?? traitsSuccessMessage ?? achievementsSuccessMessage}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='space-y-4 p-6'>
              <div className='flex items-start gap-3'>
                <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl'>
                  <Lightbulb size={18} />
                </div>
                <div className='space-y-1'>
                  <p className='text-ink font-semibold'>Mẹo nhỏ</p>
                  <p className='text-sm leading-relaxed text-slate-600'>
                    Headline rõ, teaching style cụ thể và offerings đang mở là 3 tín hiệu được học
                    viên nhìn đầu tiên.
                  </p>
                </div>
              </div>
              <div className='space-y-2 rounded-2xl bg-slate-50 p-4'>
                <p className='text-sm text-slate-700'>{buildApprovalSummary(currentMentor)}</p>
                <p className='text-sm text-slate-700'>
                  {buildVerificationSummary(currentMentor, profileBundle.verification ?? null)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className='overflow-hidden rounded-[26px] border-slate-200 shadow-none'>
            <div className='h-20 bg-gradient-to-r from-blue-700 to-blue-500' />
            <CardContent className='space-y-4 p-6 pt-0'>
              <div className='-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm'>
                {currentMentor.fullName
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase()}
              </div>
              <div className='space-y-1'>
                <p className='text-ink font-semibold'>{currentMentor.fullName}</p>
                <p className='text-sm text-slate-500'>
                  {currentMentor.headline?.trim() || 'Mentor đang hoàn thiện headline công khai.'}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='warning'>
                  <Star size={14} />
                  Chưa có đánh giá
                </Badge>
                {previewPrice !== null ? (
                  <Badge variant='info'>{formatPrice(previewPrice)}/giờ</Badge>
                ) : null}
              </div>
              <Link to={path.mentorProfile(String(currentMentor.id))}>
                <Button className='w-full rounded-xl' variant='outline'>
                  Xem trang công khai
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className='rounded-[22px] border-slate-200 bg-slate-50 shadow-none'>
            <CardContent className='p-4 text-sm text-slate-600'>
              Màn này đang dùng dữ liệu thật từ current mentor, subjects, traits, achievements và
              verification. Video giới thiệu chưa được tính vào mức độ hoàn thiện vì backend hiện
              chưa hỗ trợ.
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardPage>
  )
}

function TraitOptionSection({
  title,
  description,
  options,
  selectedIds,
  emptyMessage,
  onToggle
}: {
  title: string
  description: string
  options: MentorOptionDetailApiResponse[]
  selectedIds: number[]
  emptyMessage: string
  onToggle: (optionId: number) => void
}) {
  return (
    <section className='space-y-4'>
      <div className='space-y-1'>
        <p className='text-ink text-[1.35rem] font-bold tracking-tight'>{title}</p>
        <p className='text-sm text-slate-500'>{description}</p>
      </div>

      {options.length ? (
        <div className='flex flex-wrap gap-3'>
          {options.map((option) => {
            const selected = selectedIds.includes(option.id)

            return (
              <button
                className={cn(
                  'flex min-h-12 items-center gap-3 rounded-2xl border px-4 py-3 text-left text-base font-medium transition',
                  selected
                    ? 'border-blue-700 bg-blue-700 text-white shadow-[0_10px_18px_rgba(37,99,235,0.18)]'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                )}
                key={option.id}
                onClick={() => onToggle(option.id)}
                type='button'
              >
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition',
                    selected
                      ? 'border-white/30 bg-white text-blue-700'
                      : 'border-slate-300 bg-white text-transparent'
                  )}
                >
                  <Check size={14} />
                </span>
                <span>{option.name}</span>
                {selected ? <Check size={16} className='ml-1 shrink-0' /> : null}
              </button>
            )
          })}
        </div>
      ) : (
        <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
          <CardContent className='p-4 text-sm text-slate-600'>{emptyMessage}</CardContent>
        </Card>
      )}
    </section>
  )
}

function AchievementProofPanel({
  proofUrl,
  fileInputId,
  onFileChange,
  onClear
}: {
  proofUrl: string
  fileInputId: string
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
}) {
  return (
    <div className='grid gap-4 md:grid-cols-[1.1fr_0.9fr]'>
      <div className='space-y-2'>
        <Label htmlFor={fileInputId}>Chứng chỉ/Ảnh minh chứng</Label>
        <label
          className='flex min-h-[116px] cursor-pointer items-center gap-4 rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-4 py-4 transition hover:border-blue-300 hover:bg-blue-50/40'
          htmlFor={fileInputId}
        >
          <span className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm'>
            {proofUrl ? (
              <img
                alt='Ảnh minh chứng'
                className='h-full w-full rounded-2xl object-cover'
                src={proofUrl}
              />
            ) : (
              <ImagePlus size={28} />
            )}
          </span>

          <span className='min-w-0 space-y-2'>
            <span className='block text-base font-semibold text-slate-800'>
              {proofUrl ? 'Ảnh minh chứng đã chọn' : 'Tải ảnh minh chứng'}
            </span>
            <span className='block text-sm leading-relaxed text-slate-500'>
              {proofUrl
                ? 'Bạn có thể bấm để thay ảnh khác hoặc xoá ảnh hiện tại.'
                : 'Ưu tiên ảnh rõ nét của chứng chỉ, bằng cấp hoặc giấy xác nhận liên quan.'}
            </span>
            {proofUrl ? (
              <span className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm'>
                <FileImage size={14} />
                Proof image ready
              </span>
            ) : (
              <span className='inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm'>
                <Upload size={14} />
                PNG, JPG, WEBP
              </span>
            )}
          </span>
        </label>
        <input
          accept='image/png,image/jpeg,image/webp'
          className='hidden'
          id={fileInputId}
          onChange={onFileChange}
          type='file'
        />
      </div>

      <div className='space-y-2'>
        <Label>Ảnh minh chứng hiện tại</Label>
        <div className='flex min-h-[116px] flex-col justify-between rounded-[22px] border border-slate-200 bg-white p-4'>
          {proofUrl ? (
            <>
              <div className='space-y-2'>
                <p className='text-sm font-medium text-slate-800'>Đã có ảnh minh chứng</p>
                <p className='text-xs leading-relaxed break-all text-slate-500'>{proofUrl}</p>
              </div>
              <div className='flex justify-end'>
                <Button
                  className='rounded-xl px-4'
                  onClick={onClear}
                  type='button'
                  variant='outline'
                >
                  <X size={14} />
                  Xóa ảnh
                </Button>
              </div>
            </>
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-slate-400'>
              Chưa có ảnh minh chứng.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function InfoMiniCard({
  title,
  description,
  icon: Icon
}: {
  title: string
  description: string
  icon: typeof GraduationCap
}) {
  return (
    <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
      <CardContent className='flex items-start gap-3 p-4'>
        <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl'>
          <Icon size={18} />
        </div>
        <div className='space-y-1'>
          <p className='text-ink font-semibold'>{title}</p>
          <p className='text-sm leading-relaxed text-slate-600'>{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
