import { useState } from 'react'
import { Mail, Search, ShieldAlert } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { WorkspaceMetricCard } from '@/components/WorkspaceMetricCard'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useAdminUsersQuery } from '@/hooks/queries/admin/useAdminUsersQuery'
import { useUpdateUserStatusMutation } from '@/hooks/queries/admin/useUpdateUserStatusMutation'
import { getInitials, formatDateTime } from '@/utils/format'
import type { UserRoleApiResponse, UserTypeApiResponse } from '@/types/api/user'
import type { UserStatus } from '@/types/models/user'

type UserRoleFilter = 'ALL' | UserRoleApiResponse
type UserStatusFilter = 'ALL' | UserStatus

const roleFilters: Array<{ key: UserRoleFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả vai trò' },
  { key: 'LEARNER', label: 'Học viên' },
  { key: 'MENTOR', label: 'Mentor' },
  { key: 'ADMIN', label: 'Admin' },
  { key: 'MANAGER', label: 'Quản lý' }
]

const statusFilters: Array<{ key: UserStatusFilter; label: string }> = [
  { key: 'ALL', label: 'Mọi trạng thái' },
  { key: 'ACTIVE', label: 'Đang hoạt động' },
  { key: 'INACTIVE', label: 'Không hoạt động' },
  { key: 'BANNED', label: 'Đã khóa' }
]

const roleLabelMap: Record<UserRoleApiResponse, string> = {
  LEARNER: 'Học viên',
  MENTOR: 'Mentor',
  ADMIN: 'Admin',
  MANAGER: 'Quản lý'
}

const userTypeLabelMap: Record<UserTypeApiResponse, string> = {
  STUDENT: 'Học sinh',
  PARENT: 'Phụ huynh',
  UNIVERSITY_STUDENT: 'Sinh viên',
  WORKING_ADULT: 'Người đi làm'
}

export function meta() {
  return [{ title: 'Người dùng | Admin' }]
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<UserRoleFilter>('ALL')
  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('ALL')
  const [banId, setBanId] = useState<number | null>(null)
  const [unbanId, setUnbanId] = useState<number | null>(null)

  const { data: usersData } = useAdminUsersQuery({
    search: searchQuery || undefined,
    role: roleFilter === 'ALL' ? undefined : roleFilter,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page: 1,
    size: 50
  })
  const users = usersData?.data ?? []

  const { mutate: updateUserStatus, isPending: isUpdatingStatus } = useUpdateUserStatusMutation()

  const userSummary = [
    {
      label: 'Tài khoản đang hoạt động',
      value: users.filter((user) => user.status === 'ACTIVE').length
    },
    {
      label: 'Mentor trong hệ thống',
      value: users.filter((user) => user.role === 'MENTOR').length
    },
    {
      label: 'Tài khoản cần theo dõi',
      value: users.filter((user) => user.status !== 'ACTIVE').length
    }
  ]

  const handleBanConfirm = () => {
    if (!banId) return
    updateUserStatus(
      { id: banId, data: { action: 'BAN' } },
      {
        onSuccess: () => setBanId(null),
        onError: () => setBanId(null)
      }
    )
  }

  const handleUnbanConfirm = () => {
    if (!unbanId) return
    updateUserStatus(
      { id: unbanId, data: { action: 'ACTIVATE' } },
      {
        onSuccess: () => setUnbanId(null),
        onError: () => setUnbanId(null)
      }
    )
  }

  return (
    <DashboardPage
      description='Tra cứu người dùng theo vai trò và trạng thái, khóa hoặc mở lại tài khoản khi cần xử lý spam hoặc vi phạm.'
      title='Quản lý người dùng'
    >
      <div className='space-y-6'>
        <WorkspacePanel
          title='Bộ lọc người dùng'
          description='Tìm nhanh theo tên hoặc email, sau đó thu hẹp theo vai trò và trạng thái để đọc hàng người dùng rõ hơn.'
        >
          <div className='grid gap-4 xl:grid-cols-[1.2fr_auto_auto]'>
            <div className='relative min-w-0'>
              <Search
                aria-hidden='true'
                className='text-muted absolute top-1/2 left-3 -translate-y-1/2'
                size={16}
              />
              <Input
                className='pl-10'
                id='admin-user-search'
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Tìm theo tên hoặc email'
                type='search'
                value={searchQuery}
              />
            </div>

            <Select
              onChange={(event) => setRoleFilter(event.target.value as UserRoleFilter)}
              value={roleFilter}
            >
              {roleFilters.map((filter) => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </Select>

            <Select
              onChange={(event) => setStatusFilter(event.target.value as UserStatusFilter)}
              value={statusFilter}
            >
              {statusFilters.map((filter) => (
                <option key={filter.key} value={filter.key}>
                  {filter.label}
                </option>
              ))}
            </Select>
          </div>

          <div className='grid gap-3 md:grid-cols-3'>
            {userSummary.map((item) => (
              <WorkspaceMetricCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title='Danh sách người dùng'
          description='Xem tên, vai trò, loại tài khoản, trạng thái và khóa/mở lại tài khoản trực tiếp tại đây.'
        >
          {users.length === 0 ? (
            <EmptyState
              description='Thử đổi từ khóa, vai trò hoặc trạng thái để quay lại một danh sách người dùng phù hợp hơn.'
              title='Không tìm thấy người dùng'
            />
          ) : (
            <>
              <div className='hidden overflow-x-auto lg:block'>
                <Table className='min-w-[920px]'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Loại tài khoản</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className='flex items-start gap-3'>
                            <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-semibold'>
                              {getInitials(user.fullName)}
                            </div>
                            <div className='space-y-1'>
                              <p className='text-ink font-semibold'>{user.fullName}</p>
                              <p className='text-muted inline-flex items-center gap-2 text-sm'>
                                <Mail aria-hidden='true' size={14} />
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm font-medium text-slate-700'>
                          {roleLabelMap[user.role]}
                        </TableCell>
                        <TableCell className='text-sm text-slate-700'>
                          {user.userType ? userTypeLabelMap[user.userType] : 'Chưa cập nhật'}
                        </TableCell>
                        <TableCell className='text-sm text-slate-700'>
                          {formatDateTime(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge kind='user' status={user.status} />
                        </TableCell>
                        <TableCell>
                          {user.role !== 'ADMIN' &&
                            (user.status === 'BANNED' ? (
                              <Button onClick={() => setUnbanId(user.id)} size='sm' variant='outline'>
                                Mở khóa
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setBanId(user.id)}
                                size='sm'
                                variant='destructive'
                              >
                                Khóa tài khoản
                              </Button>
                            ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className='grid gap-4 lg:hidden'>
                {users.map((user) => (
                  <Card className='rounded-2xl shadow-none' key={user.id}>
                    <CardContent className='flex items-start gap-3 p-4'>
                      <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl font-semibold'>
                        {getInitials(user.fullName)}
                      </div>
                      <div className='min-w-0 flex-1 space-y-2'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <p className='text-ink font-semibold'>{user.fullName}</p>
                          <StatusBadge kind='user' status={user.status} />
                        </div>
                        <p className='text-muted inline-flex items-center gap-2 text-sm'>
                          <Mail aria-hidden='true' size={14} />
                          {user.email}
                        </p>
                        <div className='text-muted grid gap-2 text-sm md:grid-cols-2'>
                          <p>{roleLabelMap[user.role]}</p>
                          <p>{user.userType ? userTypeLabelMap[user.userType] : 'Chưa cập nhật'}</p>
                          <p>Tham gia {formatDateTime(user.createdAt)}</p>
                        </div>
                        {user.role !== 'ADMIN' && (
                          <div className='pt-1'>
                            {user.status === 'BANNED' ? (
                              <Button onClick={() => setUnbanId(user.id)} size='sm' variant='outline'>
                                Mở khóa
                              </Button>
                            ) : (
                              <Button
                                onClick={() => setBanId(user.id)}
                                size='sm'
                                variant='destructive'
                              >
                                Khóa tài khoản
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </WorkspacePanel>

        <WorkspaceNotice
          description='Khóa tài khoản chỉ nên dùng cho các trường hợp spam hoặc vi phạm chính sách rõ ràng. Admin không thể tự khóa tài khoản admin khác từ màn hình này.'
          icon={ShieldAlert}
          title='Lưu ý khi khóa tài khoản'
          tone='info'
        />
      </div>

      <ConfirmModal
        description='Tài khoản sẽ không thể đăng nhập cho đến khi được mở khóa lại. Dùng cho các trường hợp spam hoặc vi phạm chính sách.'
        destructive
        isConfirming={isUpdatingStatus}
        onConfirm={handleBanConfirm}
        onOpenChange={(open) => !open && setBanId(null)}
        open={!!banId}
        title='Khóa tài khoản người dùng'
      />

      <ConfirmModal
        description='Tài khoản sẽ có thể đăng nhập và sử dụng hệ thống trở lại.'
        isConfirming={isUpdatingStatus}
        onConfirm={handleUnbanConfirm}
        onOpenChange={(open) => !open && setUnbanId(null)}
        open={!!unbanId}
        title='Mở khóa tài khoản người dùng'
      />
    </DashboardPage>
  )
}
