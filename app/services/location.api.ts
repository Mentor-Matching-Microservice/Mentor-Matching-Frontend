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
  cityDistricts: (cityId: number) => `locations/cities/${cityId}/districts`
} as const

const defaultLocationApi = {
  getCities: async (params?: LocationSearchParams): Promise<ApiResponse<CityApiResponse[]>> =>
    (await http.get<ApiResponse<CityApiResponse[]>>(LOCATION_ENDPOINTS.cities, { params })).data,

  getDistrictsByCity: async (
    cityId: number,
    params?: LocationSearchParams
  ): Promise<ApiResponse<DistrictApiResponse[]>> =>
    (
      await http.get<ApiResponse<DistrictApiResponse[]>>(LOCATION_ENDPOINTS.cityDistricts(cityId), {
        params
      })
    ).data
}

export const locationApi = env.useMock ? mockLocationApi : defaultLocationApi
