import { BriefcaseBusiness, CalendarDays, Clock3, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
import { cn } from '@/utils/cn'
import { formatPrice, getInitials } from '@/utils/format'

export type MentorCardMeetingType = 'ONLINE' | 'OFFLINE' | 'HYBRID'
export type MentorCardApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
export type MentorCardVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED'
export type MentorCardOfferingProficiency = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT'

export type MentorCardOffering = {
  id: string
  subject: string
  grade: string
  proficiency: MentorCardOfferingProficiency
  pricePerHour: number
  active: boolean
  teachingNote?: string | null
}

export type MentorCardSpecificDateAvailability = {
  dateLabel: string
  startTime: string
  endTime: string
  meetingTypes: MentorCardMeetingType[]
  note?: string
}

export interface MentorCardData {
  id: string
  name: string
  avatarUrl?: string | null
  headline?: string | null
  experienceYears?: number | null
  approvalStatus?: MentorCardApprovalStatus | null
  verificationStatus?: MentorCardVerificationStatus | null
  rating?: number | null
  reviewsCount?: number | null
  responseTime?: string | null
  activeStudentsCount?: number | null
  startingPrice?: number | null
  expertise?: string | null
  highlights?: string[]
  subjects?: string[]
  grades?: string[]
  meetingTypes?: MentorCardMeetingType[]
  availabilitySummary?: string | null
  offerings?: MentorCardOffering[]
  specificDateAvailability?: MentorCardSpecificDateAvailability[]
}

interface MentorCardProps {
  mentor: MentorCardData
}

const MentorCard = ({ mentor }: MentorCardProps) => {
  const offerings = (mentor.offerings ?? []).filter((offering) => offering.active).slice(0, 2)
  const meetingTypes = mentor.meetingTypes ?? []
  const nextAvailability = mentor.specificDateAvailability?.[0]
  const profileHref = path.mentorProfile(mentor.id)
  const startingPriceLabel =
    typeof mentor.startingPrice === 'number' ? `${formatPrice(mentor.startingPrice)}/giờ` : null

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }} className='h-full'>
      <Card className='group h-full overflow-hidden rounded-xl border-slate-200 bg-white shadow-none transition hover:border-blue-200 hover:shadow-md'>
        <CardContent className='flex h-full flex-col p-4'>
          <div className='flex items-start gap-3.5'>
            <div className='bg-primary/10 text-primary h-13 w-13 shrink-0 overflow-hidden rounded-full'>
              {mentor.avatarUrl ? (
                <img
                  alt={mentor.name}
                  className='h-full w-full object-cover'
                  loading='lazy'
                  src={mentor.avatarUrl}
                />
              ) : (
                <span className='flex h-full w-full items-center justify-center text-base font-bold'>
                  {getInitials(mentor.name)}
                </span>
              )}
            </div>

            <div className='min-w-0 flex-1'>
              <div className='flex items-start justify-between gap-2'>
                <Link
                  className='text-ink truncate text-base font-bold hover:text-blue-700!'
                  to={profileHref}
                >
                  {mentor.name}
                </Link>
                {mentor.rating !== null && mentor.rating !== undefined ? (
                  <span className='shrink-0 text-base font-semibold text-amber-600'>
                    ★ {mentor.rating.toFixed(1)}
                  </span>
                ) : (
                  <span className='shrink-0 text-sm font-medium text-slate-400'>
                    Chưa có đánh giá
                  </span>
                )}
              </div>
              {mentor.verificationStatus === 'VERIFIED' || mentor.approvalStatus === 'APPROVED' ? (
                <div className='mt-0.5 flex flex-wrap gap-1'>
                  {mentor.verificationStatus === 'VERIFIED' ? (
                    <Badge className='px-1.5 py-0 text-[10px]' variant='info'>
                      Đã xác minh
                    </Badge>
                  ) : null}
                  {mentor.approvalStatus === 'APPROVED' ? (
                    <Badge className='px-1.5 py-0 text-[10px]' variant='success'>
                      Đã duyệt
                    </Badge>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>

          <p className='text-ink/80 mt-3 line-clamp-2 min-h-12 text-[15px] leading-relaxed'>
            {mentor.headline?.trim() || 'Xem hồ sơ để tìm hiểu thêm về mentor này.'}
          </p>

          <div className='mt-4 grid grid-cols-3 divide-x divide-slate-200 rounded-xl bg-slate-50 py-3.5'>
            <QuickStat
              icon={<Clock3 size={16} />}
              label='Khả dụng'
              value={nextAvailability ? 'Có lịch gần' : 'Xem lịch'}
            />
            <QuickStat
              icon={<GraduationCap size={16} />}
              label={offerings.length ? 'Khóa học' : 'Học phí'}
              value={
                offerings.length ? `${offerings.length} đang mở` : startingPriceLabel || 'Chưa mở'
              }
            />
            <QuickStat
              icon={<BriefcaseBusiness size={16} />}
              label='Kinh nghiệm'
              value={
                typeof mentor.experienceYears === 'number'
                  ? `${mentor.experienceYears} năm`
                  : 'Đang cập nhật'
              }
            />
          </div>

          <div className='mt-4 overflow-hidden rounded-xl bg-slate-50'>
            {offerings.length ? (
              offerings.map((offering) => (
                <div
                  key={offering.id}
                  className='flex items-center justify-between gap-3 border-b border-white px-3 py-2.5 last:border-b-0'
                >
                  <div className='min-w-0'>
                    <p className='text-ink truncate text-[15px] font-bold'>
                      {offering.subject} · {offering.grade}
                    </p>
                    <p className='text-ink/75 mt-0.5 text-sm font-semibold'>
                      {formatPrice(offering.pricePerHour)}/giờ
                    </p>
                  </div>
                  <Link
                    className={cn(
                      buttonVariants({ size: 'sm' }),
                      'h-9 shrink-0 rounded-lg px-3.5 text-sm text-white! hover:text-white!'
                    )}
                    to={profileHref}
                  >
                    Đặt lịch
                  </Link>
                </div>
              ))
            ) : (
              <div className='px-3 py-4 text-center'>
                <p className='text-ink text-sm font-bold'>
                  {startingPriceLabel ? `Từ ${startingPriceLabel}` : 'Chưa có khóa học đang mở'}
                </p>
                <p className='text-muted mt-1 text-xs'>Xem hồ sơ để biết môn học phù hợp</p>
              </div>
            )}
          </div>

          <Link
            className='py-3 text-center text-[15px] font-bold text-blue-700! hover:text-blue-800! hover:underline!'
            to={profileHref}
          >
            Xem tất cả khóa học
          </Link>

          <div className='mt-auto border-t border-slate-200 pt-3'>
            <div className='flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5'>
              <span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700'>
                <CalendarDays size={16} />
              </span>
              <div className='min-w-0'>
                <p className='text-muted text-sm font-bold'>Lịch trống tiếp theo</p>
                <p className='text-ink mt-0.5 truncate text-[15px] font-semibold'>
                  {nextAvailability
                    ? `${nextAvailability.dateLabel}, ${nextAvailability.startTime}-${nextAvailability.endTime}`
                    : mentor.availabilitySummary || 'Xem lịch chi tiết trong hồ sơ'}
                </p>
              </div>
            </div>

            <p className='text-muted mt-2.5 text-sm font-semibold'>Hình thức học phù hợp</p>
            <div className='mt-1.5 flex min-h-6 flex-wrap gap-1.5'>
              {meetingTypes.map((meetingType) => (
                <Badge key={meetingType} className='px-2.5 py-1 text-sm' variant='muted'>
                  {formatMeetingType(meetingType)}
                </Badge>
              ))}
              {(mentor.highlights ?? []).slice(0, 1).map((highlight) => (
                <Badge key={highlight} className='px-2.5 py-1 text-sm' variant='outline'>
                  {highlight}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function QuickStat({
  icon,
  label,
  value
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className='min-w-0 px-1.5 text-center'>
      <span className='text-muted mx-auto flex justify-center'>{icon}</span>
      <p className='text-muted mt-1 truncate text-xs font-semibold'>{label}</p>
      <p className='text-ink mt-0.5 line-clamp-2 text-sm font-bold'>{value}</p>
    </div>
  )
}

export default MentorCard

function formatMeetingType(meetingType: MentorCardMeetingType) {
  if (meetingType === 'ONLINE') return 'Online'
  if (meetingType === 'OFFLINE') return 'Offline'
  return 'Hybrid'
}
