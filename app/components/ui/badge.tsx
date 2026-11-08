import type { HTMLAttributes } from 'react'

import { cn } from '@/utils/cn'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'success'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'muted'

const variantClassMap: Record<BadgeVariant, string> = {
  default: 'border-primary/15 bg-primary/10 text-primary',
  secondary: 'border-slate-200 bg-slate-100 text-slate-700',
  outline: 'border-slate-200 bg-white text-slate-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  destructive: 'border-red-200 bg-red-50 text-red-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  muted: 'border-slate-200 bg-slate-50 text-slate-600'
}

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={cn(
        'inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-semibold',
        variantClassMap[variant],
        className
      )}
    />
  )
}
