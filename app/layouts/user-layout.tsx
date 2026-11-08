import { DashboardShell } from '@/components/DashboardShell'
import { userNavItems } from '@/constants/dashboard-nav'
import { path } from '@/config/path'

export default function UserLayout() {
  return (
    <DashboardShell
      accentClass='bg-primary'
      brandHref={path.user.root}
      brandLabel='Học viên'
      homeLink='/'
      navItems={userNavItems}
    />
  )
}
