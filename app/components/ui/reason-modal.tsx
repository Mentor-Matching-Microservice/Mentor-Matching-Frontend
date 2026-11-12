import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, X } from 'lucide-react'

import { Button } from './button'
import { Textarea } from './textarea'

type ReasonModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  placeholder?: string
  confirmLabel?: string
  confirmingLabel?: string
  onConfirm: (reason: string) => void
  isConfirming?: boolean
}

export function ReasonModal({
  open,
  onOpenChange,
  title,
  description = 'Vui lòng nhập lý do để tiếp tục.',
  placeholder = 'Nhập lý do...',
  confirmLabel = 'Xác nhận',
  confirmingLabel = 'Đang xử lý...',
  onConfirm,
  isConfirming
}: ReasonModalProps) {
  const [reason, setReason] = useState('')
  const titleId = useId()
  const descriptionId = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!open) {
      setReason('')
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) {
        onOpenChange(false)
      }
    }

    const timeout = setTimeout(() => {
      textareaRef.current?.focus()
    }, 50)

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeout)
    }
  }, [open, isConfirming, onOpenChange])

  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div
      className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4'
      onClick={(e) => {
        if (e.target === e.currentTarget && !isConfirming) {
          onOpenChange(false)
        }
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal='true'
        className='animate-in fade-in zoom-in relative flex w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'
        role='dialog'
      >
        <button
          aria-label='Đóng'
          className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400'
          disabled={isConfirming}
          onClick={() => onOpenChange(false)}
          type='button'
        >
          <X size={20} />
        </button>

        <div className='mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500'>
          <AlertCircle size={32} />
        </div>

        <h3 className='text-ink text-xl font-bold tracking-tight' id={titleId}>
          {title}
        </h3>
        <p className='text-muted mt-2 text-sm' id={descriptionId}>
          {description}
        </p>

        <div className='mt-5'>
          <Textarea
            ref={textareaRef}
            className='min-h-[100px] resize-none'
            onChange={(e) => setReason(e.target.value)}
            placeholder={placeholder}
            value={reason}
          />
        </div>

        <div className='mt-7 flex w-full gap-3'>
          <Button
            className='h-11 flex-1 rounded-2xl'
            disabled={isConfirming}
            onClick={() => onOpenChange(false)}
            type='button'
            variant='outline'
          >
            Hủy
          </Button>
          <Button
            className='h-11 flex-1 rounded-2xl font-semibold'
            disabled={isConfirming || !reason.trim()}
            onClick={() => onConfirm(reason)}
            type='button'
            variant='destructive'
          >
            {isConfirming ? confirmingLabel : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
