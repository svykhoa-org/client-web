import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'

import type { ErrorResponse, SuccessResponse } from '@/common/interface/ServiceResponse'

export class ApiError extends Error {
  errorCode?: string
  statusCode?: number

  constructor(message: string, errorCode?: string, statusCode?: number) {
    super(message)
    this.name = 'ApiError'
    this.errorCode = errorCode
    this.statusCode = statusCode
  }
}
import { apiConfig } from '@/config/api'
import { clearTokens, getRefreshToken, setTokens } from '@/lib/axios'
import { getAuthState, useAuthStore } from '@/stores/authStore'

// Auth endpoints return 401/403 for genuine credential / refresh-token failures, not an expired
// access token — never run the refresh-and-retry flow for them (else a wrong-password login 401
// would fire a spurious POST /auth/refresh with a null token → 400 refreshToken should not be empty).
const AUTH_ENDPOINTS = ['/auth/login', '/auth/refresh', '/auth/logout']

// Module-level so all HttpClient instances share one in-flight refresh (avoids a refresh storm
// when several requests 401 at once). Mirrors the flow in src/lib/axios/index.ts.
let isRefreshing = false
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processRefreshQueue = (error: unknown, token: string | null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token)
    else reject(error)
  })
  refreshQueue = []
}

class HttpClient {
  private client: AxiosInstance

  constructor(customBaseURL?: string) {
    const baseURL = customBaseURL || apiConfig.apiBaseURL

    this.client = axios.create({
      baseURL,
      timeout: apiConfig.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      config => {
        // Lấy auth state từ store
        const authState = getAuthState()

        // Thêm token vào Authorization header nếu có
        if (authState.token) {
          config.headers.Authorization = `Bearer ${authState.token}`
        }

        // Thêm user ID vào x-client-id header nếu có
        const userId = authState.user?.id || authState.user?.id
        if (userId) {
          config.headers['x-client-id'] = userId
        }

        // Thêm API Key vào header nếu có
        if (apiConfig.apiKey) {
          config.headers['x-api-key'] = apiConfig.apiKey
        }

        // 'ngrok-skip-browser-warning': 'true'
        // config.headers['ngrok-skip-browser-warning'] = 'true';

        return config
      },
      error => {
        console.log('Request error:', error)
        return Promise.reject(error)
      },
    )

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse<SuccessResponse<unknown>>) => {
        return response
      },
      async (error: AxiosError<ErrorResponse>) => {
        const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined

        const isAuthEndpoint = AUTH_ENDPOINTS.some(path => original?.url?.includes(path))
        if (error.response?.status !== 401 || !original || original._retry || isAuthEndpoint) {
          return Promise.reject(error)
        }

        original._retry = true

        // No refresh token → not authenticated; don't POST a null token (server rejects it 400).
        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        }

        // A refresh is already in flight — queue this request and retry it with the new token.
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            refreshQueue.push({ resolve, reject })
          }).then(token => {
            original.headers.Authorization = `Bearer ${token}`
            return this.client(original)
          })
        }

        isRefreshing = true

        try {
          // Bare axios (not this.client) so the refresh call itself can't recurse through this
          // interceptor. Hits the auth server regardless of a custom baseURL on this instance.
          const { data } = await axios.post<{
            data: { accessToken: string; refreshToken: string }
          }>(
            `${apiConfig.apiBaseURL}/auth/refresh`,
            { refreshToken },
            { headers: { 'Content-Type': 'application/json', 'x-api-key': apiConfig.apiKey } },
          )
          const newAccess = data.data.accessToken
          const newRefresh = data.data.refreshToken
          setTokens(newAccess, newRefresh)
          // Push the new access token into the zustand store too: the request interceptor reads
          // getAuthState().token, so without this every later request would reuse the stale token.
          useAuthStore.getState().setToken(newAccess)
          processRefreshQueue(null, newAccess)
          original.headers.Authorization = `Bearer ${newAccess}`
          return this.client(original)
        } catch (refreshError) {
          // Refresh failed (invalid/rotated refresh token → 403) — flush queued requests so they
          // reject instead of hanging forever, then bounce to login.
          processRefreshQueue(refreshError, null)
          clearTokens()
          window.location.href = '/login'
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      },
    )
  }

  async get<T>(url: string, params?: Record<string, unknown>): Promise<SuccessResponse<T>> {
    try {
      // Apply direct parameter passing to avoid nesting
      const response = await this.client.get<SuccessResponse<T>>(url, {
        params,
        paramsSerializer: {
          // Ensure parameters are properly serialized
          indexes: null, // This prevents array params from being serialized with indices
        },
      })
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>)
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<SuccessResponse<T>> {
    try {
      const response = await this.client.post<SuccessResponse<T>>(url, data, config)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>)
    }
  }

  async put<T>(url: string, data?: unknown): Promise<SuccessResponse<T>> {
    try {
      const response = await this.client.put<SuccessResponse<T>>(url, data)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>)
    }
  }

  async patch<T>(url: string, data?: unknown): Promise<SuccessResponse<T>> {
    try {
      const response = await this.client.patch<SuccessResponse<T>>(url, data)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>)
    }
  }

  async delete<T>(url: string): Promise<SuccessResponse<T>> {
    try {
      const response = await this.client.delete<SuccessResponse<T>>(url)
      return response.data
    } catch (error) {
      throw this.handleError(error as AxiosError<ErrorResponse>)
    }
  }

  private handleError(error: AxiosError<ErrorResponse>): ApiError {
    if (error.response?.data) {
      const { message, errorCode, statusCode } = error.response.data
      return new ApiError(message || 'Server error', errorCode, statusCode ?? error.response.status)
    }
    if (error.request) {
      return new ApiError('Network error - Please check your connection')
    }
    return new ApiError(error.message || 'An unexpected error occurred')
  }
}

// Export class for custom instances
export { HttpClient }
