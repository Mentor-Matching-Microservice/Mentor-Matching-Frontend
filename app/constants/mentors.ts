import type { Mentor } from '@/types/models/mentor'

export const mentors: Mentor[] = [
  {
    id: 'nguyen-minh-anh',
    name: 'Nguyễn Minh Anh',
    headline: 'Mentor Toán THCS, luyện nền tảng và tư duy giải bài',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    reviewsCount: 112,
    responseTime: 'Trong 1 giờ',
    activeStudentsCount: 186,
    startingPrice: 280000,
    expertise: 'Toán THCS và ôn thi chuyển cấp',
    highlights: ['Toán lớp 8-9', 'Ôn thi lớp 10', 'Học online'],
    introduction:
      'Minh Anh giúp học viên mất gốc Toán xây lại nền tảng, luyện phương pháp trình bày và bám sát mục tiêu kiểm tra hoặc thi chuyển cấp.',
    subjects: ['Toán'],
    grades: ['Lớp 8', 'Lớp 9', 'Ôn thi lớp 10'],
    meetingTypes: ['ONLINE', 'HYBRID'],
    availabilitySummary: 'Tối Thứ 2, Thứ 4 và sáng Chủ nhật',
    teachingStyle:
      'Chẩn đoán lỗ hổng trước, chia bài theo mục tiêu tuần, giao bài ngắn sau mỗi buổi và phản hồi rõ phần cần sửa.',
    achievements: [
      'Theo sát học viên mất gốc và ôn thi chuyển cấp',
      'Có báo cáo ngắn sau từng buổi cho phụ huynh',
      'Ưu tiên mục tiêu điểm số và kỹ năng trình bày'
    ],
    offerings: [
      {
        id: 'math-grade-9-foundation',
        subject: 'Toán',
        grade: 'Lớp 9',
        proficiency: 'ADVANCED',
        pricePerHour: 280000,
        active: true,
        teachingNote: 'Tập trung đại số, hình học và đề chuyển cấp.'
      },
      {
        id: 'math-grade-8-foundation',
        subject: 'Toán',
        grade: 'Lớp 8',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 240000,
        active: true,
        teachingNote: 'Củng cố nền tảng và thói quen làm bài.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Thứ 2',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Thứ 4',
        startTime: '19:00',
        endTime: '21:30',
        meetingTypes: ['ONLINE', 'HYBRID']
      },
      {
        dayLabel: 'Chủ nhật',
        startTime: '08:00',
        endTime: '11:00',
        meetingTypes: ['ONLINE', 'HYBRID']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '12/06',
        startTime: '19:30',
        endTime: '21:00',
        meetingTypes: ['ONLINE'],
        note: 'Tăng cường trước kỳ kiểm tra giữa kỳ'
      },
      {
        dateLabel: '16/06',
        startTime: '08:30',
        endTime: '10:00',
        meetingTypes: ['HYBRID']
      }
    ],
    experience: [
      {
        title: 'Mentor Toán cá nhân',
        company: 'Mentor Matching',
        period: '2021 - nay'
      },
      {
        title: 'Giáo viên Toán',
        company: 'Trung tâm Bright Math',
        period: '2018 - 2021'
      }
    ],
    education: [
      {
        degree: 'Cử nhân Sư phạm Toán',
        school: 'Đại học Sư phạm TP.HCM'
      }
    ],
    reviews: [
      {
        name: 'Phụ huynh bé An',
        rating: 5,
        text: 'Mentor chỉ ra đúng phần con bị hổng và chia bài rất vừa sức. Sau 6 tuần con tự tin hơn hẳn.',
        tags: ['Tiến bộ rõ ràng', 'Phản hồi đều cho phụ huynh']
      },
      {
        name: 'Minh K.',
        rating: 5,
        text: 'Cách giải thích dễ hiểu, có checklist lỗi sai sau mỗi buổi nên em biết cần luyện gì.',
        tags: ['Dễ hiểu', 'Bám sát mục tiêu thi']
      }
    ]
  },
  {
    id: 'tran-quoc-huy',
    name: 'Trần Quốc Huy',
    headline: 'Mentor Tiếng Anh giao tiếp và IELTS nền tảng',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
    reviewsCount: 86,
    responseTime: 'Trong 2 giờ',
    activeStudentsCount: 142,
    startingPrice: 320000,
    expertise: 'Tiếng Anh THPT, IELTS 5.0-6.5',
    highlights: ['IELTS cơ bản', 'Tiếng Anh THPT', 'Online'],
    introduction:
      'Quốc Huy xây lộ trình học tiếng Anh theo mục tiêu cụ thể: cải thiện điểm trên lớp, luyện nói tự tin hoặc chuẩn bị IELTS mức nền tảng.',
    subjects: ['Tiếng Anh'],
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12', 'IELTS Foundation'],
    meetingTypes: ['ONLINE'],
    availabilitySummary: 'Tối các ngày trong tuần',
    teachingStyle:
      'Kết hợp sửa phát âm, luyện phản xạ ngắn, từ vựng theo chủ đề và bài tập nghe-nói sau buổi học.',
    achievements: [
      'Thiết kế lộ trình theo mục tiêu điểm và kỹ năng',
      'Phản hồi phát âm ngay trong buổi học',
      'Phù hợp học viên cần tăng phản xạ giao tiếp'
    ],
    offerings: [
      {
        id: 'english-grade-12-exam',
        subject: 'Tiếng Anh',
        grade: 'Lớp 12',
        proficiency: 'ADVANCED',
        pricePerHour: 300000,
        active: true,
        teachingNote: 'Ôn ngữ pháp, đọc hiểu và chiến thuật làm đề.'
      },
      {
        id: 'ielts-foundation',
        subject: 'IELTS',
        grade: 'Foundation',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 320000,
        active: true,
        teachingNote: 'Lộ trình cho mục tiêu 5.0-6.5.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Thứ 3',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Thứ 5',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Thứ 7',
        startTime: '09:00',
        endTime: '11:30',
        meetingTypes: ['ONLINE']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '13/06',
        startTime: '20:00',
        endTime: '21:30',
        meetingTypes: ['ONLINE'],
        note: 'Có thể thêm buổi speaking thử'
      }
    ],
    experience: [
      {
        title: 'IELTS Mentor',
        company: 'English Pathway',
        period: '2020 - nay'
      },
      {
        title: 'Trợ giảng Tiếng Anh',
        company: 'Đại học Ngoại ngữ',
        period: '2018 - 2020'
      }
    ],
    education: [
      {
        degree: 'Cử nhân Ngôn ngữ Anh',
        school: 'Đại học Khoa học Xã hội và Nhân văn'
      }
    ],
    reviews: [
      {
        name: 'Lan N.',
        rating: 5,
        text: 'Mỗi buổi đều có mục tiêu rõ, sửa lỗi phát âm rất kỹ và bài tập không bị quá tải.',
        tags: ['Lộ trình rõ', 'Phù hợp học nền tảng']
      }
    ]
  },
  {
    id: 'le-thu-ha',
    name: 'Lê Thu Hà',
    headline: 'Mentor Vật lý THPT, học qua ví dụ thực tế',
    approvalStatus: 'APPROVED',
    verificationStatus: 'VERIFIED',
    rating: 4.7,
    reviewsCount: 64,
    responseTime: 'Trong 3 giờ',
    activeStudentsCount: 98,
    startingPrice: 260000,
    expertise: 'Vật lý lớp 10-12',
    highlights: ['Vật lý THPT', 'Mất gốc', 'Hybrid'],
    introduction:
      'Thu Hà giúp học viên hiểu bản chất công thức qua ví dụ gần gũi, sau đó luyện dạng bài theo mức độ từ cơ bản đến nâng cao.',
    subjects: ['Vật lý'],
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    meetingTypes: ['HYBRID', 'OFFLINE'],
    availabilitySummary: 'Chiều Thứ 7 và Chủ nhật tại Quận 7 hoặc online',
    teachingStyle:
      'Dạy theo sơ đồ khái niệm, ví dụ đời sống và bài luyện theo cấp độ để học viên nắm chắc vì sao dùng công thức.',
    achievements: [
      'Dùng sơ đồ khái niệm để giảm học vẹt',
      'Có thể học offline tại Quận 7',
      'Phù hợp học viên cần hiểu bản chất công thức'
    ],
    offerings: [
      {
        id: 'physics-grade-11',
        subject: 'Vật lý',
        grade: 'Lớp 11',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 260000,
        active: true,
        teachingNote: 'Điện học, quang học và bài tập vận dụng.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Thứ 7',
        startTime: '14:00',
        endTime: '17:30',
        meetingTypes: ['OFFLINE', 'HYBRID']
      },
      {
        dayLabel: 'Chủ nhật',
        startTime: '15:00',
        endTime: '18:00',
        meetingTypes: ['ONLINE', 'HYBRID']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '15/06',
        startTime: '19:00',
        endTime: '20:30',
        meetingTypes: ['ONLINE']
      }
    ],
    experience: [
      {
        title: 'Mentor Vật lý',
        company: 'STEM Lab Sài Gòn',
        period: '2019 - nay'
      }
    ],
    education: [
      {
        degree: 'Thạc sĩ Vật lý ứng dụng',
        school: 'Đại học Khoa học Tự nhiên'
      }
    ],
    reviews: [
      {
        name: 'Quang P.',
        rating: 5,
        text: 'Cô giải thích công thức bằng ví dụ nên em dễ nhớ hơn, không còn học thuộc máy móc.',
        tags: ['Hiểu bản chất', 'Ví dụ thực tế']
      }
    ]
  },
  {
    id: 'pham-gia-bao',
    name: 'Phạm Gia Bảo',
    headline: 'Mentor lập trình Python cho học sinh mới bắt đầu',
    approvalStatus: 'PENDING',
    verificationStatus: 'PENDING',
    rating: 4.6,
    reviewsCount: 51,
    responseTime: 'Trong 4 giờ',
    activeStudentsCount: 74,
    startingPrice: 300000,
    expertise: 'Python cơ bản và tư duy thuật toán',
    highlights: ['Python', 'Tin học', 'Dự án nhỏ'],
    introduction:
      'Gia Bảo hướng dẫn học sinh làm quen với Python qua bài tập trực quan, mini project và cách debug từng bước.',
    subjects: ['Lập trình'],
    grades: ['THCS', 'THPT', 'Người mới bắt đầu'],
    meetingTypes: ['ONLINE'],
    availabilitySummary: 'Tối Thứ 3, Thứ 5 và Chủ nhật',
    teachingStyle:
      'Học qua mini project, giải thích lỗi trực tiếp và dùng bài tập ngắn để hình thành tư duy thuật toán.',
    achievements: [
      'Phù hợp học sinh mới bắt đầu lập trình',
      'Có mini project sau từng chặng',
      'Đang chờ hoàn tất duyệt hồ sơ'
    ],
    offerings: [
      {
        id: 'python-beginner',
        subject: 'Lập trình Python',
        grade: 'Người mới bắt đầu',
        proficiency: 'INTERMEDIATE',
        pricePerHour: 300000,
        active: true,
        teachingNote: 'Biến, vòng lặp, hàm, cấu trúc dữ liệu và mini project.'
      }
    ],
    recurringAvailability: [
      {
        dayLabel: 'Thứ 3',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Thứ 5',
        startTime: '19:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE']
      },
      {
        dayLabel: 'Chủ nhật',
        startTime: '09:00',
        endTime: '11:30',
        meetingTypes: ['ONLINE']
      }
    ],
    specificDateAvailability: [
      {
        dateLabel: '18/06',
        startTime: '20:00',
        endTime: '21:00',
        meetingTypes: ['ONLINE'],
        note: 'Lịch sẽ mở rộng sau khi được duyệt'
      }
    ],
    experience: [
      {
        title: 'Mentor lập trình thiếu niên',
        company: 'Code Starter',
        period: '2022 - nay'
      }
    ],
    education: [
      {
        degree: 'Kỹ sư Công nghệ thông tin',
        school: 'Đại học Bách khoa TP.HCM'
      }
    ],
    reviews: [
      {
        name: 'Phụ huynh Minh T.',
        rating: 4,
        text: 'Buổi học vui, có sản phẩm nhỏ sau mỗi chặng nên con có động lực tiếp tục.',
        tags: ['Có mini project', 'Dễ tạo hứng thú']
      }
    ]
  }
]
