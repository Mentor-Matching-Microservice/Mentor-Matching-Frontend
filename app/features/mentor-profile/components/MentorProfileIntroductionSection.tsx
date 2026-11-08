import { Badge } from '@/components/ui/badge'
import { MentorProfileContentSection } from '@/features/mentor-profile/components/MentorProfilePageShell'
import type { MentorProfileViewModel } from '@/features/mentor-profile/mentor-profile.mapper'

type MentorProfileIntroductionSectionProps = {
  mentor: MentorProfileViewModel
}

export function MentorProfileIntroductionSection({
  mentor
}: MentorProfileIntroductionSectionProps) {
  return (
    <MentorProfileContentSection id='introduction' title='Giới thiệu ngắn'>
      <p className='text-muted text-sm leading-7'>{mentor.introduction}</p>
      {mentor.highlights.length ? (
        <div className='mt-4 flex flex-wrap gap-2'>
          {mentor.highlights.slice(0, 5).map((highlight) => (
            <Badge key={highlight} variant='muted'>
              {highlight}
            </Badge>
          ))}
        </div>
      ) : null}
    </MentorProfileContentSection>
  )
}
