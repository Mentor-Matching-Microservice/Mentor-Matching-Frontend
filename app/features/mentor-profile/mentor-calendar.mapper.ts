import type { MentorCalendarApiResponse } from '@/types/api/mentor-calendar'

export type MentorCalendarSlotViewModel = {
  id: string
  date: string
  startTime: string
  endTime: string
  isBookable: boolean
  isNearestBookable: boolean
}

export type MentorCalendarDateViewModel = {
  date: string
  slots: MentorCalendarSlotViewModel[]
}

export type MentorCalendarViewModel = {
  mentorId: number
  from: string
  to: string
  dates: MentorCalendarDateViewModel[]
  slots: MentorCalendarSlotViewModel[]
}

export function mapMentorCalendarToViewModel(
  calendar: MentorCalendarApiResponse
): MentorCalendarViewModel {
  const slots = calendar.dates
    .flatMap((date) =>
      date.availableWindows.map<MentorCalendarSlotViewModel>((window) => ({
        id: buildCalendarSlotId(calendar.mentorId, date.date, window.startTime, window.endTime),
        date: date.date,
        startTime: window.startTime,
        endTime: window.endTime,
        isBookable: true,
        isNearestBookable: false
      }))
    )
    .sort(compareCalendarSlots)

  const nearestBookableSlot = slots.find((slot) => slot.isBookable)
  const slotsWithNearest = slots.map((slot) => ({
    ...slot,
    isNearestBookable: slot.id === nearestBookableSlot?.id
  }))

  return {
    mentorId: calendar.mentorId,
    from: calendar.from,
    to: calendar.to,
    dates: calendar.dates.map((date) => ({
      date: date.date,
      slots: slotsWithNearest.filter((slot) => slot.date === date.date)
    })),
    slots: slotsWithNearest
  }
}

export function resolveSelectedCalendarSlot(
  slots: MentorCalendarSlotViewModel[],
  selectedSlotId?: string
) {
  return (
    slots.find((slot) => slot.id === selectedSlotId && slot.isBookable) ??
    slots.find((slot) => slot.isNearestBookable && slot.isBookable) ??
    slots.find((slot) => slot.isBookable) ??
    null
  )
}

function buildCalendarSlotId(mentorId: number, date: string, startTime: string, endTime: string) {
  return `${mentorId}:${date}:${startTime}:${endTime}`
}

function compareCalendarSlots(
  left: MentorCalendarSlotViewModel,
  right: MentorCalendarSlotViewModel
) {
  return (
    left.date.localeCompare(right.date) ||
    left.startTime.localeCompare(right.startTime) ||
    left.endTime.localeCompare(right.endTime)
  )
}
