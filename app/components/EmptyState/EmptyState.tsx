import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { BookOpen } from 'lucide-react'

import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  action,
  actionHref,
  actionLabel,
  className,
  description,
  icon,
  title
}: EmptyStateProps) {
  return (
    <Card className={cn('border-dashed bg-white/90 text-center shadow-none', className)}>
      <CardContent className='flex min-h-[260px] flex-col items-center justify-center p-8 md:p-10'>
        <div className='bg-primary/10 text-primary mb-5 flex h-14 w-14 items-center justify-center rounded-2xl'>
          {icon ?? <BookOpen aria-hidden='true' size={26} />}
        </div>
        <h2 className='text-ink text-lg font-semibold'>{title}</h2>
        <p className='text-muted mt-2 max-w-md text-sm leading-relaxed'>{description}</p>
        {action ? <div className='mt-6'>{action}</div> : null}
        {actionHref && actionLabel ? (
          <Link className={cn(buttonVariants({ size: 'lg' }), 'mt-6 rounded-full')} to={actionHref}>
            {actionLabel}
          </Link>
        ) : null}
      </CardContent>
    </Card>
  )
}
