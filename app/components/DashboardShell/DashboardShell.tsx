import { LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'

import { buttonVariants } from '@/components/ui/button'
import { path } from '@/config/path'
import type { DashboardNavItem } from '@/constants/dashboard-nav'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/utils/cn'

type DashboardShellProps = {
  brandLabel: string
  brandHref: string
  navItems: DashboardNavItem[]
  accentClass?: string
  homeLink?: string
}

export function DashboardShell({
  brandLabel,
  brandHref,
  navItems,
  accentClass = 'bg-primary',
  homeLink = '/'
}: DashboardShellProps) {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
      isActive
        ? 'bg-white text-primary shadow-soft'
        : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
    )

  const sidebar = (
    <aside className='border-line flex h-full flex-col border-r bg-white'>
      <div className='border-line border-b px-5 py-5'>
        <Link className='block' to={brandHref} onClick={() => setSidebarOpen(false)}>
          <span
            className={cn(
              'inline-block rounded-lg px-2.5 py-1 text-xs font-bold tracking-wide text-white uppercase',
              accentClass
            )}
          >
            {brandLabel}
          </span>
        </Link>
      </div>

      <nav className='flex-1 space-y-1 px-3 py-4'>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClass}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className='border-line space-y-2 border-t px-4 py-4'>
        <Link
          className='hover:text-primary block text-sm font-medium text-slate-500 transition'
          to={path.discover}
        >
          Khám phá mentor
        </Link>
        <Link
          className='hover:text-primary block text-sm font-medium text-slate-500 transition'
          to={homeLink}
        >
          ← Về trang chủ
        </Link>
      </div>
    </aside>
  )

  return (
    <div className='bg-base text-ink min-h-screen'>
      {sidebarOpen && (
        <button
          aria-label='Đóng menu'
          className='bg-ink/40 fixed inset-0 z-40 lg:hidden'
          type='button'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className='flex min-h-screen'>
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 -translate-x-full transition-transform lg:static lg:shrink-0 lg:translate-x-0',
            sidebarOpen && 'translate-x-0'
          )}
        >
          {sidebar}
        </div>

        <div className='min-w-0 flex-1'>
          <header className='border-line sticky top-0 z-30 flex items-center justify-between border-b bg-white/90 px-4 py-3 backdrop-blur md:px-8'>
            <button
              className={buttonVariants({
                className: 'lg:hidden',
                size: 'icon',
                variant: 'outline'
              })}
              type='button'
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>

            <Link
              className='text-muted hover:text-primary hidden text-sm font-medium transition md:block'
              to={path.discover}
            >
              Khám phá mentor
            </Link>

            <div className='flex items-center gap-2'>
              <Link
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'hidden sm:inline-flex'
                )}
                to={homeLink}
              >
                Trang chủ
              </Link>
              <button
                className={buttonVariants({ size: 'sm', variant: 'outline' })}
                type='button'
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span className='hidden sm:inline'>Đăng xuất</span>
              </button>
            </div>

            {sidebarOpen && (
              <button
                className={cn(
                  buttonVariants({ size: 'icon', variant: 'outline' }),
                  'absolute top-3 right-4 lg:hidden'
                )}
                type='button'
                onClick={() => setSidebarOpen(false)}
              >
                <X size={18} />
              </button>
            )}
          </header>

          <main className='dashboard-container py-6 md:py-8'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
