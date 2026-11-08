import { LoaderCircle } from 'lucide-react'
import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type SpinnerProps = HTMLAttributes<HTMLDivElement> & {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClassMap = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-10'
} as const

export function Spinner({ className, label, size = 'md', ...props }: SpinnerProps) {
  return (
    <div
      {...props}
      aria-busy='true'
      aria-live='polite'
      className={cn('inline-flex items-center gap-3 text-slate-500', className)}
      role='status'
    >
      <LoaderCircle
        aria-hidden='true'
        className={cn('text-primary animate-spin', sizeClassMap[size])}
      />
      {label ? <span className='text-sm font-medium text-slate-600'>{label}</span> : null}
    </div>
  )
}
