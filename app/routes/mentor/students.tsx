import { BookOpenText, CalendarDays, CheckCircle2, Clock3, Search, Users } from 'lucide-react'
import { useMemo, useState } from 'react'

import { DashboardPage } from '@/components/DashboardPage'
import { WorkspaceMetricCard } from '@/components/WorkspaceMetricCard'
import { AppSelect } from '@/components/ui/app-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import { mentorStudents } from '@/mocks/mentor-workspace'
import type { MentorStudentRecord } from '@/mocks/mentor-workspace'
import { cn } from '@/utils/cn'
import { formatShortBookingDate, formatTimeRange } from '@/utils/format'

type StatusFilter = 'ALL' | 'CONFIRMED' | 'PENDING' | 'COMPLETED'
type SubjectFilter = 'ALL' | 'TOAN_9' | 'TOAN_8' | 'ON_THI_10'

const statusOptions = [
  { label: 'Theo trạng thái', value: 'ALL' },
  { label: BOOKING_STATUS_CONFIG.CONFIRMED.label, value: 'CONFIRMED' },
  { label: BOOKING_STATUS_CONFIG.PENDING.label, value: 'PENDING' },
  { label: BOOKING_STATUS_CONFIG.COMPLETED.label, value: 'COMPLETED' }
] as const

const subjectOptions = [
  { label: 'Theo môn học', value: 'ALL' },
  { label: 'Toán - Lớp 9', value: 'TOAN_9' },
  { label: 'Toán - Lớp 8', value: 'TOAN_8' },
  { label: 'Toán - Ôn thi lớp 10', value: 'ON_THI_10' }
] as const

function getStudentStatusMeta(student: MentorStudentRecord) {
  if (student.bookingStatus === 'CONFIRMED') {
    return {
      label: BOOKING_STATUS_CONFIG.CONFIRMED.label,
      className: 'border-blue-200 bg-blue-50 text-blue-700'
    }
  }

  if (student.bookingStatus === 'PENDING') {
    return {
      label: BOOKING_STATUS_CONFIG.PENDING.label,
      className: 'border-amber-200 bg-amber-50 text-amber-700'
    }
  }

  return {
    label: BOOKING_STATUS_CONFIG.COMPLETED.label,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700'
  }
}

function getStudentAvatar(studentName: string) {
  return studentName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function matchSubjectFilter(student: MentorStudentRecord, filter: SubjectFilter) {
  if (filter === 'ALL') return true
  if (filter === 'TOAN_9') return student.recentOffering.includes('Lớp 9')
  if (filter === 'TOAN_8') return student.recentOffering.includes('Lớp 8')
  return student.recentOffering.includes('Ôn thi lớp 10')
}

function matchStatusFilter(student: MentorStudentRecord, filter: StatusFilter) {
  if (filter === 'ALL') return true
  if (filter === 'CONFIRMED') return student.bookingStatus === 'CONFIRMED'
  if (filter === 'PENDING') return student.bookingStatus === 'PENDING'
  return student.bookingStatus === 'COMPLETED'
}

export function meta() {
  return [{ title: 'Học viên | Mentor' }]
}

export default function MentorStudentsPage() {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('ALL')

  const activeStudents = mentorStudents.filter(
    (student) => student.bookingStatus === 'CONFIRMED' || student.bookingStatus === 'PENDING'
  )
  const newStudentsCount = mentorStudents.filter((student) => student.bookingCount <= 1).length

  const visibleStudents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return mentorStudents.filter((student) => {
      const matchesQuery =
        !normalizedQuery ||
        student.studentName.toLowerCase().includes(normalizedQuery) ||
        student.recentOffering.toLowerCase().includes(normalizedQuery)

      return (
        matchesQuery &&
        matchStatusFilter(student, statusFilter) &&
        matchSubjectFilter(student, subjectFilter)
      )
    })
  }, [query, statusFilter, subjectFilter])

  return (
    <DashboardPage className='space-y-6 md:space-y-7' title='Học viên'>
      <div className='mb-10 grid gap-4 xl:grid-cols-2'>
        <WorkspaceMetricCard
          className='rounded-[24px]'
          helper='Tổng số học viên hiện tại'
          icon={Users}
          label='Học viên đang học'
          value={activeStudents.length}
        />
        <WorkspaceMetricCard
          className='rounded-[24px]'
          helper='Học viên tham gia trong tuần này'
          icon={CalendarDays}
          label='Học viên mới'
          tone='neutral'
          value={newStudentsCount}
        />
      </div>

      <Card className='rounded-[24px] border-slate-200 shadow-none'>
        <CardContent className='space-y-4 p-4 md:p-5'>
          <div className='flex flex-col gap-3 xl:flex-row'>
            <div className='relative flex-1'>
              <Search
                aria-hidden='true'
                className='absolute top-1/2 left-4 -translate-y-1/2 text-slate-400'
                size={18}
              />
              <Input
                className='h-12 rounded-xl pl-11 text-base'
                id='mentor-students-search'
                onChange={(event) => setQuery(event.target.value)}
                placeholder='Tìm kiếm học viên...'
                type='search'
                value={query}
              />
            </div>

            <div className='grid gap-3 md:grid-cols-2 xl:min-w-[300px]'>
              <AppSelect
                ariaLabel='Lọc theo trạng thái'
                className='[&_button]:h-12 [&_button]:rounded-xl [&_button]:text-base [&_button]:text-slate-900!'
                onValueChange={(value) => setStatusFilter((value || 'ALL') as StatusFilter)}
                options={statusOptions.slice(1).map((option) => ({ ...option }))}
                placeholder='Theo trạng thái'
                value={statusFilter === 'ALL' ? '' : statusFilter}
              />
              <AppSelect
                ariaLabel='Lọc theo môn học'
                className='[&_button]:h-12 [&_button]:rounded-xl [&_button]:text-base [&_button]:text-slate-900!'
                onValueChange={(value) => setSubjectFilter((value || 'ALL') as SubjectFilter)}
                options={subjectOptions.slice(1).map((option) => ({ ...option }))}
                placeholder='Theo môn học'
                value={subjectFilter === 'ALL' ? '' : subjectFilter}
              />
            </div>
          </div>

          <div className='space-y-3'>
            {visibleStudents.map((student) => {
              const statusMeta = getStudentStatusMeta(student)

              return (
                <Card className='rounded-[22px] border-slate-200 shadow-none' key={student.id}>
                  <CardContent className='p-4 md:p-5'>
                    <div className='flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between'>
                      <div className='flex min-w-0 flex-1 items-start gap-4'>
                        <div className='flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl font-semibold text-slate-700'>
                          {getStudentAvatar(student.studentName)}
                        </div>

                        <div className='grid min-w-0 flex-1 gap-4 xl:grid-cols-[220px_1px_minmax(0,1fr)] xl:items-start'>
                          <div className='space-y-2'>
                            <p className='text-ink text-[2rem] leading-none font-bold tracking-tight'>
                              {student.studentName}
                            </p>
                            <span
                              className={cn(
                                'inline-flex rounded-full border px-3 py-1 text-sm font-medium',
                                statusMeta.className
                              )}
                            >
                              {statusMeta.label}
                            </span>
                          </div>

                          <div className='hidden h-full w-px bg-slate-200 xl:block' />

                          <div className='space-y-3'>
                            <div className='grid gap-3 text-[1.02rem] text-slate-800 md:grid-cols-2'>
                              <p className='flex items-center gap-2'>
                                <BookOpenText className='text-blue-600' size={17} />
                                {student.recentOffering.replace(' · ', ' - ')}
                              </p>
                              <p className='flex items-center gap-2'>
                                <CheckCircle2 className='text-blue-600' size={17} />
                                {student.bookingCount} buổi đã ghi nhận
                              </p>
                              <p className='flex items-center gap-2'>
                                <CalendarDays className='text-blue-600' size={17} />
                                {student.nextSession
                                  ? formatShortBookingDate(student.nextSession.bookingDate)
                                  : '-'}
                              </p>
                              <p className='flex items-center gap-2'>
                                <Clock3 className='text-blue-600' size={17} />
                                {student.nextSession
                                  ? formatTimeRange(
                                      student.nextSession.startTime,
                                      student.nextSession.endTime
                                    )
                                  : '-'}
                              </p>
                            </div>

                            <p className='text-[1.02rem] leading-relaxed text-slate-700'>
                              {student.recentSummary}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className='flex min-w-[150px] flex-col gap-3 xl:w-[150px]'>
                        <Button className='h-12 rounded-full text-base'>Xem chi tiết</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {visibleStudents.length === 0 ? (
              <Card className='rounded-[22px] border-dashed border-slate-200 shadow-none'>
                <CardContent className='flex min-h-[180px] flex-col items-center justify-center gap-2 p-6 text-center'>
                  <p className='text-ink text-lg font-semibold'>Không tìm thấy học viên phù hợp</p>
                  <p className='max-w-md text-sm text-slate-500'>
                    Hãy thử đổi từ khóa tìm kiếm hoặc bỏ bớt bộ lọc để xem lại toàn bộ danh sách.
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </DashboardPage>
  )
}
