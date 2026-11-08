import { RoleGuard } from '@/components/RoleGuard'
import { ROLES } from '@/constants/roles'

export default function AdminRoleLayout() {
  return <RoleGuard role={ROLES.ADMIN} />
}
