import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type {
  CatalogCategoryApiResponse,
  CatalogSubjectApiResponse,
  CreateSubjectRequest,
  UpdateSubjectRequest
} from '@/types/api/catalog'
import { catalogApi } from '@/services/catalog.api'

type SubjectFormModalProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: (message?: string) => void
  categories: CatalogCategoryApiResponse[]
  initialData?: CatalogSubjectApiResponse | null
}

export function SubjectFormModal({
  isOpen,
  onClose,
  onSuccess,
  categories,
  initialData
}: SubjectFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<CreateSubjectRequest>({
    name: '',
    categoryId: categories[0]?.id || 0,
    description: ''
  })

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          categoryId: initialData.categoryId,
          description: initialData.description
        })
      } else {
        setFormData({
          name: '',
          categoryId: categories[0]?.id || 0,
          description: ''
        })
      }
      setError('')
    }
  }, [isOpen, initialData, categories])

  if (typeof document === 'undefined' || !isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      if (initialData) {
        await catalogApi.updateSubject(initialData.id, formData as UpdateSubjectRequest)
        onSuccess('Cập nhật Môn học thành công.')
      } else {
        await catalogApi.createSubject(formData)
        onSuccess('Thêm Môn học thành công.')
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
            {initialData ? 'Chỉnh sửa Môn học' : 'Thêm Môn học mới'}
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
              <Label className='text-ink text-sm font-medium' htmlFor='categoryId'>
                Nhóm Danh mục
              </Label>
              <select
                id='categoryId'
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                className='focus:border-primary focus:ring-primary flex h-12 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              >
                <option value={0} disabled>
                  -- Chọn danh mục --
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='name'>
                Tên Môn học
              </Label>
              <Input
                id='name'
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className='h-12 rounded-xl'
                placeholder='Ví dụ: Toán Cao Cấp, Lập trình Java...'
              />
            </div>

            <div className='space-y-2'>
              <Label className='text-ink text-sm font-medium' htmlFor='description'>
                Mô tả ngắn gọn
              </Label>
              <Textarea
                id='description'
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className='min-h-[100px] rounded-xl'
                placeholder='Nội dung tóm tắt môn học...'
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
