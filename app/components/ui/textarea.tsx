/* eslint-disable react/prop-types */
import * as React from 'react'

import { cn } from '@/utils/cn'

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        {...props}
        ref={ref}
        className={cn(
          'border-line bg-base text-ink placeholder:text-muted focus:border-primary focus:ring-primary/10 flex min-h-28 w-full rounded-xl border px-3 py-2.5 text-sm transition-colors outline-none focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
