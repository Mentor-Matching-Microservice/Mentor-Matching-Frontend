import type { ReactNode } from 'react'
import { Award, ShieldCheck, Sparkles } from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { MentorProfileViewModel } from '@/features/mentor-profile/mentor-profile.mapper'
import { cn } from '@/utils/cn'

type MentorTrustBlockProps = {
  mentor: MentorProfileViewModel
  className?: string
}

export function MentorTrustBlock({ className, mentor }: MentorTrustBlockProps) {
  const hasPublicTrustStatuses = Boolean(mentor.approvalStatus || mentor.verificationStatus)

  return (
    <Card className={cn('rounded-3xl', className)}>
      <CardContent className='p-6'>
        <div className='flex flex-wrap items-start justify-between gap-3'>
          <div>
            <p className='text-ink text-xl font-semibold'>Điểm tin cậy</p>
            <p className='text-muted mt-1 text-sm'>
              Phụ huynh và học viên có thể kiểm tra duyệt hồ sơ, xác minh danh tính và thế mạnh nổi
              bật trước khi gửi yêu cầu đặt lịch.
            </p>
          </div>
          <div className='flex flex-wrap gap-2'>
            {mentor.approvalStatus ? (
              <StatusBadge kind='approval' status={mentor.approvalStatus} />
            ) : null}
            {mentor.verificationStatus ? (
              <StatusBadge kind='verification' status={mentor.verificationStatus} />
            ) : null}
            {!hasPublicTrustStatuses ? (
              <Badge variant='muted'>Endpoint public chưa trả về trạng thái trust</Badge>
            ) : null}
          </div>
        </div>

        <div className='mt-5 grid gap-4 md:grid-cols-2'>
          <TrustCard
            description={
              mentor.approvalStatus
                ? 'Hồ sơ công khai sau khi được đội ngũ vận hành kiểm tra nội dung giảng dạy, thông tin cơ bản và khả năng nhận lịch.'
                : 'Route public hiện chưa trả về approval status, nên màn hình giữ thông tin này ở trạng thái trung thực thay vì suy diễn.'
            }
            icon={<ShieldCheck className='text-primary h-4 w-4' />}
            title='Duyệt hồ sơ mentor'
          />
          <TrustCard
            description={
              mentor.verificationStatus
                ? 'Trạng thái xác minh được theo dõi riêng để làm rõ danh tính, không thay thế cho trạng thái duyệt công khai.'
                : 'Route public hiện chưa trả về verification status, nên chỉ hiển thị phần tín hiệu có thật từ contract hiện có.'
            }
            icon={<Award className='text-primary h-4 w-4' />}
            title='Xác minh danh tính'
          />
        </div>

        <div className='mt-5'>
          <div className='flex items-center gap-2'>
            <Sparkles className='text-primary h-4 w-4' />
            <p className='text-ink text-sm font-semibold'>Điểm nổi bật khi ra quyết định</p>
          </div>
          <div className='mt-3 flex flex-wrap gap-2'>
            {mentor.highlights.length ? (
              mentor.highlights.map((highlight) => (
                <Badge key={highlight} variant='muted'>
                  {highlight}
                </Badge>
              ))
            ) : (
              <Badge variant='outline'>Mentor chưa công khai thêm điểm nổi bật</Badge>
            )}
          </div>
        </div>

        <div className='mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4'>
          <p className='text-ink text-sm font-semibold'>Cam kết và thành tích</p>
          <ul className='mt-3 space-y-2'>
            {mentor.achievements.map((achievement) => (
              <li key={achievement} className='flex items-start gap-2 text-sm text-slate-700'>
                <span className='mt-1 h-1.5 w-1.5 rounded-full bg-blue-500' />
                <span>{achievement}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

type TrustCardProps = {
  title: string
  description: string
  icon: ReactNode
}

function TrustCard({ description, icon, title }: TrustCardProps) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-slate-50 p-4'>
      <div className='flex items-center gap-2'>
        {icon}
        <p className='text-ink font-semibold'>{title}</p>
      </div>
      <p className='text-muted mt-2 text-sm leading-relaxed'>{description}</p>
    </div>
  )
}
