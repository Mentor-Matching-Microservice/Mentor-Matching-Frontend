import axios from 'axios'
import { useMemo, useState } from 'react'
import { useParams } from 'react-router'

import BookingSidebar from '@/components/BookingSidebar'
import { EmptyState } from '@/components/EmptyState'
import { ScreenErrorState } from '@/components/ScreenErrorState'
import { path } from '@/config/path'
import {
  MentorProfileAvailabilitySection,
  MentorProfileHeader,
  MentorProfileIntroductionSection,
  MentorProfileOfferingsSection,
  MentorProfilePageShell,
  MentorProfileReviewsSection,
  MentorProfileSkeleton,
  MentorProfileTrustSection
} from '@/features/mentor-profile/components'
import { parseMentorId } from '@/features/mentor-profile/mentor-profile-calendar.utils'
import { mapMentorProfileToViewModel } from '@/features/mentor-profile/mentor-profile.mapper'
import { useMentorProfileCalendar } from '@/features/mentor-profile/useMentorProfileCalendar'
import { useMentorProfileQuery } from '@/hooks/queries/mentor/useMentorProfileQuery'
import type { ErrorResponse } from '@/types/api/common'

const MentorProfile = () => {
  const { id } = useParams()
  const mentorId = parseMentorId(id)
  const mentorProfileQuery = useMentorProfileQuery(mentorId)
  const mentor = useMemo(
    () => (mentorProfileQuery.data ? mapMentorProfileToViewModel(mentorProfileQuery.data) : null),
    [mentorProfileQuery.data]
  )
  const [selectedOfferingIdState, setSelectedOfferingId] = useState<string>()
  const mentorCalendar = useMentorProfileCalendar({
    mentorId
  })
  const selectedOfferingId = mentor?.offerings.some(
    (offering) => offering.id === selectedOfferingIdState
  )
    ? selectedOfferingIdState
    : (mentor?.offerings.find((offering) => offering.active)?.id ?? mentor?.offerings[0]?.id)

  const notFound =
    mentorId === null ||
    (axios.isAxiosError<ErrorResponse>(mentorProfileQuery.error) &&
      mentorProfileQuery.error.response?.status === 404)

  if (notFound) {
    return (
      <MentorProfilePageShell>
        <EmptyState
          actionHref={path.discover}
          actionLabel='Quay lại danh sách mentor'
          description='Hồ sơ này hiện không có sẵn hoặc chưa đủ điều kiện hiển thị.'
          title='Không tìm thấy mentor'
        />
      </MentorProfilePageShell>
    )
  }

  if (mentorProfileQuery.isLoading) {
    return (
      <MentorProfilePageShell>
        <MentorProfileSkeleton />
      </MentorProfilePageShell>
    )
  }

  if (mentorProfileQuery.isError) {
    return (
      <MentorProfilePageShell>
        <ScreenErrorState
          description='Không thể tải hồ sơ mentor lúc này. Vui lòng thử lại.'
          onRetry={() => void mentorProfileQuery.refetch()}
          title='Chưa tải được hồ sơ mentor'
        />
      </MentorProfilePageShell>
    )
  }

  if (!mentor) return null

  return (
    <MentorProfilePageShell>
      <MentorProfileHeader mentor={mentor} />

      <div className='mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start'>
        <main className='space-y-5'>
          <MentorProfileIntroductionSection mentor={mentor} />
          <MentorProfileOfferingsSection
            mentor={mentor}
            selectedOfferingId={selectedOfferingId}
            onSelectOffering={setSelectedOfferingId}
          />
          <MentorProfileTrustSection mentor={mentor} />
          <MentorProfileAvailabilitySection
            calendar={mentorCalendar.calendar}
            isError={mentorCalendar.isError}
            isLoading={mentorCalendar.isLoading}
            selectedSlotId={mentorCalendar.selectedSlotId}
            weekStart={mentorCalendar.displayWeekStart}
            onChangeWeek={mentorCalendar.handleChangeWeek}
            onSelectSlot={mentorCalendar.setSelectedSlotId}
          />
          <MentorProfileReviewsSection mentor={mentor} />
        </main>

        <BookingSidebar
          calendarSlots={mentorCalendar.calendar?.slots ?? []}
          isCalendarLoading={mentorCalendar.isLoading}
          mentor={mentor}
          selectedSlotId={mentorCalendar.selectedSlotId}
          selectedOfferingId={selectedOfferingId}
          className='lg:col-start-2 lg:row-start-1'
          onSelectSlot={mentorCalendar.setSelectedSlotId}
        />
      </div>
    </MentorProfilePageShell>
  )
}

export default MentorProfile
