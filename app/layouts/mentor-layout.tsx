import { DashboardShell } from '@/components/DashboardShell'
import { mentorNavItems } from '@/constants/dashboard-nav'
import { path } from '@/config/path'

export default function MentorLayout() {
  return (
    <DashboardShell
      accentClass='bg-emerald-600'
      brandHref={path.mentorPanel.root}
      brandLabel='Mentor'
      homeLink='/'
      navItems={mentorNavItems}
    />
  )
}
