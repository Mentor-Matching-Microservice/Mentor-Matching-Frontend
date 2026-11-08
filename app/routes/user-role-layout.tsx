import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'

export default function UserRoleLayout() {
  return <RoleGuard role={ROLES.LEARNER} />
}
