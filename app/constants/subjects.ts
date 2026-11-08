import type { Subject } from '@/types/models/subject'

export type SubjectPreview = Subject & {
  icon: string
  description: string
}

export const subjects: SubjectPreview[] = [
  {
    id: 'math',
    name: 'Toán',
    icon: 'Sigma',
    grades: ['Lớp 6-9', 'THPT', 'Ôn thi'],
    description: 'Củng cố nền tảng, luyện đề và tư duy giải bài.'
  },
  {
    id: 'english',
    name: 'Tiếng Anh',
    icon: 'BookOpen',
    grades: ['THCS', 'THPT', 'IELTS Foundation'],
    description: 'Ngữ pháp, giao tiếp, đọc hiểu và mục tiêu IELTS nền tảng.'
  },
  {
    id: 'physics',
    name: 'Vật lý',
    icon: 'Atom',
    grades: ['Lớp 10', 'Lớp 11', 'Lớp 12'],
    description: 'Hiểu bản chất công thức và luyện bài theo chuyên đề.'
  },
  {
    id: 'chemistry',
    name: 'Hóa học',
    icon: 'FlaskConical',
    grades: ['Lớp 8-9', 'THPT'],
    description: 'Mất gốc, cân bằng phản ứng, bài tập tính toán.'
  },
  {
    id: 'literature',
    name: 'Ngữ văn',
    icon: 'PenLine',
    grades: ['THCS', 'THPT', 'Ôn thi'],
    description: 'Đọc hiểu, nghị luận và cách triển khai dàn ý rõ ràng.'
  },
  {
    id: 'coding',
    name: 'Lập trình',
    icon: 'Code2',
    grades: ['THCS', 'THPT', 'Người mới bắt đầu'],
    description: 'Python, tư duy thuật toán và dự án nhỏ cho học sinh.'
  },
  {
    id: 'biology',
    name: 'Sinh học',
    icon: 'Dna',
    grades: ['THCS', 'THPT'],
    description: 'Khái niệm nền tảng, sơ đồ hóa kiến thức và luyện câu hỏi.'
  },
  {
    id: 'exam-prep',
    name: 'Ôn thi',
    icon: 'ClipboardCheck',
    grades: ['Chuyển cấp', 'Tốt nghiệp', 'Đại học'],
    description: 'Lộ trình theo mục tiêu điểm số, thời gian và năng lực hiện tại.'
  }
]
