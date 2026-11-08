import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

import { EmptyState } from '@/components/EmptyState'
import { cn } from '@/utils/cn'

type DashboardPageProps = {
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function DashboardPage({ title, description, children, className }: DashboardPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('relative space-y-6 md:space-y-8', className)}
    >
      {title || description ? (
        <div className='relative z-10 flex flex-col gap-2'>
          {title ? (
            <h1 className='text-ink text-2xl font-semibold tracking-tight md:text-3xl'>{title}</h1>
          ) : null}
          {description ? (
            <p className='text-muted max-w-3xl text-sm md:text-base'>{description}</p>
          ) : null}
        </div>
      ) : null}

      <div className='relative z-10'>
        {children ?? (
          <EmptyState
            className='min-h-[300px]'
            description='Tính năng này đang trong quá trình hoàn thiện. Khi có dữ liệu hoặc workflow sẵn sàng, nội dung sẽ hiển thị tại đây.'
            icon={<Sparkles aria-hidden='true' size={28} />}
            title='Đang phát triển'
          />
        )}
      </div>
    </motion.div>
  )
}
