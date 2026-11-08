import { z } from 'zod'

import { createRequiredStringSchema } from '@/schemas/common.schema'

const verificationDocumentSchema = z.object({
  fileName: z.string().trim(),
  mediaId: z.number().nullable(),
  previewUrl: z.string().trim()
})

export const becomeMentorVerificationSchema = z.object({
  verificationFullName: createRequiredStringSchema('Vui lòng nhập họ tên trên giấy tờ'),
  idCardNumber: createRequiredStringSchema('Vui lòng nhập số giấy tờ'),
  documents: z
    .object({
      idFront: verificationDocumentSchema,
      idBack: verificationDocumentSchema,
      selfieWithId: verificationDocumentSchema
    })
    .superRefine((documents, context) => {
      if (!documents.idFront.mediaId) {
        context.addIssue({
          code: 'custom',
          message: 'Vui lòng tải ảnh mặt trước giấy tờ',
          path: ['idFront', 'mediaId']
        })
      }

      if (!documents.idBack.mediaId) {
        context.addIssue({
          code: 'custom',
          message: 'Vui lòng tải ảnh mặt sau giấy tờ',
          path: ['idBack', 'mediaId']
        })
      }
    })
})

export type BecomeMentorVerificationFormValues = z.infer<typeof becomeMentorVerificationSchema>
