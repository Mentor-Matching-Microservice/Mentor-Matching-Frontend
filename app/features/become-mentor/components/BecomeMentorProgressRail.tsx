import { Check, Circle } from 'lucide-react'

import { cn } from '@/utils/cn'

import type { BecomeMentorStep } from '../become-mentor.types'

type BecomeMentorProgressRailProps = {
  onSelectStep: (index: number) => void
  steps: BecomeMentorStep[]
}

export function BecomeMentorProgressRail({ onSelectStep, steps }: BecomeMentorProgressRailProps) {
  return (
    <aside className='rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm'>
      <div className='space-y-1'>
        <p className='text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase'>
          Tiến trình
        </p>
        <h2 className='text-lg font-semibold text-slate-900'>Hồ sơ trở thành mentor</h2>
        <p className='text-sm leading-6 text-slate-600'>
          Bạn có thể đi theo thứ tự này để không bỏ sót thông tin quan trọng.
        </p>
      </div>

      <div className='mt-6 space-y-4'>
        {steps.map((step, index) => (
          <button
            className='group flex w-full gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-slate-50'
            key={step.id}
            onClick={() => onSelectStep(index)}
            type='button'
          >
            <div className='flex flex-col items-center'>
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                  step.status === 'done' && 'border-emerald-200 bg-emerald-50 text-emerald-700',
                  step.status === 'current' && 'border-primary/25 bg-primary text-white',
                  step.status === 'upcoming' && 'border-slate-200 bg-white text-slate-400'
                )}
              >
                {step.status === 'done' ? (
                  <Check size={16} />
                ) : (
                  <Circle size={14} fill='currentColor' />
                )}
              </div>
              {index < steps.length - 1 ? <div className='mt-2 h-10 w-px bg-slate-200' /> : null}
            </div>

            <div className='min-w-0 pt-0.5'>
              <p
                className={cn(
                  'text-sm font-semibold transition-colors',
                  step.status === 'current' ? 'text-primary' : 'text-slate-900'
                )}
              >
                {step.label}
              </p>
              {step.description ? (
                <p className='mt-1 text-sm leading-6 text-slate-500'>{step.description}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}
