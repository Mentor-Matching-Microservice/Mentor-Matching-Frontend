import type { ComponentProps } from 'react'

import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import type { BadgeProps } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner'
import type { CurrentMentorOnboardingStatusApiResponse } from '@/types/api/mentor'

import { BecomeMentorPersonalSection } from './BecomeMentorPersonalSection'
import { BecomeMentorTeachingSection } from './BecomeMentorTeachingSection'

type BecomeMentorProfileStepProps = {
  formId: string
  isError: boolean
  isLoading: boolean
  onRetry: () => void
  onSubmit: () => void
  personalSectionProps: ComponentProps<typeof BecomeMentorPersonalSection>
  status?: CurrentMentorOnboardingStatusApiResponse
  teachingSectionProps: ComponentProps<typeof BecomeMentorTeachingSection>
}

export function BecomeMentorProfileStep({
  formId,
  isError,
  isLoading,
  onRetry,
  onSubmit,
  personalSectionProps,
  status,
  teachingSectionProps
}: BecomeMentorProfileStepProps) {
  if (isLoading) {
    return (
      <div className='flex min-h-72 items-center justify-center rounded-[28px] border border-slate-200 bg-white'>
        <Spinner label='Đang tải hồ sơ mentor của bạn...' size='lg' />
      </div>
    )
  }

  if (isError) {
    return (
      <ScreenErrorState
        description='Không thể tải hồ sơ mentor hiện tại. Hãy thử lại trước khi tiếp tục.'
        onRetry={onRetry}
        title='Không tải được hồ sơ'
      />
    )
  }

  const profileStatus = getProfileStatus(status)

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm'>
        <div>
          <p className='text-sm font-semibold text-slate-900'>Trạng thái hồ sơ</p>
          {profileStatus.description ? (
            <p className='text-sm text-slate-500'>{profileStatus.description}</p>
          ) : null}
        </div>
        <Badge variant={profileStatus.variant}>{profileStatus.label}</Badge>
      </div>

      <form className='space-y-6' id={formId} onSubmit={onSubmit}>
        <BecomeMentorPersonalSection eyebrow='Phần 1' {...personalSectionProps} />
        <BecomeMentorTeachingSection eyebrow='Phần 2' {...teachingSectionProps} />
      </form>
    </div>
  )
}

function getProfileStatus(status: CurrentMentorOnboardingStatusApiResponse | undefined): {
  description?: string
  label: string
  variant: BadgeProps['variant']
} {
  if (!status?.mentorProfileCreated) {
    return {
      description: 'Bạn chưa tạo hồ sơ mentor. Bấm tiếp tục để lưu hồ sơ lần đầu.',
      label: 'Chưa tạo',
      variant: 'warning'
    }
  }

  if (!status.profileDetailsCompleted) {
    return {
      label: 'Bản nháp',
      variant: 'info'
    }
  }

  if (status.approvalStatus === 'APPROVED') {
    return {
      description: 'Hồ sơ mentor đã được duyệt và có thể sử dụng trong khu mentor.',
      label: 'Đã duyệt',
      variant: 'success'
    }
  }

  if (status.approvalStatus === 'REJECTED') {
    return {
      description: 'Hồ sơ cần điều chỉnh trước khi gửi duyệt lại.',
      label: 'Cần chỉnh sửa',
      variant: 'destructive'
    }
  }

  return {
    description: 'Hồ sơ đã được lưu, bạn có thể hoàn thiện các bước tiếp theo.',
    label: 'Đang hoàn thiện',
    variant: 'muted'
  }
}
