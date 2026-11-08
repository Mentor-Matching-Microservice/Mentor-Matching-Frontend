import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

import { StatusBadge } from '@/components/StatusBadge'
import { useAdminMentorVerificationDetailQuery } from '@/hooks/queries/admin/useAdminMentorVerificationDetailQuery'
import { formatDateTime } from '@/utils/format'

type MentorVerificationDetailModalProps = {
  verificationId: number | null
  onOpenChange: (open: boolean) => void
}

function DocumentPreview({ label, url }: { label: string; url: string | null }) {
  return (
    <div>
      <p className='text-muted mb-1.5 text-sm font-medium'>{label}</p>
      {url ? (
        <a href={url} target='_blank' rel='noreferrer' className='block'>
          <img
            src={url}
            alt={label}
            className='h-40 w-full rounded-xl border border-slate-200 object-cover transition hover:opacity-90'
          />
        </a>
      ) : (
        <div className='text-muted flex h-40 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm'>
          Chưa cung cấp
        </div>
      )}
    </div>
  )
}

export function MentorVerificationDetailModal({
  verificationId,
  onOpenChange
}: MentorVerificationDetailModalProps) {
  const { data: verification, isLoading } = useAdminMentorVerificationDetailQuery(verificationId)

  if (typeof document === 'undefined' || verificationId === null) return null

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
          {isLoading || !verification ? (
            <p className='text-muted py-10 text-center text-sm'>Đang tải giấy tờ...</p>
          ) : (
            <>
              <div className='mb-5 flex flex-wrap items-start justify-between gap-3 pr-8'>
                <div>
                  <h3 className='text-ink text-xl font-bold tracking-tight'>{verification.accountFullName}</h3>
                  <p className='text-muted mt-1 text-sm'>{verification.accountEmail}</p>
                </div>
                <StatusBadge kind='verification' status={verification.verificationStatus} />
              </div>

              <div className='mb-5 space-y-1 rounded-2xl border border-slate-100 p-4 text-sm'>
                <div className='grid grid-cols-3 gap-3 border-b border-slate-100 py-2.5 last:border-b-0'>
                  <span className='text-muted'>Họ tên trên CCCD</span>
                  <span className='text-ink col-span-2 font-medium'>{verification.fullName}</span>
                </div>
                <div className='grid grid-cols-3 gap-3 border-b border-slate-100 py-2.5 last:border-b-0'>
                  <span className='text-muted'>Số CCCD</span>
                  <span className='text-ink col-span-2 font-medium'>
                    {verification.idCardNumber ?? 'Chưa cập nhật'}
                  </span>
                </div>
                <div className='grid grid-cols-3 gap-3 border-b border-slate-100 py-2.5 last:border-b-0'>
                  <span className='text-muted'>Ngày nộp</span>
                  <span className='text-ink col-span-2 font-medium'>
                    {formatDateTime(verification.createdAt)}
                  </span>
                </div>
                {verification.rejectionReason && (
                  <div className='grid grid-cols-3 gap-3 py-2.5'>
                    <span className='text-muted'>Lý do từ chối</span>
                    <span className='text-ink col-span-2 font-medium'>{verification.rejectionReason}</span>
                  </div>
                )}
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <DocumentPreview label='CCCD mặt trước' url={verification.idCardFrontUrl} />
                <DocumentPreview label='CCCD mặt sau' url={verification.idCardBackUrl} />
                <div className='sm:col-span-2'>
                  <DocumentPreview label='Ảnh chân dung cầm CCCD' url={verification.selfieWithIdUrl} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
