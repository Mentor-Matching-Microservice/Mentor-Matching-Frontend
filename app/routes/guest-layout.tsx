import { useEffect } from 'react'
import { Outlet, useSearchParams, useNavigate } from 'react-router'

import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { useCurrentUserQuery } from '@/hooks/queries/auth/useCurrentUserQuery'
import { useAuthStore } from '@/stores/auth-store'
import { getDashboardPath } from '@/utils/get-dashboard-path'

export default function GuestLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [searchParams] = useSearchParams()
  const { data: user, isLoading } = useCurrentUserQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if (accessToken && !isLoading) {
      const redirectTo = searchParams.get('redirectTo')
      if (redirectTo && redirectTo.startsWith('/')) {
        navigate(redirectTo, { replace: true })
      } else if (user) {
        navigate(getDashboardPath(user.roles), { replace: true })
      } else {
        navigate(path.discover, { replace: true })
      }
    }
  }, [accessToken, isLoading, user, searchParams, navigate])

  if (!hasHydrated) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner label='Đang xác thực phiên đăng nhập...' />
      </div>
    )
  }

  if (accessToken) {
    if (isLoading) {
      return (
        <div className='flex min-h-[40vh] items-center justify-center'>
          <Spinner label='Đang chuyển hướng...' />
        </div>
      )
    }
    return null
  }

  return <Outlet />
}
