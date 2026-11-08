import { z } from 'zod'

import { createRequiredStringSchema } from '@/schemas/common.schema'

export const becomeMentorAvailabilityWindowSchema = z
  .object({
    mode: z.enum(['RECURRING', 'SPECIFIC_DATE']),
    selectedDays: z.array(z.string()),
    specificDate: z.string().trim(),
    startTime: createRequiredStringSchema('Vui lòng chọn giờ bắt đầu'),
    endTime: createRequiredStringSchema('Vui lòng chọn giờ kết thúc')
  })
  .superRefine((value, context) => {
    if (value.mode === 'RECURRING' && value.selectedDays.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['selectedDays'],
        message: 'Vui lòng chọn ít nhất một ngày trong tuần'
      })
    }

    if (value.mode === 'SPECIFIC_DATE' && !value.specificDate) {
      context.addIssue({
        code: 'custom',
        path: ['specificDate'],
        message: 'Vui lòng chọn ngày cụ thể'
      })
    }
  })

export const becomeMentorAvailabilitySchema = z.object({
  availabilities: z
    .array(becomeMentorAvailabilityWindowSchema)
    .min(1, 'Vui lòng thêm ít nhất một khung giờ rảnh')
})

export type BecomeMentorAvailabilityFormValues = z.infer<typeof becomeMentorAvailabilitySchema>
