import { AlertTriangle, Settings2 } from 'lucide-react'

import { DashboardPage } from '@/components/DashboardPage'
import { WorkspaceNotice } from '@/components/WorkspaceNotice'
import { WorkspacePanel } from '@/components/WorkspacePanel'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { adminSettingsGroups } from '@/mocks/admin-workspace'

export function meta() {
  return [{ title: 'Cài đặt | Admin' }]
}

export default function AdminSettingsPage() {
  return (
    <DashboardPage
      description='Giữ màn hình cài đặt ở mức định hướng vận hành rõ ràng: nhóm nào đã có quy ước, nhóm nào còn phải chờ backend trước khi mở chỉnh sửa trực tiếp.'
      title='Cài đặt hệ thống'
    >
      <div className='space-y-6'>
        <WorkspacePanel
          title='Phạm vi cấu hình hiện tại'
          description='Admin cần một nơi nhìn thấy các nhóm cấu hình quan trọng, nhưng không nên bị dẫn tới cảm giác đây đã là form cấu hình hoàn chỉnh.'
        >
          <div className='grid gap-4 xl:grid-cols-3'>
            {adminSettingsGroups.map((group) => (
              <Card className='rounded-2xl shadow-none' key={group.id}>
                <CardContent className='space-y-5 p-5'>
                  <div className='flex items-start gap-3'>
                    <div className='bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'>
                      <Settings2 aria-hidden='true' size={18} />
                    </div>
                    <div className='space-y-1'>
                      <h2 className='text-ink font-semibold'>{group.title}</h2>
                      <p className='text-muted text-sm'>{group.description}</p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    {group.items.map((item) => (
                      <Card
                        className='rounded-2xl border-slate-200 bg-slate-50 shadow-none'
                        key={item.label}
                      >
                        <CardContent className='space-y-2 p-4'>
                          <div className='flex flex-wrap items-center gap-2'>
                            <p className='text-ink font-medium'>{item.label}</p>
                            <Badge
                              variant={
                                item.supportLabel === 'Đã có quy ước'
                                  ? 'success'
                                  : item.supportLabel === 'Cần backend'
                                    ? 'warning'
                                    : 'muted'
                              }
                            >
                              {item.supportLabel}
                            </Badge>
                          </div>
                          <p className='text-muted text-sm'>{item.value}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </WorkspacePanel>

        <WorkspaceNotice
          description='Các nhóm settings này đang giúp admin nhìn đúng phạm vi hỗ trợ hiện có. Chúng chưa nên có submit state hoặc toggle thật cho tới khi backend định nghĩa rõ dữ liệu, quyền sửa và hậu quả vận hành của từng thay đổi.'
          icon={AlertTriangle}
          title='Vì sao chưa có nút lưu cấu hình'
          tone='warning'
        />
      </div>
    </DashboardPage>
  )
}
