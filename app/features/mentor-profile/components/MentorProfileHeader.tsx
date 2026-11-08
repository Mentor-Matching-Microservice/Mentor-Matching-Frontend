import type { ReactNode } from 'react'
import {
  Award,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  MessageSquareText,
  Star,
  Users
} from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  formatMeetingTypeLabel,
  type MentorProfileViewModel
} from '@/features/mentor-profile/mentor-profile.mapper'
import { getInitials } from '@/utils/format'

type MentorProfileHeaderProps = {
  mentor: MentorProfileViewModel
}

export function MentorProfileHeader({ mentor }: MentorProfileHeaderProps) {
  return (
    <Card className='overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm'>
      <CardContent className='p-0'>
        <div className='flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6'>
          <div className='flex min-w-0 items-center gap-4'>
            <div className='bg-primary/10 text-primary h-20 w-20 shrink-0 overflow-hidden rounded-full'>
              {mentor.avatarUrl ? (
                <img
                  alt={mentor.name}
                  className='h-full w-full object-cover'
                  src={mentor.avatarUrl}
                />
              ) : (
                <span className='flex h-full w-full items-center justify-center text-2xl font-bold'>
                  {getInitials(mentor.name)}
                </span>
              )}
            </div>
            <div className='min-w-0'>
              <h1 className='text-ink text-2xl font-bold md:text-3xl'>{mentor.name}</h1>
              <p className='text-muted mt-1 text-sm'>{mentor.headline}</p>
              <div className='mt-3 flex flex-wrap gap-2'>
                {mentor.verificationStatus ? (
                  <StatusBadge kind='verification' status={mentor.verificationStatus} />
                ) : null}
                {mentor.approvalStatus ? (
                  <StatusBadge kind='approval' status={mentor.approvalStatus} />
                ) : null}
                {mentor.meetingTypes.map((meetingType) => (
                  <Badge key={meetingType} variant='outline'>
                    {formatMeetingTypeLabel(meetingType)}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-3 gap-2 md:min-w-[360px]'>
            <HeaderMetric
              icon={<Star size={14} className='text-amber-500' />}
              label='Đánh giá'
              value={mentor.rating !== null ? mentor.rating.toFixed(1) : 'Chưa có'}
            />
            <HeaderMetric
              icon={<Users size={14} className='text-blue-600' />}
              label='Học viên'
              value={
                mentor.activeStudentsCount !== null
                  ? String(mentor.activeStudentsCount)
                  : 'Đang cập nhật'
              }
            />
            <HeaderMetric
              icon={<MessageSquareText size={14} className='text-emerald-600' />}
              label='Phản hồi'
              value={mentor.responseTime || 'Chưa công khai'}
            />
          </div>
        </div>

        <nav className='flex gap-1 overflow-x-auto border-t border-slate-200 px-4'>
          <ProfileNavItem
            href='#introduction'
            icon={<CheckCircle2 size={15} />}
            label='Mentor tin cậy'
          />
          <ProfileNavItem href='#offerings' icon={<BookOpen size={15} />} label='Môn học' />
          <ProfileNavItem href='#experience' icon={<Award size={15} />} label='Kinh nghiệm' />
          <ProfileNavItem href='#availability' icon={<CalendarDays size={15} />} label='Lịch dạy' />
          <ProfileNavItem href='#reviews' icon={<MessageSquareText size={15} />} label='Đánh giá' />
        </nav>
      </CardContent>
    </Card>
  )
}

type ProfileNavItemProps = {
  href: string
  icon: ReactNode
  label: string
}

function ProfileNavItem({ href, icon, label }: ProfileNavItemProps) {
  return (
    <a
      className='text-muted hover:text-primary inline-flex shrink-0 items-center gap-2 border-b-2 border-transparent px-4 py-3 text-xs font-semibold hover:border-blue-500'
      href={href}
    >
      {icon}
      {label}
    </a>
  )
}

type HeaderMetricProps = {
  icon: ReactNode
  label: string
  value: string
}

function HeaderMetric({ icon, label, value }: HeaderMetricProps) {
  return (
    <div className='rounded-xl border border-slate-200 bg-slate-50 p-3'>
      <p className='text-muted flex items-center gap-1.5 text-[10px]'>
        {icon}
        {label}
      </p>
      <p className='text-ink mt-1 text-xs font-bold'>{value}</p>
    </div>
  )
}
