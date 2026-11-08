import type { ApiResponse } from '@/types/api/common'
import type {
  CityApiResponse,
  DistrictApiResponse,
  LocationSearchParams
} from '@/types/api/location'

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms))

function buildSuccessResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return {
    status: 200,
    code: 'SUCCESS',
    success: true,
    message,
    data
  }
}

const mockCities: CityApiResponse[] = [
  { id: 1, code: 'HCM', name: 'Ho Chi Minh' },
  { id: 2, code: 'HN', name: 'Ha Noi' },
  { id: 3, code: 'DN', name: 'Da Nang' }
]

const mockDistricts: DistrictApiResponse[] = [
  { id: 101, cityId: 1, code: 'Q1', name: 'Quan 1' },
  { id: 102, cityId: 1, code: 'Q3', name: 'Quan 3' },
  { id: 103, cityId: 1, code: 'TPD', name: 'Thu Duc' },
  { id: 201, cityId: 2, code: 'BD', name: 'Ba Dinh' },
  { id: 202, cityId: 2, code: 'CG', name: 'Cau Giay' },
  { id: 203, cityId: 2, code: 'TX', name: 'Thanh Xuan' },
  { id: 301, cityId: 3, code: 'HC', name: 'Hai Chau' },
  { id: 302, cityId: 3, code: 'TK', name: 'Thanh Khe' },
  { id: 303, cityId: 3, code: 'SL', name: 'Son Tra' }
]

function normalizeSearch(search?: string) {
  return search?.trim().toLowerCase() ?? ''
}

function filterBySearch<T extends { code: string; name: string }>(items: T[], search?: string) {
  const normalizedSearch = normalizeSearch(search)

  if (!normalizedSearch) return items

  return items.filter((item) => {
    const normalizedCode = item.code.toLowerCase()
    const normalizedName = item.name.toLowerCase()

    return normalizedCode.includes(normalizedSearch) || normalizedName.includes(normalizedSearch)
  })
}

export const mockLocationApi = {
  async getCities(params?: LocationSearchParams): Promise<ApiResponse<CityApiResponse[]>> {
    await delay()

    return buildSuccessResponse(
      filterBySearch(mockCities, params?.search),
      'Get cities successfully'
    )
  },

  async getDistrictsByCity(
    cityId: number,
    params?: LocationSearchParams
  ): Promise<ApiResponse<DistrictApiResponse[]>> {
    await delay()

    const cityDistricts = mockDistricts.filter((district) => district.cityId === cityId)

    return buildSuccessResponse(
      filterBySearch(cityDistricts, params?.search),
      'Get districts successfully'
    )
  }
}
