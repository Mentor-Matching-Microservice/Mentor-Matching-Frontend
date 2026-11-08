import { useMemo, useState } from 'react'

import {
  mapMentorCalendarToViewModel,
  resolveSelectedCalendarSlot,
  type MentorCalendarSlotViewModel,
  type MentorCalendarViewModel
} from '@/features/mentor-profile/mentor-calendar.mapper'
import {
  addDaysToIsoDate,
  getCalendarWeekRange,
  getCalendarWeekView,
  getInitialCalendarDiscoveryRange,
  getWeekStartIso
} from '@/features/mentor-profile/mentor-profile-calendar.utils'
import { useMentorCalendarQuery } from '@/hooks/queries/mentor/useMentorCalendarQuery'

type UseMentorProfileCalendarParams = {
  mentorId: number | null
}

type UseMentorProfileCalendarResult = {
  calendar: MentorCalendarViewModel | null
  displayWeekStart: string
  isError: boolean
  isLoading: boolean
  selectedSlot: MentorCalendarSlotViewModel | null
  selectedSlotId?: string
  setSelectedSlotId: (slotId: string) => void
  handleChangeWeek: (weekOffset: number) => void
}

export function useMentorProfileCalendar({
  mentorId
}: UseMentorProfileCalendarParams): UseMentorProfileCalendarResult {
  const [initialWeekStart] = useState(() => getWeekStartIso(new Date()))
  const [requestedWeekStart, setRequestedWeekStart] = useState<string>()
  const [selectedSlotIdState, setSelectedSlotId] = useState<string>()
  const calendarRange = requestedWeekStart
    ? getCalendarWeekRange(requestedWeekStart)
    : getInitialCalendarDiscoveryRange(initialWeekStart)
  const mentorCalendarQuery = useMentorCalendarQuery(mentorId, calendarRange.from, calendarRange.to)
  const queriedCalendar = useMemo(
    () =>
      mentorCalendarQuery.data ? mapMentorCalendarToViewModel(mentorCalendarQuery.data) : null,
    [mentorCalendarQuery.data]
  )
  const displayWeekStart =
    requestedWeekStart ??
    (queriedCalendar?.slots[0] ? getWeekStartIso(queriedCalendar.slots[0].date) : initialWeekStart)
  const calendar = useMemo(
    () => (queriedCalendar ? getCalendarWeekView(queriedCalendar, displayWeekStart) : null),
    [displayWeekStart, queriedCalendar]
  )
  const selectedSlot = calendar
    ? resolveSelectedCalendarSlot(calendar.slots, selectedSlotIdState)
    : null
  const selectedSlotId = selectedSlot?.id

  const handleChangeWeek = (weekOffset: number) => {
    const nextWeekStart = addDaysToIsoDate(displayWeekStart, weekOffset * 7)

    setRequestedWeekStart(nextWeekStart)
  }

  return {
    calendar,
    displayWeekStart,
    isError: mentorCalendarQuery.isError,
    isLoading: mentorCalendarQuery.isLoading,
    selectedSlot,
    selectedSlotId,
    setSelectedSlotId,
    handleChangeWeek
  }
}
