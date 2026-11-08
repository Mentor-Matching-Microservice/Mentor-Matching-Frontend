import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical'
}) {
  return (
    <div
      {...props}
      aria-orientation={orientation}
      className={cn(
        'shrink-0 bg-slate-200',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className
      )}
      role='separator'
    />
  )
}
