import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Lock } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { z } from 'zod'
import axios from 'axios'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/Button'
import { path } from '@/config/path'
import { authApi } from '@/services/auth.api'
import type { ErrorResponse } from '@/types/api/common'

const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token') || ''
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token) {
      setError('root', { message: 'Mã xác thực token không hợp lệ hoặc đã hết hạn.' })
      return
    }

    clearErrors()
    try {
      await authApi.resetPassword({
        token,
        password: values.password,
        confirmPassword: values.confirmPassword
      })
      setIsSuccess(true)
    } catch (err: unknown) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        const message =
          err.response?.data?.message || 'Không thể đặt lại mật khẩu. Mã token có thể đã hết hạn.'
        setError('root', { message })
      } else {
        setError('root', { message: 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.' })
      }
    }
  }

  return (
    <div className='flex min-h-screen bg-white'>
      {/* Left visual banner */}
      <div className='relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#064e3b] via-[#043d2e] to-[#022c22] p-16 text-white lg:flex'>
        <div
          className='absolute inset-0 opacity-10'
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, white 2%, transparent 0%),
                              radial-gradient(circle at 75px 75px, white 2%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}
        />

        <div className='relative z-10'>
          <BrandLogo className='text-white [&_span]:text-white' />
        </div>

        <div className='relative z-10 max-w-lg'>
          <h1 className='text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl'>
            Tạo mật khẩu mới.
          </h1>
          <p className='mt-6 text-lg text-emerald-100/80 leading-relaxed'>
            Thiết lập mật khẩu mạnh và an toàn để tiếp tục sử dụng tài khoản của bạn trên nền tảng Mentor Matching.
          </p>
        </div>

        <div className='relative z-10 text-sm text-emerald-200/50'>
          © {new Date().getFullYear()} Mentor Matching Platform. All rights reserved.
        </div>
      </div>

      {/* Right side form */}
      <div className='flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20 xl:px-28'>
        <div className='mx-auto w-full max-w-md'>
          <Link
            className='inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition'
            to={path.login}
          >
            <ArrowLeft size={16} />
            Quay lại đăng nhập
          </Link>

          {isSuccess ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              className='mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center'
            >
              <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
                <CheckCircle2 size={32} />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>Đặt lại mật khẩu thành công!</h2>
              <p className='mt-2 text-sm text-slate-600 leading-relaxed'>
                Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập ngay bằng mật khẩu mới.
              </p>

              <div className='mt-6'>
                <Button
                  className='h-11 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700'
                  onClick={() => navigate(path.login)}
                  type='button'
                >
                  Đăng nhập ngay
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.3 }}
              className='mt-8'
            >
              <h2 className='text-3xl font-extrabold tracking-tight text-slate-900'>
                Đặt lại mật khẩu
              </h2>
              <p className='mt-2 text-sm text-slate-500'>
                Nhập mật khẩu mới cho tài khoản của bạn.
              </p>

              <form className='mt-8 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                {/* Mật khẩu mới */}
                <div>
                  <label className='block text-xs font-semibold text-slate-700' htmlFor='password'>
                    Mật khẩu mới
                  </label>
                  <div className='relative mt-1'>
                    <Lock className='absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <input
                      {...register('password')}
                      className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pr-4 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                      id='password'
                      placeholder='Ít nhất 6 ký tự'
                      type='password'
                    />
                  </div>
                  {errors.password?.message ? (
                    <p className='mt-1 text-xs text-red-500'>{errors.password.message}</p>
                  ) : null}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <label
                    className='block text-xs font-semibold text-slate-700'
                    htmlFor='confirmPassword'
                  >
                    Xác nhận mật khẩu mới
                  </label>
                  <div className='relative mt-1'>
                    <Lock className='absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <input
                      {...register('confirmPassword')}
                      className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pr-4 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                      id='confirmPassword'
                      placeholder='Nhập lại mật khẩu mới'
                      type='password'
                    />
                  </div>
                  {errors.confirmPassword?.message ? (
                    <p className='mt-1 text-xs text-red-500'>{errors.confirmPassword.message}</p>
                  ) : null}
                </div>

                {errors.root?.message ? (
                  <div className='rounded-xl border border-red-200 bg-red-50 p-3 text-center text-xs font-medium text-red-600'>
                    {errors.root.message}
                  </div>
                ) : null}

                <Button
                  className='h-11 w-full gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700'
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                  type='submit'
                >
                  <span>Cập nhật mật khẩu mới</span>
                  <ChevronRight size={16} />
                </Button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
