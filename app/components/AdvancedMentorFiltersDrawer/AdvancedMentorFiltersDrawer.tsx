import { MapPin, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils/cn'

export type AdvancedMentorFilterOption = {
  helper?: string
  label: string
  value: string
}

type AdvancedMentorFiltersDrawerProps = {
  cityName?: string | null
  districtOptions: AdvancedMentorFilterOption[]
  genderOptions: AdvancedMentorFilterOption[]
  isDistrictLoading?: boolean
  meetingTypeOptions: AdvancedMentorFilterOption[]
  onApply: (selectedValues: string[]) => void
  onClose: () => void
  selectedValues: string[]
}

export function AdvancedMentorFiltersDrawer({
  cityName,
  districtOptions,
  genderOptions,
  isDistrictLoading = false,
  meetingTypeOptions,
  onApply,
  onClose,
  selectedValues
}: AdvancedMentorFiltersDrawerProps) {
  const [draftValues, setDraftValues] = useState(selectedValues)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const toggleSingleValue = (value: string, groupPrefix: string) => {
    setDraftValues((currentValues) => {
      const isSelected = currentValues.includes(value)
      const withoutGroup = currentValues.filter((item) => !item.startsWith(groupPrefix))

      return isSelected ? withoutGroup : [...withoutGroup, value]
    })
  }

  const selectedCount = draftValues.length

  return (
    <div
      aria-labelledby='advanced-mentor-filters-title'
      aria-modal='true'
      className='fixed inset-0 z-[70] flex justify-end'
      role='dialog'
    >
      <button
        aria-label='Đóng bộ lọc nâng cao'
        className='absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[2px]'
        type='button'
        onClick={onClose}
      />

      <aside className='relative flex h-full w-full max-w-[480px] flex-col border-l border-slate-200 bg-white shadow-2xl'>
        <header className='flex items-center justify-between border-b border-slate-200 px-6 py-5'>
          <div>
            <h2 id='advanced-mentor-filters-title' className='text-ink text-xl font-bold'>
              Bộ lọc nâng cao
            </h2>
            {selectedCount ? (
              <p className='text-muted mt-1 text-xs'>{selectedCount} tiêu chí đang chọn</p>
            ) : null}
          </div>
          <Button
            aria-label='Đóng'
            className='rounded-full'
            size='icon'
            type='button'
            variant='ghost'
            onClick={onClose}
          >
            <X size={20} />
          </Button>
        </header>

        <div className='flex-1 space-y-8 overflow-y-auto px-6 py-7'>
          <FilterSection
            description='Chọn hình thức phù hợp với cách bạn muốn học.'
            title='Hình thức học'
          >
            <div className='flex flex-wrap gap-2'>
              {meetingTypeOptions.map((option) => {
                const selected = draftValues.includes(option.value)

                return (
                  <button
                    key={option.value}
                    aria-pressed={selected}
                    className={cn(
                      'rounded-full border px-5 py-2.5 text-sm font-semibold transition',
                      selected
                        ? 'border-blue-600 bg-blue-600 text-white shadow-sm'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
                    )}
                    type='button'
                    onClick={() => toggleSingleValue(option.value, 'meeting:')}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </FilterSection>

          <FilterSection
            description='Lọc theo khu vực cụ thể trong địa điểm đã chọn.'
            title='Khu vực chi tiết'
          >
            {cityName ? (
              <>
                <div className='mb-3 flex items-center gap-2 text-sm text-slate-600'>
                  <MapPin size={15} />
                  <span>{cityName}</span>
                </div>
                {isDistrictLoading ? (
                  <div className='grid grid-cols-2 gap-2'>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className='h-11 animate-pulse rounded-xl bg-slate-100' />
                    ))}
                  </div>
                ) : districtOptions.length ? (
                  <div className='grid gap-2 sm:grid-cols-2'>
                    {districtOptions.map((option) => {
                      const selected = draftValues.includes(option.value)

                      return (
                        <button
                          key={option.value}
                          aria-pressed={selected}
                          className={cn(
                            'rounded-xl border px-3 py-2.5 text-left text-sm font-medium transition',
                            selected
                              ? 'border-blue-300 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          )}
                          type='button'
                          onClick={() => toggleSingleValue(option.value, 'district:')}
                        >
                          {option.label}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <p className='rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500'>
                    Chưa có khu vực phù hợp.
                  </p>
                )}
              </>
            ) : (
              <p className='rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600'>
                Chọn địa điểm ở thanh bộ lọc trước để xem quận hoặc huyện.
              </p>
            )}
          </FilterSection>

          <FilterSection
            description='Tùy chọn này không bắt buộc và có thể bỏ trống.'
            title='Giới tính mentor'
          >
            <div className='space-y-2'>
              {genderOptions.map((option) => {
                const selected = draftValues.includes(option.value)

                return (
                  <label
                    key={option.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition',
                      selected
                        ? 'border-blue-200 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    )}
                  >
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleSingleValue(option.value, 'gender:')}
                    />
                    <span className='text-sm font-medium text-slate-700'>{option.label}</span>
                  </label>
                )
              })}
            </div>
          </FilterSection>
        </div>

        <footer className='flex items-center gap-3 border-t border-slate-200 bg-white px-6 py-5'>
          <Button
            className='shrink-0 rounded-xl'
            type='button'
            variant='ghost'
            onClick={() => setDraftValues([])}
          >
            <RotateCcw size={15} />
            Thiết lập lại
          </Button>
          <Button
            className='h-11 flex-1 rounded-xl shadow-lg shadow-blue-600/15'
            type='button'
            onClick={() => onApply(draftValues)}
          >
            <SlidersHorizontal size={16} />
            Áp dụng bộ lọc
          </Button>
        </footer>
      </aside>
    </div>
  )
}

function FilterSection({
  children,
  description,
  title
}: {
  children: React.ReactNode
  description: string
  title: string
}) {
  return (
    <section>
      <h3 className='text-ink text-sm font-bold tracking-[0.08em] uppercase'>{title}</h3>
      <p className='text-muted mt-1 text-xs leading-relaxed'>{description}</p>
      <div className='mt-4'>{children}</div>
    </section>
  )
}
