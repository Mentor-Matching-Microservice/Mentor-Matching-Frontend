import { Link } from 'react-router'

import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { path } from '@/config/path'
import { cn } from '@/utils/cn'

const Footer = () => {
  return (
    <footer className='mt-20 border-t border-slate-200 bg-slate-50'>
      <div className='page-container py-12'>
        <div className='grid gap-10 md:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]'>
          <div>
            <Link className='text-primary text-lg font-semibold' to={path.home}>
              Mentor Matching
            </Link>
            <p className='text-muted mt-3 max-w-md text-sm leading-relaxed'>
              Kết nối học viên và phụ huynh với mentor đã được duyệt theo môn học, cấp lớp, hình
              thức học và mục tiêu tiến bộ cụ thể.
            </p>
            <div className='mt-4 flex flex-wrap gap-2 text-xs'>
              <Badge variant='outline'>Mentor đã duyệt</Badge>
              <Badge variant='outline'>Offering theo môn và cấp lớp</Badge>
              <Badge variant='outline'>Đặt buổi học theo khung giờ thật</Badge>
            </div>
          </div>
          <div>
            <p className='text-ink text-sm font-semibold'>Khám phá</p>
            <ul className='text-muted mt-3 space-y-2 text-sm'>
              <li>
                <Link className='hover:text-primary transition' to={path.discover}>
                  Tìm mentor
                </Link>
              </li>
              <li>
                <Link className='hover:text-primary transition' to={path.home}>
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link className='hover:text-primary transition' to={path.mentorPanel.root}>
                  Khu vực Mentor
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className='text-ink text-sm font-semibold'>Tài khoản</p>
            <ul className='text-muted mt-3 space-y-2 text-sm'>
              <li>
                <Link className='hover:text-primary transition' to={path.login}>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link className='hover:text-primary transition' to={path.user.root}>
                  Học viên
                </Link>
              </li>
              <li>
                <Link className='hover:text-primary transition' to={path.admin.root}>
                  Admin
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className='text-ink text-sm font-semibold'>Bắt đầu</p>
            <p className='text-muted mt-3 text-sm leading-relaxed'>
              Bắt đầu với môn học và cấp lớp cụ thể, so sánh học phí cùng độ tin cậy rồi gửi yêu cầu
              đặt buổi đầu tiên.
            </p>
            <div className='mt-4 space-y-3'>
              <Link
                className={cn(buttonVariants({ className: 'w-full rounded-2xl text-center' }))}
                to={path.discover}
              >
                Tìm mentor ngay
              </Link>
              <Link
                className={cn(
                  buttonVariants({
                    className: 'w-full rounded-2xl text-center',
                    variant: 'outline'
                  })
                )}
                to={path.login}
              >
                Đăng nhập để quản lý lịch học
              </Link>
            </div>
          </div>
        </div>
        <Separator className='my-8' />
        <div className='flex flex-col gap-2 text-xs text-slate-500 md:flex-row md:items-center md:justify-between'>
          <p>2026 Mentor Matching. All rights reserved.</p>
          <p>Ưu tiên trải nghiệm tìm mentor rõ ràng, đáng tin và bám sát nhu cầu học tập.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
