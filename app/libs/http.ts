import axios, { type AxiosError, type AxiosInstance } from 'axios'

import { env } from '@/config/env'
import { path } from '@/config/path'
import { isMockAccessToken } from '@/services/mock/auth.mock.api'
import { HttpStatusCode } from '@/constants/http-status'
import { useAuthStore } from '@/stores/auth-store'
import type { AuthApiResponse } from '@/types/api/auth'
import type { ApiResponse, ErrorResponse } from '@/types/api/common'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from '@/utils/http-error'
import { getCurrentLocale } from '@/utils/locale'

const REFRESH_TOKEN_URL = 'auth/refresh-token'

class HttpClient {
  instance: AxiosInstance
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: env.apiBaseUrl,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        const accessToken = useAuthStore.getState().accessToken
        const locale = getCurrentLocale()

        if (config.headers) {
          config.headers['Accept-Language'] = locale
        }

        if (accessToken && config.headers && config.url !== REFRESH_TOKEN_URL) {
          config.headers.Authorization = accessToken.startsWith('Bearer ')
            ? accessToken
            : `Bearer ${accessToken}`
        }

        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        const statusCode = error.response?.status

        if (statusCode === HttpStatusCode.Forbidden) {
          if (window.location.pathname !== path.forbidden) {
            window.location.assign(path.forbidden)
          }
          return Promise.reject(error)
        }

        if (statusCode !== HttpStatusCode.Unauthorized) {
          const accessToken = useAuthStore.getState().accessToken
          const isNetworkError = !error.response
          const skipNotify = env.useMock && (isNetworkError || isMockAccessToken(accessToken))

          if (skipNotify) return Promise.reject(error)

          return Promise.reject(error)
        }

        if (isAxiosUnauthorizedError<ErrorResponse>(error)) {
          const config = error.config
          const requestUrl = config?.url || ''

          if (config && isAxiosExpiredTokenError(error) && requestUrl !== REFRESH_TOKEN_URL) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  this.refreshTokenRequest = null
                })

            return this.refreshTokenRequest.then((accessToken) => {
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  Authorization: `Bearer ${accessToken}`
                }
              })
            })
          }

          this.logoutAndRedirect()
        }

        return Promise.reject(error)
      }
    )
  }

  private redirectToLogin() {
    if (window.location.pathname !== path.login) {
      window.location.assign(path.login)
    }
  }

  private logoutAndRedirect() {
    useAuthStore.getState().logout()
    this.redirectToLogin()
  }

  private handleRefreshToken() {
    const { setAccessToken } = useAuthStore.getState()

    return this.instance
      .post<ApiResponse<AuthApiResponse>>(REFRESH_TOKEN_URL, {})
      .then((res) => {
        const accessToken = res.data.data.accessToken
        setAccessToken(accessToken)
        return accessToken
      })
      .catch((error) => {
        this.logoutAndRedirect()
        throw error
      })
  }
}

const http = new HttpClient().instance

export default http
