import { ArrowRight, ArrowUpRight, CalendarDays, ShieldCheck, Search, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { type ReactNode, useEffect, useMemo, useState, useTransition } from 'react'
import { Link, useNavigate } from 'react-router'

import { EmptyState } from '@/components/EmptyState'
import MentorCard from '@/components/MentorCard'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import SectionTitle from '@/components/SectionTitle'
import SubjectCard from '@/components/SubjectCard'
import TestimonialCard from '@/components/TestimonialCard'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { path } from '@/config/path'
import { testimonials } from '@/constants/testimonials'
import { useCatalogOptionsQuery } from '@/hooks/queries/catalog/useCatalogOptionsQuery'
import { useCitiesQuery } from '@/hooks/queries/location/useCitiesQuery'
import { useFeaturedMentorsQuery } from '@/hooks/queries/mentor/useFeaturedMentorsQuery'
import { mapCatalogSubjectToHomeCard, mapFeaturedMentorToCard } from '@/features/home/home.mapper'
import { cn } from '@/utils/cn'

const marketplaceStats = [
  { value: '240+', label: 'mentor đã duyệt' },
  { value: '8,500+', label: 'buổi học đã đặt' },
  { value: '40+', label: 'môn học và cấp lớp' }
] as const

const FEATURED_MENTOR_PARAMS = {
  page: 1,
  size: 3,
  sortBy: 'createdAt',
  sortDir: 'desc'
} as const

const trustSteps = [
  {
    title: 'Tìm đúng nhu cầu học',
    description: 'Bắt đầu từ môn học, lớp, mục tiêu và hình thức học phù hợp với học viên.'
  },
  {
    title: 'So sánh mentor rõ ràng',
    description: 'Xem học phí, trạng thái duyệt, đánh giá, cách dạy và lịch rảnh ngay trên hồ sơ.'
  },
  {
    title: 'Đặt buổi học thực tế',
    description: 'Chọn môn học cụ thể, khung giờ phù hợp rồi gửi yêu cầu đặt lịch tới mentor.'
  }
] as const

const marketplaceTracks = [
  {
    title: 'Bắt đầu như học viên',
    description:
      'Tìm mentor theo môn học, cấp lớp, mục tiêu và học phí rồi tiếp tục tới hồ sơ chi tiết.',
    href: path.discover,
    action: 'Tìm mentor phù hợp'
  },
  {
    title: 'Bắt đầu như mentor',
    description:
      'Hoàn thiện hồ sơ giảng dạy, khai báo offering và khung giờ để nhận yêu cầu học phù hợp.',
    href: path.mentorPanel.root,
    action: 'Chuẩn bị hồ sơ mentor'
  }
] as const

const Home = () => {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [context, setContext] = useState('')
  const [debouncedContext, setDebouncedContext] = useState('')
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [selectedCityName, setSelectedCityName] = useState<string | null>(null)
  const [isSearchPending, startSearchTransition] = useTransition()

  const catalogOptionsQuery = useCatalogOptionsQuery()
  const featuredMentorsQuery = useFeaturedMentorsQuery(FEATURED_MENTOR_PARAMS)
  const shouldSearchCities =
    debouncedContext.length >= 2 && (!selectedCityName || selectedCityName !== debouncedContext)
  const citySuggestionsQuery = useCitiesQuery(debouncedContext, shouldSearchCities)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedContext(context.trim())
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [context])

  const subjectCards = useMemo(
    () =>
      (catalogOptionsQuery.data?.subjects ?? [])
        .slice(0, 8)
        .map((subject) => mapCatalogSubjectToHomeCard(subject, catalogOptionsQuery.data!)),
    [catalogOptionsQuery.data]
  )

  const featuredMentorCards = useMemo(
    () => (featuredMentorsQuery.data ?? []).map(mapFeaturedMentorToCard),
    [featuredMentorsQuery.data]
  )

  const citySuggestions = useMemo(
    () =>
      (citySuggestionsQuery.data ?? []).map((city) => ({
        id: String(city.id),
        label: city.name,
        description: `Thành phố · ${city.code}`
      })),
    [citySuggestionsQuery.data]
  )

  const handleContextChange = (value: string) => {
    setContext(value)

    if (selectedCityName && value.trim() !== selectedCityName) {
      setSelectedCityId(null)
      setSelectedCityName(null)
    }
  }

  const handleQuickTagClick = (tag: string) => {
    if (tag === 'Học cuối tuần') {
      setContext('Cuối tuần')
      setSelectedCityId(null)
      setSelectedCityName(null)
      return
    }

    setKeyword(tag)
  }

  const handleCitySuggestionSelect = (suggestion: { id: string; label: string }) => {
    setSelectedCityId(Number(suggestion.id))
    setSelectedCityName(suggestion.label)
    setContext(suggestion.label)
  }

  const handleSubmitSearch = () => {
    const params = new URLSearchParams()
    const trimmedKeyword = keyword.trim()
    const trimmedContext = context.trim()

    if (trimmedKeyword) {
      params.set('search', trimmedKeyword)
    }

    if (selectedCityId) {
      params.set('cityId', String(selectedCityId))
    } else if (trimmedContext) {
      params.set('context', trimmedContext)
    }

    const destination = params.size ? `${path.discover}?${params.toString()}` : path.discover

    startSearchTransition(() => {
      navigate(destination)
    })
  }

  return (
    <div className='flex flex-col gap-16 py-8'>
      <section className='relative -mx-4 -mt-8 overflow-hidden rounded-[2rem] bg-linear-to-br from-blue-50 via-sky-50 to-white px-4 py-14 sm:-mx-6 sm:px-8 lg:-mx-10 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-12 lg:px-16 lg:py-20'>
        <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(37,99,235,0.14),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.12),transparent_28%)]' />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className='relative space-y-6'
        >
          <div className='space-y-4'>
            <h1 className='text-ink max-w-3xl text-4xl leading-[1.05] font-black tracking-tight md:text-6xl'>
              Tìm <span className='text-primary'>đúng Mentor.</span>
              <br />
              Học đúng lộ trình.
              <br />
              <span className='text-primary'>Đạt đúng mục tiêu.</span>
            </h1>
            <p className='max-w-2xl leading-relaxed text-slate-700 md:text-lg'>
              Nền tảng kết nối học viên với mentor chất lượng, giúp xây dựng lộ trình học tập cá
              nhân hóa và đạt kết quả mong muốn.
            </p>
          </div>

          <form
            className='max-w-3xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-blue-900/10'
            onSubmit={(event) => {
              event.preventDefault()
              handleSubmitSearch()
            }}
          >
            <div className='grid gap-3 md:grid-cols-[1fr_1fr_150px]'>
              <label className='space-y-1'>
                <span className='text-ink text-sm font-bold'>Môn học hoặc mục tiêu</span>
                <input
                  className='focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-4'
                  placeholder='Ví dụ: Toán 10, IELTS...'
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                />
              </label>
              <label className='space-y-1'>
                <span className='text-ink text-sm font-bold'>Cấp lớp hoặc hình thức</span>
                <input
                  className='focus:border-primary focus:ring-primary/10 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:ring-4'
                  placeholder='Ví dụ: Lớp 12, Online/Offline'
                  value={context}
                  onChange={(event) => handleContextChange(event.target.value)}
                />
              </label>
              <button
                className={cn(
                  buttonVariants({ size: 'lg' }),
                  'mt-auto h-12 rounded-xl shadow-lg shadow-blue-600/20'
                )}
                disabled={isSearchPending}
                type='submit'
              >
                <Search size={17} />
                Tìm ngay
              </button>
            </div>
            {citySuggestions.length && shouldSearchCities ? (
              <div className='mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3'>
                {citySuggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion.id}
                    className='rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700'
                    type='button'
                    onClick={() => handleCitySuggestionSelect(suggestion)}
                  >
                    {suggestion.label}
                  </button>
                ))}
              </div>
            ) : null}
          </form>

          <div className='flex flex-wrap items-center gap-2 text-sm text-slate-700'>
            <span>Gợi ý:</span>
            {['Toán lớp 10', 'IELTS', 'Ôn thi chuyển cấp'].map((tag) => (
              <button
                key={tag}
                className='rounded-full border border-blue-200 bg-white/70 px-3 py-1 font-medium text-blue-700'
                type='button'
                onClick={() => handleQuickTagClick(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className='grid max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-blue-900/10 sm:grid-cols-3'>
            {marketplaceStats.map((stat) => (
              <div
                key={stat.label}
                className='border-b border-slate-200 p-5 last:border-b-0 sm:border-r sm:border-b-0 sm:last:border-r-0'
              >
                <p className='text-ink text-3xl font-black'>{stat.value}</p>
                <p className='text-ink mt-1 text-sm capitalize'>{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: 0.05 }}
          className='relative mt-12 flex min-h-105 items-center justify-center lg:mt-0'
        >
          <JourneyGraphic />
        </motion.div>
      </section>

      <section className='space-y-8'>
        <div className='flex flex-col gap-5 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-4xl'>
            <p className='text-primary text-2xl font-bold uppercase'>Mentor nổi bật</p>
            <h2 className='text-ink mt-3 max-w-3xl text-3xl leading-tight font-black tracking-tight md:text-5xl'>
              Một số mentor công khai để bắt đầu so sánh
            </h2>
            <p className='text-muted mt-4 max-w-2xl leading-relaxed md:text-lg'>
              Xem nhanh môn học, học phí và lịch gần nhất từ các mentor đang công khai trên hệ
              thống.
            </p>
          </div>
          <Link
            className={cn(
              buttonVariants({
                className: 'w-fit rounded-2xl px-5 md:inline-flex',
                variant: 'outline'
              })
            )}
            to={path.discover}
          >
            Xem tất cả <ArrowUpRight size={16} />
          </Link>
        </div>
        {featuredMentorsQuery.isLoading ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {Array.from({ length: 3 }).map((_, index) => (
              <Card
                key={`featured-mentor-skeleton-${index}`}
                className='h-[620px] animate-pulse rounded-3xl border-slate-200 bg-white shadow-sm'
              />
            ))}
          </div>
        ) : featuredMentorsQuery.isError ? (
          <ScreenErrorState
            description='Không thể tải danh sách mentor nổi bật lúc này. Nội dung giới thiệu khác trên trang vẫn khả dụng.'
            onRetry={() => {
              void featuredMentorsQuery.refetch()
            }}
            title='Chưa tải được mentor nổi bật'
          />
        ) : featuredMentorCards.length ? (
          <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
            {featuredMentorCards.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        ) : (
          <EmptyState
            className='min-h-0'
            description='Khi có mentor công khai phù hợp, khu vực này sẽ hiển thị để bạn bắt đầu so sánh.'
            title='Chưa có mentor nổi bật để hiển thị'
          />
        )}
      </section>

      <section className='space-y-8'>
        <SectionTitle
          eyebrow='Môn học'
          size='md'
          subtitle='Bắt đầu từ nhu cầu học tập thực tế để lọc ra mentor phù hợp nhanh hơn.'
          title='Khám phá theo môn học, cấp lớp và mục tiêu'
        />
        {catalogOptionsQuery.isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {Array.from({ length: 8 }).map((_, index) => (
              <Card
                key={`subject-skeleton-${index}`}
                className='h-55 animate-pulse rounded-[28px] border-slate-200/80 bg-white'
              />
            ))}
          </div>
        ) : catalogOptionsQuery.isError ? (
          <ScreenErrorState
            description='Không thể tải danh mục môn học lúc này. Bạn vẫn có thể tiếp tục khám phá mentor từ các CTA khác trên trang.'
            onRetry={() => {
              void catalogOptionsQuery.refetch()
            }}
            title='Chưa tải được danh mục môn học'
          />
        ) : subjectCards.length ? (
          <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
            {subjectCards.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <EmptyState
            className='min-h-0'
            description='Danh mục môn học công khai đang được cập nhật và sẽ hiển thị lại khi có dữ liệu.'
            title='Chưa có môn học để hiển thị'
          />
        )}
      </section>

      <section className='grid gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
        <Card className='rounded-[32px] border-slate-200/80 bg-slate-50'>
          <CardContent className='p-8'>
            <SectionTitle
              eyebrow='Quy trình'
              size='md'
              subtitle='Từng bước được thiết kế để giúp phụ huynh và học viên ra quyết định nhanh nhưng vẫn đủ căn cứ.'
              title='Cách Mentor Matching giữ trải nghiệm đặt lịch thực tế'
            />
            <div className='mt-6 grid gap-4 md:grid-cols-3'>
              {trustSteps.map((step, index) => (
                <Card key={step.title} className='rounded-2xl border-slate-200/80 shadow-none'>
                  <CardContent className='p-5'>
                    <p className='text-primary text-sm font-semibold'>Bước {index + 1}</p>
                    <p className='text-ink mt-2 font-semibold'>{step.title}</p>
                    <p className='text-muted mt-2 text-sm leading-relaxed'>{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className='grid gap-4'>
          {marketplaceTracks.map((track, index) => (
            <Card key={track.title} className='rounded-[28px] border-slate-200/80 bg-white'>
              <CardContent className='flex h-full flex-col p-6'>
                <Badge className='w-fit' variant={index === 0 ? 'info' : 'outline'}>
                  {index === 0 ? 'Dành cho học viên và phụ huynh' : 'Dành cho mentor'}
                </Badge>
                <h3 className='text-ink mt-4 text-2xl font-semibold'>{track.title}</h3>
                <p className='text-muted mt-3 text-sm leading-relaxed'>{track.description}</p>
                <Separator className='my-5' />
                <div className='flex items-center gap-2 text-sm text-slate-600'>
                  {index === 0 ? (
                    <Users size={16} className='text-primary' />
                  ) : (
                    <ShieldCheck size={16} className='text-primary' />
                  )}
                  {index === 0
                    ? 'So sánh nhanh học phí, đánh giá và khung giờ.'
                    : 'Chỉ mentor đã duyệt mới hiển thị ở khu vực công khai.'}
                </div>
                <Link
                  className={cn(
                    buttonVariants({
                      className: 'mt-6 w-fit rounded-2xl',
                      variant: index === 0 ? 'default' : 'outline'
                    })
                  )}
                  to={track.href}
                >
                  {track.action} <ArrowRight size={16} />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='space-y-8'>
        <SectionTitle
          eyebrow='Phản hồi'
          size='md'
          subtitle='Những nhận xét ngắn nhưng sát với điều người học cần biết trước khi đặt buổi đầu tiên.'
          title='Học viên và phụ huynh đánh giá điều gì'
        />
        <div className='grid gap-6 md:grid-cols-3'>
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>
    </div>
  )
}

function JourneyGraphic() {
  return (
    <div className='relative w-full max-w-xl text-center'>
      <h2 className='text-ink text-3xl leading-tight font-black tracking-tight md:text-5xl'>
        Hành trình đặt lớp
      </h2>
      <div className='relative mx-auto mt-8 h-72 max-w-md'>
        <svg
          aria-hidden='true'
          className='absolute inset-0 h-full w-full text-slate-400'
          fill='none'
          viewBox='0 0 420 270'
        >
          <path d='M105 80H295' stroke='currentColor' strokeLinecap='round' strokeWidth='2' />
          <path
            d='M280 68L296 80L280 92'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='2'
          />
          <path
            d='M105 118V145C105 157 115 167 127 167H182'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='2'
          />
          <path
            d='M238 167H300C312 167 322 157 322 145V118'
            stroke='currentColor'
            strokeLinecap='round'
            strokeWidth='2'
          />
        </svg>

        <JourneyNode
          className='absolute top-0 left-10'
          icon={<Search size={36} />}
          label='1. Chọn Mentor'
        />
        <JourneyNode
          className='absolute top-0 right-10'
          icon={<CalendarDays size={34} />}
          label='3. Đặt lịch ngay'
        />
        <JourneyNode
          className='absolute top-28 left-1/2 -translate-x-1/2'
          icon={<span className='text-5xl leading-none'>☆</span>}
          label='2. Xem đánh giá'
        />
      </div>
      <p className='text-muted -mt-2 text-base leading-relaxed md:text-lg'>
        Quy trình 3 bước đơn giản, minh bạch.
      </p>
    </div>
  )
}

function JourneyNode({
  className,
  icon,
  label
}: {
  className?: string
  icon: ReactNode
  label: string
}) {
  return (
    <div className={cn('flex w-32 flex-col items-center', className)}>
      <div className='flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-100/70 text-blue-700 shadow-inner'>
        {icon}
      </div>
      <p className='text-ink mt-3 text-sm font-semibold'>{label}</p>
    </div>
  )
}

export default Home
