import type { ButtonHTMLAttributes } from 'react'

import { Button as UIButton, type ButtonProps as UIButtonProps } from '@/components/ui/button'

type ButtonVariant = 'primary' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = Omit<UIButtonProps, 'size' | 'variant'> &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    isLoading?: boolean
  }

const variantMap: Record<ButtonVariant, UIButtonProps['variant']> = {
  primary: 'default',
  secondary: 'secondary',
  danger: 'destructive'
}

const sizeMap: Record<ButtonSize, UIButtonProps['size']> = {
  sm: 'sm',
  md: 'default',
  lg: 'lg'
}

export function Button({ size = 'md', variant = 'primary', ...props }: ButtonProps) {
  return <UIButton {...props} size={sizeMap[size]} variant={variantMap[variant]} />
}
