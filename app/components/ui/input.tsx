/* eslint-disable react/prop-types */
import * as React from 'react'

import { cn } from '@/utils/cn'

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        className={cn(
          'border-line bg-base text-ink placeholder:text-muted focus:border-primary focus:ring-primary/10 flex h-11 w-full rounded-xl border px-3 py-2 text-sm transition-colors outline-none focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    )
  }
)

Input.displayName = 'Input'

export { Input }
