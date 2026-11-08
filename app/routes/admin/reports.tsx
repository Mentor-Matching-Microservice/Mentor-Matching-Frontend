import { useMemo, useState } from 'react'
import { AlertTriangle, FileWarning } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { EmptyState } from '@/components/EmptyState'
import { StatusFilterPills } from '@/components/StatusFilterPills'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  adminReports,
  type AdminReportRecord,
  type AdminReportStatus
} from '@/mocks/admin-workspace'

type ReportFilter = 'ALL' | AdminReportStatus

const reportFilters: Array<{ key: ReportFilter; label: string }> = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'NEW', label: 'Mới' },
  { key: 'IN_REVIEW', label: 'Đang xử lý' },
  { key: 'CLOSED', label: 'Đã đóng' }
]

const matchesReportFilter = (report: AdminReportRecord, filter: ReportFilter) =>
  filter === 'ALL' ? true : report.status === filter

const reportStatusLabelMap: Record<AdminReportStatus, string> = {
  NEW: 'Mới',
  IN_REVIEW: 'Đang xử lý',
  CLOSED: 'Đã đóng'
}

export function meta() {
  return [{ title: 'Báo cáo | Admin' }]
}

export default function AdminReportsPage() {
  const [activeFilter, setActiveFilter] = useState<ReportFilter>('ALL')

  const filteredReports = useMemo(
    () => adminReports.filter((report) => matchesReportFilter(report, activeFilter)),
    [activeFilter]
  )

  const filterCounts = useMemo(
    () =>
      reportFilters.reduce<Record<ReportFilter, number>>(
        (accumulator, filter) => {
          accumulator[filter.key] = adminReports.filter((report) =>
            matchesReportFilter(report, filter.key)
          ).length

          return accumulator
        },
        {} as Record<ReportFilter, number>
      ),
    []
  )

  return (
    <DashboardPage
      description='Giữ khu vực báo cáo trung thực với hiện trạng backend: có hàng đợi đọc và ưu tiên, nhưng chưa giả lập một moderation engine hoàn chỉnh.'
      title='Báo cáo và sự cố'
    >
      <div className='space-y-6'>
        <WorkspacePanel
          title='Trạng thái báo cáo'
          description='Tách báo cáo mới, đang xử lý và đã đóng để admin rà hàng đợi theo mức ưu tiên thay vì đọc một danh sách phẳng.'
        >
          <StatusFilterPills
            onValueChange={setActiveFilter}
            options={reportFilters.map((filter) => ({
              key: filter.key,
              label: `${filter.label} (${filterCounts[filter.key]})`
            }))}
            value={activeFilter}
          />
        </WorkspacePanel>

        <WorkspacePanel
          title='Hàng đợi báo cáo'
          description='Mỗi mục chỉ mô tả loại vấn đề, thực thể liên quan, mức độ và trạng thái hiện có; thao tác đóng/mở chính thức vẫn chờ workflow backend.'
        >
          {filteredReports.length === 0 ? (
            <EmptyState
              description='Khi có báo cáo hệ thống, khiếu nại học viên hoặc cờ vận hành mới, chúng sẽ hiển thị ở đây theo trạng thái đã chọn.'
              title='Chưa có báo cáo nào'
            />
          ) : (
            <div className='grid gap-4'>
              {filteredReports.map((report) => (
                <Card className='rounded-2xl shadow-none' key={report.id}>
                  <CardContent className='flex flex-col gap-4 p-5 lg:flex-row lg:items-start lg:justify-between'>
                    <div className='flex items-start gap-4'>
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                          report.severity === 'HIGH'
                            ? 'bg-red-50 text-red-700'
                            : report.severity === 'MEDIUM'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <FileWarning aria-hidden='true' size={18} />
                      </div>
                      <div className='space-y-3'>
                        <div className='flex flex-wrap items-center gap-2'>
                          <h2 className='text-ink text-lg font-semibold'>{report.title}</h2>
                          <Badge
                            variant={
                              report.severity === 'HIGH'
                                ? 'destructive'
                                : report.severity === 'MEDIUM'
                                  ? 'warning'
                                  : 'muted'
                            }
                          >
                            {report.severity === 'HIGH'
                              ? 'Mức cao'
                              : report.severity === 'MEDIUM'
                                ? 'Mức trung bình'
                                : 'Mức thấp'}
                          </Badge>
                          <Badge variant='info'>{reportStatusLabelMap[report.status]}</Badge>
                        </div>

                        <div className='text-muted grid gap-2 text-sm md:grid-cols-2 xl:grid-cols-3'>
                          <p>{report.reportType}</p>
                          <p>{report.relatedEntity}</p>
                          <p>{report.submittedAtLabel}</p>
                        </div>

                        <p className='text-muted text-sm'>{report.summary}</p>
                      </div>
                    </div>

                    <Button variant='outline'>Xem chi tiết</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </WorkspacePanel>

        <WorkspaceNotice
          description='Route này cố ý dừng ở mức triage queue và trạng thái đọc được. Việc phân công, đóng báo cáo hoặc ghi log xử lý chi tiết chưa nên được giả lập như tính năng đã có.'
          icon={AlertTriangle}
          title='Ghi chú về mức độ hoàn thiện'
          tone='warning'
        />
      </div>
    </DashboardPage>
  )
}
