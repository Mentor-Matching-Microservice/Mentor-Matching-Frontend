import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type {
  CatalogGradeApiResponse,
  CreateGradeRequest,
  GradeLevelGroupApiResponse,
  UpdateGradeRequest
} from '@/types/api/catalog'
import { catalogApi } from '@/services/catalog.api'

type GradeFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message?: string) => void
  initialData?: CatalogGradeApiResponse | null
}

const LEVEL_GROUPS: { value: GradeLevelGroupApiResponse; label: string }[] = [
  { value: 'PRIMARY', label: 'Cấp 1 (Tiểu học)' },
  { value: 'SECONDARY', label: 'Cấp 2 (THCS)' },
  { value: 'HIGH_SCHOOL', label: 'Cấp 3 (THPT)' }
]

export function GradeFormModal({ isOpen, onClose, onSuccess, initialData }: GradeFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<CreateGradeRequest>({
    name: '',
    levelGroup: 'PRIMARY'
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          levelGroup: initialData.levelGroup
        })
      } else {
        setFormData({
          name: '',
          levelGroup: 'PRIMARY'
        })
      }
      setError('')
    }
  }, [isOpen, initialData])

  if (typeof document === 'undefined' || !isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (initialData) {
        await catalogApi.updateGrade(initialData.id, formData as UpdateGradeRequest)
        onSuccess('Cập nhật lớp học / cấp độ thành công.')
      } else {
        await catalogApi.createGrade(formData)
        onSuccess('Thêm lớp học / cấp độ thành công.')
      }
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsSubmitting(false)
    }
  }

  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:p-6'>
      <div className='w-full max-w-[500px] rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-7 py-5'>
          <h3 className='text-ink text-[1.5rem] font-bold tracking-tight'>
            {initialData ? 'Chỉnh sửa Cấp độ' : 'Thêm Cấp độ mới'}
          </h3>
          <button
            aria-label='Đóng modal'
            className='flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
            onClick={onClose}
            type='button'
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className='space-y-5 px-7 py-6'>
            {error && (
              <div className='rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700'>
                {error}
              </div>
            )}

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='levelGroup'>
                Nhóm Cấp bậc
              </Label>
              <select
                id='levelGroup'
                value={formData.levelGroup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    levelGroup: e.target.value as GradeLevelGroupApiResponse
                  })
                }
                className='focus:border-primary focus:ring-primary flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              >
                {LEVEL_GROUPS.map((group) => (
                  <option key={group.value} value={group.value}>
                    {group.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='name'>
                Tên Lớp học / Trình độ
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className='h-12 rounded-xl'
                placeholder='Ví dụ: Lớp 1, Lớp 12, Tiếng Anh B1...'
              />
            </div>
          </div>

          <div className='flex items-center justify-end gap-3 border-t border-slate-200 px-7 py-4'>
            <Button
              type='button'
              className='h-11 rounded-xl px-5'
              variant='outline'
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type='submit' className='h-11 rounded-xl px-6' disabled={isSubmitting}>
              {isSubmitting ? 'Đang xử lý...' : 'Lưu thông tin'}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
