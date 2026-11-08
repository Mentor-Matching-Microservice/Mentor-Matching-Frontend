import { useMemo, useState } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'

import {
  isMentorAvailabilityDraftValid,
  MentorAvailabilityForm,
  type MentorAvailabilityDraftValue
} from '@/components/MentorAvailabilityForm/MentorAvailabilityForm'
import { Button } from '@/components/ui/button'

type MentorAvailabilityModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MentorAvailabilityModal({ open, onOpenChange }: MentorAvailabilityModalProps) {
  const [draft, setDraft] = useState<MentorAvailabilityDraftValue>({
    mode: 'RECURRING',
    selectedDays: ['2', '4'],
    specificDate: '',
    startTime: '18:00',
    endTime: '20:00'
  })

  const canSave = useMemo(() => isMentorAvailabilityDraftValid(draft), [draft])

  const handleClose = () => {
    onOpenChange(false)
  }

  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div className='fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm md:p-6'>
      <div className='w-full max-w-[540px] overflow-visible rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)]'>
        <div className='flex items-center justify-between gap-4 border-b border-slate-200 px-7 py-5'>
          <h3 className='text-ink text-[1.85rem] font-bold tracking-tight'>Thêm khung giờ rảnh</h3>
          <button
            aria-label='Đóng modal'
            className='flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900'
            onClick={handleClose}
            type='button'
          >
            <X size={22} />
          </button>
        </div>

        <div className='overflow-visible px-7 py-6'>
          <MentorAvailabilityForm onChange={setDraft} value={draft} />
        </div>

        <div className='flex items-center justify-end gap-3 border-t border-slate-200 px-7 py-4'>
          <Button
            className='h-12 rounded-xl border-slate-300 bg-white px-5 text-base text-slate-700 hover:bg-slate-50 hover:text-slate-900'
            onClick={handleClose}
            variant='outline'
          >
            Hủy
          </Button>
          <Button
            className='h-12 rounded-xl px-6 text-base'
            disabled={!canSave}
            onClick={handleClose}
          >
            Lưu khung giờ
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
