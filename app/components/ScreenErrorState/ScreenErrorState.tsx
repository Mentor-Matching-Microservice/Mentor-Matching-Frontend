import { AlertTriangle } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { Button } from '@/components/ui/button'

type ScreenErrorStateProps = {
  title?: string
  description?: string
  retryLabel?: string
  onRetry?: () => void
}

export function ScreenErrorState({
  description = 'Không thể tải dữ liệu màn hình lúc này. Vui lòng thử lại để tiếp tục.',
  onRetry,
  retryLabel = 'Thử lại',
  title = 'Đã có lỗi xảy ra'
}: ScreenErrorStateProps) {
  return (
    <EmptyState
      className='border-red-100 bg-red-50/40'
      description={description}
      icon={<AlertTriangle aria-hidden='true' size={26} />}
      title={title}
      action={
        onRetry ? (
          <Button className='rounded-full' onClick={onRetry} type='button' variant='destructive'>
            {retryLabel}
          </Button>
        ) : null
      }
    />
  )
}
