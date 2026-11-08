import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import { useAuthStore } from '@/stores/auth-store'
import { isAxiosNotFoundError } from '@/utils/http-error'
import type {
  CurrentMentorApiResponse,
  MentorAvailabilityDetailApiResponse
} from '@/types/api/mentor'

export type CurrentMentorScheduleApiBundle = {
  currentMentor: CurrentMentorApiResponse | null
  availabilities: MentorAvailabilityDetailApiResponse[]
}

async function fetchCurrentMentorSchedule(
  suppressNotFound = false
): Promise<CurrentMentorScheduleApiBundle> {
  try {
    const currentMentor = (await mentorApi.getCurrentMentor()).data
    const availabilities = (await mentorApi.getCurrentMentorAvailabilities()).data

    return {
      currentMentor,
      availabilities
    }
  } catch (error) {
    if (suppressNotFound && isAxiosNotFoundError(error)) {
      return {
        currentMentor: null,
        availabilities: []
      }
    }

    throw error
  }
}

export function getCurrentMentorScheduleQueryOptions(suppressNotFound = false) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.currentSchedule,
    queryFn: () => fetchCurrentMentorSchedule(suppressNotFound)
  })
}

export function useCurrentMentorScheduleQuery(
  enabled = true,
  options?: {
    suppressNotFound?: boolean
  }
) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const suppressNotFound = options?.suppressNotFound ?? false

  return useQuery({
    ...getCurrentMentorScheduleQueryOptions(suppressNotFound),
    enabled: Boolean(accessToken) && enabled
  })
}
