import { env } from '@/config/env'
import http from '@/libs/http'
import { mockLocationApi } from '@/services/mock/location.mock.api'
import type { ApiResponse } from '@/types/api/common'
import type {
  CityApiResponse,
  DistrictApiResponse,
  LocationSearchParams
} from '@/types/api/location'

const LOCATION_ENDPOINTS = {
  cities: 'locations/cities',
  cityDetail: (cityId: number) => `locations/cities/${cityId}`,
  cityDistricts: (cityId: number) => `locations/cities/${cityId}/districts`,
  districtDetail: (districtId: number) => `locations/districts/${districtId}`
} as const

const defaultLocationApi = {
  getCities: async (params?: LocationSearchParams): Promise<ApiResponse<CityApiResponse[]>> =>
    (await http.get<ApiResponse<CityApiResponse[]>>(LOCATION_ENDPOINTS.cities, { params })).data,

  getCity: async (cityId: number): Promise<ApiResponse<CityApiResponse>> =>
    (await http.get<ApiResponse<CityApiResponse>>(LOCATION_ENDPOINTS.cityDetail(cityId))).data,

  getDistrictsByCity: async (
    cityId: number,
    params?: LocationSearchParams
  ): Promise<ApiResponse<DistrictApiResponse[]>> =>
    (
      await http.get<ApiResponse<DistrictApiResponse[]>>(LOCATION_ENDPOINTS.cityDistricts(cityId), {
        params
      })
    ).data,

  getDistrict: async (districtId: number): Promise<ApiResponse<DistrictApiResponse>> =>
    (await http.get<ApiResponse<DistrictApiResponse>>(LOCATION_ENDPOINTS.districtDetail(districtId)))
      .data
}

export const locationApi = env.useMock ? mockLocationApi : defaultLocationApi
