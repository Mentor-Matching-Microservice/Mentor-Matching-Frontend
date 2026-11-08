import { useState } from 'react'
import { ExternalLink, Search, ShieldCheck } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { ReasonModal } from '@/components/ui/reason-modal'
import { useAdminMentorsQuery } from '@/hooks/queries/admin/useAdminMentorsQuery'
import { useAdminMentorVerificationsQuery } from '@/hooks/queries/admin/useAdminMentorVerificationsQuery'
import { useReviewMentorApprovalMutation } from '@/hooks/queries/admin/useReviewMentorApprovalMutation'
import { useReviewMentorVerificationMutation } from '@/hooks/queries/admin/useReviewMentorVerificationMutation'
import { MentorProfileDetailModal } from '@/features/admin/mentors/components/MentorProfileDetailModal'
import { MentorVerificationDetailModal } from '@/features/admin/mentors/components/MentorVerificationDetailModal'
import { getInitials, formatDateTime } from '@/utils/format'
import type { MentorApprovalStatusApiResponse } from '@/types/api/mentor'

type MentorDirectoryFilter = 'ALL' | 'APPROVED' | 'SUSPENDED'

const mentorDirectoryFilters: Array<{ key: MentorDirectoryFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'APPROVED', label: 'Đã duyệt' },
  { key: 'SUSPENDED', label: 'Tạm dừng' }
]

export function meta() {
  return [{ title: 'Mentor | Admin' }]
}

export default function AdminMentorsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [directoryFilter, setDirectoryFilter] = useState<MentorDirectoryFilter>('ALL')

  const [verifyId, setVerifyId] = useState<number | null>(null)
  const [rejectVerifyId, setRejectVerifyId] = useState<number | null>(null)

  const [approveId, setApproveId] = useState<number | null>(null)
  const [rejectApproveId, setRejectApproveId] = useState<number | null>(null)

  const [suspendId, setSuspendId] = useState<number | null>(null)
  const [reactivateId, setReactivateId] = useState<number | null>(null)

  const [viewMentorId, setViewMentorId] = useState<number | null>(null)
  const [viewVerificationId, setViewVerificationId] = useState<number | null>(null)

  // Queries
  const { data: verificationsData } = useAdminMentorVerificationsQuery({
    status: 'PENDING',
    page: 1,
    size: 50
  })
  const verifications = verificationsData?.data || []

  const { data: approvalsData } = useAdminMentorsQuery({
    approvalStatus: 'PENDING',
    page: 1,
    size: 50
  })
  const approvals = approvalsData?.data || []

  const { data: directoryData } = useAdminMentorsQuery({
    approvalStatus:
      directoryFilter === 'ALL' ? undefined : (directoryFilter as MentorApprovalStatusApiResponse),
    search: searchQuery,
    page: 1,
    size: 50
  })
  const directory = directoryData?.data || []

  // Mutations
  const { mutate: reviewVerification, isPending: isVerifying } =
    useReviewMentorVerificationMutation()
  const { mutate: reviewApproval, isPending: isApproving } = useReviewMentorApprovalMutation()

  // Handlers
  const handleVerifyConfirm = () => {
    if (!verifyId) return
    reviewVerification(
      { id: verifyId, data: { action: 'VERIFY' } },
      {
        onSuccess: () => {
          setVerifyId(null)
        },
        onError: () => {
          setVerifyId(null)
        }
      }
    )
  }

  const handleVerifyReject = (reason: string) => {
    if (!rejectVerifyId) return
    reviewVerification(
      { id: rejectVerifyId, data: { action: 'REJECT', rejectionReason: reason } },
      {
        onSuccess: () => {
          setRejectVerifyId(null)
        },
        onError: () => {
          setRejectVerifyId(null)
        }
      }
    )
  }

  const handleApproveConfirm = () => {
    if (!approveId) return
    reviewApproval(
      { id: approveId, data: { action: 'APPROVE' } },
      {
        onSuccess: () => {
          setApproveId(null)
        },
        onError: () => {
          setApproveId(null)
        }
      }
    )
  }

  const handleApproveReject = (reason: string) => {
    if (!rejectApproveId) return
    reviewApproval(
      { id: rejectApproveId, data: { action: 'REJECT', approvalNote: reason } },
      {
        onSuccess: () => {
          setRejectApproveId(null)
        },
        onError: () => {
          setRejectApproveId(null)
        }
      }
    )
  }

  const handleSuspendConfirm = (reason: string) => {
    if (!suspendId) return
    reviewApproval(
      { id: suspendId, data: { action: 'SUSPEND', approvalNote: reason } },
      {
        onSuccess: () => {
          setSuspendId(null)
        },
        onError: () => {
          setSuspendId(null)
        }
      }
    )
  }

  const handleReactivateConfirm = () => {
    if (!reactivateId) return
    reviewApproval(
      { id: reactivateId, data: { action: 'REACTIVATE' } },
      {
        onSuccess: () => {
          setReactivateId(null)
        },
        onError: () => {
          setReactivateId(null)
        }
      }
    )
  }

  return (
    <DashboardPage
      description='Tách rõ hàng chờ phê duyệt và danh sách mentor đang hoạt động để admin không trộn lẫn duyệt hồ sơ với vận hành lâu dài.'
      title='Quản lý mentor'
    >
      <div className='space-y-8'>
        {/* Verification Queue */}
        <WorkspacePanel
          className='border-amber-200'
          title='Chờ duyệt CCCD / Danh tính'
          description='Hàng chờ duyệt thông tin định danh của mentor (Căn cước công dân, hộ chiếu, ảnh chân dung).'
        >
          {verifications.length === 0 ? (
            <EmptyState
              description='Không có yêu cầu duyệt danh tính nào đang chờ xử lý.'
              title='Trống'
            />
          ) : (
            <div className='grid gap-4'>
              {verifications.map((item) => (
                <Card className='rounded-2xl border-amber-200 shadow-none' key={item.id}>
                  <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-start'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-lg font-semibold text-amber-700'>
                      {getInitials(item.accountFullName)}
                    </div>

                    <div className='min-w-0 flex-1 space-y-4'>
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div>
                          <h2 className='text-ink text-lg font-semibold'>{item.accountFullName}</h2>
                          <p className='text-muted mt-1 text-sm'>{item.accountEmail}</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <StatusBadge kind='verification' status={item.verificationStatus} />
                        </div>
                      </div>

                      <div className='text-muted grid gap-2 text-sm'>
                        <p>Ngày nộp: {item.createdAt ? formatDateTime(item.createdAt) : 'N/A'}</p>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                      <Button onClick={() => setVerifyId(item.id)}>Duyệt CCCD</Button>
                      <Button variant='destructive' onClick={() => setRejectVerifyId(item.id)}>
                        Từ chối
                      </Button>
                      <Button variant='outline' onClick={() => setViewVerificationId(item.id)}>
                        <ExternalLink aria-hidden='true' size={16} />
                        Xem giấy tờ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>

        {/* Approval Queue */}
        <WorkspacePanel
          className='border-blue-200'
          title='Chờ duyệt lên sàn (Profile)'
          description='Hàng chờ duyệt hồ sơ năng lực, kinh nghiệm, môn học để mentor có thể bắt đầu nhận học viên.'
        >
          {approvals.length === 0 ? (
            <EmptyState
              description='Không có yêu cầu duyệt hồ sơ nào đang chờ xử lý.'
              title='Trống'
            />
          ) : (
            <div className='grid gap-4'>
              {approvals.map((mentor) => (
                <Card className='rounded-2xl border-blue-200 shadow-none' key={mentor.id}>
                  <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-start'>
                    <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-lg font-semibold text-blue-700'>
                      {getInitials(mentor.fullName)}
                    </div>

                    <div className='min-w-0 flex-1 space-y-4'>
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div>
                          <h2 className='text-ink text-lg font-semibold'>{mentor.fullName}</h2>
                          <p className='text-muted mt-1 text-sm'>
                            {mentor.headline || 'Chưa cập nhật tiêu đề'}
                          </p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <StatusBadge kind='approval' status={mentor.approvalStatus} />
                          <StatusBadge kind='verification' status={mentor.verificationStatus} />
                        </div>
                      </div>

                      <div className='text-muted grid gap-2 text-sm md:grid-cols-2'>
                        <p>
                          {mentor.currentPosition} tại {mentor.workplace}
                        </p>
                        <p>Kinh nghiệm: {mentor.experienceYears} năm</p>
                        <p>
                          Ngày nộp: {mentor.createdAt ? formatDateTime(mentor.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                      <Button onClick={() => setApproveId(mentor.id)}>Duyệt Profile</Button>
                      <Button variant='destructive' onClick={() => setRejectApproveId(mentor.id)}>
                        Từ chối
                      </Button>
                      <Button variant='outline' onClick={() => setViewMentorId(mentor.id)}>
                        <ExternalLink aria-hidden='true' size={16} />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>

        {/* Directory */}
        <WorkspacePanel
          title='Mentor đang hoạt động'
          description='Dùng để rà soát mentor đã lên sàn, tạm dừng hồ sơ khi cần và theo dõi chất lượng hoạt động hiện tại.'
          action={
            <StatusFilterPills
              onValueChange={(val) => setDirectoryFilter(val as MentorDirectoryFilter)}
              options={mentorDirectoryFilters}
              value={directoryFilter}
            />
          }
        >
          <div className='flex w-full flex-wrap items-center gap-3'>
            <div className='relative min-w-[260px] flex-1'>
              <Search
                aria-hidden='true'
                className='text-muted absolute top-1/2 left-3 -translate-y-1/2'
                size={16}
              />
              <Input
                className='pl-10'
                id='admin-mentor-search'
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder='Tìm theo tên, tiêu đề...'
                type='search'
                value={searchQuery}
              />
            </div>
          </div>

          {directory.length === 0 ? (
            <EmptyState
              description='Hãy thử đổi từ khóa hoặc quay lại trạng thái khác để xem thêm mentor phù hợp.'
              title='Không tìm thấy mentor phù hợp'
            />
          ) : (
            <div className='grid gap-4'>
              {directory.map((mentor) => (
                <Card className='rounded-2xl shadow-none' key={mentor.id}>
                  <CardContent className='flex flex-col gap-5 p-5 xl:flex-row xl:items-center'>
                    <div className='bg-primary/10 text-primary flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-semibold'>
                      {getInitials(mentor.fullName)}
                    </div>

                    <div className='min-w-0 flex-1 space-y-4'>
                      <div className='flex flex-wrap items-start justify-between gap-3'>
                        <div>
                          <h2 className='text-ink text-lg font-semibold'>{mentor.fullName}</h2>
                          <p className='text-muted mt-1 text-sm'>{mentor.headline}</p>
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <StatusBadge kind='approval' status={mentor.approvalStatus} />
                          <StatusBadge kind='verification' status={mentor.verificationStatus} />
                        </div>
                      </div>

                      <div className='text-muted grid gap-2 text-sm md:grid-cols-3'>
                        <p>
                          {mentor.currentPosition} tại {mentor.workplace}
                        </p>
                        <p>{mentor.experienceYears} năm kinh nghiệm</p>
                        <p>
                          Gia nhập: {mentor.createdAt ? formatDateTime(mentor.createdAt) : 'N/A'}
                        </p>
                      </div>
                    </div>

                    <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 xl:border-t-0 xl:pt-0'>
                      <Button variant='outline' onClick={() => setViewMentorId(mentor.id)}>
                        <ShieldCheck aria-hidden='true' size={16} />
                        Xem hồ sơ
                      </Button>
                      {mentor.approvalStatus === 'SUSPENDED' && (
                        <Button variant='outline' onClick={() => setReactivateId(mentor.id)}>
                          Mở lại
                        </Button>
                      )}
                      {mentor.approvalStatus === 'APPROVED' && (
                        <Button variant='outline' onClick={() => setSuspendId(mentor.id)}>
                          Tạm dừng
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>
      </div>

      {/* Modals */}
      <ConfirmModal
        open={!!verifyId}
        onOpenChange={(open) => !open && setVerifyId(null)}
        title='Xác nhận duyệt CCCD'
        description='Bạn có chắc chắn muốn xác thực danh tính cho Mentor này không? (Bước này không thể hoàn tác)'
        onConfirm={handleVerifyConfirm}
        isConfirming={isVerifying}
      />

      <ReasonModal
        open={!!rejectVerifyId}
        onOpenChange={(open) => !open && setRejectVerifyId(null)}
        title='Từ chối duyệt CCCD'
        description='Vui lòng nhập lý do từ chối để mentor có thể chỉnh sửa và nộp lại hồ sơ.'
        placeholder='Ví dụ: Hình ảnh CCCD bị mờ, không rõ mặt...'
        confirmLabel='Xác nhận từ chối'
        onConfirm={handleVerifyReject}
        isConfirming={isVerifying}
      />

      <ConfirmModal
        open={!!approveId}
        onOpenChange={(open) => !open && setApproveId(null)}
        title='Duyệt hồ sơ Mentor lên sàn'
        description='Hồ sơ sẽ được hiển thị công khai trên hệ thống và mentor có thể bắt đầu nhận học viên.'
        onConfirm={handleApproveConfirm}
        isConfirming={isApproving}
      />

      <ReasonModal
        open={!!rejectApproveId}
        onOpenChange={(open) => !open && setRejectApproveId(null)}
        title='Từ chối duyệt hồ sơ lên sàn'
        description='Vui lòng nhập lý do từ chối để mentor có thể chỉnh sửa và nộp lại hồ sơ.'
        placeholder='Ví dụ: Hình ảnh CCCD bị mờ, không rõ mặt...'
        confirmLabel='Xác nhận từ chối'
        onConfirm={handleApproveReject}
        isConfirming={isApproving}
      />

      <ReasonModal
        open={!!suspendId}
        onOpenChange={(open) => !open && setSuspendId(null)}
        title='Tạm dừng mentor'
        description='Mentor sẽ bị ẩn khỏi tìm kiếm công khai cho đến khi được mở lại. Vui lòng nhập lý do tạm dừng.'
        placeholder='Ví dụ: Vi phạm chính sách nền tảng, học viên phản ánh...'
        confirmLabel='Xác nhận tạm dừng'
        onConfirm={handleSuspendConfirm}
        isConfirming={isApproving}
      />

      <ConfirmModal
        open={!!reactivateId}
        onOpenChange={(open) => !open && setReactivateId(null)}
        title='Mở lại hoạt động cho mentor'
        description='Hồ sơ mentor sẽ hiển thị công khai trở lại và có thể tiếp tục nhận học viên.'
        onConfirm={handleReactivateConfirm}
        isConfirming={isApproving}
      />

      <MentorProfileDetailModal
        mentorId={viewMentorId}
        onOpenChange={(open) => !open && setViewMentorId(null)}
      />

      <MentorVerificationDetailModal
        verificationId={viewVerificationId}
        onOpenChange={(open) => !open && setViewVerificationId(null)}
      />
    </DashboardPage>
  )
}
