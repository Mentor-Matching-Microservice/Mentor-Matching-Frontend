import type { MentorApprovalStatus, MentorVerificationStatus } from '@/types/models/mentor'
import type { UserStatus } from '@/types/models/user'

export type AdminQueueItem = {
  id: string
  mentorName: string
  headline: string
  submittedAtLabel: string
  approvalStatus: MentorApprovalStatus
  verificationStatus: MentorVerificationStatus
  offeringsSummary: string
  note: string
  priority: 'high' | 'medium'
}

export type AdminMentorDirectoryItem = {
  id: string
  mentorName: string
  headline: string
  approvalStatus: MentorApprovalStatus
  verificationStatus: MentorVerificationStatus
  submittedAtLabel: string
  offeringsSummary: string
  activeStudentsCount: number
  ratingLabel: string
  reviewNote: string
}

export type AdminUserRole = 'LEARNER' | 'MENTOR' | 'PARENT' | 'ADMIN'
export type AdminUserType = 'Học viên' | 'Mentor' | 'Phụ huynh' | 'Quản trị'

export type AdminUserRecord = {
  id: string
  fullName: string
  email: string
  role: AdminUserRole
  userType: AdminUserType
  status: UserStatus
  joinedLabel: string
  note: string
}

export type AdminReportStatus = 'NEW' | 'IN_REVIEW' | 'CLOSED'
export type AdminReportSeverity = 'LOW' | 'MEDIUM' | 'HIGH'

export type AdminReportRecord = {
  id: string
  title: string
  reportType: string
  relatedEntity: string
  submittedAtLabel: string
  severity: AdminReportSeverity
  status: AdminReportStatus
  summary: string
}

export type AdminSettingsItem = {
  label: string
  value: string
  supportLabel: 'Đã có quy ước' | 'Cần backend' | 'Chưa hỗ trợ'
}

export type AdminSettingsGroup = {
  id: string
  title: string
  description: string
  items: AdminSettingsItem[]
}

export const adminDashboardSummary = [
  {
    label: 'Hồ sơ mentor chờ duyệt',
    value: '6',
    helper: 'Ưu tiên duyệt các hồ sơ đã đủ giấy tờ để không nghẽn nguồn cung mentor công khai.'
  },
  {
    label: 'Mentor cần rà soát xác minh',
    value: '3',
    helper: 'Bao gồm hồ sơ đã gửi nhưng thiếu bước kiểm tra cuối hoặc cần bổ sung chứng từ.'
  },
  {
    label: 'Báo cáo đang mở',
    value: '4',
    helper:
      'Giữ hàng đợi báo cáo nhỏ để tránh phát sinh khiếu nại chồng chéo từ học viên và phụ huynh.'
  },
  {
    label: 'Tài khoản cần theo dõi',
    value: '5',
    helper: 'Các tài khoản bị khóa, không hoạt động lâu ngày hoặc cần liên hệ xác minh bổ sung.'
  }
] as const

export const adminQueueItems: AdminQueueItem[] = [
  {
    id: 'queue-mentor-1',
    mentorName: 'Nguyễn Văn Nam',
    headline: 'Mentor Toán THPT và ôn thi tốt nghiệp',
    submittedAtLabel: '2 giờ trước',
    approvalStatus: 'PENDING',
    verificationStatus: 'PENDING',
    offeringsSummary: 'Toán lớp 11-12 · 300k/giờ',
    note: 'Thiếu bước đối chiếu giấy tờ tùy thân với video giới thiệu.',
    priority: 'high'
  },
  {
    id: 'queue-mentor-2',
    mentorName: 'Trần Thị Thu',
    headline: 'Mentor Tiếng Anh THCS, luyện giao tiếp',
    submittedAtLabel: '5 giờ trước',
    approvalStatus: 'PENDING',
    verificationStatus: 'VERIFIED',
    offeringsSummary: 'Tiếng Anh lớp 6-9 · 260k/giờ',
    note: 'Đã xác minh xong, cần chốt ghi chú duyệt trước khi hiển thị công khai.',
    priority: 'high'
  },
  {
    id: 'queue-mentor-3',
    mentorName: 'Lê Thùy Linh',
    headline: 'Mentor Ngữ văn THCS, kèm viết đoạn và luyện đọc hiểu',
    submittedAtLabel: 'Hôm qua',
    approvalStatus: 'PENDING',
    verificationStatus: 'REJECTED',
    offeringsSummary: 'Ngữ văn lớp 7-9 · 240k/giờ',
    note: 'Hồ sơ xác minh bị trả lại do ảnh giấy tờ chưa rõ, cần phản hồi cho mentor.',
    priority: 'medium'
  }
]

export const adminMentorDirectory: AdminMentorDirectoryItem[] = [
  {
    id: 'mentor-1',
    mentorName: 'Nguyễn Minh Anh',
    headline: 'Mentor Toán THCS, luyện nền tảng và ôn thi chuyển cấp',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'Cập nhật 2 ngày trước',
    offeringsSummary: 'Toán lớp 8-9 · 280k/giờ',
    activeStudentsCount: 45,
    ratingLabel: '4.9/5',
    reviewNote: 'Hồ sơ ổn định, tỷ lệ giữ lịch tốt và đang có nhiều học viên quay lại.'
  },
  {
    id: 'mentor-2',
    mentorName: 'Trần Quốc Huy',
    headline: 'Mentor Tiếng Anh giao tiếp và IELTS nền tảng',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'Cập nhật 1 tuần trước',
    offeringsSummary: 'IELTS Foundation · 320k/giờ',
    activeStudentsCount: 28,
    ratingLabel: '5.0/5',
    reviewNote: 'Không có cảnh báo vận hành, phù hợp tiếp tục mở rộng lịch dạy.'
  },
  {
    id: 'mentor-3',
    mentorName: 'Phạm Gia Bảo',
    headline: 'Mentor Vật lý THPT, luyện bài tập và chuyên đề điện',
    approvalStatus: 'SUSPENDED',
    verificationStatus: 'VERIFIED',
    submittedAtLabel: 'Tạm dừng 3 ngày trước',
    offeringsSummary: 'Vật lý lớp 11-12 · 310k/giờ',
    activeStudentsCount: 6,
    ratingLabel: '4.7/5',
    reviewNote: 'Đang tạm dừng do cần rà soát phản hồi về việc dời lịch nhiều lần.'
  }
]

export const adminUsers: AdminUserRecord[] = [
  {
    id: 'user-1',
    fullName: 'Nguyễn Thu An',
    email: 'an.nguyen@example.com',
    role: 'LEARNER',
    userType: 'Học viên',
    status: 'ACTIVE',
    joinedLabel: '12/05/2026',
    note: 'Đang có 3 lịch học sắp tới và chưa có cảnh báo vận hành.'
  },
  {
    id: 'user-2',
    fullName: 'Trần Quốc Huy',
    email: 'huy.tran@example.com',
    role: 'MENTOR',
    userType: 'Mentor',
    status: 'ACTIVE',
    joinedLabel: '10/05/2026',
    note: 'Mentor đã duyệt, hồ sơ xác minh đầy đủ và đang dạy đều.'
  },
  {
    id: 'user-3',
    fullName: 'Lê Minh Châu',
    email: 'chau.le@example.com',
    role: 'PARENT',
    userType: 'Phụ huynh',
    status: 'INACTIVE',
    joinedLabel: '01/05/2026',
    note: 'Tạo tài khoản nhưng chưa hoàn tất hồ sơ học viên hoặc đặt lịch đầu tiên.'
  },
  {
    id: 'user-4',
    fullName: 'Phạm Văn Duy',
    email: 'duy.pham@example.com',
    role: 'LEARNER',
    userType: 'Học viên',
    status: 'BANNED',
    joinedLabel: '28/04/2026',
    note: 'Đã khóa tạm thời sau nhiều lần vi phạm quy định liên hệ ngoài nền tảng.'
  },
  {
    id: 'user-5',
    fullName: 'Admin Điều Hành',
    email: 'ops.admin@example.com',
    role: 'ADMIN',
    userType: 'Quản trị',
    status: 'ACTIVE',
    joinedLabel: '15/03/2026',
    note: 'Tài khoản nội bộ dùng để theo dõi duyệt mentor và xử lý báo cáo.'
  }
]

export const adminReports: AdminReportRecord[] = [
  {
    id: 'report-1',
    title: 'Phụ huynh phản ánh mentor dời lịch sát giờ',
    reportType: 'Khiếu nại buổi học',
    relatedEntity: 'Booking #BK-240611-01',
    submittedAtLabel: '35 phút trước',
    severity: 'HIGH',
    status: 'NEW',
    summary:
      'Cần kiểm tra lịch sử đổi lịch và xác nhận với cả hai bên trước khi giữ mentor tiếp tục mở lịch.'
  },
  {
    id: 'report-2',
    title: 'Nội dung hồ sơ mentor chưa khớp giấy tờ xác minh',
    reportType: 'Kiểm tra hồ sơ mentor',
    relatedEntity: 'Mentor Lê Thùy Linh',
    submittedAtLabel: '2 giờ trước',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    summary:
      'Đội vận hành đang yêu cầu mentor bổ sung ảnh giấy tờ và cập nhật phần giới thiệu công khai.'
  },
  {
    id: 'report-3',
    title: 'Học viên báo lỗi thanh toán chưa cập nhật sau buổi học',
    reportType: 'Thanh toán',
    relatedEntity: 'Booking #BK-240609-08',
    submittedAtLabel: 'Hôm qua',
    severity: 'MEDIUM',
    status: 'IN_REVIEW',
    summary:
      'Hiện mới có trạng thái theo dõi nội bộ, chưa có màn hình xử lý thanh toán hoàn chỉnh trong frontend.'
  },
  {
    id: 'report-4',
    title: 'Yêu cầu đóng báo cáo đã xử lý',
    reportType: 'Theo dõi sau xử lý',
    relatedEntity: 'User Nguyen Thu An',
    submittedAtLabel: '2 ngày trước',
    severity: 'LOW',
    status: 'CLOSED',
    summary: 'Báo cáo đã được xác nhận và đóng ở bước vận hành nội bộ.'
  }
]

export const adminSettingsGroups: AdminSettingsGroup[] = [
  {
    id: 'mentor-review',
    title: 'Quy trình duyệt mentor',
    description:
      'Các nguyên tắc vận hành mà đội admin đang áp dụng trước khi mở mentor ra marketplace.',
    items: [
      {
        label: 'Điều kiện hiển thị công khai',
        value: 'Chỉ mentor đã duyệt và đã xác minh mới được lên danh sách công khai.',
        supportLabel: 'Đã có quy ước'
      },
      {
        label: 'Ghi chú duyệt nội bộ',
        value:
          'Hiện vẫn theo dõi bằng quy trình nội bộ, chưa có form backend riêng cho từng bước xử lý.',
        supportLabel: 'Cần backend'
      }
    ]
  },
  {
    id: 'reports-safety',
    title: 'Báo cáo và an toàn nền tảng',
    description:
      'Những điểm đội vận hành cần nhìn thấy rõ để tránh overpromise moderation tooling.',
    items: [
      {
        label: 'Trạng thái báo cáo',
        value:
          'Frontend đang mô tả hàng đợi xử lý, nhưng chưa có workflow đóng/mở báo cáo trực tiếp.',
        supportLabel: 'Chưa hỗ trợ'
      },
      {
        label: 'Escalation mức cao',
        value:
          'Các báo cáo mức cao cần được rà soát thủ công qua đội vận hành trước khi chuẩn hóa thành flow.',
        supportLabel: 'Đã có quy ước'
      }
    ]
  },
  {
    id: 'payment-ops',
    title: 'Thanh toán và đối soát',
    description:
      'Nhóm cài đặt này giữ vai trò định hướng cho giai đoạn UI tĩnh, chưa giả lập cấu hình hoàn chỉnh.',
    items: [
      {
        label: 'Theo dõi thanh toán lỗi',
        value:
          'Có thể hiển thị trạng thái và ghi chú vận hành, nhưng chưa có màn hình cấu hình recovery đầy đủ.',
        supportLabel: 'Cần backend'
      },
      {
        label: 'Lịch đối soát',
        value:
          'Đối soát sau các buổi đã hoàn thành là hướng vận hành hiện tại, cần backend rõ hơn trước khi cho sửa trực tiếp.',
        supportLabel: 'Cần backend'
      }
    ]
  }
]
