import type { MentorCalendarViewModel } from '@/features/mentor-profile/mentor-calendar.mapper'

export function parseMentorId(value: string | undefined) {
  if (!value) return null
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null
}

export function getInitialCalendarDiscoveryRange(from: string) {
  return {
    from,
    to: addDaysToIsoDate(from, 30)
  }
}

export function getCalendarWeekView(calendar: MentorCalendarViewModel, weekStart: string) {
  const weekEnd = addDaysToIsoDate(weekStart, 6)
  const weekDates = calendar.dates.filter((date) => date.date >= weekStart && date.date <= weekEnd)
  const weekSlots = weekDates.flatMap((date) => date.slots)
  const nearestSlotId = weekSlots.find((slot) => slot.isBookable)?.id
  const slots = weekSlots.map((slot) => ({
    ...slot,
    isNearestBookable: slot.id === nearestSlotId
  }))

  return {
    ...calendar,
    from: weekStart,
    to: weekEnd,
    dates: weekDates.map((date) => ({
      ...date,
      slots: slots.filter((slot) => slot.date === date.date)
    })),
    slots
  }
}

export function getCalendarWeekRange(weekStart: string) {
  return {
    from: weekStart,
    to: addDaysToIsoDate(weekStart, 6)
  }
}

export function getWeekStartIso(value: Date | string) {
  const date = typeof value === 'string' ? new Date(`${value}T00:00:00`) : new Date(value)
  const dayOfWeek = date.getDay() === 0 ? 7 : date.getDay()

  date.setDate(date.getDate() - dayOfWeek + 1)

  return toIsoDate(date)
}

export function addDaysToIsoDate(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`)

  date.setDate(date.getDate() + days)

  return toIsoDate(date)
}

export function formatWeekRange(weekStart: string) {
  const weekEnd = addDaysToIsoDate(weekStart, 6)

  return `${formatShortDate(weekStart)} - ${formatShortDate(weekEnd)}`
}

export function formatCalendarDayLabel(value: string) {
  const date = new Date(`${value}T00:00:00`)

  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit'
  }).format(date)
}

export function formatShortDate(value: string) {
  const date = new Date(`${value}T00:00:00`)

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date)
}

function toIsoDate(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}
