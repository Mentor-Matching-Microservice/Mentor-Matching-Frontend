export type CityApiResponse = {
  id: number
  code: string
  name: string
}

export type DistrictApiResponse = {
  id: number
  cityId: number
  code: string
  name: string
}

export type LocationSearchParams = {
  search?: string
}
