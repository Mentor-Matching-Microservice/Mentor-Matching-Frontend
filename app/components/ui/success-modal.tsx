import { createPortal } from 'react-dom'
import { CheckCircle2, X } from 'lucide-react'
import { Button } from './button'

type SuccessModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
}

export function SuccessModal({ open, onOpenChange, title, description }: SuccessModalProps) {
  if (typeof document === 'undefined' || !open) return null

  return createPortal(
    <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4'>
      <div className='animate-in fade-in zoom-in relative flex w-full max-w-[400px] flex-col items-center overflow-hidden rounded-[24px] border border-slate-200 bg-white p-6 text-center shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'>
        <button
          aria-label='Đóng'
          className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          onClick={() => onOpenChange(false)}
          type='button'
        >
          <X size={20} />
        </button>

        <div className='mt-2 mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-500'>
          <CheckCircle2 size={44} />
        </div>

        <h3 className='text-ink text-[1.35rem] font-bold tracking-tight'>{title}</h3>

        {description && (
          <p className='text-muted mt-2 max-w-[280px] text-sm leading-relaxed'>{description}</p>
        )}

        <Button
          className='mt-7 h-12 w-full rounded-2xl text-[1.05rem] font-semibold'
          onClick={() => onOpenChange(false)}
        >
          Đồng ý
        </Button>
      </div>
    </div>,
    document.body
  )
}
