import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'

export default function MentorRoleLayout() {
  return <RoleGuard role={ROLES.MENTOR} />
}
