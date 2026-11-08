import type { LabelHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn('text-ink text-sm font-medium', className)} />
}
