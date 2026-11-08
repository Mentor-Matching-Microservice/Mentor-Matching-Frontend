import { env } from '@/config/env'
import http from '@/libs/http'
import { mockCatalogApi } from '@/services/mock/catalog.mock.api'
import type { CatalogOptionsApiResponse } from '@/types/api/catalog'
import type { ApiResponse } from '@/types/api/common'

const CATALOG_ENDPOINTS = {
  options: 'catalog/options',
  adminSubjects: 'admin/catalog/subjects',
  adminGrades: 'admin/catalog/grades'
} as const

const defaultCatalogApi = {
  getCatalogOptions: async (): Promise<ApiResponse<CatalogOptionsApiResponse>> =>
    (await http.get<ApiResponse<CatalogOptionsApiResponse>>(CATALOG_ENDPOINTS.options)).data,

  createSubject: async (
    data: import('@/types/api/catalog').CreateSubjectRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>> =>
    (
      await http.post<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>>(
        CATALOG_ENDPOINTS.adminSubjects,
        data
      )
    ).data,

  updateSubject: async (
    id: number,
    data: import('@/types/api/catalog').UpdateSubjectRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>> =>
    (
      await http.put<ApiResponse<import('@/types/api/catalog').CatalogSubjectApiResponse>>(
        `${CATALOG_ENDPOINTS.adminSubjects}/${id}`,
        data
      )
    ).data,

  deleteSubject: async (id: number): Promise<ApiResponse<void>> =>
    (await http.delete<ApiResponse<void>>(`${CATALOG_ENDPOINTS.adminSubjects}/${id}`)).data,

  createGrade: async (
    data: import('@/types/api/catalog').CreateGradeRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>> =>
    (
      await http.post<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>>(
        CATALOG_ENDPOINTS.adminGrades,
        data
      )
    ).data,

  updateGrade: async (
    id: number,
    data: import('@/types/api/catalog').UpdateGradeRequest
  ): Promise<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>> =>
    (
      await http.put<ApiResponse<import('@/types/api/catalog').CatalogGradeApiResponse>>(
        `${CATALOG_ENDPOINTS.adminGrades}/${id}`,
        data
      )
    ).data,

  deleteGrade: async (id: number): Promise<ApiResponse<void>> =>
    (await http.delete<ApiResponse<void>>(`${CATALOG_ENDPOINTS.adminGrades}/${id}`)).data
}

export const catalogApi = env.useMock ? mockCatalogApi : defaultCatalogApi
