import axios, {
  AxiosError,
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
import { getAuthState } from '@/stores/authStore'

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
      (error: AxiosError<ErrorResponse>) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          // Sử dụng authStore.logout() sau này, nhưng không thể sử dụng hooks ở đây
          // Vì vậy, chỉ chuyển hướng đến trang đăng nhập
          window.location.href = '/login'
        }
        return Promise.reject(error)
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
