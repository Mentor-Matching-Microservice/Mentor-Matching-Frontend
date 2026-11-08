import { ChevronLeft, ChevronRight, RotateCcw, Search, SlidersHorizontal } from 'lucide-react'
import { type FormEvent, useMemo, useState } from 'react'

import { EmptyState } from '@/components/EmptyState'
import {
  AdvancedMentorFiltersDrawer,
  type AdvancedMentorFilterOption
} from '@/components/AdvancedMentorFiltersDrawer'
import MentorCard from '@/components/MentorCard'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { Badge } from '@/components/ui/badge'
import { AppSelect } from '@/components/ui/app-select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useCatalogOptionsQuery } from '@/hooks/queries/catalog/useCatalogOptionsQuery'
import { useCitiesQuery } from '@/hooks/queries/location/useCitiesQuery'
import { useDistrictsByCityQuery } from '@/hooks/queries/location/useDistrictsByCityQuery'
import { useDiscoverMentorsQuery } from '@/hooks/queries/mentor/useDiscoverMentorsQuery'
import { type DiscoverFilterKey, useDiscoverFilters } from '@/hooks/useDiscoverFilters'
import { mapDiscoverMentorToCard } from '@/features/discover/discover.mapper'
import type { Gender, SortDirection } from '@/types/api/common'
import type { MentorListSortBy, MentorMeetingType } from '@/types/api/mentor'

const meetingTypeOptions: Array<{
  label: string
  value: MentorMeetingType
  helper: string
}> = [
  { label: 'Online', value: 'ONLINE', helper: 'Học trực tuyến' },
  { label: 'Offline', value: 'OFFLINE', helper: 'Học trực tiếp' },
  { label: 'Hybrid', value: 'HYBRID', helper: 'Kết hợp online và trực tiếp' }
]

const genderOptions: Array<{ label: string; value: Gender }> = [
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' }
]

type DiscoverSortOption = {
  key: string
  label: string
  sortBy: MentorListSortBy | null
  sortDir: SortDirection | null
}

const sortOptions: DiscoverSortOption[] = [
  { key: 'relevance', label: 'Được đề xuất', sortBy: null, sortDir: null },
  { key: 'price-asc', label: 'Giá thấp đến cao', sortBy: 'minPrice', sortDir: 'asc' },
  { key: 'newest', label: 'Mới nhất', sortBy: 'createdAt', sortDir: 'desc' }
]

const Discover = () => {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const {
    filters,
    page,
    queryParams: mentorQueryParams,
    resetFilters,
    search,
    selectedCityId,
    selectedDistrictId,
    selectedGender,
    selectedGradeId,
    selectedMeetingType,
    selectedSubjectId,
    setFilter,
    setFilters,
    sortBy,
    sortDir
  } = useDiscoverFilters()

  const catalogOptionsQuery = useCatalogOptionsQuery()
  const citiesQuery = useCitiesQuery('')
  const districtsQuery = useDistrictsByCityQuery(selectedCityId)
  const cities = useMemo(() => citiesQuery.data ?? [], [citiesQuery.data])
  const districts = useMemo(() => districtsQuery.data ?? [], [districtsQuery.data])
  const activeSort = useMemo(() => resolveSortOption(sortBy, sortDir), [sortBy, sortDir])

  const mentorsQuery = useDiscoverMentorsQuery(mentorQueryParams)
  const mentorCards = useMemo(
    () => (mentorsQuery.data?.data ?? []).map(mapDiscoverMentorToCard),
    [mentorsQuery.data]
  )

  const filterDetails = useMemo(() => {
    const detailMap = new Map<string, FilterDetail>()
    const addFilterDetail = (key: DiscoverFilterKey, value: string, label: string) => {
      detailMap.set(`${key}:${value}`, { key, label, value })
    }

    catalogOptionsQuery.data?.subjects.forEach((subject) => {
      addFilterDetail('subjectId', String(subject.id), subject.name)
    })
    catalogOptionsQuery.data?.grades.forEach((grade) => {
      addFilterDetail('gradeId', String(grade.id), grade.name)
    })
    meetingTypeOptions.forEach((option) => {
      addFilterDetail('meetingType', option.value, option.label)
    })
    cities.forEach((city) => {
      addFilterDetail('cityId', String(city.id), city.name)
    })
    if (selectedCityId) {
      districts.forEach((district) => {
        addFilterDetail('districtId', String(district.id), district.name)
      })
    }
    genderOptions.forEach((option) => {
      addFilterDetail('gender', option.value, option.label)
    })

    return detailMap
  }, [catalogOptionsQuery.data, cities, districts, selectedCityId])
  const selectedFilterValues = useMemo(
    () =>
      [
        selectedSubjectId ? `subjectId:${selectedSubjectId}` : null,
        selectedGradeId ? `gradeId:${selectedGradeId}` : null,
        selectedMeetingType ? `meetingType:${selectedMeetingType}` : null,
        selectedCityId ? `cityId:${selectedCityId}` : null,
        selectedDistrictId ? `districtId:${selectedDistrictId}` : null,
        selectedGender ? `gender:${selectedGender}` : null
      ].filter((value): value is string => Boolean(value)),
    [
      selectedCityId,
      selectedDistrictId,
      selectedGender,
      selectedGradeId,
      selectedMeetingType,
      selectedSubjectId
    ]
  )
  const selectedAdvancedFilterValues = useMemo(
    () =>
      [
        selectedMeetingType ? `meeting:${selectedMeetingType}` : null,
        selectedDistrictId ? `district:${selectedDistrictId}` : null,
        selectedGender ? `gender:${selectedGender}` : null
      ].filter((value): value is string => Boolean(value)),
    [selectedDistrictId, selectedGender, selectedMeetingType]
  )
  const activeFilterDetails = selectedFilterValues
    .map((value) => filterDetails.get(value))
    .filter((detail): detail is FilterDetail => Boolean(detail))

  const filterMetadataError =
    catalogOptionsQuery.error ??
    citiesQuery.error ??
    (selectedCityId ? districtsQuery.error : null) ??
    null

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setFilter('search', String(formData.get('search') ?? ''))
  }

  const handleDrawerFiltersApply = (values: string[]) => {
    const updates: Parameters<typeof setFilters>[0] = {
      districtId: null,
      gender: null,
      meetingType: null
    }

    values.forEach((value) => {
      const [group, rawValue] = value.split(':')
      if (group === 'meeting') updates.meetingType = rawValue
      if (group === 'district' && selectedCityId) updates.districtId = rawValue
      if (group === 'gender') updates.gender = rawValue
    })

    setFilters(updates)
    setFiltersOpen(false)
  }

  const handleSortChange = (sortKey: string) => {
    const nextSort = sortOptions.find((option) => option.key === sortKey) ?? sortOptions[0]
    setFilters({
      sortBy: nextSort.sortBy,
      sortDir: nextSort.sortDir
    })
  }

  const handlePageChange = (nextPage: number) => {
    setFilter('page', nextPage <= 1 ? null : String(nextPage))
  }

  const mentorPage = mentorsQuery.data
  const totalItems = mentorPage?.totalItems ?? 0
  const totalPages = Math.max(mentorPage?.totalPages ?? 1, 1)
  const catalog = catalogOptionsQuery.data
  const filtersLoading = catalogOptionsQuery.isLoading || citiesQuery.isLoading

  return (
    <div className='space-y-6'>
      <header>
        <h1 className='text-ink mt-1 text-3xl font-bold tracking-tight md:text-4xl'>
          Tìm kiếm Mentor
        </h1>
      </header>

      <Card className='rounded-2xl border-slate-200 bg-white shadow-sm'>
        <CardContent className='p-4'>
          <div className='flex flex-col gap-3 xl:flex-row xl:items-center'>
            <div className='grid flex-1 grid-cols-2 gap-2 sm:flex sm:flex-wrap'>
              <AppSelect
                ariaLabel='Lọc theo môn học'
                className='sm:w-44'
                disabled={filtersLoading}
                options={(catalog?.subjects ?? []).map((subject) => ({
                  label: subject.name,
                  value: String(subject.id)
                }))}
                placeholder='Môn học'
                value={filters.subjectId ?? ''}
                onValueChange={(value) => setFilter('subjectId', value)}
              />

              <AppSelect
                ariaLabel='Lọc theo lớp học'
                className='sm:w-40'
                disabled={filtersLoading}
                options={(catalog?.grades ?? []).map((grade) => ({
                  label: grade.name,
                  value: String(grade.id)
                }))}
                placeholder='Lớp học'
                value={filters.gradeId ?? ''}
                onValueChange={(value) => setFilter('gradeId', value)}
              />

              <AppSelect
                ariaLabel='Lọc theo địa điểm'
                className='sm:w-44'
                disabled={filtersLoading}
                options={cities.map((city) => ({
                  label: city.name,
                  value: String(city.id)
                }))}
                placeholder='Địa điểm'
                value={filters.cityId ?? ''}
                onValueChange={(value) => setFilter('cityId', value)}
              />

              <Button
                className='rounded-xl'
                type='button'
                variant='outline'
                onClick={() => setFiltersOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Bộ lọc khác
                {selectedAdvancedFilterValues.length ? (
                  <Badge className='ml-1' variant='info'>
                    {selectedAdvancedFilterValues.length}
                  </Badge>
                ) : null}
              </Button>
            </div>

            <form className='relative w-full xl:ml-auto xl:max-w-xs' onSubmit={handleSearchSubmit}>
              <Search
                aria-hidden='true'
                className='text-muted absolute top-1/2 left-3 -translate-y-1/2'
                size={17}
              />
              <Input
                key={search}
                aria-label='Tìm kiếm mentor'
                className='h-10 pl-10'
                defaultValue={search}
                name='search'
                placeholder='Tìm kiếm mentor...'
              />
            </form>
          </div>

          {filterMetadataError ? (
            <p className='mt-3 text-sm text-red-600'>
              Chưa thể tải đầy đủ lựa chọn bộ lọc. Bạn vẫn có thể tìm mentor theo từ khóa.
            </p>
          ) : null}

          {search || activeFilterDetails.length ? (
            <div className='mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4'>
              {search ? <Badge variant='outline'>Từ khóa: {search}</Badge> : null}
              {activeFilterDetails.map((filter) => (
                <button
                  key={`${filter.key}:${filter.value}`}
                  className='inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:border-blue-300'
                  type='button'
                  onClick={() => setFilter(filter.key, null)}
                >
                  {filter.label}
                  <span aria-hidden='true'>×</span>
                </button>
              ))}
              <Button
                className='ml-auto h-8 rounded-lg px-2 text-xs'
                size='sm'
                type='button'
                variant='ghost'
                onClick={resetFilters}
              >
                <RotateCcw size={13} />
                Xóa tất cả
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <section className='space-y-5'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h2 className='text-ink text-lg font-semibold'>
              {mentorsQuery.isLoading && !mentorPage
                ? 'Đang tìm mentor phù hợp'
                : `${totalItems} mentor phù hợp`}
            </h2>
            {mentorsQuery.isFetching && mentorPage ? (
              <p className='text-muted mt-1 text-sm'>Đang cập nhật kết quả...</p>
            ) : null}
          </div>

          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-muted shrink-0 text-sm'>Sắp xếp theo</span>
            <div className='flex flex-wrap rounded-xl border border-slate-200 bg-white p-1'>
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    activeSort.key === option.key
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  type='button'
                  onClick={() => handleSortChange(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {mentorsQuery.isError ? (
          <ScreenErrorState
            description='Không thể tải danh sách mentor lúc này. Vui lòng thử lại.'
            onRetry={() => void mentorsQuery.refetch()}
            retryLabel='Tải lại danh sách'
            title='Danh sách mentor đang bị lỗi'
          />
        ) : mentorsQuery.isLoading && !mentorPage ? (
          <MentorGridSkeleton />
        ) : mentorCards.length ? (
          <>
            <div className='grid items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {mentorCards.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>

            <div className='flex flex-wrap items-center justify-center gap-3 pt-2'>
              <Button
                aria-label='Trang trước'
                className='rounded-xl'
                disabled={page <= 1}
                type='button'
                variant='outline'
                onClick={() => handlePageChange(page - 1)}
              >
                <ChevronLeft size={16} />
                Trang trước
              </Button>
              <Badge variant='muted'>
                Trang {page} / {totalPages}
              </Badge>
              <Button
                aria-label='Trang sau'
                className='rounded-xl'
                disabled={page >= totalPages}
                type='button'
                variant='outline'
                onClick={() => handlePageChange(page + 1)}
              >
                Trang sau
                <ChevronRight size={16} />
              </Button>
              {page < totalPages - 1 ? (
                <Button
                  className='rounded-xl'
                  type='button'
                  variant='ghost'
                  onClick={() => handlePageChange(totalPages)}
                >
                  Đi tới trang cuối
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <EmptyState
            action={
              <Button className='rounded-full' type='button' onClick={resetFilters}>
                Xóa bộ lọc và tìm lại
              </Button>
            }
            description='Thử mở rộng bộ lọc hoặc đổi từ khóa để xem thêm mentor phù hợp.'
            title='Chưa có mentor phù hợp'
          />
        )}
      </section>

      {filtersOpen ? (
        <AdvancedMentorFiltersDrawer
          cityName={cities.find((city) => city.id === selectedCityId)?.name}
          districtOptions={districts.map<AdvancedMentorFilterOption>((district) => ({
            label: district.name,
            value: `district:${district.id}`
          }))}
          genderOptions={genderOptions.map<AdvancedMentorFilterOption>((option) => ({
            label: option.label,
            value: `gender:${option.value}`
          }))}
          isDistrictLoading={districtsQuery.isLoading}
          meetingTypeOptions={meetingTypeOptions.map<AdvancedMentorFilterOption>((option) => ({
            helper: option.helper,
            label: option.label,
            value: `meeting:${option.value}`
          }))}
          selectedValues={selectedAdvancedFilterValues}
          onApply={handleDrawerFiltersApply}
          onClose={() => setFiltersOpen(false)}
        />
      ) : null}
    </div>
  )
}

export default Discover

function MentorGridSkeleton() {
  return (
    <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className='rounded-2xl border-slate-200 bg-white shadow-sm'>
          <CardContent className='space-y-4 p-4'>
            <div className='flex items-center gap-3'>
              <div className='h-12 w-12 animate-pulse rounded-full bg-slate-200' />
              <div className='flex-1 space-y-2'>
                <div className='h-4 w-2/3 animate-pulse rounded-full bg-slate-200' />
                <div className='h-3 w-1/3 animate-pulse rounded-full bg-slate-100' />
              </div>
            </div>
            <div className='h-10 animate-pulse rounded-xl bg-slate-100' />
            <div className='h-20 animate-pulse rounded-xl bg-slate-50' />
            <div className='h-24 animate-pulse rounded-xl bg-slate-50' />
            <div className='h-16 animate-pulse rounded-xl bg-slate-50' />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

type FilterDetail = {
  key: DiscoverFilterKey
  label: string
  value: string
}

function resolveSortOption(sortBy: MentorListSortBy | null, sortDir: SortDirection | null) {
  return (
    sortOptions.find((option) => option.sortBy === sortBy && option.sortDir === sortDir) ??
    sortOptions[0]
  )
}
