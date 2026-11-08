import type { ReactNode } from 'react'

import { cn } from '@/utils/cn'

type DashboardSectionHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function DashboardSectionHeader({ action, className, title }: DashboardSectionHeaderProps) {
  return (
    <div
      className={cn('flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between', className)}
    >
      <div className='space-y-1'>
        <h2 className='text-ink text-lg font-semibold'>{title}</h2>
      </div>
      {action ? <div className='shrink-0'>{action}</div> : null}
    </div>
  )
}
