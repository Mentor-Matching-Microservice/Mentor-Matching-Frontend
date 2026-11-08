import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { useQueryParams } from '@/hooks/useQueryParams'
import type { Gender, SortDirection } from '@/types/api/common'
import type { MentorListSortBy, MentorMeetingType, MentorsQueryParams } from '@/types/api/mentor'

export const DISCOVER_PAGE_SIZE = 9

export type DiscoverFilters = Partial<Record<keyof MentorsQueryParams, string>> & {
  page: string
  search: string
  size: string
}

export type DiscoverFilterKey = keyof DiscoverFilters

type FilterUpdates = Partial<Record<DiscoverFilterKey, string | null | undefined>>

/* Quản lý filter của trang Discover qua URL và trả params đã parse để gọi API. */
export function useDiscoverFilters() {
  const urlQueryParams = useQueryParams()
  const [searchParams, setSearchParams] = useSearchParams()

  /* Chuẩn hóa query string trên URL thành filter object dùng cho UI. */
  const filters = useMemo<DiscoverFilters>(
    () => ({
      page: urlQueryParams.page || '1',
      search: urlQueryParams.search?.trim() ?? '',
      size: urlQueryParams.size || String(DISCOVER_PAGE_SIZE),
      cityId: urlQueryParams.cityId,
      districtId: urlQueryParams.districtId,
      gender: urlQueryParams.gender,
      gradeId: urlQueryParams.gradeId,
      meetingType: urlQueryParams.meetingType,
      sortBy: urlQueryParams.sortBy,
      sortDir: urlQueryParams.sortDir,
      subjectId: urlQueryParams.subjectId
    }),
    [urlQueryParams]
  )

  /* Parse filter từ string URL sang kiểu dữ liệu sạch để truyền vào API. */
  const parsedFilters = useMemo(() => {
    const search = filters.search
    const page = parsePositiveInteger(filters.page) ?? 1
    const size = parsePositiveInteger(filters.size) ?? DISCOVER_PAGE_SIZE
    const selectedMeetingType = parseMeetingType(filters.meetingType)
    const selectedCityId = parsePositiveInteger(filters.cityId)
    const selectedDistrictId = parsePositiveInteger(filters.districtId)
    const selectedSubjectId = parsePositiveInteger(filters.subjectId)
    const selectedGradeId = parsePositiveInteger(filters.gradeId)
    const selectedGender = parseGender(filters.gender)
    const sortBy = parseSortBy(filters.sortBy)
    const sortDir = parseSortDirection(filters.sortDir)
    const queryParams: MentorsQueryParams = { page, size }

    if (search) queryParams.search = search
    if (selectedMeetingType) queryParams.meetingType = selectedMeetingType
    if (selectedCityId) queryParams.cityId = selectedCityId
    if (selectedDistrictId) queryParams.districtId = selectedDistrictId
    if (selectedSubjectId) queryParams.subjectId = selectedSubjectId
    if (selectedGradeId) queryParams.gradeId = selectedGradeId
    if (selectedGender) queryParams.gender = selectedGender
    if (
      (sortBy === 'minPrice' && sortDir === 'asc') ||
      (sortBy === 'createdAt' && sortDir === 'desc')
    ) {
      queryParams.sortBy = sortBy
      queryParams.sortDir = sortDir
    }

    return {
      page,
      queryParams,
      search,
      selectedCityId,
      selectedDistrictId,
      selectedGender,
      selectedGradeId,
      selectedMeetingType,
      selectedSubjectId,
      sortBy,
      sortDir
    }
  }, [filters])

  /* Cập nhật nhiều filter cùng lúc; value rỗng sẽ xóa filter khỏi URL. */
  const setFilters = useCallback(
    (updates: FilterUpdates) => {
      const nextParams = new URLSearchParams(searchParams)
      const updatedKeys = Object.keys(updates) as DiscoverFilterKey[]

      updatedKeys.forEach((key) => {
        const value = updates[key]?.trim()

        if (value) nextParams.set(key, value)
        else nextParams.delete(key)
      })

      if (updatedKeys.includes('cityId')) nextParams.delete('districtId')
      if (!updatedKeys.every((key) => key === 'page')) nextParams.delete('page')

      setSearchParams(nextParams)
    },
    [searchParams, setSearchParams]
  )

  /* Cập nhật một filter đơn lẻ trên URL. */
  const setFilter = useCallback(
    (key: DiscoverFilterKey, value: string | null | undefined) => {
      setFilters({ [key]: value })
    },
    [setFilters]
  )

  /* Xóa toàn bộ filter và query hiện tại khỏi URL. */
  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams())
  }, [setSearchParams])

  return {
    ...parsedFilters,
    filters,
    resetFilters,
    setFilter,
    setFilters
  }
}

/* Parse số nguyên dương từ query string; sai định dạng thì bỏ qua. */
function parsePositiveInteger(value: string | null | undefined) {
  if (!value) return null
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null
}

/* Chỉ nhận các hình thức học hợp lệ từ URL. */
function parseMeetingType(value: string | null | undefined): MentorMeetingType | null {
  return value === 'ONLINE' || value === 'OFFLINE' || value === 'HYBRID' ? value : null
}

/* Chỉ nhận các giá trị giới tính hợp lệ từ URL. */
function parseGender(value: string | null | undefined): Gender | null {
  return value === 'MALE' || value === 'FEMALE' || value === 'OTHER' ? value : null
}

/* Chỉ nhận các field sort mentor mà API hỗ trợ. */
function parseSortBy(value: string | null | undefined): MentorListSortBy | null {
  if (
    value === 'id' ||
    value === 'fullName' ||
    value === 'gender' ||
    value === 'experienceYears' ||
    value === 'meetingType' ||
    value === 'createdAt' ||
    value === 'minPrice'
  ) {
    return value
  }

  return null
}

/* Chỉ nhận chiều sắp xếp hợp lệ. */
function parseSortDirection(value: string | null | undefined): SortDirection | null {
  return value === 'asc' || value === 'desc' ? value : null
}
