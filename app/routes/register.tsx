import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { path } from '@/config/path'
import { emailSchema } from '@/schemas/common.schema'
import { authApi } from '@/services/auth.api'
import type { ErrorResponse } from '@/types/api/common'

const registerSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await authApi.register(values)
      setRegisteredEmail(values.email)
    } catch (error) {
      const response = axios.isAxiosError<ErrorResponse>(error) ? error.response?.data : null
      setError('root', {
        message: response?.detail || response?.message || 'Không thể đăng ký. Vui lòng thử lại.'
      })
    }
  })

  return (
    <main className='bg-background flex min-h-screen flex-col items-center justify-center gap-6 p-6'>
      <Link to={path.home} aria-label='Trang chủ'>
        <BrandLogo />
      </Link>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle>Đăng ký tài khoản</CardTitle>
          <CardDescription>
            {registeredEmail
              ? `Tài khoản ${registeredEmail} đã được tạo và đang chờ xác minh.`
              : 'Tạo tài khoản học viên bằng email và mật khẩu.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registeredEmail ? (
            <p className='text-muted-foreground text-sm'>
              Tài khoản chưa thể đăng nhập cho tới khi được xác minh.
            </p>
          ) : (
            <form onSubmit={onSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  autoComplete='email'
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                {errors.email && <p className='text-destructive text-sm'>{errors.email.message}</p>}
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='password'>Mật khẩu</Label>
                <Input
                  id='password'
                  type='password'
                  autoComplete='new-password'
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-destructive text-sm'>{errors.password.message}</p>
                )}
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor='confirmPassword'>Xác nhận mật khẩu</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  autoComplete='new-password'
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className='text-destructive text-sm'>{errors.confirmPassword.message}</p>
                )}
              </div>
              {errors.root && <p className='text-destructive text-sm'>{errors.root.message}</p>}
              <Button type='submit' disabled={isSubmitting}>
                Đăng ký
              </Button>
            </form>
          )}
          <p className='text-muted-foreground mt-4 text-center text-sm'>
            Đã có tài khoản?{' '}
            <Link className='text-primary underline' to={path.login}>
              Đăng nhập
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
