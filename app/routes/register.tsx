import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, GraduationCap, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'
import axios from 'axios'

import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/Button'
import { path } from '@/config/path'
import { authApi } from '@/services/auth.api'
import type { ErrorResponse } from '@/types/api/common'

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Vui lòng nhập họ và tên'),
    email: z.string().email('Email không đúng định dạng'),
    phone: z.string().regex(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ').or(z.string().min(10, 'Số điện thoại không hợp lệ')),
    userType: z.enum(['STUDENT', 'PARENT', 'UNIVERSITY_STUDENT', 'WORKING_ADULT']),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu')
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword']
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      userType: 'STUDENT',
      password: '',
      confirmPassword: ''
    }
  })

  const onSubmit = handleSubmit(async (values) => {
    clearErrors('root')
    try {
      await authApi.register({
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword
      })

      setSuccessMessage('Đăng ký tài khoản thành công! Đang chuyển hướng sang trang đăng nhập...')
      setTimeout(() => {
        navigate(path.login, { replace: true })
      }, 1500)
    } catch (error) {
      const response = axios.isAxiosError<ErrorResponse>(error) ? error.response?.data : null
      setError('root', {
        message: response?.detail || response?.message || 'Không thể đăng ký. Vui lòng thử lại.'
      })
    }
  })

  return (
    <div className='flex min-h-screen items-stretch bg-white'>
      {/* Left Side - Visual */}
      <div className='relative hidden w-1/2 overflow-hidden lg:block'>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
            scale: [1, 1.08, 1]
          }}
          className='absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28)_0%,transparent_42%),radial-gradient(circle_at_bottom_left,rgba(5,150,105,0.22)_0%,transparent_40%),linear-gradient(135deg,#064e3b_0%,#065f46_52%,#047857_100%)]'
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
              Bắt đầu học với mentor phù hợp hơn.
            </h2>
            <p className='max-w-md text-lg leading-relaxed text-white/80'>
              Tạo tài khoản learner, lưu hồ sơ học tập và đặt lịch với mentor theo nhu cầu của bạn.
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
              to={path.home}
            >
              <ArrowLeft className='h-4 w-4' />
              Quay lại trang chủ
            </Link>

            <h1 className='font-display mb-2 text-4xl font-extrabold tracking-tight text-slate-900'>
              Đăng ký
            </h1>
            <p className='text-muted mb-8 text-sm'>
              Nhập thông tin cơ bản để tạo tài khoản học trên Mentor Matching.
            </p>

            {successMessage && (
              <div className='mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-800'>
                {successMessage}
              </div>
            )}

            <form className='space-y-4' onSubmit={onSubmit}>
              {/* Họ và tên */}
              <div>
                <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='fullName'>
                  Họ và tên
                </label>
                <div className='relative'>
                  <User className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                  <input
                    id='fullName'
                    type='text'
                    placeholder='Nguyễn Văn An'
                    className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none'
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName?.message && (
                  <p className='mt-1 text-sm font-medium text-red-500'>{errors.fullName.message}</p>
                )}
              </div>

              {/* Email & Phone */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='email'>
                    Email
                  </label>
                  <div className='relative'>
                    <Mail className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                    <input
                      id='email'
                      type='email'
                      placeholder='name@example.com'
                      className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none'
                      {...register('email')}
                    />
                  </div>
                  {errors.email?.message && (
                    <p className='mt-1 text-sm font-medium text-red-500'>{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='phone'>
                    Số điện thoại
                  </label>
                  <div className='relative'>
                    <Phone className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                    <input
                      id='phone'
                      type='tel'
                      placeholder='0901234567'
                      className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none'
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone?.message && (
                    <p className='mt-1 text-sm font-medium text-red-500'>{errors.phone.message}</p>
                  )}
                </div>
              </div>

              {/* Bạn là */}
              <div>
                <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='userType'>
                  Bạn là
                </label>
                <div className='relative'>
                  <GraduationCap className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                  <select
                    id='userType'
                    className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-8 pl-11 text-sm text-slate-900 transition-all focus:bg-white focus:ring-4 focus:outline-none'
                    {...register('userType')}
                  >
                    <option value='STUDENT'>Học sinh</option>
                    <option value='PARENT'>Phụ huynh</option>
                    <option value='UNIVERSITY_STUDENT'>Sinh viên</option>
                    <option value='WORKING_ADULT'>Người đi làm</option>
                  </select>
                </div>
              </div>

              {/* Password & Confirm Password */}
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div>
                  <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='password'>
                    Mật khẩu
                  </label>
                  <div className='relative'>
                    <Lock className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                    <input
                      id='password'
                      type='password'
                      placeholder='Ít nhất 6 ký tự'
                      className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none'
                      {...register('password')}
                    />
                  </div>
                  {errors.password?.message && (
                    <p className='mt-1 text-sm font-medium text-red-500'>{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className='mb-1.5 block text-sm font-semibold text-slate-800' htmlFor='confirmPassword'>
                    Xác nhận mật khẩu
                  </label>
                  <div className='relative'>
                    <Lock className='text-muted absolute top-3.5 left-3.5 h-5 w-5' />
                    <input
                      id='confirmPassword'
                      type='password'
                      placeholder='Nhập lại mật khẩu'
                      className='focus:border-primary focus:ring-primary/20 h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pr-4 pl-11 text-sm text-slate-900 transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:outline-none'
                      {...register('confirmPassword')}
                    />
                  </div>
                  {errors.confirmPassword?.message && (
                    <p className='mt-1 text-sm font-medium text-red-500'>{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              {errors.root?.message && (
                <p className='text-center text-sm font-medium text-red-500'>
                  {errors.root.message}
                </p>
              )}

              <Button
                className='shadow-lift mt-2 h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-lg font-bold text-white transition-all'
                disabled={isSubmitting}
                isLoading={isSubmitting}
                size='lg'
                type='submit'
              >
                Tạo tài khoản
                <ChevronRight className='ml-2 h-5 w-5' />
              </Button>
            </form>

            <p className='text-muted mt-8 text-center text-sm'>
              Đã có tài khoản?{' '}
              <Link className='text-primary font-bold hover:underline' to={path.login}>
                Đăng nhập
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
