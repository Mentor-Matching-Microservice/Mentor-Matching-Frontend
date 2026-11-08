import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

type WorkspaceNoticeTone = 'info' | 'warning' | 'neutral'

type WorkspaceNoticeProps = {
  title: string
  description: string
  icon: LucideIcon
  tone?: WorkspaceNoticeTone
  className?: string
}

const toneClassMap: Record<WorkspaceNoticeTone, string> = {
  info: 'border-blue-100 bg-blue-50 text-blue-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  neutral: 'border-slate-200 bg-slate-50 text-slate-900'
}

const iconToneClassMap: Record<WorkspaceNoticeTone, string> = {
  info: 'text-blue-700',
  warning: 'text-amber-700',
  neutral: 'text-slate-700'
}

const bodyToneClassMap: Record<WorkspaceNoticeTone, string> = {
  info: 'text-blue-800',
  warning: 'text-amber-800',
  neutral: 'text-slate-700'
}

export function WorkspaceNotice({
  className,
  description,
  icon: Icon,
  title,
  tone = 'info'
}: WorkspaceNoticeProps) {
  return (
    <Card className={cn('rounded-3xl shadow-sm', toneClassMap[tone], className)}>
      <CardContent className='flex items-start gap-3 p-4 md:p-5'>
        <div className={cn('mt-0.5 shrink-0', iconToneClassMap[tone])}>
          <Icon aria-hidden='true' size={18} />
        </div>
        <div className='space-y-1.5'>
          <p className='font-semibold'>{title}</p>
          <p className={cn('text-sm leading-relaxed', bodyToneClassMap[tone])}>{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
