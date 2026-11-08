import { z } from 'zod'

import { createRequiredStringSchema } from '@/schemas/common.schema'

export type BecomeMentorProfileFormValues = {
  fullName: string
  gender?: string
  hometownCityId: string
  currentCityId: string
  currentDistrictId: string
  headline: string
  introduction: string
  teachingStyle: string
  experienceYears: string
  currentPosition?: string
  workplace?: string
  education: string
  major: string
  meetingType: string
}

export const becomeMentorProfileSchema: z.ZodType<BecomeMentorProfileFormValues> = z.object({
  fullName: createRequiredStringSchema('Vui lòng nhập họ và tên'),
  gender: z.string().trim().optional(),
  hometownCityId: createRequiredStringSchema('Vui lòng chọn quê quán'),
  currentCityId: createRequiredStringSchema('Vui lòng chọn tỉnh/thành phố hiện tại'),
  currentDistrictId: createRequiredStringSchema('Vui lòng chọn quận/huyện hiện tại'),
  headline: createRequiredStringSchema('Vui lòng nhập tiêu đề ngắn'),
  introduction: createRequiredStringSchema('Vui lòng nhập giới thiệu bản thân'),
  teachingStyle: createRequiredStringSchema('Vui lòng nhập phong cách giảng dạy'),
  experienceYears: createRequiredStringSchema('Vui lòng nhập số năm kinh nghiệm'),
  currentPosition: createRequiredStringSchema('Vui lòng nhập vị trí hiện tại'),
  workplace: createRequiredStringSchema('Vui lòng nhập khu vực làm việc'),
  education: createRequiredStringSchema('Vui lòng nhập học vấn'),
  major: createRequiredStringSchema('Vui lòng nhập chuyên ngành'),
  meetingType: createRequiredStringSchema('Vui lòng chọn hình thức dạy')
})
