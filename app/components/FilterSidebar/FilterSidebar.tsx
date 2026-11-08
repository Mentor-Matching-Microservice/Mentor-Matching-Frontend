import { RotateCcw, SlidersHorizontal, X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

interface FilterSidebarProps {
  onClose?: () => void
  groups?: FilterGroup[]
  selectedValues?: string[]
  onToggleValue?: (value: string) => void
  onReset?: () => void
  onApply?: () => void
}

export type FilterOption = {
  label: string
  value: string
  helper?: string
  disabled?: boolean
  badgeLabel?: string
}

export type FilterGroup = {
  title: string
  items: FilterOption[]
}

export const defaultFilterGroups: FilterGroup[] = [
  {
    title: 'Môn học',
    items: [
      { label: 'Toán', value: 'subject:Toán', helper: 'THCS, ôn chuyển cấp và nền tảng' },
      { label: 'Tiếng Anh', value: 'subject:Tiếng Anh', helper: 'THPT và giao tiếp cơ bản' },
      { label: 'Vật lý', value: 'subject:Vật lý', helper: 'Môn học cần so sánh cách giảng dạy' },
      {
        label: 'Lập trình',
        value: 'subject:Lập trình Python',
        helper: 'Cho học sinh cần nền tảng logic'
      }
    ]
  },
  {
    title: 'Cấp lớp',
    items: [
      { label: 'Lớp 8', value: 'grade:Lớp 8' },
      { label: 'Lớp 9', value: 'grade:Lớp 9' },
      { label: 'THPT', value: 'grade:THPT' },
      { label: 'IELTS Foundation', value: 'grade:IELTS Foundation' }
    ]
  },
  {
    title: 'Hình thức học',
    items: [
      { label: 'Online', value: 'meeting:ONLINE', helper: 'Phù hợp lịch linh hoạt' },
      { label: 'Offline', value: 'meeting:OFFLINE', helper: 'Cần gặp trực tiếp' },
      { label: 'Hybrid', value: 'meeting:HYBRID', helper: 'Có thể kết hợp online và gặp mặt' }
    ]
  },
  {
    title: 'Mức học phí mỗi giờ',
    items: [
      { label: 'Dưới 250k', value: 'price:under-250' },
      { label: '250k - 350k', value: 'price:250-350' },
      { label: '350k - 500k', value: 'price:350-500' },
      { label: 'Trên 500k', value: 'price:500-plus' }
    ]
  },
  {
    title: 'Khả dụng và tín nhiệm',
    items: [
      { label: 'Buổi tối', value: 'availability:evening', helper: 'Dễ ghép lịch sau giờ học' },
      { label: 'Cuối tuần', value: 'availability:weekend', helper: 'Ưu tiên Thứ 7 và Chủ nhật' },
      {
        label: 'Có lịch gần nhất',
        value: 'availability:upcoming',
        helper: 'Có slot cụ thể sắp mở'
      },
      {
        label: 'Phản hồi nhanh',
        value: 'availability:fast-response',
        helper: 'Thường phản hồi trong 1-2 giờ'
      },
      { label: 'Đã duyệt', value: 'trust:approved', helper: 'Hồ sơ đã qua bước duyệt công khai' },
      { label: 'Đã xác minh', value: 'trust:verified', helper: 'Có tín hiệu xác minh bổ sung' },
      { label: 'Từ 4.5 sao', value: 'trust:rating-4.5', helper: 'Phù hợp khi cần tín nhiệm cao' }
    ]
  }
]

const FilterSidebar = ({
  groups = defaultFilterGroups,
  onApply,
  onClose,
  onReset,
  onToggleValue,
  selectedValues = []
}: FilterSidebarProps) => {
  const selectedCount = selectedValues.length

  return (
    <Card className='flex w-full flex-col rounded-3xl border-slate-200 bg-white shadow-sm'>
      <CardContent className='flex flex-1 flex-col gap-5 p-5'>
        <div className='flex items-start justify-between gap-3'>
          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <Badge className='gap-1.5' variant='info'>
                <SlidersHorizontal size={12} />
                Bộ lọc
              </Badge>
              {selectedCount ? <Badge variant='muted'>{selectedCount} đang chọn</Badge> : null}
            </div>
            <div>
              <h3 className='text-ink text-base font-semibold'>Thu hẹp danh sách mentor</h3>
              <p className='text-muted mt-1 text-sm leading-relaxed'>
                Chọn thêm hình thức học, khu vực chi tiết hoặc giới tính.
              </p>
            </div>
          </div>
          {onClose ? (
            <Button
              className='shrink-0 rounded-xl md:hidden'
              size='icon'
              type='button'
              variant='outline'
              onClick={onClose}
            >
              <X size={16} />
            </Button>
          ) : null}
        </div>

        {groups.map((group, index) => (
          <div key={group.title}>
            {index > 0 ? <Separator className='mb-5' /> : null}
            <p className='text-ink text-sm font-semibold'>{group.title}</p>
            <div className='mt-3 space-y-2'>
              {group.items.map((item) => (
                <label
                  key={item.value}
                  className={`flex items-start gap-3 rounded-xl border px-3 py-3 transition ${
                    item.disabled
                      ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-70'
                      : 'cursor-pointer'
                  } ${
                    selectedValues.includes(item.value)
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Checkbox
                    checked={selectedValues.includes(item.value)}
                    disabled={item.disabled}
                    onChange={() => onToggleValue?.(item.value)}
                  />
                  <span className='min-w-0'>
                    <span className='flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700'>
                      <span>{item.label}</span>
                      {item.badgeLabel ? (
                        <span className='rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase'>
                          {item.badgeLabel}
                        </span>
                      ) : null}
                    </span>
                    {item.helper ? (
                      <span className='mt-1 block text-xs leading-relaxed text-slate-500'>
                        {item.helper}
                      </span>
                    ) : null}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className='mt-auto flex gap-3 border-t border-slate-200 pt-4'>
          <Button className='flex-1 rounded-xl' type='button' variant='outline' onClick={onReset}>
            <RotateCcw size={14} />
            Xóa bộ lọc
          </Button>
          <Button
            className='flex-1 rounded-xl'
            type='button'
            onClick={() => {
              onApply?.()
              onClose?.()
            }}
          >
            Áp dụng
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterSidebar
