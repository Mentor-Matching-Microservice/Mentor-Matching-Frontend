import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'

import { Spinner } from '@/components/ui/spinner'
import { path } from '@/config/path'
import { useAuthStore } from '@/stores/auth-store'

export default function ProtectedLayout() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!accessToken) {
      const redirectTo = encodeURIComponent(`${location.pathname}${location.search}`)
      navigate(`${path.login}?redirectTo=${redirectTo}`, { replace: true })
    }
  }, [accessToken, location, navigate])

  if (!hasHydrated) {
    return (
      <div className='bg-base flex min-h-screen items-center justify-center'>
        <Spinner label='Đang xác thực phiên đăng nhập...' />
      </div>
    )
  }

  if (!accessToken) {
    return null
  }

  return <Outlet />
}
