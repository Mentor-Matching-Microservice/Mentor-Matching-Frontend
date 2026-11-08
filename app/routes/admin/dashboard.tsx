import { Link } from 'react-router'
import {
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  DollarSign,
  FileWarning,
  Settings2,
  ShieldCheck,
  UserPlus,
  Users
} from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusBadge } from '@/components/StatusBadge'
import { WorkspaceActionCard } from '@/components/WorkspaceActionCard'
import { WorkspaceMetricCard } from '@/components/WorkspaceMetricCard'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { path } from '@/config/path'
import { DailyTrendChart } from '@/features/admin/dashboard/components/DailyTrendChart'
import { useAdminStatsOverviewQuery } from '@/hooks/queries/admin/useAdminStatsOverviewQuery'
import { useAdminStatsTimeseriesQuery } from '@/hooks/queries/admin/useAdminStatsTimeseriesQuery'
import { adminDashboardSummary, adminQueueItems, adminReports } from '@/mocks/admin-workspace'
import { formatPrice } from '@/utils/format'
import { cn } from '@/utils/cn'

const quickLinks = [
  {
    title: 'Mở hàng duyệt mentor',
    description: 'Đi thẳng đến các hồ sơ cần chốt duyệt hoặc từ chối.',
    href: path.admin.mentors,
    icon: BookOpenCheck
  },
  {
    title: 'Rà soát người dùng',
    description: 'Kiểm tra tài khoản mentor, học viên và phụ huynh cần theo dõi.',
    href: path.admin.users,
    icon: Users
  },
  {
    title: 'Kiểm tra cài đặt vận hành',
    description: 'Xem các nhóm cấu hình đang có quy ước và phần nào còn chờ backend.',
    href: path.admin.settings,
    icon: Settings2
  }
] as const

const systemHealth = [
  {
    label: 'Hàng đợi duyệt mentor',
    value: 'Ổn định',
    helper: 'Đang còn 6 hồ sơ, trong đó 2 hồ sơ cần xử lý ngay trong hôm nay.'
  },
  {
    label: 'Báo cáo người dùng',
    value: 'Cần chú ý',
    helper: 'Có một báo cáo mức cao mới gửi, nên ưu tiên kiểm tra trước các việc theo dõi khác.'
  },
  {
    label: 'Thiết lập vận hành',
    value: 'Một phần thủ công',
    helper: 'Reports và payment operations vẫn cần backend rõ hơn trước khi mở cấu hình trực tiếp.'
  }
] as const

export function meta() {
  return [{ title: 'Tổng quan | Admin' }]
}

export default function AdminDashboardPage() {
  const highlightedReports = adminReports.filter((report) => report.status !== 'CLOSED').slice(0, 2)

  const { data: statsOverview } = useAdminStatsOverviewQuery()
  const { data: statsTimeseries } = useAdminStatsTimeseriesQuery()

  const bookingTrendData = (statsTimeseries ?? []).map((point) => ({
    date: point.date,
    value: point.bookingsCount
  }))
  const revenueTrendData = (statsTimeseries ?? []).map((point) => ({
    date: point.date,
    value: point.revenue
  }))

  return (
    <DashboardPage
      description='Ưu tiên hàng chờ duyệt, báo cáo mở và các tín hiệu vận hành ảnh hưởng trực tiếp đến marketplace.'
      title='Tổng quan Admin'
    >
      <WorkspacePanel
        description='Số liệu tăng trưởng người dùng, booking và doanh thu trong 30 ngày gần nhất.'
        title='Thống kê tổng quan'
      >
        <div className='grid gap-4 xl:grid-cols-4'>
          <WorkspaceMetricCard
            helper={statsOverview ? `Từ ${statsOverview.from} đến ${statsOverview.to}` : undefined}
            icon={UserPlus}
            label='Người dùng mới'
            value={statsOverview ? statsOverview.newUsersCount : '—'}
          />
          <WorkspaceMetricCard
            helper='Mentor đăng ký mới trong khoảng thời gian'
            icon={Users}
            label='Mentor mới'
            value={statsOverview ? statsOverview.newMentorsCount : '—'}
          />
          <WorkspaceMetricCard
            helper={
              statsOverview
                ? `${statsOverview.completedBookings}/${statsOverview.totalBookings} booking hoàn thành`
                : undefined
            }
            icon={BookOpenCheck}
            label='Tỷ lệ hoàn thành Booking'
            tone='success'
            value={statsOverview ? `${Math.round(statsOverview.completionRate * 100)}%` : '—'}
          />
          <WorkspaceMetricCard
            helper='Tổng giao dịch đã thanh toán qua Stripe'
            icon={DollarSign}
            label='Doanh thu'
            tone='warning'
            value={statsOverview ? formatPrice(statsOverview.totalRevenue) : '—'}
          />
        </div>

        <div className='grid gap-4 xl:grid-cols-2'>
          <DailyTrendChart
            color='var(--primary)'
            data={bookingTrendData}
            title='Booking theo ngày'
            valueFormatter={(value) => String(value)}
          />
          <DailyTrendChart
            color='var(--secondary)'
            data={revenueTrendData}
            title='Doanh thu theo ngày'
            valueFormatter={(value) => formatPrice(value)}
          />
        </div>
      </WorkspacePanel>

      <WorkspacePanel
        title='Cần xử lý hôm nay'
        description='Đưa các đầu việc cần quyết định lên trước metric để admin biết nên mở màn hình nào ngay.'
        action={
          <Link
            className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
            to={path.admin.mentors}
          >
            Mở duyệt mentor
            <ArrowRight aria-hidden='true' size={14} />
          </Link>
        }
      >
        {adminQueueItems.length === 0 ? (
          <EmptyState
            description='Khi không còn hồ sơ mentor nào chờ xử lý, phần tổng quan sẽ chuyển sang tập trung vào báo cáo và theo dõi hệ thống.'
            title='Không có mục cần xử lý gấp'
          />
        ) : (
          <div className='grid gap-4'>
            {adminQueueItems.map((item) => (
              <Card className='rounded-2xl shadow-none' key={item.id}>
                <CardContent className='flex flex-col gap-4 p-4 lg:flex-row lg:items-start lg:justify-between'>
                  <div className='space-y-3'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <h2 className='text-ink text-lg font-semibold'>{item.mentorName}</h2>
                      <StatusBadge kind='approval' status={item.approvalStatus} />
                      <StatusBadge kind='verification' status={item.verificationStatus} />
                    </div>
                    <p className='text-muted text-sm'>{item.headline}</p>
                    <div className='text-muted grid gap-2 text-sm md:grid-cols-2'>
                      <p>{item.offeringsSummary}</p>
                      <p>Gửi hồ sơ {item.submittedAtLabel}</p>
                    </div>
                    <Card className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'>
                      <CardContent className='p-4 text-sm text-slate-600'>{item.note}</CardContent>
                    </Card>
                  </div>

                  <div className='flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 lg:border-t-0 lg:pt-0'>
                    <Badge variant={item.priority === 'high' ? 'destructive' : 'warning'}>
                      {item.priority === 'high' ? 'Ưu tiên cao' : 'Theo dõi'}
                    </Badge>
                    <Link className={buttonVariants()} to={path.admin.mentors}>
                      Rà soát hồ sơ
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </WorkspacePanel>

      <div className='grid gap-4 xl:grid-cols-4'>
        {adminDashboardSummary.map((item, index) => {
          const icons = [BookOpenCheck, ShieldCheck, FileWarning, AlertTriangle] as const

          return (
            <WorkspaceMetricCard
              helper={item.helper}
              icon={icons[index]}
              key={item.label}
              label={item.label}
              value={item.value}
            />
          )
        })}
      </div>

      <div className='grid gap-6 xl:grid-cols-[1.3fr_1fr]'>
        <WorkspacePanel
          title='Báo cáo và cờ vận hành'
          description='Giữ màn hình này trung thực: chỉ hiển thị hàng đợi và bối cảnh xử lý, chưa giả lập moderation workflow đầy đủ.'
          action={
            <Link
              className={cn(buttonVariants({ size: 'sm', variant: 'link' }), 'h-auto px-0')}
              to={path.admin.reports}
            >
              Xem tất cả báo cáo
              <ArrowRight aria-hidden='true' size={14} />
            </Link>
          }
        >
          <div className='space-y-4'>
            {highlightedReports.map((report) => (
              <Card className='rounded-2xl shadow-none' key={report.id}>
                <CardContent className='flex items-start gap-4 p-4'>
                  <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-700'>
                    <FileWarning aria-hidden='true' size={20} />
                  </div>
                  <div className='min-w-0 flex-1 space-y-2'>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-ink font-semibold'>{report.title}</p>
                      <Badge variant={report.severity === 'HIGH' ? 'destructive' : 'warning'}>
                        {report.severity === 'HIGH' ? 'Mức cao' : 'Mức trung bình'}
                      </Badge>
                    </div>
                    <p className='text-muted text-sm'>
                      {report.reportType} · {report.relatedEntity} · {report.submittedAtLabel}
                    </p>
                    <p className='text-muted text-sm'>{report.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspacePanel
          title='Tình trạng vận hành'
          description='Các tín hiệu ngắn giúp admin biết phần nào đang ổn, phần nào còn cần thao tác thủ công.'
        >
          <div className='grid gap-3'>
            {systemHealth.map((item) => (
              <WorkspaceMetricCard
                helper={item.helper}
                icon={ShieldCheck}
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </WorkspacePanel>
      </div>

      <WorkspacePanel
        title='Đi nhanh tới màn hình cần dùng'
        description='Giữ điều hướng admin thực dụng: mentor, users, reports và settings đều có entry point rõ ràng.'
      >
        <div className='grid gap-3 lg:grid-cols-3'>
          {quickLinks.map((item) => (
            <WorkspaceActionCard
              description={item.description}
              icon={item.icon}
              key={item.title}
              title={item.title}
              to={item.href}
            />
          ))}
        </div>
      </WorkspacePanel>

      <WorkspaceNotice
        description='Reports và settings mới mô tả hàng đợi, quy ước vận hành và phạm vi backend hiện có. Chúng chưa đại diện cho workflow moderation hoặc cấu hình hệ thống hoàn chỉnh.'
        icon={AlertTriangle}
        title='Lưu ý ở giai đoạn UI tĩnh'
        tone='warning'
      />
    </DashboardPage>
  )
}
