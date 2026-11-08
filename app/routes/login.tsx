import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowLeft, ChevronRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router'
import axios from 'axios'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/Button'
import { path } from '@/config/path'
import { getCurrentUserQueryOptions } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useLoginMutation } from '@/hooks/queries/auth/useLoginMutation'
import { queryClient } from '@/libs/query-client'
import { loginSchema, type LoginFormValues } from '@/schemas/auth.schema'
import type { ErrorResponse } from '@/types/api/common'
import { getDashboardPath } from '@/utils/get-dashboard-path'
import { isAxiosUnauthorizedError } from '@/utils/http-error'

export default function LoginPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const loginMutation = useLoginMutation()

  const {
    register,
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const redirectTo = searchParams.get('redirectTo')

  const getLoginErrorMessage = (error: unknown) => {
    if (isAxiosUnauthorizedError<ErrorResponse>(error)) {
      return error.response?.data?.message || 'Email hoặc mật khẩu không đúng.'
    }

    if (axios.isAxiosError<ErrorResponse>(error) && !error.response) {
      return 'Không kết nối được máy chủ.'
    }

    return 'Không thể đăng nhập. Vui lòng thử lại.'
  }

  const showLoginError = (error: unknown) => {
    setError('root', { message: getLoginErrorMessage(error) })
  }

  const handleLogin = (values: LoginFormValues) => {
    clearErrors('root')

    loginMutation.mutate(values, {
      onSuccess: () => {
        queryClient
          .fetchQuery(getCurrentUserQueryOptions())
          .then((user) => {
            const destination = redirectTo || getDashboardPath(user.roles)
            navigate(destination, { replace: true })
          })
          .catch(showLoginError)
      },
      onError: showLoginError
    })
  }

  return (
    <div className='flex min-h-screen items-stretch bg-white'>
      {/* Left Side - Visual */}
      <div className='relative hidden w-1/2 overflow-hidden lg:block'>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.1, 1]
          }}
          className='absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.28)_0%,transparent_42%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.22)_0%,transparent_40%),linear-gradient(135deg,#0f172a_0%,#172554_52%,#1d4ed8_100%)]'
          initial={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
        />
        <div
          className='absolute inset-0 z-10 opacity-30'
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'
          }}
        />

        <div className='relative z-20 flex h-full flex-col justify-between p-12 text-white'>
          <BrandLogo
            className='w-fit'
            markClassName='rounded-2xl bg-white/98 shadow-lg ring-white/30'
            textClassName='text-white! group-hover:text-white!'
          />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className='font-display mb-6 text-5xl leading-tight font-bold text-white'>
              Tìm người dạy phù hợp, <br /> học cho dễ vào hơn.
            </h2>
            <p className='max-w-md text-lg leading-relaxed text-white/80'>
              Chọn mentor theo môn học, cách dạy và lịch học phù hợp với bạn. Mọi thứ gọn gàng, dễ
              xem và dễ bắt đầu.
            </p>
          </motion.div>

          <footer className='text-sm text-white/60'>
            © 2026 Mentor Matching Platform. All rights reserved.
          </footer>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className='flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-20'>
        <div className='mx-auto w-full max-w-md'>
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              className='text-muted hover:text-primary mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors'
              to='/'
            >
              <ArrowLeft className='h-4 w-4' />
              Quay lại trang chủ
            </Link>

            <header className='mb-10'>
              <h1 className='font-display mb-3 text-4xl font-bold tracking-tight'>Đăng nhập</h1>
              <p className='text-muted'>Chào mừng bạn quay trở lại. Hãy nhập thông tin của bạn.</p>
            </header>

            <form className='space-y-6' onSubmit={handleSubmit(handleLogin)}>
              <div className='space-y-2'>
                <label className='text-ink text-sm font-semibold' htmlFor='email'>
                  Địa chỉ Email
                </label>
                <div className='relative'>
                  <Mail className='text-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
                  <input
                    {...register('email')}
                    autoComplete='email'
                    className='border-line bg-base text-ink focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border pr-4 pl-10 outline-hidden transition-all focus:bg-white focus:ring-4'
                    id='email'
                    placeholder='name@example.com'
                    type='email'
                  />
                </div>
                {errors.email?.message && (
                  <p className='mt-1 text-sm font-medium text-red-500'>{errors.email.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <label className='text-ink text-sm font-semibold' htmlFor='password'>
                    Mật khẩu
                  </label>
                  <Link
                    className='text-primary text-sm font-medium hover:underline'
                    to='/forgot-password'
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className='relative'>
                  <Lock className='text-muted absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
                  <input
                    {...register('password')}
                    autoComplete='current-password'
                    className='border-line bg-base text-ink focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border pr-4 pl-10 outline-hidden transition-all focus:bg-white focus:ring-4'
                    id='password'
                    placeholder='••••••••'
                    type='password'
                  />
                </div>
                {errors.password?.message && (
                  <p className='mt-1 text-sm font-medium text-red-500'>{errors.password.message}</p>
                )}
              </div>

              <Button
                className='shadow-lift h-12 w-full rounded-xl text-lg font-bold'
                disabled={isSubmitting || loginMutation.isPending}
                isLoading={isSubmitting || loginMutation.isPending}
                size='lg'
                type='submit'
              >
                Đăng nhập ngay
                <ChevronRight className='ml-2 h-5 w-5' />
              </Button>

              {errors.root?.message ? (
                <p className='text-center text-sm font-medium text-red-500'>
                  {errors.root.message}
                </p>
              ) : null}
            </form>

            <p className='text-muted mt-10 text-center text-sm'>
              Chưa có tài khoản?{' '}
              <Link className='text-primary font-bold hover:underline' to='/register'>
                Đăng ký ngay
              </Link>
            </p>

            <div className='border-line mt-12 flex justify-center gap-8 border-t pt-8'>
              <Link
                className='text-muted hover:text-primary text-sm font-medium transition'
                to={path.discover}
              >
                Khám phá Mentor
              </Link>
              <Link
                className='text-muted hover:text-primary text-sm font-medium transition'
                to='/help'
              >
                Hỗ trợ
              </Link>
              <Link
                className='text-muted hover:text-primary text-sm font-medium transition'
                to='/terms'
              >
                Điều khoản
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
