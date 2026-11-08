export type ApiResponse<T> = {
  status: number
  code: string
  success: boolean
  message: string
  data: T
}

export type SortDirection = 'asc' | 'desc'

export type SortOrder = SortDirection

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'

export type PaginationParams = {
  page?: number
  size?: number
}

export type SortParams<TSortBy extends string = string> = {
  sortBy?: TSortBy
  sortDir?: SortDirection
}

export type PageQueryParams<
  TSortBy extends string = string,
  TFilters extends Record<string, unknown> = Record<string, never>
> = PaginationParams & SortParams<TSortBy> & TFilters

export type PageResponse<T> = {
  page: number
  pageSize: number
  totalPages: number
  totalItems: number
  data: T[]
}

export type PageMeta = Omit<PageResponse<never>, 'data'>

export type ErrorResponse = {
  code: string
  status: number
  message: string
  path: string
  timestamp: string
}
