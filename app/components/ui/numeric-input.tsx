import * as React from 'react'

import { Input, type InputProps } from '@/components/ui/input'

type NumericInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  onValueChange: (value: string) => void
  value: string
}

export function sanitizeDigits(value: string) {
  return value.replace(/\D/g, '')
}

export const NumericInput = React.forwardRef<HTMLInputElement, NumericInputProps>(
  ({ inputMode = 'numeric', onValueChange, value, ...props }, ref) => {
    return (
      <Input
        {...props}
        ref={ref}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onValueChange(sanitizeDigits(event.target.value))}
      />
    )
  }
)

NumericInput.displayName = 'NumericInput'
