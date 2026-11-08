import type { SelectHTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        'focus-visible:ring-primary/15 flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    />
  )
}
