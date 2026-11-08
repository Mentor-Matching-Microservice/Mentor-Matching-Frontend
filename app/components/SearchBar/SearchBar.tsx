import { BookOpen, MapPin, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/cn'

export type SearchBarSuggestion = {
  id: string
  label: string
  description?: string
}

type SearchBarProps = {
  keywordPlaceholder?: string
  contextPlaceholder?: string
  buttonLabel?: string
  quickTags?: string[]
  helperText?: string
  keywordValue?: string
  contextValue?: string
  onKeywordChange?: (value: string) => void
  onContextChange?: (value: string) => void
  onQuickTagClick?: (tag: string) => void
  onSubmit?: () => void
  isSubmitting?: boolean
  contextSuggestions?: SearchBarSuggestion[]
  isContextSuggestionsLoading?: boolean
  contextSuggestionsError?: string | null
  contextSuggestionsEmptyText?: string
  onContextSuggestionSelect?: (suggestion: SearchBarSuggestion) => void
  className?: string
}

const SearchBar = ({
  keywordPlaceholder = 'Môn học, mentor hoặc mục tiêu học tập',
  contextPlaceholder = 'Lớp, khu vực hoặc hình thức học',
  buttonLabel = 'Tìm mentor',
  quickTags = [],
  helperText = 'Có thể tìm theo môn học, mục tiêu học, lớp hoặc hình thức học mong muốn.',
  keywordValue,
  contextValue,
  onKeywordChange,
  onContextChange,
  onQuickTagClick,
  onSubmit,
  isSubmitting = false,
  contextSuggestions = [],
  isContextSuggestionsLoading = false,
  contextSuggestionsError,
  contextSuggestionsEmptyText = 'Không tìm thấy thành phố phù hợp.',
  onContextSuggestionSelect,
  className
}: SearchBarProps) => {
  const [isContextFocused, setIsContextFocused] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit?.()
  }

  const shouldShowContextSuggestions =
    isContextFocused &&
    Boolean(onContextSuggestionSelect) &&
    Boolean(contextValue?.trim()) &&
    (isContextSuggestionsLoading ||
      Boolean(contextSuggestionsError) ||
      contextSuggestions.length > 0 ||
      (contextValue?.trim().length ?? 0) >= 2)

  return (
    <Card className={cn('shadow-soft rounded-[28px] border-slate-200/80 bg-white', className)}>
      <CardContent className='p-4 md:p-5'>
        <form
          className='grid gap-3 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] xl:items-end'
          onSubmit={handleSubmit}
        >
          <label className='flex flex-col gap-2'>
            <span className='text-ink text-[11px] font-semibold tracking-[0.2em] uppercase'>
              Môn học hoặc mục tiêu
            </span>
            <div className='relative'>
              <Search className='text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
              <Input
                aria-label='Tìm theo môn học, mentor hoặc mục tiêu học tập'
                className='h-12 bg-slate-50 pr-4 pl-10'
                placeholder={keywordPlaceholder}
                value={keywordValue}
                onChange={(event) => onKeywordChange?.(event.target.value)}
              />
            </div>
          </label>

          <label className='flex flex-col gap-2'>
            <span className='text-ink text-[11px] font-semibold tracking-[0.2em] uppercase'>
              Cấp lớp hoặc bối cảnh học
            </span>
            <div className='relative'>
              <MapPin className='text-muted pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2' />
              <Input
                aria-label='Lớp, khu vực hoặc hình thức học'
                className='h-12 bg-slate-50 pr-4 pl-10'
                placeholder={contextPlaceholder}
                value={contextValue}
                onBlur={() => {
                  window.setTimeout(() => setIsContextFocused(false), 120)
                }}
                onChange={(event) => onContextChange?.(event.target.value)}
                onFocus={() => setIsContextFocused(true)}
              />
              {shouldShowContextSuggestions ? (
                <div className='absolute inset-x-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg'>
                  {isContextSuggestionsLoading ? (
                    <p className='px-4 py-3 text-sm text-slate-600'>Đang tìm khu vực phù hợp...</p>
                  ) : contextSuggestionsError ? (
                    <p className='px-4 py-3 text-sm text-red-600'>{contextSuggestionsError}</p>
                  ) : contextSuggestions.length ? (
                    <div className='py-2'>
                      {contextSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          className='flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition hover:bg-slate-50'
                          type='button'
                          onClick={() => onContextSuggestionSelect?.(suggestion)}
                          onMouseDown={(event) => event.preventDefault()}
                        >
                          <span className='text-ink text-sm font-medium'>{suggestion.label}</span>
                          {suggestion.description ? (
                            <span className='text-muted text-xs'>{suggestion.description}</span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className='px-4 py-3 text-sm text-slate-600'>
                      {contextSuggestionsEmptyText}
                    </p>
                  )}
                </div>
              ) : null}
            </div>
          </label>

          <Button
            className='h-12 xl:min-w-[150px]'
            isLoading={isSubmitting}
            size='lg'
            type='submit'
          >
            {buttonLabel}
          </Button>
        </form>

        <Separator className='my-4' />

        <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
          <div className='flex max-w-2xl items-start gap-2 text-sm text-slate-600'>
            <BookOpen className='text-primary mt-0.5 h-4 w-4 shrink-0' />
            <p className='leading-relaxed'>{helperText}</p>
          </div>

          {quickTags.length > 0 ? (
            <div className='flex flex-wrap gap-2 lg:justify-end'>
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  className={cn(
                    buttonVariants({
                      className:
                        'h-8 rounded-full border-slate-200 bg-slate-50 px-3 text-xs hover:bg-white',
                      size: 'sm',
                      variant: 'outline'
                    })
                  )}
                  type='button'
                  onClick={() => onQuickTagClick?.(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

export default SearchBar
