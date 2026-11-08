import { mentors } from '@/constants/mentors'
import type {
  Mentor,
  MentorOffering,
  MentorOfferingProficiency,
  SpecificDateAvailabilityWindow,
  WeeklyAvailabilityWindow
} from '@/types/models/mentor'
import type { BookingStatus, PaymentStatus } from '@/types/models/booking'

type MentorWorkspaceAction = {
  label: string
  href?: string
  variant: 'primary' | 'secondary'
}

export type MentorUpcomingSession = {
  id: string
  studentName: string
  subject: string
  grade: string
  bookingDate: string
  startTime: string
  endTime: string
  meetingType: Mentor['meetingTypes'][number]
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  prepNote: string
  action: MentorWorkspaceAction
}

export type MentorStudentRecord = {
  id: string
  studentName: string
  learnerGoal: string
  recentOffering: string
  bookingCount: number
  bookingStatus: BookingStatus
  nextSession?: {
    bookingDate: string
    startTime: string
    endTime: string
  }
  recentSummary: string
}

export type MentorEarningsTransaction = {
  id: string
  label: string
  detail: string
  amount: number
  paymentStatus: PaymentStatus
  bookedAt: string
}

export type MentorProfileChecklistItem = {
  label: string
  done: boolean
  helper: string
}

const mentorProfile = mentors.find((mentor) => mentor.id === 'nguyen-minh-anh') ?? mentors[0]

const buildOfferingLabel = (offering: MentorOffering) => `${offering.subject} · ${offering.grade}`

export const mentorWorkspaceProfile = mentorProfile

export const mentorWorkspaceSummary = [
  {
    label: 'Buổi dạy sắp tới',
    value: '6',
    helper: 'Bao gồm lịch đã xác nhận và một buổi chờ học viên thanh toán'
  },
  {
    label: 'Học viên đang theo học',
    value: '14',
    helper: 'Tính theo học viên có buổi trong 30 ngày gần nhất'
  },
  {
    label: 'Thu nhập chờ về',
    value: '4,2 triệu',
    helper: 'Các buổi đã hoàn thành, đang chờ đối soát và chi trả'
  }
] as const

export const mentorUpcomingSessions: MentorUpcomingSession[] = [
  {
    id: 'mentor-session-1',
    studentName: 'Minh Khôi',
    subject: 'Toán',
    grade: 'Lớp 9',
    bookingDate: '2026-06-11',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    prepNote: 'Ôn hệ phương trình và chốt checklist lỗi sai trước bài kiểm tra 45 phút.',
    action: { label: 'Vào buổi học', variant: 'primary' }
  },
  {
    id: 'mentor-session-2',
    studentName: 'Ngọc Linh',
    subject: 'Toán',
    grade: 'Lớp 8',
    bookingDate: '2026-06-12',
    startTime: '19:00',
    endTime: '20:00',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED',
    paymentStatus: 'PAID',
    prepNote: 'Kiểm tra bài tập về phân tích đa thức và giao thêm 2 câu luyện tự làm.',
    action: { label: 'Mở ghi chú', variant: 'secondary' }
  },
  {
    id: 'mentor-session-3',
    studentName: 'Gia Hân',
    subject: 'Toán',
    grade: 'Ôn thi lớp 10',
    bookingDate: '2026-06-13',
    startTime: '08:30',
    endTime: '10:00',
    meetingType: 'HYBRID',
    bookingStatus: 'PENDING',
    paymentStatus: 'PENDING',
    prepNote:
      'Giữ chỗ tạm thời, chờ học viên hoàn tất thanh toán để xác nhận buổi chuyên đề hình học.',
    action: { label: 'Theo dõi thanh toán', variant: 'secondary' }
  }
]

export const mentorRecurringAvailability: WeeklyAvailabilityWindow[] =
  mentorProfile.recurringAvailability

export const mentorSpecificDateAvailability: SpecificDateAvailabilityWindow[] =
  mentorProfile.specificDateAvailability

export const mentorScheduleNotes = [
  'Khung giờ lặp lại dùng cho lịch dạy cố định mỗi tuần, phù hợp học viên học đều và phụ huynh cần lịch ổn định.',
  'Khung giờ theo ngày cụ thể dùng cho tăng cường trước kiểm tra, đổi lịch tuần đó hoặc mở thêm ca ngắn hạn.',
  'Buổi đã được đặt cần theo dõi riêng với availability để tránh hiểu availability là lịch đã chốt.'
] as const

export const mentorStudents: MentorStudentRecord[] = [
  {
    id: 'student-1',
    studentName: 'Minh Khôi',
    learnerGoal: 'Củng cố đại số lớp 9 và tự tin hơn trước kỳ thi vào lớp 10.',
    recentOffering: 'Toán · Lớp 9',
    bookingCount: 8,
    bookingStatus: 'CONFIRMED',
    nextSession: {
      bookingDate: '2026-06-11',
      startTime: '14:00',
      endTime: '15:30'
    },
    recentSummary: 'Đã hoàn thành 6 buổi, tiến bộ rõ ở phần trình bày và kiểm tra nháp.'
  },
  {
    id: 'student-2',
    studentName: 'Ngọc Linh',
    learnerGoal: 'Giữ nền tảng Toán lớp 8 ổn định và giảm lỗi sai cơ bản.',
    recentOffering: 'Toán · Lớp 8',
    bookingCount: 5,
    bookingStatus: 'CONFIRMED',
    nextSession: {
      bookingDate: '2026-06-12',
      startTime: '19:00',
      endTime: '20:00'
    },
    recentSummary: 'Cần gửi lại ảnh bài làm trước buổi sau để chốt phần phân tích đa thức.'
  },
  {
    id: 'student-3',
    studentName: 'Gia Hân',
    learnerGoal: 'Luyện chuyên đề hình học trước kỳ thi thử đầu tháng.',
    recentOffering: 'Toán · Ôn thi lớp 10',
    bookingCount: 1,
    bookingStatus: 'PENDING',
    nextSession: {
      bookingDate: '2026-06-13',
      startTime: '08:30',
      endTime: '10:00'
    },
    recentSummary: 'Mới đặt buổi đầu tiên, đang chờ thanh toán để chốt tài liệu và địa điểm.'
  },
  {
    id: 'student-4',
    studentName: 'Bảo Nam',
    learnerGoal: 'Ôn lại nền tảng hình học sau khi nghỉ học 2 tuần.',
    recentOffering: 'Toán · Lớp 8',
    bookingCount: 3,
    bookingStatus: 'COMPLETED',
    recentSummary: 'Đã hoàn thành buổi gần nhất, đang chờ phụ huynh xác nhận lịch học tiếp theo.'
  }
]

export const mentorEarningsSummary = {
  availableBalance: 12500000,
  pendingPayout: 4200000,
  projectedThisMonth: 8700000,
  completedSessionsThisMonth: 18,
  platformFeeRate: '5%',
  payoutWindow: 'Đối soát vào ngày 15 hằng tháng cho các buổi đã hoàn thành.'
} as const

export const mentorEarningsTransactions: MentorEarningsTransaction[] = [
  {
    id: 'txn-1',
    label: 'Buổi Toán lớp 9 · Minh Khôi',
    detail: 'Buổi học ngày 08/06 · Sau phí nền tảng',
    amount: 399000,
    paymentStatus: 'PAID',
    bookedAt: '2026-06-08'
  },
  {
    id: 'txn-2',
    label: 'Buổi Toán lớp 8 · Ngọc Linh',
    detail: 'Đã hoàn thành, chờ đối soát kỳ chi trả tiếp theo',
    amount: 228000,
    paymentStatus: 'PENDING',
    bookedAt: '2026-06-09'
  },
  {
    id: 'txn-3',
    label: 'Hoàn tiền buổi hủy · Phụ huynh Bảo Nam',
    detail: 'Buổi 28/05 đã hủy, hoàn lại học phí cho học viên',
    amount: -240000,
    paymentStatus: 'REFUNDED',
    bookedAt: '2026-05-28'
  },
  {
    id: 'txn-4',
    label: 'Buổi tăng cường chuyên đề',
    detail: 'Thanh toán lỗi, học viên chưa giữ chỗ thành công',
    amount: 320000,
    paymentStatus: 'FAILED',
    bookedAt: '2026-06-10'
  }
]

export const mentorProfileChecklist: MentorProfileChecklistItem[] = [
  {
    label: 'Giới thiệu và phong cách dạy',
    done: Boolean(mentorProfile.introduction && mentorProfile.teachingStyle),
    helper: 'Giúp học viên hiểu mentor dạy theo nhịp nào và phù hợp với ai.'
  },
  {
    label: 'Offerings theo môn và lớp',
    done: mentorProfile.offerings.some((offering) => offering.active),
    helper: 'Ưu tiên mô tả rõ subject, grade, mức độ và học phí.'
  },
  {
    label: 'Xác minh và duyệt hồ sơ',
    done:
      mentorProfile.approvalStatus === 'APPROVED' &&
      mentorProfile.verificationStatus === 'VERIFIED',
    helper: 'Cần hiển thị trung thực để phụ huynh và học viên yên tâm đặt lịch.'
  }
]

export const mentorProfileHighlights = [
  'Ưu tiên giữ offerings gọn, rõ mức giá và phạm vi lớp để học viên chọn nhanh hơn.',
  'Teaching content trong milestone này là giao diện tĩnh, chưa thay thế workflow chỉnh sửa thực trên backend.',
  'Approval và verification được hiển thị riêng để không trộn lẫn quy trình duyệt với mức độ xác minh.'
] as const

export const mentorTeachingContent = [
  {
    title: 'Chuẩn bị trước buổi học',
    description:
      'Gửi checklist ngắn hoặc ảnh bài tập cần xem trước để buổi học đi thẳng vào phần học viên đang vướng.'
  },
  {
    title: 'Trong buổi học',
    description:
      'Mở đầu bằng chẩn đoán nhanh, giải mẫu một dạng then chốt, sau đó để học viên tự làm từng bước với phản hồi trực tiếp.'
  },
  {
    title: 'Sau buổi học',
    description:
      'Tóm tắt 2 đến 3 ý cần nhớ, giao bài vừa sức và ghi chú riêng cho phụ huynh khi cần theo dõi thêm.'
  }
] as const

export const mentorOfferingSummaries = mentorProfile.offerings.map((offering) => ({
  ...offering,
  label: buildOfferingLabel(offering)
}))

export const proficiencyLabelMap: Record<MentorOfferingProficiency, string> = {
  BASIC: 'Cơ bản',
  INTERMEDIATE: 'Trung bình',
  ADVANCED: 'Nâng cao',
  EXPERT: 'Chuyên sâu'
}
