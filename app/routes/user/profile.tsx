import axios from 'axios'
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react'
import {
  BookOpenText,
  ClipboardList,
  GraduationCap,
  Sparkles,
  Target,
  UserCircle2
} from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { AppSelect } from '@/components/ui/app-select'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useCatalogGradesQuery } from '@/hooks/queries/catalog/useCatalogOptionsQuery'
import { useCurrentLearnerProfileQuery } from '@/hooks/queries/user/useCurrentLearnerProfileQuery'
import { useUpdateCurrentUserProfileMutation } from '@/hooks/queries/user/useUpdateCurrentUserProfileMutation'
import type { ErrorResponse, Gender } from '@/types/api/common'
import type { LearnerProfileApiResponse } from '@/types/api/user'
import type { CurrentUser, UserType } from '@/types/models/user'
import { cn } from '@/utils/cn'

type ProfileFormValues = {
  fullName: string
  email: string
  phone: string
  userType: UserType | ''
  gender: Gender | ''
  birthYear: string
  schoolName: string
  gradeId: string
  learningGoal: string
}

type UserProfileTabKey = 'account' | 'learning' | 'goals'

const DEFAULT_USER_TYPE: UserType = 'STUDENT'

const emptyFormValues: ProfileFormValues = {
  fullName: '',
  email: '',
  phone: '',
  userType: '',
  gender: '',
  birthYear: '',
  schoolName: '',
  gradeId: '',
  learningGoal: ''
}

const userProfileTabs: Array<{
  key: UserProfileTabKey
  label: string
  icon: typeof UserCircle2
}> = [
  { key: 'account', label: 'Thông tin chung', icon: UserCircle2 },
  { key: 'learning', label: 'Bối cảnh học tập', icon: GraduationCap },
  { key: 'goals', label: 'Mục tiêu học tập', icon: Target }
]

const userTypeOptions: Array<{ label: string; value: UserType }> = [
  { label: 'Học sinh', value: 'STUDENT' },
  { label: 'Phụ huynh', value: 'PARENT' },
  { label: 'Sinh viên', value: 'UNIVERSITY_STUDENT' },
  { label: 'Người đi làm', value: 'WORKING_ADULT' }
]

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' }
]

function formatGradeLabel(name: string) {
  return name.replace(/^Lop\s+/i, 'Lớp ')
}

function mapProfileToFormValues(
  currentUser: CurrentUser,
  learnerProfile: LearnerProfileApiResponse
): ProfileFormValues {
  return {
    fullName: currentUser.fullName,
    email: currentUser.email,
    phone: currentUser.phone,
    userType: currentUser.userType ?? '',
    gender: learnerProfile.gender ?? '',
    birthYear: learnerProfile.birthYear ? String(learnerProfile.birthYear) : '',
    schoolName: learnerProfile.schoolName ?? '',
    gradeId: learnerProfile.gradeId ? String(learnerProfile.gradeId) : '',
    learningGoal: learnerProfile.learningGoal ?? ''
  }
}

function parseBirthYear(value: string): number | null {
  const normalizedValue = value.trim()

  if (!normalizedValue) return null

  const parsedValue = Number(normalizedValue)
  return Number.isInteger(parsedValue) ? parsedValue : null
}

function isValidBirthYear(value: string) {
  const parsedValue = parseBirthYear(value)

  if (parsedValue === null) return true

  const currentYear = new Date().getFullYear()
  return parsedValue >= 1900 && parsedValue <= currentYear
}

function areFormValuesEqual(left: ProfileFormValues, right: ProfileFormValues) {
  return (
    left.fullName === right.fullName &&
    left.email === right.email &&
    left.phone === right.phone &&
    left.userType === right.userType &&
    left.gender === right.gender &&
    left.birthYear === right.birthYear &&
    left.schoolName === right.schoolName &&
    left.gradeId === right.gradeId &&
    left.learningGoal === right.learningGoal
  )
}

function getProfileSaveErrorMessage(error: unknown) {
  if (axios.isAxiosError<ErrorResponse>(error)) {
    if (!error.response) return 'Không kết nối được máy chủ.'
    return error.response.data?.message || 'Không thể lưu hồ sơ lúc này.'
  }

  return 'Không thể lưu hồ sơ lúc này.'
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
          <p className='text-sm text-slate-500'>Sẵn sàng</p>
        </div>
      </div>
    </div>
  )
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

function InfoMiniCard({
  title,
  description,
  icon: Icon
}: {
  title: string
  description: string
  icon: typeof BookOpenText
}) {
  return (
    <Card className='rounded-2xl border-slate-200 bg-slate-50/70 shadow-none'>
      <CardContent className='flex items-start gap-3 p-4'>
        <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
          <Icon size={18} />
        </div>
        <div className='space-y-1.5'>
          <p className='text-ink font-semibold'>{title}</p>
          <p className='text-sm leading-relaxed text-slate-600'>{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function meta() {
  return [{ title: 'Hồ sơ | Học viên' }]
}

export default function UserProfilePage() {
  const {
    data: currentUser,
    isLoading: isCurrentUserLoading,
    isError: isCurrentUserError,
    refetch: refetchCurrentUser
  } = useCurrentUserQuery()
  const {
    data: learnerProfile,
    isLoading: isLearnerProfileLoading,
    isError: isLearnerProfileError,
    refetch: refetchLearnerProfile
  } = useCurrentLearnerProfileQuery()
  const {
    data: grades,
    isLoading: isGradesLoading,
    isError: isGradesError,
    refetch: refetchGrades
  } = useCatalogGradesQuery()
  const updateCurrentUserProfileMutation = useUpdateCurrentUserProfileMutation()

  const [activeTab, setActiveTab] = useState<UserProfileTabKey>('account')
  const [draftFormValues, setDraftFormValues] = useState<ProfileFormValues | null>(null)
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null)
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null)

  const sourceFormValues =
    currentUser && learnerProfile
      ? mapProfileToFormValues(currentUser, learnerProfile)
      : emptyFormValues
  const formValues = draftFormValues ?? sourceFormValues

  const completionItems = [
    {
      label: 'Thông tin liên hệ',
      done: Boolean(formValues.fullName.trim() && formValues.phone.trim() && formValues.userType)
    },
    {
      label: 'Bối cảnh học tập',
      done: Boolean(
        formValues.schoolName.trim() && formValues.gradeId && formValues.birthYear.trim()
      )
    },
    {
      label: 'Mục tiêu học tập',
      done: Boolean(formValues.learningGoal.trim())
    }
  ]

  const completedCount = completionItems.filter((item) => item.done).length
  const completionPercent = Math.round((completedCount / completionItems.length) * 100)
  const selectedGrade = grades?.find((grade) => String(grade.id) === formValues.gradeId) ?? null
  const selectedUserTypeLabel =
    userTypeOptions.find((option) => option.value === formValues.userType)?.label ??
    'Chưa chọn vai trò'
  const selectedGenderLabel =
    genderOptions.find((option) => option.value === formValues.gender)?.label ??
    'Chưa bổ sung giới tính'
  const isPageLoading =
    (!currentUser || !learnerProfile || !grades) &&
    (isCurrentUserLoading || isLearnerProfileLoading || isGradesLoading)
  const hasPageError = isCurrentUserError || isLearnerProfileError || isGradesError
  const isSubmitting = updateCurrentUserProfileMutation.isPending
  const hasUnsavedChanges = !areFormValuesEqual(formValues, sourceFormValues)

  const handleFieldChange =
    (field: keyof ProfileFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setSubmitErrorMessage(null)
      setDraftFormValues((currentValues) => ({
        ...(currentValues ?? sourceFormValues),
        [field]: event.target.value
      }))
    }

  const handleSelectChange = (field: keyof ProfileFormValues) => (value: string) => {
    setSubmitErrorMessage(null)
    setDraftFormValues((currentValues) => ({
      ...(currentValues ?? sourceFormValues),
      [field]: value
    }))
  }

  const handleRetry = () => {
    setDraftFormValues(null)
    setSaveToastMessage(null)
    setSubmitErrorMessage(null)
    void refetchCurrentUser()
    void refetchLearnerProfile()
    void refetchGrades()
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!currentUser) return

    setSaveToastMessage(null)
    setSubmitErrorMessage(null)

    if (!formValues.userType) {
      setSubmitErrorMessage('Vui lòng chọn vai trò học tập để hoàn thiện hồ sơ.')
      return
    }

    if (!isValidBirthYear(formValues.birthYear)) {
      setSubmitErrorMessage('Năm sinh không hợp lệ. Vui lòng nhập năm trong khoảng hợp lý.')
      return
    }

    updateCurrentUserProfileMutation.mutate(
      {
        user: {
          fullName: formValues.fullName.trim(),
          phone: formValues.phone.trim(),
          userType: formValues.userType || currentUser.userType || DEFAULT_USER_TYPE
        },
        learnerProfile: {
          gender: formValues.gender || null,
          birthYear: parseBirthYear(formValues.birthYear),
          schoolName: formValues.schoolName.trim() || null,
          gradeId: formValues.gradeId ? Number(formValues.gradeId) : null,
          learningGoal: formValues.learningGoal.trim() || null
        }
      },
      {
        onSuccess: ({
          currentUser: updatedCurrentUser,
          learnerProfile: updatedLearnerProfile,
          message
        }) => {
          setDraftFormValues(mapProfileToFormValues(updatedCurrentUser, updatedLearnerProfile))
          setSaveToastMessage(message || 'Hồ sơ đã được cập nhật thành công.')
        },
        onError: (error) => {
          setSubmitErrorMessage(getProfileSaveErrorMessage(error))
        }
      }
    )
  }

  useEffect(() => {
    if (!saveToastMessage) return

    const timeoutId = window.setTimeout(() => {
      setSaveToastMessage(null)
    }, 3500)

    return () => window.clearTimeout(timeoutId)
  }, [saveToastMessage])

  if (isPageLoading) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
        title='Hồ sơ học viên'
      >
        <ProfileFormSkeleton />
      </DashboardPage>
    )
  }

  if (hasPageError || !currentUser || !learnerProfile || !grades) {
    return (
      <DashboardPage
        className='space-y-8 md:space-y-10'
        description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
        title='Hồ sơ học viên'
      >
        <ScreenErrorState
          description='Không thể tải hồ sơ học viên hoặc dữ liệu lớp học lúc này. Vui lòng thử lại để tiếp tục.'
          onRetry={handleRetry}
          retryLabel='Tải lại hồ sơ'
          title='Không tải được hồ sơ'
        />
      </DashboardPage>
    )
  }

  return (
    <DashboardPage
      className='space-y-6 md:space-y-7'
      description='Giữ hồ sơ học viên rõ ràng để mentor hiểu nhanh bối cảnh học tập và mục tiêu hiện tại của bạn.'
      title='Hồ sơ học viên'
    >
      {saveToastMessage ? (
        <div
          role='status'
          aria-live='polite'
          className='fixed top-5 right-5 z-50 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg shadow-emerald-900/10'
        >
          {saveToastMessage}
        </div>
      ) : null}

      <div className='grid gap-6 xl:grid-cols-[1.55fr_0.75fr]'>
        <div className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='p-6'>
              <div className='space-y-3'>
                <div className='flex flex-wrap items-center gap-3'>
                  <Badge variant='info'>{selectedUserTypeLabel}</Badge>
                  {selectedGrade ? (
                    <Badge variant='success'>{formatGradeLabel(selectedGrade.name)}</Badge>
                  ) : null}
                </div>
                <div className='space-y-2'>
                  <p className='text-ink text-[2rem] font-bold tracking-tight'>
                    {formValues.fullName || 'Hồ sơ học viên'}
                  </p>
                  <p className='text-slate-600'>
                    {formValues.learningGoal.trim() ||
                      'Bổ sung mục tiêu học tập để mentor hiểu nhanh điều bạn đang cần cải thiện.'}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {[
                      selectedGenderLabel,
                      formValues.birthYear ? `Sinh năm ${formValues.birthYear}` : null,
                      formValues.phone || null
                    ]
                      .filter(Boolean)
                      .join(' · ') || 'Bổ sung thông tin cơ bản để hồ sơ đầy đủ hơn.'}
                  </p>
                  <p className='text-sm text-slate-500'>
                    {[
                      formValues.schoolName || null,
                      selectedGrade ? formatGradeLabel(selectedGrade.name) : null
                    ]
                      .filter(Boolean)
                      .join(' · ') ||
                      'Bổ sung trường lớp hiện tại để mentor chuẩn bị nội dung sát nhu cầu.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className='rounded-[24px] border-slate-200 shadow-none'>
            <CardContent className='p-2'>
              <div className='flex flex-wrap gap-2'>
                {userProfileTabs.map((tab) => {
                  const selected = activeTab === tab.key

                  return (
                    <button
                      key={tab.key}
                      type='button'
                      onClick={() => setActiveTab(tab.key)}
                      className={cn(
                        'flex items-center gap-2 rounded-[18px] px-4 py-3 text-sm font-medium transition md:px-5',
                        selected
                          ? 'bg-blue-50 text-blue-700 shadow-[inset_0_-2px_0_#2563eb]'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <form className='space-y-6' onSubmit={handleSubmit}>
            {activeTab === 'account' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Thông tin tài khoản
                    </p>
                    <p className='text-sm text-slate-500'>
                      Đây là những dữ liệu mentor nhìn đầu tiên khi chuẩn bị buổi học và liên hệ xác
                      nhận lịch.
                    </p>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-full-name'>Họ và tên</Label>
                      <Input
                        id='learner-full-name'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('fullName')}
                        value={formValues.fullName}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-email'>Email</Label>
                      <Input
                        id='learner-email'
                        disabled
                        readOnly
                        type='email'
                        value={formValues.email}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-phone'>Số điện thoại</Label>
                      <Input
                        id='learner-phone'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('phone')}
                        type='tel'
                        value={formValues.phone}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Giới tính</Label>
                      <AppSelect
                        ariaLabel='Chọn giới tính'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('gender')}
                        options={genderOptions}
                        placeholder='Chọn giới tính'
                        value={formValues.gender}
                      />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label>Vai trò học tập</Label>
                      <AppSelect
                        ariaLabel='Chọn vai trò học tập'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('userType')}
                        options={userTypeOptions}
                        placeholder='Chọn vai trò học tập'
                        value={formValues.userType}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {activeTab === 'learning' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Bối cảnh học tập
                    </p>
                    <p className='text-sm text-slate-500'>
                      Thông tin trường lớp giúp mentor căn đúng trình độ, tốc độ học và bài tập cần
                      chuẩn bị.
                    </p>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <div className='space-y-2'>
                      <Label htmlFor='learner-birth-year'>Năm sinh</Label>
                      <Input
                        id='learner-birth-year'
                        className='h-11 rounded-xl'
                        disabled={isSubmitting}
                        inputMode='numeric'
                        onChange={handleFieldChange('birthYear')}
                        placeholder='Ví dụ: 2009'
                        value={formValues.birthYear}
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Lớp hiện tại</Label>
                      <AppSelect
                        ariaLabel='Chọn lớp hiện tại'
                        className='[&_button]:h-11 [&_button]:rounded-xl [&_button]:text-slate-900!'
                        disabled={isSubmitting}
                        onValueChange={handleSelectChange('gradeId')}
                        options={grades.map((grade) => ({
                          label: formatGradeLabel(grade.name),
                          value: String(grade.id)
                        }))}
                        placeholder='Chọn lớp hiện tại'
                        value={formValues.gradeId}
                      />
                    </div>
                    <div className='space-y-2 md:col-span-2'>
                      <Label htmlFor='learner-school'>Trường / trung tâm</Label>
                      <Input
                        id='learner-school'
                        className='h-11 rounded-xl'
                        disabled={isSubmitting}
                        onChange={handleFieldChange('schoolName')}
                        placeholder='Ví dụ: THPT Nguyễn Thượng Hiền'
                        value={formValues.schoolName}
                      />
                    </div>
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <InfoMiniCard
                      title='Ngữ cảnh hiện tại'
                      icon={GraduationCap}
                      description={
                        [
                          formValues.schoolName || null,
                          selectedGrade ? formatGradeLabel(selectedGrade.name) : null
                        ]
                          .filter(Boolean)
                          .join(' · ') || 'Chưa có đủ dữ liệu trường lớp để mentor đọc nhanh hồ sơ.'
                      }
                    />
                    <InfoMiniCard
                      title='Tín hiệu matching'
                      icon={Sparkles}
                      description='Khi trường lớp rõ ràng, mentor sẽ dễ đánh giá lịch phù hợp và chuẩn bị lộ trình học sát hơn.'
                    />
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {activeTab === 'goals' ? (
              <Card className='rounded-[26px] border-slate-200 shadow-none'>
                <CardContent className='space-y-5 p-6'>
                  <div className='space-y-1'>
                    <p className='text-ink text-[1.9rem] font-bold tracking-tight'>
                      Mục tiêu học tập
                    </p>
                    <p className='text-sm text-slate-500'>
                      Mô tả ngắn điều bạn đang muốn cải thiện để mentor hiểu rõ lý do đặt buổi học.
                    </p>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='learner-goal'>Mục tiêu hiện tại</Label>
                    <Textarea
                      id='learner-goal'
                      className='min-h-40 rounded-2xl'
                      disabled={isSubmitting}
                      onChange={handleFieldChange('learningGoal')}
                      placeholder='Ví dụ: Củng cố nền tảng Toán lớp 9, chuẩn bị thi vào 10 hoặc cải thiện kỹ năng IELTS...'
                      value={formValues.learningGoal}
                    />
                  </div>

                  <div className='grid gap-4 md:grid-cols-2'>
                    <InfoMiniCard
                      title='Tóm tắt hiển thị với mentor'
                      icon={BookOpenText}
                      description={
                        formValues.learningGoal.trim() ||
                        'Chưa có mô tả mục tiêu học tập để mentor đọc nhanh trước khi nhận booking.'
                      }
                    />
                    <InfoMiniCard
                      title='Lưu ý khi mô tả'
                      icon={ClipboardList}
                      description='Hãy nói rõ môn học, mức hiện tại và mục tiêu gần nhất. Mô tả cụ thể sẽ giúp mentor đề xuất buổi học phù hợp hơn.'
                    />
                  </div>

                  {submitErrorMessage ? (
                    <div
                      role='alert'
                      aria-live='polite'
                      className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700'
                    >
                      {submitErrorMessage}
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            ) : null}

            <Card className='rounded-[24px] border-slate-200 shadow-none'>
              <CardContent className='flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-end'>
                <Button
                  className='rounded-xl px-5'
                  disabled={isSubmitting || !hasUnsavedChanges}
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setDraftFormValues(null)
                    setSaveToastMessage(null)
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
        </div>

        <aside className='space-y-6'>
          <Card className='rounded-[26px] border-slate-200 shadow-none'>
            <CardContent className='space-y-5 p-6'>
              <p className='text-ink text-lg font-semibold'>Mức độ hoàn thiện hồ sơ</p>
              <ProgressRing percent={completionPercent} />
              <div className='space-y-3'>
                {completionItems.map((item) => (
                  <div key={item.label} className='flex items-center justify-between gap-3'>
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
            </CardContent>
          </Card>

          <Card className='overflow-hidden rounded-[26px] border-slate-200 shadow-none'>
            <div className='h-20 bg-gradient-to-r from-blue-700 to-blue-500' />
            <CardContent className='space-y-4 p-6 pt-0'>
              <div className='-mt-8 flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-lg font-semibold text-slate-700 shadow-sm'>
                {formValues.fullName
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')
                  .toUpperCase() || 'HV'}
              </div>
              <div className='space-y-1'>
                <p className='text-ink font-semibold'>{formValues.fullName || 'Học viên'}</p>
                <p className='text-sm text-slate-500'>
                  {formValues.learningGoal.trim() || 'Đang hoàn thiện mô tả mục tiêu học tập.'}
                </p>
              </div>
              <div className='flex flex-wrap gap-2'>
                <Badge variant='info'>{selectedUserTypeLabel}</Badge>
                {selectedGrade ? (
                  <Badge variant='success'>{formatGradeLabel(selectedGrade.name)}</Badge>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </DashboardPage>
  )
}
