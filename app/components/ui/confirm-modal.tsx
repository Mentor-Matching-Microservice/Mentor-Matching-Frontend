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
  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4'>
      <div className='animate-in fade-in zoom-in relative flex w-full max-w-[400px] flex-col items-center overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'>
        <button
          aria-label='Đóng'
          className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          onClick={() => onOpenChange(false)}
          type='button'
          disabled={isConfirming}
        >
          <X size={20} />
        </button>

        <div
          className={`mt-2 mb-5 flex h-20 w-20 items-center justify-center rounded-full ${destructive ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}
        >
          <AlertCircle size={44} />
        </div>

        <h3 className='text-ink text-[1.35rem] font-bold tracking-tight'>{title}</h3>

        {description && (
          <p className='text-muted mt-2 max-w-[280px] text-sm leading-relaxed'>{description}</p>
        )}

        <div className='mt-7 flex w-full gap-3'>
          <Button
            type='button'
            variant='outline'
            className='h-12 flex-1 rounded-2xl text-[1.05rem]'
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelText}
          </Button>
          <Button
            type='button'
            variant={destructive ? 'destructive' : 'default'}
            className='h-12 flex-1 rounded-2xl text-[1.05rem] font-semibold'
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? 'Đang xử lý...' : confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  )
}
