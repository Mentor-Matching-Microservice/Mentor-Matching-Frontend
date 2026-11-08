import { describe, expect, it } from 'vitest'

import {
  mapMentorCalendarToViewModel,
  resolveSelectedCalendarSlot
} from '@/features/mentor-profile/mentor-calendar.mapper'

describe('mentor calendar mapper', () => {
  it('sorts available windows and marks the nearest slot', () => {
    const calendar = mapMentorCalendarToViewModel({
      mentorId: 101,
      from: '2026-06-15',
      to: '2026-06-21',
      dates: [
        {
          date: '2026-06-16',
          availableWindows: [{ startTime: '14:00:00', endTime: '16:00:00' }]
        },
        {
          date: '2026-06-15',
          availableWindows: [{ startTime: '10:00:00', endTime: '12:00:00' }]
        }
      ]
    })

    expect(calendar.slots.map((slot) => slot.date)).toEqual(['2026-06-15', '2026-06-16'])
    expect(calendar.slots[0].isNearestBookable).toBe(true)
    expect(calendar.slots[1].isNearestBookable).toBe(false)
  })

  it('keeps the user-selected slot while it remains available', () => {
    const calendar = mapMentorCalendarToViewModel({
      mentorId: 101,
      from: '2026-06-15',
      to: '2026-06-21',
      dates: [
        {
          date: '2026-06-15',
          availableWindows: [
            { startTime: '10:00:00', endTime: '12:00:00' },
            { startTime: '14:00:00', endTime: '16:00:00' }
          ]
        }
      ]
    })
    const userSelectedSlot = calendar.slots[1]

    expect(resolveSelectedCalendarSlot(calendar.slots, userSelectedSlot.id)?.id).toBe(
      userSelectedSlot.id
    )
  })

  it('falls back to the nearest slot when selection is no longer valid', () => {
    const calendar = mapMentorCalendarToViewModel({
      mentorId: 101,
      from: '2026-06-22',
      to: '2026-06-28',
      dates: [
        {
          date: '2026-06-23',
          availableWindows: [{ startTime: '09:00:00', endTime: '11:00:00' }]
        }
      ]
    })

    expect(resolveSelectedCalendarSlot(calendar.slots, 'slot-from-another-week')?.id).toBe(
      calendar.slots[0].id
    )
  })
})
