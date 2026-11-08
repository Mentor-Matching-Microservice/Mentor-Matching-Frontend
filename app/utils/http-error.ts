import axios, { type AxiosError } from 'axios'

import { EXPIRED_TOKEN_ERROR_CODE } from '@/constants/auth'
import type { ErrorResponse } from '@/types/api/common'

export function isAxiosUnauthorizedError<T = unknown>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError<T>(error) && error.response?.status === 401
}

export function isAxiosNotFoundError<T = unknown>(error: unknown): error is AxiosError<T> {
  return axios.isAxiosError<T>(error) && error.response?.status === 404
}

export function isAxiosExpiredTokenError(error: AxiosError<ErrorResponse>): boolean {
  const code = error.response?.data?.code
  return code === EXPIRED_TOKEN_ERROR_CODE
}
