import { ArrowRight, BadgeCheck, Clock3, ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

type BecomeMentorHeroProps = {
  completedCount: number
  totalCount: number
}

export function BecomeMentorHero({ completedCount, totalCount }: BecomeMentorHeroProps) {
  return (
    <section className='relative overflow-hidden rounded-[36px] border border-slate-200 bg-white'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.14),transparent_30%)]' />
      <div className='relative grid gap-8 px-6 py-8 md:px-8 md:py-10 xl:grid-cols-[minmax(0,1.45fr)_22rem]'>
        <div className='space-y-6'>
          <div className='flex flex-wrap items-center gap-3'>
            <Badge variant='info'>Hồ sơ mentor</Badge>
            <Badge variant='muted' className='gap-1'>
              <Clock3 size={14} />
              Dự kiến duyệt trong 24-48 giờ
            </Badge>
          </div>

          <div className='max-w-3xl space-y-3'>
            <h1 className='text-4xl leading-tight font-semibold md:text-5xl'>
              Trở thành mentor và biến kinh nghiệm của bạn thành những buổi học đáng giá.
            </h1>
            <p className='max-w-2xl leading-7 text-slate-600 md:text-lg'>
              Đây là trang ứng tuyển vào khu mentor. Bạn hoàn thiện hồ sơ, chọn môn dạy, khai lịch
              rảnh và nộp xác minh trước khi đội ngũ quản trị duyệt lên trang kết nối.
            </p>
          </div>

          <div className='grid gap-3 md:grid-cols-3'>
            <MetricCard
              icon={BadgeCheck}
              label='Tiến độ hiện tại'
              value={`${completedCount}/${totalCount} bước`}
            />
            <MetricCard
              icon={ShieldCheck}
              label='Kiểm tra trước khi public'
              value='Xác minh + phê duyệt'
            />
            <MetricCard icon={ArrowRight} label='Mục tiêu sau khi duyệt' value='Vào khu mentor' />
          </div>
        </div>

        <div className='rounded-[28px] border border-slate-200 bg-slate-50/80 p-5 shadow-inner shadow-white'>
          <p className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase'>
            Quy trình xét duyệt
          </p>
          <div className='mt-4 space-y-4'>
            <TimelineItem
              title='Hoàn thiện hồ sơ'
              description='Thông tin cá nhân, kinh nghiệm, môn dạy và mức học phí.'
            />
            <TimelineItem
              title='Nộp giấy tờ xác minh'
              description='CCCD / ID và ảnh chân dung để đội ngũ đối chiếu.'
            />
            <TimelineItem
              title='Quản trị viên xét duyệt'
              description='Chúng tôi kiểm tra độ tin cậy trước khi bật hoạt động mentor.'
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({
  icon: Icon,
  label,
  value
}: {
  icon: typeof BadgeCheck
  label: string
  value: string
}) {
  return (
    <div className='rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm'>
      <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl'>
        <Icon size={18} />
      </div>
      <p className='mt-4 text-sm font-medium text-slate-500'>{label}</p>
      <p className='mt-1 text-lg font-semibold text-slate-900'>{value}</p>
    </div>
  )
}

function TimelineItem({ description, title }: { description: string; title: string }) {
  return (
    <div className='flex gap-3'>
      <div className='flex flex-col items-center'>
        <div className='bg-primary/12 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold'>
          •
        </div>
        <div className='mt-2 h-full w-px bg-slate-200 last:hidden' />
      </div>
      <div className='pb-3'>
        <p className='text-sm font-semibold text-slate-900'>{title}</p>
        <p className='mt-1 text-sm leading-6 text-slate-600'>{description}</p>
      </div>
    </div>
  )
}
