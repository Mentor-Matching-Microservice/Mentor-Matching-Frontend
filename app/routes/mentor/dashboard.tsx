import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

import { DashboardPage } from '@/components/DashboardPage'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { path } from '@/config/path'
import { cn } from '@/utils/cn'
import { getInitials } from '@/utils/format'

export function meta() {
  return [{ title: 'Tổng quan | Mentor' }]
}

type MentorDashboardStat = {
  label: string
  value: string
  helper?: string
  helperClassName?: string
  href?: string
}

const statCards: MentorDashboardStat[] = [
  {
    label: 'Tổng thu nhập',
    value: '12.500.000đ',
    helper: '+1.2tr tháng này',
    helperClassName: 'text-emerald-700'
  },
  {
    label: 'Học viên',
    value: '12',
    helper: 'View list',
    helperClassName: 'text-blue-700',
    href: path.mentorPanel.students
  },
  {
    label: 'Buổi dạy sắp tới',
    value: '4'
  }
]

const upcomingRows = [
  {
    id: 'row-1',
    studentName: 'Minh Khôi',
    subjectLabel: 'Toán 10',
    timeLabel: '19:30 - 21:00',
    dayLabel: 'Hôm nay',
    statusLabel: 'Paid/Confirmed',
    actionLabel: 'Vào lớp học',
    actionVariant: 'default' as const
  },
  {
    id: 'row-2',
    studentName: 'Ngọc Linh',
    subjectLabel: 'Toán 10',
    timeLabel: '19:30 - 21:00',
    dayLabel: 'Hôm nay',
    statusLabel: 'Paid/Confirmed',
    actionLabel: 'Vào lớp học',
    actionVariant: 'default' as const
  },
  {
    id: 'row-3',
    studentName: 'Gia Hân',
    subjectLabel: 'Toán 10',
    timeLabel: '19:30 - 21:00',
    dayLabel: 'Hôm nay',
    statusLabel: 'Paid/Confirmed',
    actionLabel: 'Vào lớp học',
    actionVariant: 'default' as const
  },
  {
    id: 'row-4',
    studentName: 'Nguyễn Minh',
    subjectLabel: 'Toán 10',
    timeLabel: '19:30 - 21:00',
    dayLabel: 'Hôm nay',
    statusLabel: 'Paid/Confirmed',
    actionLabel: 'Vào lớp học',
    actionVariant: 'default' as const
  }
]

const studentRows = [
  {
    name: 'Minh Khôi',
    lessonLabel: 'Toán 10',
    startDate: '07/07/2022',
    lastSession: '07/07/2023'
  },
  {
    name: 'Ngọc Linh',
    lessonLabel: 'Toán 8',
    startDate: '07/07/2022',
    lastSession: '07/07/2023'
  },
  {
    name: 'Nguyễn Minh Anh',
    lessonLabel: 'Toán 5',
    startDate: '07/07/2022',
    lastSession: '07/07/2023'
  },
  {
    name: 'Gia Hân',
    lessonLabel: 'Toán 10',
    startDate: '07/07/2022',
    lastSession: '07/07/2023'
  }
]

export default function MentorDashboardPage() {
  return (
    <DashboardPage className='space-y-8 md:space-y-10' title=''>
      <div className='space-y-6'>
        <div className='flex flex-wrap items-center gap-2 text-sm text-slate-500'>
          <Link className='hover:text-primary transition' to={path.home}>
            Home
          </Link>
          <ChevronRight size={14} />
          <span className='text-ink font-medium'>Mentor Dashboard</span>
        </div>

        <section className='grid gap-4 xl:grid-cols-3'>
          {statCards.map((card) => (
            <Card className='rounded-[18px] border-slate-300/90 shadow-none' key={card.label}>
              <CardContent className='flex min-h-[128px] flex-col justify-between p-4'>
                <p className='text-ink text-[0.95rem] font-medium'>{card.label}</p>
                <p className='text-ink text-[2.2rem] leading-none font-bold md:text-[2.45rem]'>
                  {card.value}
                </p>
                {card.href && card.helper ? (
                  <Link
                    className={cn(
                      'inline-flex text-[0.95rem] font-medium transition hover:underline',
                      card.helperClassName
                    )}
                    to={card.href}
                  >
                    {card.helper}
                  </Link>
                ) : card.helper ? (
                  <p className={cn('text-[0.95rem] font-medium', card.helperClassName)}>
                    {card.helper}
                  </p>
                ) : (
                  <span className='h-5' />
                )}
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      <section className='space-y-4'>
        <h2 className='text-ink text-[1.95rem] font-bold tracking-tight'>Buổi dạy sắp tới</h2>

        <div className='space-y-2.5'>
          {upcomingRows.map((row) => (
            <Card className='rounded-[14px] border-slate-300/90 shadow-none' key={row.id}>
              <CardContent className='grid items-center gap-4 px-4 py-2.5 md:grid-cols-[1.1fr_0.85fr_1fr_0.95fr_auto]'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700'>
                    {getInitials(row.studentName)}
                  </div>
                  <p className='text-ink truncate text-[0.98rem] font-medium'>{row.studentName}</p>
                </div>

                <p className='text-ink text-[0.98rem] font-medium'>{row.subjectLabel}</p>

                <div>
                  <p className='text-ink text-[0.98rem] font-medium'>{row.timeLabel}</p>
                  <p className='text-muted text-[0.92rem]'>{row.dayLabel}</p>
                </div>

                <span className='inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1 text-[0.95rem] font-semibold text-emerald-700'>
                  {row.statusLabel}
                </span>

                <div className='md:justify-self-end'>
                  <Button
                    className='h-9 rounded-lg px-4 text-sm font-medium'
                    variant={row.actionVariant}
                  >
                    {row.actionLabel}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='space-y-4'>
        <h2 className='text-ink text-[1.95rem] font-bold tracking-tight'>Học viên đang theo học</h2>

        <Card className='overflow-hidden rounded-[14px] border-slate-300/90 shadow-none'>
          <CardContent className='p-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-slate-50/40'>
                  <TableHead className='h-12 px-4 text-[0.95rem] font-medium tracking-normal text-slate-800 normal-case'>
                    Học viên
                  </TableHead>
                  <TableHead className='h-12 text-[0.95rem] font-medium tracking-normal text-slate-800 normal-case'>
                    Buổi lọt
                  </TableHead>
                  <TableHead className='h-12 text-[0.95rem] font-medium tracking-normal text-slate-800 normal-case'>
                    Start từ đầu
                  </TableHead>
                  <TableHead className='h-12 text-[0.95rem] font-medium tracking-normal text-slate-800 normal-case'>
                    Last session
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentRows.map((row) => (
                  <TableRow className='align-middle' key={row.name}>
                    <TableCell className='px-4 py-3 text-[0.98rem] font-medium text-slate-900'>
                      {row.name}
                    </TableCell>
                    <TableCell className='py-3 text-[0.98rem] text-slate-900'>
                      {row.lessonLabel}
                    </TableCell>
                    <TableCell className='py-3 text-[0.98rem] text-slate-900'>
                      {row.startDate}
                    </TableCell>
                    <TableCell className='py-3 text-[0.98rem] text-slate-900'>
                      {row.lastSession}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </DashboardPage>
  )
}
