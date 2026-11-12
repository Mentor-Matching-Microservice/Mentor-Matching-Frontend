import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, X } from 'lucide-react'
import { Button } from './button'

type ConfirmModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  onConfirm: () => void
  confirmText?: string
  cancelText?: string
  isConfirming?: boolean
  destructive?: boolean
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isConfirming = false,
  destructive = false
}: ConfirmModalProps) {
  const titleId = useId()
  const descriptionId = useId()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) {
        onOpenChange(false)
      }
    }

    // Auto-focus confirm button
    const timeout = setTimeout(() => {
      confirmButtonRef.current?.focus()
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
        className='animate-in fade-in zoom-in relative flex w-full max-w-[400px] flex-col items-center overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'
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

        <div
          className={`mt-2 mb-5 flex h-20 w-20 items-center justify-center rounded-full ${destructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}
        >
          <AlertCircle size={44} />
        </div>

        <h3 className='text-ink text-[1.35rem] font-bold tracking-tight' id={titleId}>
          {title}
        </h3>

        {description && (
          <p className='text-muted mt-2 max-w-[280px] text-sm leading-relaxed' id={descriptionId}>
            {description}
          </p>
        )}

        <div className='mt-7 flex w-full gap-3'>
          <Button
            className='h-12 flex-1 rounded-2xl text-[1.05rem]'
            disabled={isConfirming}
            onClick={() => onOpenChange(false)}
            type='button'
            variant='outline'
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmButtonRef}
            className='h-12 flex-1 rounded-2xl text-[1.05rem] font-semibold'
            disabled={isConfirming}
            onClick={onConfirm}
            type='button'
            variant={destructive ? 'destructive' : 'default'}
          >
            {isConfirming ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
