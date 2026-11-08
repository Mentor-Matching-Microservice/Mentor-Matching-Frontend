import { z } from 'zod'

export const createRequiredStringSchema = (message = 'Trường này là bắt buộc') =>
  z.string().trim().min(1, message)

export const createOptionalStringSchema = () => z.string().trim().optional()

export const emailSchema =
  createRequiredStringSchema('Email là bắt buộc').email('Email không hợp lệ')

export const phoneSchema = createRequiredStringSchema('Số điện thoại là bắt buộc').refine(
  (value) => /^[+]?[0-9\s()-]{9,20}$/.test(value),
  'Số điện thoại không hợp lệ'
)

export const urlSchema =
  createRequiredStringSchema('Đường dẫn là bắt buộc').url('Đường dẫn không hợp lệ')

export const idSchema = z.union([
  createRequiredStringSchema('ID là bắt buộc'),
  z.number().int().positive('ID không hợp lệ')
])

export const searchKeywordSchema = z.string().trim().max(255, 'Từ khóa tìm kiếm quá dài')

type PasswordSchemaOptions = {
  fieldLabel?: string
  minLength?: number
}

export function createPasswordSchema(options: PasswordSchemaOptions = {}) {
  const { fieldLabel = 'Mật khẩu', minLength = 6 } = options

  return z
    .string()
    .min(1, `${fieldLabel} là bắt buộc`)
    .min(minLength, `${fieldLabel} phải có ít nhất ${minLength} ký tự`)
}

export const pageSchema = z.number().int().positive()
export const pageSizeSchema = z.number().int().positive()
