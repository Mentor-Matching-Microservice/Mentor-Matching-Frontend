import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MentorProfileContentSection,
  MentorProfileInlineEmpty
} from '@/features/mentor-profile/components/MentorProfilePageShell'
import {
  formatMeetingTypeLabel,
  type MentorProfileOffering,
  type MentorProfileViewModel
} from '@/features/mentor-profile/mentor-profile.mapper'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/utils/format'

type MentorProfileOfferingsSectionProps = {
  mentor: MentorProfileViewModel
  onSelectOffering: (id: string) => void
  selectedOfferingId?: string
}

export function MentorProfileOfferingsSection({
  mentor,
  onSelectOffering,
  selectedOfferingId
}: MentorProfileOfferingsSectionProps) {
  return (
    <MentorProfileContentSection
      id='offerings'
      title='Môn học và học phí'
      subtitle='Chọn môn học phù hợp để xem lịch và gửi yêu cầu đặt buổi.'
    >
      <div className='space-y-3'>
        {mentor.offerings.length ? (
          mentor.offerings.map((offering) => (
            <OfferingCard
              key={offering.id}
              meetingTypes={mentor.meetingTypes}
              offering={offering}
              selected={offering.id === selectedOfferingId}
              onSelect={onSelectOffering}
            />
          ))
        ) : (
          <MentorProfileInlineEmpty text='Mentor chưa có môn học đang mở.' />
        )}
      </div>
    </MentorProfileContentSection>
  )
}

type OfferingCardProps = {
  meetingTypes: MentorProfileViewModel['meetingTypes']
  offering: MentorProfileOffering
  onSelect: (id: string) => void
  selected: boolean
}

function OfferingCard({ meetingTypes, offering, onSelect, selected }: OfferingCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition',
        selected
          ? 'border-blue-400 bg-blue-50/70 ring-2 ring-blue-100'
          : 'border-slate-200 bg-slate-50'
      )}
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='min-w-0'>
          <p className='text-ink font-bold'>
            {offering.subject} · {offering.grade}
          </p>
          <p className='text-muted mt-1 text-sm leading-relaxed'>{offering.teachingNote}</p>
          <div className='mt-2 flex flex-wrap gap-2'>
            <Badge variant='outline'>{formatProficiency(offering.proficiency)}</Badge>
            {meetingTypes.map((type) => (
              <Badge key={type} variant='outline'>
                {formatMeetingTypeLabel(type)}
              </Badge>
            ))}
          </div>
        </div>
        <div className='flex shrink-0 items-center justify-between gap-4 sm:flex-col sm:items-end'>
          <p className='text-primary text-lg font-bold'>
            {formatPrice(offering.pricePerHour)} / buổi
          </p>
          <Button
            className='rounded-xl'
            type='button'
            variant={selected ? 'default' : 'outline'}
            onClick={() => onSelect(offering.id)}
          >
            {selected ? 'Đã chọn' : 'Chọn môn này'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function formatProficiency(value: MentorProfileOffering['proficiency']) {
  if (value === 'BASIC') return 'Cơ bản'
  if (value === 'INTERMEDIATE') return 'Trung cấp'
  if (value === 'ADVANCED') return 'Nâng cao'
  return 'Chuyên sâu'
}
