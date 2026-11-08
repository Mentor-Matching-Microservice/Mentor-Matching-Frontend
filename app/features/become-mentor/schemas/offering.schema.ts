import { z } from 'zod'

import { createRequiredStringSchema } from '@/schemas/common.schema'

export const becomeMentorOfferingSchema = z.object({
  gradeId: createRequiredStringSchema('Vui lòng chọn cấp lớp'),
  subjectGradeId: createRequiredStringSchema('Vui lòng chọn tổ hợp môn học và cấp lớp hợp lệ'),
  subjectId: createRequiredStringSchema('Vui lòng chọn môn học'),
  teachingNote: createRequiredStringSchema('Vui lòng nhập mô tả ngắn về môn học'),
  pricePerHour: createRequiredStringSchema('Vui lòng nhập học phí mỗi giờ')
})

export type BecomeMentorOfferingFormValues = z.infer<typeof becomeMentorOfferingSchema>
