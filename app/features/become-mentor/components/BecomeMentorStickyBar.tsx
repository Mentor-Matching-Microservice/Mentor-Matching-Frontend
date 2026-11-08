import { ArrowLeft, ArrowRight, Save } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type BecomeMentorStickyBarProps = {
  completedCount: number
  currentStepIndex: number
  currentStepLabel: string
  currentStepFormId: string
  isFirstStep: boolean
  isLastStep: boolean
  isReadyForFinalSubmit?: boolean
  isSubmitting?: boolean
  onBack: () => void
  onFinalSubmit?: () => void
  totalCount: number
}

export function BecomeMentorStickyBar({
  completedCount,
  currentStepIndex,
  currentStepLabel,
  currentStepFormId,
  isFirstStep,
  isLastStep,
  isReadyForFinalSubmit = false,
  isSubmitting = false,
  onBack,
  onFinalSubmit,
  totalCount
}: BecomeMentorStickyBarProps) {
  return (
    <div className='sticky bottom-4 z-30 mt-8'>
      <div className='mx-auto flex w-full max-w-5xl flex-col gap-4 rounded-[28px] border border-slate-200 bg-white/96 px-4 py-4 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur md:flex-row md:items-center md:justify-between md:px-6'>
        <div className='space-y-1'>
          <div className='flex flex-wrap items-center gap-2'>
            <Badge variant={completedCount === totalCount ? 'success' : 'warning'}>
              {completedCount}/{totalCount} bước hoàn tất
            </Badge>
            <span className='text-sm text-slate-500'>
              Bước {currentStepIndex + 1}/{totalCount}: {currentStepLabel}
            </span>
          </div>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
          <Button className='rounded-2xl' variant='outline'>
            <Save size={16} />
            Lưu nháp
          </Button>
          {!isFirstStep ? (
            <Button className='rounded-2xl' onClick={onBack} size='lg' variant='outline'>
              <ArrowLeft size={16} />
              Quay lại
            </Button>
          ) : null}
          <Button
            className='rounded-2xl'
            form={isLastStep && isReadyForFinalSubmit ? undefined : currentStepFormId}
            isLoading={isSubmitting}
            onClick={isLastStep && isReadyForFinalSubmit ? onFinalSubmit : undefined}
            size='lg'
            type={isLastStep && isReadyForFinalSubmit ? 'button' : 'submit'}
          >
            {isLastStep ? 'Gửi duyệt hồ sơ' : 'Tiếp tục'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
