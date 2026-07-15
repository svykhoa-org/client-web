import type { SuccessResponse } from '@/common/interface/ServiceResponse'
import type { ApiDetailResponse, ApiListData, ApiListResponse } from '@/shared/types/api'

/**
 * Thrown when the HTTP response is 2xx but the BE embeds a non-success
 * statusCode in the response body (custom error convention).
 */
export class ApiResponseError extends Error {
  readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.name = 'ApiResponseError'
    this.statusCode = statusCode
  }
}

export function isApiResponseError(error: unknown): error is ApiResponseError {
  return error instanceof ApiResponseError
}

/**
 * Unwrap a detail response body.
 * Throws `ApiResponseError` if `statusCode` is outside 2xx.
 */
export function unwrapDetail<T>(response: ApiDetailResponse<T>): T {
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new ApiResponseError(response.statusCode, response.message)
  }
  return response.data
}

/**
 * Unwrap the envelope returned by `HttpClient` (`SuccessResponse<T>`), applying the same
 * in-body 2xx `statusCode` guard as `unwrapDetail`. Use this when migrating a service from the
 * raw `axiosInstance` (which handed back `ApiDetailResponse<T>`) onto `httpClient`, which returns
 * `SuccessResponse<T>` — the two envelopes differ in shape but carry the same status/message/data.
 */
export function unwrapSuccess<T>(response: SuccessResponse<T>): T {
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new ApiResponseError(response.statusCode, response.message)
  }
  return response.data as T
}

/**
 * Unwrap a list response body.
 * Throws `ApiResponseError` if `statusCode` is outside 2xx.
 */
export function unwrapList<T>(response: ApiListResponse<T>): ApiListData<T> {
  if (response.statusCode < 200 || response.statusCode >= 300) {
    throw new ApiResponseError(response.statusCode, response.message)
  }
  return response.data
}
