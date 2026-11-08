import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils/cn'

type WorkspaceActionCardProps = {
  to: string
  title: string
  description: string
  icon: LucideIcon
  className?: string
}

export function WorkspaceActionCard({
  className,
  description,
  icon: Icon,
  title,
  to
}: WorkspaceActionCardProps) {
  return (
    <Link className='block h-full' to={to}>
      <Card
        className={cn(
          'hover:border-primary/30 hover:bg-primary/5 rounded-3xl transition',
          className
        )}
      >
        <CardContent className='flex h-full items-start gap-4 p-5'>
          <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
            <Icon aria-hidden='true' size={20} />
          </div>
          <div className='space-y-1'>
            <p className='text-ink font-semibold'>{title}</p>
            <p className='text-muted text-sm leading-relaxed'>{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
