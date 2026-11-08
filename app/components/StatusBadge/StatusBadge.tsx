import { AlertTriangle, CheckCircle2, Clock, ShieldAlert, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { BOOKING_STATUS_CONFIG } from '@/constants/booking-status'
import type { BookingStatus, PaymentStatus } from '@/types/models/booking'
import type { MentorApprovalStatus, MentorVerificationStatus } from '@/types/models/mentor'
import type { UserStatus } from '@/types/models/user'
import { cn } from '@/utils/cn'

type StatusBadgeKind = 'booking' | 'payment' | 'approval' | 'verification' | 'user'
type StatusBadgeValue =
  | BookingStatus
  | PaymentStatus
  | MentorApprovalStatus
  | MentorVerificationStatus
  | UserStatus
  | 'ACTIVE'
  | 'BANNED'
  | 'INACTIVE'

type StatusTone = 'success' | 'warning' | 'danger' | 'info' | 'muted'

type StatusBadgeProps = {
  kind: StatusBadgeKind
  status: StatusBadgeValue
  className?: string
}

const toneVariantMap: Record<StatusTone, 'success' | 'warning' | 'destructive' | 'info' | 'muted'> =
  {
    success: 'success',
    warning: 'warning',
    danger: 'destructive',
    info: 'info',
    muted: 'muted'
  }

const statusConfigMap: Record<
  StatusBadgeKind,
  Partial<Record<StatusBadgeValue, { label: string; tone: StatusTone; icon: typeof CheckCircle2 }>>
> = {
  booking: {
    PENDING: { ...BOOKING_STATUS_CONFIG.PENDING, icon: Clock },
    CONFIRMED: { ...BOOKING_STATUS_CONFIG.CONFIRMED, icon: CheckCircle2 },
    COMPLETED: { ...BOOKING_STATUS_CONFIG.COMPLETED, icon: CheckCircle2 },
    CANCELLED: { ...BOOKING_STATUS_CONFIG.CANCELLED, icon: XCircle },
    REJECTED: { ...BOOKING_STATUS_CONFIG.REJECTED, icon: XCircle },
    NO_SHOW: { ...BOOKING_STATUS_CONFIG.NO_SHOW, icon: AlertTriangle }
  },
  payment: {
    PENDING: { label: 'Chờ thanh toán', tone: 'warning', icon: Clock },
    PAID: { label: 'Đã thanh toán', tone: 'success', icon: CheckCircle2 },
    FAILED: { label: 'Thanh toán lỗi', tone: 'danger', icon: AlertTriangle },
    CANCELLED: { label: 'Đã hủy', tone: 'muted', icon: XCircle },
    REFUNDED: { label: 'Đã hoàn tiền', tone: 'info', icon: CheckCircle2 }
  },
  approval: {
    DRAFT: { label: 'Bản nháp', tone: 'muted', icon: Clock },
    PENDING: { label: 'Chờ duyệt', tone: 'warning', icon: Clock },
    APPROVED: { label: 'Đã duyệt', tone: 'success', icon: CheckCircle2 },
    REJECTED: { label: 'Từ chối', tone: 'danger', icon: XCircle },
    SUSPENDED: { label: 'Tạm dừng', tone: 'danger', icon: ShieldAlert }
  },
  verification: {
    UNVERIFIED: { label: 'Chưa xác minh', tone: 'muted', icon: ShieldAlert },
    PENDING: { label: 'Đang xác minh', tone: 'warning', icon: Clock },
    VERIFIED: { label: 'Đã xác minh', tone: 'success', icon: CheckCircle2 },
    REJECTED: { label: 'Xác minh lỗi', tone: 'danger', icon: XCircle }
  },
  user: {
    ACTIVE: { label: 'Đang hoạt động', tone: 'success', icon: CheckCircle2 },
    INACTIVE: { label: 'Không hoạt động', tone: 'muted', icon: Clock },
    BANNED: { label: 'Đã khóa', tone: 'danger', icon: ShieldAlert }
  }
}

export function StatusBadge({ className, kind, status }: StatusBadgeProps) {
  const config = statusConfigMap[kind][status] ?? {
    label: String(status),
    tone: 'muted' as StatusTone,
    icon: Clock
  }
  const Icon = config.icon

  return (
    <Badge className={cn('gap-1.5', className)} variant={toneVariantMap[config.tone]}>
      <Icon aria-hidden='true' size={13} />
      {config.label}
    </Badge>
  )
}
