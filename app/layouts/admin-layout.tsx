import { DashboardShell } from '@/components/DashboardShell'
import { adminNavItems } from '@/constants/dashboard-nav'
import { path } from '@/config/path'

export default function AdminLayout() {
  return (
    <DashboardShell
      accentClass='bg-slate-900'
      brandHref={path.admin.root}
      brandLabel='Admin'
      homeLink='/'
      navItems={adminNavItems}
    />
  )
}
