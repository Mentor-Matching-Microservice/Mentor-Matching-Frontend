import type { LucideIcon } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

type WorkspaceMetricTone = 'default' | 'info' | 'success' | 'warning' | 'danger' | 'neutral'

type WorkspaceMetricCardProps = {
  label: string
  value: string | number
  helper?: string
  icon?: LucideIcon
  tone?: WorkspaceMetricTone
  className?: string
}

const toneClassMap: Record<WorkspaceMetricTone, string> = {
  default: 'bg-slate-100 text-slate-700',
  info: 'bg-primary/10 text-primary',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  neutral: 'bg-slate-100 text-slate-700'
}

export function WorkspaceMetricCard({
  className,
  helper,
  icon: Icon,
  label,
  tone = 'info',
  value
}: WorkspaceMetricCardProps) {
  return (
    <Card className={cn('rounded-3xl', className)}>
      <CardContent className='flex h-full items-start gap-4 p-5'>
        {Icon ? (
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
              toneClassMap[tone]
            )}
          >
            <Icon aria-hidden='true' size={20} />
          </div>
        ) : null}
        <div className='space-y-1.5'>
          <p className='text-muted text-xs font-semibold tracking-wide uppercase'>{label}</p>
          <p className='text-ink text-2xl font-semibold md:text-3xl'>{value}</p>
          {helper ? <p className='text-muted text-sm leading-relaxed'>{helper}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
