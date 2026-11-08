import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { useAdminMentorDetailQuery } from '@/hooks/queries/admin/useAdminMentorDetailQuery'
import { formatDateTime } from '@/utils/format'

type MentorProfileDetailModalProps = {
  mentorId: number | null
  onOpenChange: (open: boolean) => void
}

function DetailRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className='grid grid-cols-3 gap-3 border-b border-slate-100 py-2.5 text-sm last:border-b-0'>
      <span className='text-muted'>{label}</span>
      <span className='text-ink col-span-2 font-medium'>{value ?? 'Chưa cập nhật'}</span>
    </div>
  )
}

export function MentorProfileDetailModal({ mentorId, onOpenChange }: MentorProfileDetailModalProps) {
  const { data: mentor, isLoading } = useAdminMentorDetailQuery(mentorId)

  if (typeof document === 'undefined' || mentorId === null) return null

  return createPortal(
    <div className='fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/60 p-4'>
      <div className='animate-in fade-in zoom-in relative flex max-h-[85vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.22)] duration-200'>
        <button
          aria-label='Đóng'
          className='absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600'
          onClick={() => onOpenChange(false)}
          type='button'
        >
          <X size={20} />
        </button>

        <div className='overflow-y-auto p-6'>
          {isLoading || !mentor ? (
            <p className='text-muted py-10 text-center text-sm'>Đang tải hồ sơ...</p>
          ) : (
            <>
              <div className='mb-5 flex flex-wrap items-start justify-between gap-3 pr-8'>
                <div>
                  <h3 className='text-ink text-xl font-bold tracking-tight'>{mentor.fullName}</h3>
                  <p className='text-muted mt-1 text-sm'>
                    {mentor.email} · {mentor.phone}
                  </p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <StatusBadge kind='approval' status={mentor.approvalStatus} />
                </div>
              </div>

              <div className='space-y-1 rounded-2xl border border-slate-100 p-4'>
                <DetailRow label='Tiêu đề' value={mentor.headline} />
                <DetailRow label='Vị trí hiện tại' value={mentor.currentPosition} />
                <DetailRow label='Nơi làm việc' value={mentor.workplace} />
                <DetailRow label='Học vấn' value={mentor.education} />
                <DetailRow label='Chuyên ngành' value={mentor.major} />
                <DetailRow label='Số năm kinh nghiệm' value={mentor.experienceYears} />
                <DetailRow label='Hình thức dạy' value={mentor.meetingType} />
                <DetailRow
                  label='Khu vực'
                  value={
                    [mentor.currentLocation.districtName, mentor.currentLocation.cityName]
                      .filter(Boolean)
                      .join(', ') || null
                  }
                />
                <DetailRow label='Ngày nộp hồ sơ' value={formatDateTime(mentor.createdAt)} />
                <DetailRow label='Cập nhật gần nhất' value={formatDateTime(mentor.updatedAt)} />
                {mentor.approvalNote && <DetailRow label='Ghi chú duyệt' value={mentor.approvalNote} />}
              </div>

              {mentor.introduction && (
                <div className='mt-4'>
                  <h4 className='text-ink text-sm font-semibold'>Giới thiệu</h4>
                  <p className='text-muted mt-1 text-sm leading-relaxed'>{mentor.introduction}</p>
                </div>
              )}

              {mentor.teachingStyle && (
                <div className='mt-4'>
                  <h4 className='text-ink text-sm font-semibold'>Phong cách giảng dạy</h4>
                  <p className='text-muted mt-1 text-sm leading-relaxed'>{mentor.teachingStyle}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
