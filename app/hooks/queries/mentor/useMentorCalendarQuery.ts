import { queryOptions, useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants/query-keys'
import { mentorApi } from '@/services/mentor.api'
import type { MentorCalendarApiResponse } from '@/types/api/mentor-calendar'

async function fetchMentorCalendar(
  mentorId: number,
  from: string,
  to: string
): Promise<MentorCalendarApiResponse> {
  const response = await mentorApi.getMentorCalendarBooking(mentorId, from, to)

  return response.data
}

export function getMentorCalendarQueryOptions(mentorId: number, from: string, to: string) {
  return queryOptions({
    queryKey: QUERY_KEYS.mentor.calendar({ mentorId, from, to }),
    queryFn: () => fetchMentorCalendar(mentorId, from, to)
  })
}

export function useMentorCalendarQuery(
  mentorId: number | null,
  from: string | null,
  to: string | null
) {
  return useQuery({
    ...getMentorCalendarQueryOptions(mentorId ?? 0, from ?? '', to ?? ''),
    enabled: Boolean(mentorId && mentorId > 0 && from && to)
  })
}
