import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ChevronRight, Mail } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { z } from 'zod'
import axios from 'axios'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/Button'
import { path } from '@/config/path'
import { authApi } from '@/services/auth.api'
import type { ErrorResponse } from '@/types/api/common'

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không đúng định dạng')
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    clearErrors()
    try {
      await authApi.forgotPassword({ email: values.email.trim() })
      setSubmittedEmail(values.email.trim())
    } catch (err: unknown) {
      if (axios.isAxiosError<ErrorResponse>(err)) {
        const message = err.response?.data?.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.'
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
        {/* Subtle geometric pattern overlay */}
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
            Khôi phục mật khẩu tài khoản.
          </h1>
          <p className='mt-6 text-lg text-emerald-100/80 leading-relaxed'>
            Nhập email của bạn để nhận liên kết đặt lại mật khẩu an toàn và tiếp tục hành trình học tập cùng Mentor Matching.
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

          {submittedEmail ? (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 12 }}
              className='mt-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center'
            >
              <div className='mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600'>
                <CheckCircle2 size={32} />
              </div>
              <h2 className='text-xl font-bold text-slate-900'>Đã gửi hướng dẫn</h2>
              <p className='mt-2 text-sm text-slate-600 leading-relaxed'>
                Nếu email <span className='font-semibold text-slate-800'>{submittedEmail}</span> đã được đăng ký, chúng tôi đã gửi liên kết đặt lại mật khẩu tới hộp thư của bạn.
              </p>
              <p className='mt-2 text-xs text-slate-500'>
                Vui lòng kiểm tra cả mục Thư rác (Spam) nếu không thấy email trong hộp thư đến.
              </p>

              <div className='mt-6 flex flex-col gap-3'>
                <Button
                  className='h-11 w-full rounded-xl bg-blue-600 font-semibold text-white shadow-sm hover:bg-blue-700'
                  onClick={() => setSubmittedEmail(null)}
                  type='button'
                >
                  Gửi lại yêu cầu khác
                </Button>
                <Link
                  className='text-sm font-semibold text-blue-600 hover:underline'
                  to={path.login}
                >
                  Về trang Đăng nhập
                </Link>
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
                Quên mật khẩu
              </h2>
              <p className='mt-2 text-sm text-slate-500'>
                Nhập email đã đăng ký của bạn. Chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
              </p>

              <form className='mt-8 space-y-5' onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div>
                  <label className='block text-xs font-semibold text-slate-700' htmlFor='email'>
                    Email
                  </label>
                  <div className='relative mt-1'>
                    <Mail className='absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400' />
                    <input
                      {...register('email')}
                      className='h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 pr-4 pl-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                      id='email'
                      placeholder='name@example.com'
                      type='email'
                    />
                  </div>
                  {errors.email?.message ? (
                    <p className='mt-1 text-xs text-red-500'>{errors.email.message}</p>
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
                  <span>Gửi yêu cầu đặt lại</span>
                  <ChevronRight size={16} />
                </Button>
              </form>

              <p className='mt-8 text-center text-sm text-slate-500'>
                Nhớ mật khẩu rồi?{' '}
                <Link className='font-semibold text-blue-600 hover:underline' to={path.login}>
                  Đăng nhập
                </Link>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
