import type { Booking, BookingStatus, PaymentStatus } from '@/types/models/booking'

type LearnerBookingAction = {
  label: string
  variant: 'primary' | 'secondary'
}

export type LearnerBookingItem = Booking & {
  summary: string
  primaryAction: LearnerBookingAction
  secondaryAction: LearnerBookingAction
}

export type LearnerProfileDraft = {
  fullName: string
  email: string
  phone: string
  gender: string
  birthYear: string
  schoolName: string
  grade: string
  learningGoal: string
}

export const learnerBookings: LearnerBookingItem[] = [
  {
    id: 'booking-1',
    snapshot: {
      learnerName: 'Minh Khôi',
      mentorName: 'Nguyễn Minh Anh',
      subjectName: 'Toán',
      gradeName: 'Lớp 9',
      pricePerHour: 280000
    },
    bookingDate: '2026-06-11',
    startTime: '14:00',
    endTime: '15:30',
    meetingType: 'ONLINE',
    bookingStatus: 'CONFIRMED' satisfies BookingStatus,
    paymentStatus: 'PAID' satisfies PaymentStatus,
    totalAmount: 420000,
    meetingLink: 'https://meet.google.com/example',
    summary: 'Ôn hệ phương trình và luyện đề kiểm tra 45 phút.',
    primaryAction: { label: 'Vào buổi học', variant: 'primary' },
    secondaryAction: { label: 'Xem chi tiết', variant: 'secondary' }
  },
  {
    id: 'booking-2',
    snapshot: {
      learnerName: 'Minh Khôi',
      mentorName: 'Trần Quốc Huy',
      subjectName: 'IELTS',
      gradeName: 'Foundation',
      pricePerHour: 320000
    },
    bookingDate: '2026-06-12',
    startTime: '19:30',
    endTime: '20:30',
    meetingType: 'ONLINE',
    bookingStatus: 'PENDING' satisfies BookingStatus,
    paymentStatus: 'PENDING' satisfies PaymentStatus,
    totalAmount: 320000,
    meetingLink: 'https://zoom.us/example',
    summary: 'Chờ thanh toán để mentor giữ chỗ speaking foundation.',
    primaryAction: { label: 'Thanh toán', variant: 'primary' },
    secondaryAction: { label: 'Xem chi tiết', variant: 'secondary' }
  },
  {
    id: 'booking-3',
    snapshot: {
      learnerName: 'Minh Khôi',
      mentorName: 'Lê Thu Hà',
      subjectName: 'Vật lý',
      gradeName: 'Lớp 11',
      pricePerHour: 260000
    },
    bookingDate: '2026-06-02',
    startTime: '09:00',
    endTime: '10:30',
    meetingType: 'HYBRID',
    bookingStatus: 'COMPLETED' satisfies BookingStatus,
    paymentStatus: 'PAID' satisfies PaymentStatus,
    totalAmount: 390000,
    meetingAddress: 'Quận 7, TP.HCM',
    summary: 'Buổi học hoàn tất, có thể để lại đánh giá cho mentor.',
    primaryAction: { label: 'Đánh giá buổi học', variant: 'primary' },
    secondaryAction: { label: 'Xem chi tiết', variant: 'secondary' }
  },
  {
    id: 'booking-4',
    snapshot: {
      learnerName: 'Minh Khôi',
      mentorName: 'Nguyễn Minh Anh',
      subjectName: 'Toán',
      gradeName: 'Lớp 8',
      pricePerHour: 240000
    },
    bookingDate: '2026-05-28',
    startTime: '18:00',
    endTime: '19:00',
    meetingType: 'ONLINE',
    bookingStatus: 'CANCELLED' satisfies BookingStatus,
    paymentStatus: 'REFUNDED' satisfies PaymentStatus,
    totalAmount: 240000,
    summary: 'Buổi học đã được hủy và học phí đã hoàn lại.',
    primaryAction: { label: 'Đặt lại buổi học', variant: 'secondary' },
    secondaryAction: { label: 'Xem chi tiết', variant: 'secondary' }
  },
  {
    id: 'booking-5',
    snapshot: {
      learnerName: 'Minh Khôi',
      mentorName: 'Trần Quốc Huy',
      subjectName: 'Tiếng Anh',
      gradeName: 'Lớp 12',
      pricePerHour: 300000
    },
    bookingDate: '2026-05-24',
    startTime: '20:00',
    endTime: '21:30',
    meetingType: 'ONLINE',
    bookingStatus: 'NO_SHOW' satisfies BookingStatus,
    paymentStatus: 'PAID' satisfies PaymentStatus,
    totalAmount: 450000,
    summary: 'Buổi học không diễn ra như dự kiến, cần xem lại ghi chú với mentor.',
    primaryAction: { label: 'Xem ghi chú', variant: 'secondary' },
    secondaryAction: { label: 'Liên hệ mentor', variant: 'secondary' }
  }
]

export const learnerProfileDraft: LearnerProfileDraft = {
  fullName: 'Minh Khôi',
  email: 'minhkhoi@example.com',
  phone: '0901 234 567',
  gender: 'Nam',
  birthYear: '2009',
  schoolName: 'THCS Nguyễn Du',
  grade: 'Lớp 9',
  learningGoal:
    'Củng cố nền tảng Toán để tự tin hơn trước kỳ thi vào lớp 10, đồng thời duy trì lịch học tiếng Anh đều mỗi tuần.'
}
