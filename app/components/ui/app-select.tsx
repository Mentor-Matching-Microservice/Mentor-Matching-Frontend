import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

export type AppSelectOption = {
  label: string
  value: string
}

type AppSelectProps = {
  ariaLabel: string
  className?: string
  disabled?: boolean
  onValueChange: (value: string) => void
  options: AppSelectOption[]
  placeholder: string
  value: string
}

export function AppSelect({
  ariaLabel,
  className,
  disabled = false,
  onValueChange,
  options,
  placeholder,
  value
}: AppSelectProps) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const listboxId = useId()
  const selectedOption = options.find((option) => option.value === value)
  const selectableOptions = [{ label: placeholder, value: '' }, ...options]

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const openMenu = () => {
    if (disabled) return

    const selectedIndex = selectableOptions.findIndex((option) => option.value === value)
    setActiveIndex(Math.max(selectedIndex, 0))
    setOpen(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return

    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      openMenu()
      return
    }

    if (!open) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, selectableOptions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const nextOption = selectableOptions[activeIndex]
      if (nextOption) {
        onValueChange(nextOption.value)
        setOpen(false)
      }
    }
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup='listbox'
        aria-label={ariaLabel}
        className={cn(
          'focus-visible:ring-primary/15 flex h-10 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3 text-sm text-slate-900 transition outline-none',
          open
            ? 'border-primary/40 ring-primary/10 ring-4'
            : 'border-slate-200 hover:border-slate-300',
          disabled && 'cursor-not-allowed bg-slate-50 opacity-60'
        )}
        disabled={disabled}
        type='button'
        onClick={() => {
          if (open) setOpen(false)
          else openMenu()
        }}
        onKeyDown={handleKeyDown}
      >
        <span className={cn('truncate', selectedOption ? 'text-slate-900' : 'text-slate-600')}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown
          aria-hidden='true'
          className={cn('shrink-0 text-slate-400 transition-transform', open && 'rotate-180')}
          size={15}
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          aria-label={ariaLabel}
          className='absolute top-full left-0 z-[110] mt-2 max-h-72 min-w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10'
          role='listbox'
        >
          {selectableOptions.map((option, index) => {
            const selected = option.value === value

            return (
              <button
                key={`${option.value}-${option.label}`}
                aria-selected={selected}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition',
                  selected
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50',
                  activeIndex === index && !selected && 'bg-slate-50'
                )}
                role='option'
                type='button'
                onClick={() => {
                  onValueChange(option.value)
                  setOpen(false)
                }}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <span className='whitespace-nowrap text-inherit'>{option.label}</span>
                {selected ? <Check aria-hidden='true' className='text-blue-600' size={15} /> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
